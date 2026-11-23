/**
 * Kallo Module ACT - Automated Backend Integration Test Runner
 * Runs 12 comprehensive end-to-end test cases against a live Spring Boot backend.
 *
 * Usage:
 *   node scripts/test-act-integration.js [API_BASE_URL]
 * Default:
 *   http://127.0.0.1:8080/api
 */

const axios = require('axios');
const { randomUUID } = require('node:crypto');

const baseURL = process.argv[2] || process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8080/api';

console.log('\n===============================================================');
console.log('  KALLO MODULE ACT - BACKEND INTEGRATION TEST SUITE');
console.log(`  Target API: ${baseURL}`);
console.log('===============================================================\n');

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTest(testId, title, testFn) {
  process.stdout.write(`[${testId}] ${title}... `);
  const start = Date.now();
  try {
    await testFn();
    const duration = Date.now() - start;
    console.log(`\x1b[32mPASS\x1b[0m (${duration}ms)`);
    passedCount++;
  } catch (err) {
    const duration = Date.now() - start;
    console.log(`\x1b[31mFAIL\x1b[0m (${duration}ms)`);
    const serverMessage = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    const serverCode = err.response?.data?.error?.code || err.response?.status;
    console.log(`       \x1b[33mDetail: [${serverCode}] ${serverMessage}\x1b[0m`);
    failedCount++;
  }
}

async function main() {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: { Accept: 'application/json' },
  });

  // Step 0: Connectivity Check
  try {
    await client.get('/activity-types');
  } catch (err) {
    if (!err.response) {
      console.error('\x1b[31m[ERROR] Không thể kết nối tới Backend tại:\x1b[0m', baseURL);
      console.error('Vui lòng đảm bảo:');
      console.error('  1. Docker containers (PostgreSQL, Redis) đang chạy: docker compose up -d postgres redis');
      console.error('  2. Backend Spring Boot đang chạy: mvn spring-boot:run trên cổng 8080');
      process.exit(1);
    }
  }

  // Register a temporary test user
  const testEmail = `act_tester_${Date.now()}@kallo.local`;
  const testPassword = 'KalloPassword123!';
  const testDisplayName = 'ACT Test Runner';

  let accessToken = '';
  let authHeader = {};

  await runTest('AUTH-01', 'Đăng ký tài khoản kiểm thử mới', async () => {
    const res = await client.post('/auth/register', {
      email: testEmail,
      password: testPassword,
      displayName: testDisplayName,
    });
    assert(res.status === 201 || res.status === 200, 'Mã HTTP đăng ký phải là 200 hoặc 201');
    const data = res.data?.data ?? res.data;
    accessToken = data?.accessToken;
    assert(!!accessToken, 'Phải nhận được accessToken');
    authHeader = { Authorization: `Bearer ${accessToken}` };
  });

  if (!accessToken) {
    console.error('Không có accessToken để chạy các test case tiếp theo.');
    process.exit(1);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // TC-01: Chặn tạo bài tập khi chưa có cân nặng (WEIGHT_REQUIRED)
  await runTest('TC-01', 'Từ chối tạo bài tập khi chưa có cân nặng (HTTP 422 WEIGHT_REQUIRED)', async () => {
    try {
      await client.post(
        '/activities',
        {
          clientUuid: randomUUID(),
          activityType: 'RUN_8KMH',
          intensity: 'MODERATE',
          startedAt: new Date().toISOString(),
          durationMin: 30,
        },
        { headers: authHeader }
      );
      throw new Error('Đáng lẽ phải bị từ chối với WEIGHT_REQUIRED');
    } catch (err) {
      assert(err.response?.status === 422, 'Phải trả về status 422 Unprocessable Entity');
      const code = err.response?.data?.error?.code;
      assert(code === 'WEIGHT_REQUIRED', `Mã lỗi phải là WEIGHT_REQUIRED, nhận được: ${code}`);
    }
  });

  // TC-02: Ghi nhận cân nặng cơ sở
  const weightUuid = randomUUID();
  let createdWeightId = '';
  await runTest('TC-02', 'Ghi nhận cân nặng cơ sở (HTTP 201)', async () => {
    const res = await client.post(
      '/weight-logs',
      {
        clientUuid: weightUuid,
        weightKg: 70.0,
        loggedAt: new Date(Date.now() - 120000).toISOString(),
        note: 'Cân nặng test ban đầu',
      },
      { headers: authHeader }
    );
    assert(res.status === 201 || res.status === 200, 'HTTP phải là 200 hoặc 201');
    const data = res.data?.data ?? res.data;
    createdWeightId = data.id;
    assert(Number(data.weightKg) === 70.0, 'Cân nặng phải là 70.0 kg');
  });

  // TC-03: Lấy danh sách cân nặng
  await runTest('TC-03', 'Lấy danh sách cân nặng (GET /weight-logs)', async () => {
    const res = await client.get('/weight-logs', { headers: authHeader });
    assert(res.status === 200, 'HTTP phải là 200');
    const list = res.data?.data ?? res.data;
    assert(Array.isArray(list) && list.length > 0, 'Danh sách cân nặng không được rỗng');
    assert(Number(list[0].weightKg) === 70.0, 'Bản ghi phải có cân nặng 70kg');
  });

  // TC-04: Lấy danh mục bài tập (activity-types)
  await runTest('TC-04', 'Nạp danh mục MET bài tập (GET /activity-types)', async () => {
    const res = await client.get('/activity-types', { headers: authHeader });
    assert(res.status === 200, 'HTTP phải là 200');
    const list = res.data?.data ?? res.data;
    assert(Array.isArray(list) && list.length >= 10, 'Danh mục bài tập phải có ít nhất 10 môn');
    const runType = list.find((t) => t.code === 'RUN_8KMH');
    assert(!!runType, 'Phải tìm thấy môn RUN_8KMH trong danh mục');
    assert(Number(runType.metModerate) === 8.3, 'MET của RUN_8KMH phải là 8.3');
  });

  // TC-05: Ghi nhận bài tập chạy bộ thủ công
  const activityUuid = randomUUID();
  let createdActivityId = '';
  await runTest('TC-05', 'Ghi nhận bài tập thủ công & tính calo chính xác (POST /activities)', async () => {
    const res = await client.post(
      '/activities',
      {
        clientUuid: activityUuid,
        activityType: 'RUN_8KMH',
        intensity: 'MODERATE',
        startedAt: new Date(Date.now() - 30000).toISOString(),
        durationMin: 30,
        note: 'Chạy bộ buổi sáng',
        source: 'MANUAL',
      },
      { headers: authHeader }
    );
    assert(res.status === 201 || res.status === 200, 'HTTP phải là 201 hoặc 200');
    const data = res.data?.data ?? res.data;
    createdActivityId = data.id;
    assert(data.activityType === 'RUN_8KMH', 'Mã bài tập phải là RUN_8KMH');
    // Calo = 8.3 * 70 * (30/60) = 290.5
    const calories = Number(data.caloriesBurned);
    assert(Math.abs(calories - 290.5) < 1, `Calo phải xấp xỉ 290.5 kcal, nhận được: ${calories}`);
    assert(Number(data.weightKgUsed) === 70.0, 'Phải dùng snapshot cân nặng 70kg');
  });

  // TC-06: Tính lũy thừa khi gửi trùng clientUuid
  await runTest('TC-06', 'Đảm bảo tính lũy thừa khi gửi trùng clientUuid (HTTP 200 Idempotent)', async () => {
    const res = await client.post(
      '/activities',
      {
        clientUuid: activityUuid,
        activityType: 'RUN_8KMH',
        intensity: 'MODERATE',
        startedAt: new Date(Date.now() - 30000).toISOString(),
        durationMin: 30,
        source: 'MANUAL',
      },
      { headers: authHeader }
    );
    assert(res.status === 200, 'Gửi lại cùng clientUuid phải trả về HTTP 200 OK');
    const data = res.data?.data ?? res.data;
    assert(data.id === createdActivityId, 'Phải trả về cùng ID bản ghi trước đó');
  });

  // TC-07: Sửa và Xoá bài tập
  await runTest('TC-07', 'Cập nhật & Xoá bài tập (PUT / DELETE /activities/{id})', async () => {
    const updateRes = await client.put(
      `/activities/${createdActivityId}`,
      {
        activityType: 'RUN_8KMH',
        intensity: 'MODERATE',
        startedAt: new Date(Date.now() - 40000).toISOString(),
        durationMin: 45,
        note: 'Cập nhật chạy bộ 45 phút',
      },
      { headers: authHeader }
    );
    assert(updateRes.status === 200, 'Cập nhật phải trả về 200 OK');
    const updatedData = updateRes.data?.data ?? updateRes.data;
    assert(updatedData.durationMin === 45, 'Thời lượng sau sửa phải là 45');

    const deleteRes = await client.delete(`/activities/${createdActivityId}`, { headers: authHeader });
    assert(deleteRes.status === 204, 'Xoá phải trả về 204 No Content');
  });

  // TC-08: Gửi dữ liệu Health Sync
  const stepsExternalId = `steps-hc-${todayStr}`;
  const hrExternalId = `hr-hc-${todayStr}`;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const endOfDay = now.toISOString();

  await runTest('TC-08', 'Đồng bộ bước chân và nhịp tim (POST /health-sync)', async () => {
    const res = await client.post(
      '/health-sync',
      {
        provider: 'HEALTH_CONNECT',
        records: [
          {
            dataType: 'STEPS',
            externalId: stepsExternalId,
            startTime: startOfDay,
            endTime: endOfDay,
            value: 6540,
          },
          {
            dataType: 'HEART_RATE',
            externalId: hrExternalId,
            startTime: startOfDay,
            endTime: endOfDay,
            value: 72,
            valueMin: 58,
            valueMax: 112,
          },
        ],
      },
      { headers: authHeader }
    );
    assert(res.status === 200, 'Đồng bộ phải trả về 200 OK');
    const data = res.data?.data ?? res.data;
    assert(data.created === 2, `Phải tạo mới 2 bản ghi sync, nhận được: ${data.created}`);
    assert(data.rejected.length === 0, 'Không được có bản ghi bị reject');
  });

  // TC-09: Xác minh tính lũy thừa Health Sync (AC2 - Không tăng số bước/calo)
  await runTest('TC-09', 'Idempotency Health Sync: Gửi lại lần 2 không tạo bản ghi mới (AC2)', async () => {
    const res = await client.post(
      '/health-sync',
      {
        provider: 'HEALTH_CONNECT',
        records: [
          {
            dataType: 'STEPS',
            externalId: stepsExternalId,
            startTime: startOfDay,
            endTime: endOfDay,
            value: 6540,
          },
          {
            dataType: 'HEART_RATE',
            externalId: hrExternalId,
            startTime: startOfDay,
            endTime: endOfDay,
            value: 72,
            valueMin: 58,
            valueMax: 112,
          },
        ],
      },
      { headers: authHeader }
    );
    assert(res.status === 200, 'Gửi lại phải trả về 200 OK');
    const data = res.data?.data ?? res.data;
    assert(data.unchanged === 2, `Cả 2 bản ghi phải là unchanged, nhận được unchanged=${data.unchanged}`);
    assert(data.created === 0, 'Không được tạo mới bản ghi nào');
  });

  // TC-10: Kiểm tra trạng thái đồng bộ
  await runTest('TC-10', 'Kiểm tra trạng thái đồng bộ (GET /health-sync/status)', async () => {
    const res = await client.get('/health-sync/status', { headers: authHeader });
    assert(res.status === 200, 'HTTP phải là 200');
    const list = res.data?.data ?? res.data;
    assert(Array.isArray(list) && list.length > 0, 'Danh sách trạng thái sync không được rỗng');
    const hcStatus = list.find((s) => s.provider === 'HEALTH_CONNECT');
    assert(!!hcStatus, 'Phải tìm thấy trạng thái của HEALTH_CONNECT');
    assert(!!hcStatus.lastSyncedAt, 'Phải có mốc thời gian lastSyncedAt');
  });

  // TC-11: Lấy tóm tắt thống kê ngày
  await runTest('TC-11', 'Tóm tắt thống kê ngày (GET /activities/summary)', async () => {
    const res = await client.get(`/activities/summary?date=${todayStr}`, { headers: authHeader });
    assert(res.status === 200, 'HTTP phải là 200');
    const list = res.data?.data ?? res.data;
    assert(Array.isArray(list) && list.length === 1, 'Phải trả về 1 ngày thống kê');
    const stats = list[0];
    assert(Number(stats.totalSteps) === 6540, `Số bước phải là 6540, nhận được: ${stats.totalSteps}`);
    assert(Number(stats.totalCaloriesBurned) > 0, 'Tổng calo tiêu hao phải lớn hơn 0');
  });

  // TC-12: Khử trùng lặp giữa Health Sync và bài tập thủ công
  await runTest('TC-12', 'Xác minh Khử trùng lặp Deduplication (FR-ACT-08)', async () => {
    // Tạo 1 bài tập đi bộ trong ngày hôm nay
    const walkRes = await client.post(
      '/activities',
      {
        clientUuid: randomUUID(),
        activityType: 'WALK_BRISK',
        intensity: 'MODERATE',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        durationMin: 30,
        source: 'MANUAL',
      },
      { headers: authHeader }
    );
    assert(walkRes.status === 201 || walkRes.status === 200, 'Tạo bài tập đi bộ phải thành công');

    // Lấy lại summary ngày
    const summaryRes = await client.get(`/activities/summary?date=${todayStr}`, { headers: authHeader });
    const stats = (summaryRes.data?.data ?? summaryRes.data)[0];
    assert(Number(stats.totalSteps) === 6540, 'Số bước chân vẫn giữ vững từ Health Sync');
    assert(Number(stats.activityCalories) > 0, 'Có calo bài tập thủ công');
    assert(Number(stats.totalCaloriesBurned) >= Number(stats.activityCalories), 'Tổng calo hợp lý');
  });

  console.log('\n===============================================================');
  console.log(`  KẾT QUẢ KIỂM THỬ: ${passedCount} PASSED / ${failedCount} FAILED`);
  console.log('===============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\x1b[31m[Lỗi chưa xử lý]\x1b[0m', err);
  process.exit(1);
});
