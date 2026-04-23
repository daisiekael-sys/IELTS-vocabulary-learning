const sharp = require('sharp');
const fs = require('fs');

const svg = fs.readFileSync('icon-512.svg');

Promise.all([
  sharp(svg).resize(512, 512).png().toFile('icon-512.png'),
  sharp(svg).resize(192, 192).png().toFile('icon-192.png'),
  sharp(svg).resize(512, 512).png().toFile('icon-maskable.png'),
]).then(() => console.log('All icons generated!'));