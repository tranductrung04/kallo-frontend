const fs = require('node:fs');
const path = require('node:path');
const source = path.resolve(__dirname, '..', 'res');
const destination = path.resolve(__dirname, '..', 'src', 'assets', 'images');
if (!fs.existsSync(source)) throw new Error(`Asset directory not found: ${source}`);
fs.mkdirSync(destination, { recursive: true });
for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
  if (entry.isFile()) fs.copyFileSync(path.join(source, entry.name), path.join(destination, entry.name));
}
const copied = fs.readdirSync(destination, { withFileTypes: true }).filter((entry) => entry.isFile()).length;
console.log(`Copied ${copied} assets`);
