import fs from 'node:fs';
import path from 'node:path';

function getDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const sizeKB = (fs.statSync(filePath).size / 1024).toFixed(1);
  let width = 0, height = 0, format = ext;

  if (ext === '.png') {
    width = buf.readUInt32BE(16);
    height = buf.readUInt32BE(20);
    format = 'PNG';
  } else if (ext === '.webp') {
    format = 'WebP';
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X') {
      width = 1 + buf.readUIntLE(24, 3);
      height = 1 + buf.readUIntLE(27, 3);
    } else if (chunk === 'VP8 ') {
      width = buf.readUInt16LE(26) & 0x3fff;
      height = buf.readUInt16LE(28) & 0x3fff;
    } else if (chunk === 'VP8L') {
      const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
      width = 1 + (((b1 & 0x3f) << 8) | b0);
      height = 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
    }
  } else if (ext === '.jpg' || ext === '.jpeg') {
    format = 'JPEG';
    let i = 2;
    while (i < buf.length - 8) {
      if (buf[i] === 0xff && (buf[i+1] === 0xc0 || buf[i+1] === 0xc2)) {
        height = buf.readUInt16BE(i + 5);
        width = buf.readUInt16BE(i + 7);
        break;
      }
      i++;
    }
  }
  return { path: filePath.replace(/\\/g, '/'), format, width, height, sizeKB };
}

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) scan(full);
    else if (/\.(jpg|jpeg|png|webp)$/i.test(f)) {
      const d = getDimensions(full);
      console.log(`${d.path.padEnd(58)} | ${d.format.padEnd(5)} | ${String(d.width).padStart(4)}x${String(d.height).padEnd(4)} | ${String(d.sizeKB).padStart(6)} KB`);
    }
  }
}

console.log('Path'.padEnd(58) + ' | Format| Resolution| Size (KB)');
console.log('-'.repeat(85));
scan('public/images');
