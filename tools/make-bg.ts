/* eslint-disable no-console */
import fs from 'node:fs'
import sharp from 'sharp'

const QUALITY = 92
const INPUT_FOLDER = 'raw-bg'
const OUTPUT_FOLDER = 'bg'
const CHUNK_COUNT = 69;

(async () => {
  const imageFiles = fs.readdirSync(INPUT_FOLDER).sort()

  let height = 0
  let width = 0

  const layers = []

  console.log(`Composing ${imageFiles.length} images...`)
  for (const imageFile of imageFiles) {
    const image = sharp(`${INPUT_FOLDER}/${imageFile}`)

    const meta = await image.metadata()
    const input = await image.toBuffer()
    layers.push({ input, top: height, left: 0 })
    console.log(`${imageFile} ${meta.width}x${meta.height} at 0x${height}`)

    height += meta.height
    width = Math.max(width, meta.width)
  }
  console.log(`Result image is ${width}x${height}`)

  const buffer = await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: 'white',
    },
  }).composite(layers).png().toBuffer()

  console.log(`Clearing output directory...`)
  for (const file of fs.readdirSync(OUTPUT_FOLDER)) {
    fs.unlinkSync(`${OUTPUT_FOLDER}/${file}`)
  }

  const chunkHeight = Math.floor(height / CHUNK_COUNT)

  console.log(`Chunking into ${CHUNK_COUNT} images...`)
  console.log(`Chunk size is ${chunkHeight}`)

  const lostHeight = height % chunkHeight
  if (lostHeight > 0) {
    console.warn(`${lostHeight}px of height will be lost during chunking`)
  }

  for (let index = 0; index < CHUNK_COUNT; index++) {
    const imageFile = `${String(index + 1).padStart(3, '0')}.webp`

    const top = chunkHeight * index
    console.log(`${imageFile} ${width}x${chunkHeight} at 0x${top}`)

    await sharp(buffer)
      .extract({ top, left: 0, width, height: chunkHeight })
      .webp({ quality: QUALITY })
      .toFile(`${OUTPUT_FOLDER}/${imageFile}`)
  }

  console.log(`Done.`)
})()
