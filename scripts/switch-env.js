const fs = require('node:fs');
const path = require('node:path');

const target = (process.argv[2] || 'development').toLowerCase();
const root = path.resolve(__dirname, '..');

let sourceFileName;
if (target === 'demo') {
  sourceFileName = 'demo.env';
} else if (target === 'prod' || target === 'production') {
  sourceFileName = 'production.env';
} else {
  sourceFileName = 'development.env';
}

const sourcePath = path.join(root, 'environments', sourceFileName);

if (!fs.existsSync(sourcePath)) {
  console.error(`[Kallo Env Error] File nguồn ${sourcePath} không tồn tại.`);
  process.exit(1);
}

const content = fs.readFileSync(sourcePath, 'utf8');

// Ghi nội dung vào file .env duy nhất (chuẩn theo Expo env loading)
fs.writeFileSync(path.join(root, '.env'), content, 'utf8');

// Xoá các file .env đặc biệt ở root nếu còn tồn tại để tránh Expo ưu tiên load đè lên .env
const filesToClean = ['.env.development', '.env.demo', '.env.production', '.env.local'];
for (const file of filesToClean) {
  const filePath = path.join(root, file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Bỏ qua nếu file đang bị lock hoặc không có quyền xoá
  }
}

console.log(`\n=======================================================`);
console.log(`[Kallo Env] Đã chuyển sang cấu hình: ${target.toUpperCase()}`);
console.log(`[Kallo Env] Đã ghi cấu hình vào: .env`);
console.log(`=======================================================\n`);
