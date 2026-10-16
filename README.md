# Kallo Mobile — Ứng dụng Chăm sóc Sức khỏe & Dinh dưỡng Tích hợp AI

Ứng dụng di động thông minh được xây dựng bằng **React Native**, **Expo SDK 52** và **TypeScript**, đóng vai trò là tầng Frontend toàn diện cho nền tảng Kallo. Ứng dụng hỗ trợ theo dõi dinh dưỡng cá nhân hóa, nhận diện món ăn Việt Nam qua thị giác máy tính AI (YOLOv11m), lập thực đơn thông minh, đồng bộ sức khỏe đa nền tảng và hoạt động bền bỉ với kiến trúc ngoại tuyến (Offline-First).

---

## Mục lục

- [Hướng dẫn Cài đặt & Khởi chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
- [Tài liệu tham chiếu](#-tài-liệu-tham-chiếu)

---

## Hướng dẫn Cài đặt & Khởi chạy

### 1. Yêu cầu Môi trường
- **Node.js:** Phiên bản $\ge 18.0.0$ (Khuyến nghị LTS).
- **Trình quản lý gói:** `npm` (hoặc `yarn` / `pnpm`).
- **Thiết bị chạy:** Expo Go trên điện thoại thực hoặc Trình giả lập Android Emulator / iOS Simulator.

### 2. Cài đặt Phụ thuộc
```bash
npm install
```

### 3. Kiểm tra Tính Hợp lệ của Kiểu (TypeScript Typecheck)
```bash
npm run typecheck
```

### 4. Chạy Toàn bộ Kịch bản Kiểm thử 7 Phase
Lệnh chạy lần lượt toàn bộ 7 bộ tự kiểm tra từ Phase 1 đến Phase 7:
```bash
npm run self-check
```
*Kết quả mẫu khi kiểm tra thành công:*
```text
Phase 1 self-check passed
Phase 2 calculation source self-check passed
Phase 3 nutrition self-check passed
Phase 4 nutrition self-check passed
Phase 5 activity, health sync & report self-check passed
Phase 6 AI meal plan, assistant chat & gamification self-check passed
Phase 7 system utilities, offline-first & UX polish self-check passed
```

### 5. Khởi động Ứng dụng
```bash
# Khởi động Metro Bundler
npm run start

# Chạy trực tiếp trên thiết bị Android
npm run android

# Chạy trực tiếp trên thiết bị iOS (yêu cầu macOS)
npm run ios
```

### 6. Đồng bộ Tài nguyên Hình ảnh (Ngoại quan)
Tài nguyên hình ảnh được quản lý qua `res/` và kết nối với `src/assets/images/index.ts`. Để đồng bộ tài nguyên:
```bash
npm run copy-assets
```

---

## Tài liệu tham chiếu

- [REQUIREMENT.md](docs/REQUIREMENT.md): Tài liệu Đặc tả Yêu cầu Nghiệp vụ Phần mềm (SRS v1.1).
- [UI_IMPLEMENTATION_PLAN.md](docs/UI_IMPLEMENTATION_PLAN.md): Lộ trình 13 tuần triển khai giao diện người dùng qua 7 Phase.
- [Expo Documentation](https://docs.expo.dev/): Hướng dẫn sử dụng Expo SDK 52.
- [React Navigation 7 Docs](https://reactnavigation.org/docs/getting-started): Hướng dẫn cấu trúc điều hướng React Navigation.

---

© 2026 Kallo Health & Nutrition Team. Mọi quyền được bảo lưu.
