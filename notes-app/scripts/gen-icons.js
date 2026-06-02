#!/usr/bin/env node
// Generates PWA icons as PNGs using only Node.js built-ins
// Dark background (#111111) with gold 8-pointed star (#B89A64)
import zlib from 'zlib'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function crc32(buf) {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let v = i
    for (let j = 0; j < 8; j++) v = (v & 1) ? 0xEDB88320 ^ (v >>> 1) : v >>> 1
    table[i] = v
  }
  let c = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 255] ^ (c >>> 8)
  return (c ^ 0xFFFFFFFF) >>> 0
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const dataBuf = Buffer.isBuffer(data) ? data : Buffer.from(data)
  const len = Buffer.alloc(4)
  len.writeUInt32BE(dataBuf.length)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, dataBuf])))
  return Buffer.concat([len, typeBuf, dataBuf, crcBuf])
}

function createIconPNG(size) {
  const cx = size / 2
  const cy = size / 2

  // Build the 8-pointed star polygon points (scaled to icon size)
  const R = size * 0.35   // outer radius
  const r = size * 0.146  // inner radius
  const starPoints = []
  for (let i = 0; i < 8; i++) {
    const outerAngle = (i * 45 - 90) * Math.PI / 180
    const innerAngle = outerAngle + 22.5 * Math.PI / 180
    starPoints.push([cx + R * Math.cos(outerAngle), cy + R * Math.sin(outerAngle)])
    starPoints.push([cx + r * Math.cos(innerAngle), cy + r * Math.sin(innerAngle)])
  }

  // Point-in-polygon test
  function inStar(px, py) {
    let inside = false
    const n = starPoints.length
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const [xi, yi] = starPoints[i]
      const [xj, yj] = starPoints[j]
      if (((yi > py) !== (yj > py)) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
        inside = !inside
      }
    }
    return inside
  }

  const rows = []
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3)
    row[0] = 0 // filter None
    for (let x = 0; x < size; x++) {
      const [pr, pg, pb] = inStar(x, y) ? [184, 154, 100] : [17, 17, 17]
      row[1 + x * 3] = pr
      row[2 + x * 3] = pg
      row[3 + x * 3] = pb
    }
    rows.push(row)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  const compressed = zlib.deflateSync(Buffer.concat(rows))
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', compressed), pngChunk('IEND', Buffer.alloc(0))])
}

const publicDir = path.join(__dirname, '..', 'public')
fs.mkdirSync(publicDir, { recursive: true })

for (const size of [192, 512, 180]) {
  const name = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`
  fs.writeFileSync(path.join(publicDir, name), createIconPNG(size))
  console.log(`✓ ${name}`)
}
