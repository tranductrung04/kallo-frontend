const fs = require('node:fs');
const path = require('node:path');

const target = (process.argv[2] || 'development').toLowerCase();
const root = path.resolve(__dirname, '..');

let candidateNames = [];
if (target === 'demo') {
  candidateNames = ['.env.demo', 'env.demo', 'demo.env'];
} else if (target === 'prod' || target === 'production') {
  candidateNames = ['.env.prod', '.env.production', 'env.prod', 'prod.env', 'production.env'];
} else {
  candidateNames = ['.env.dev', '.env.development', 'env.dev', 'dev.env', 'development.env'];
}

// Tìm ở thư mục gốc (root) trước, sau đó tìm trong environments/
let sourcePath = null;
const searchDirs = [root, path.join(root, 'environments')];

for (const dir of searchDirs) {
  for (const name of candidateNames) {
    const p = path.join(dir, name);
    if (fs.existsSync(p)) {
      sourcePath = p;
      break;
    }
  }
  if (sourcePath) break;
}

if (!sourcePath) {
  console.error(`[Kallo Env Error] Không tìm thấy file cấu hình cho môi trường "${target}".`);
  console.error(`Vui lòng tạo một trong các file sau ở thư mục gốc hoặc trong environments/:`);
  console.error(candidateNames.map((n) => `  - ${n}`).join('\n'));
  process.exit(1);
}

const content = fs.readFileSync(sourcePath, 'utf8');

// Ghi nội dung vào file .env duy nhất (chuẩn theo Expo env loading)
fs.writeFileSync(path.join(root, '.env'), content, 'utf8');

const relSource = path.relative(root, sourcePath);

console.log(`\n=======================================================`);
console.log(`[Kallo Env] Nguồn: ${relSource}`);
console.log(`[Kallo Env] Đã chuyển sang cấu hình: ${target.toUpperCase()}`);
console.log(`[Kallo Env] Đã ghi cấu hình vào: .env`);
console.log(`=======================================================\n`);
