const fs = require('fs');
const path = require('path');

const SOURCE_PATH = path.resolve(__dirname, '../src/config.development.js');
const TARGET_PATH = path.resolve(__dirname, '../public/config.js');

if (fs.existsSync(SOURCE_PATH)) {
  const content = fs.readFileSync(SOURCE_PATH, 'utf-8');
  fs.writeFileSync(TARGET_PATH, content, 'utf-8');
}
