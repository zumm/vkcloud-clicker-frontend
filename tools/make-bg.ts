/* eslint-disable no-console */
import fs from 'node:fs'
import sharp from 'sharp'

const FORMAT = 'png'
const FORMAT_OPTIONS = { quality: 92 }
const INPUT_FOLDER = 'raw-bg'
const OUTPUT_FOLDER = 'bg'
const CHUNK_COUNT = 80
const SCALE = 0.5

;(async () => {
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

  let buffer = await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: 'white',
    },
  })
    .composite(layers)
    .png()
    .toBuffer()

  // @ts-expect-error constant may be changed
  if (SCALE !== 1) {
    width = Math.round(width * SCALE)
    height = Math.round(height * SCALE)

    console.log(`Scaling image to ${width}x${height}...`)

    buffer = await sharp(buffer)
      .resize(width, height, { fit: 'cover' })
      .toBuffer()
  }

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
    const imageFile = `${String(index + 1).padStart(3, '0')}.${FORMAT}`

    const top = chunkHeight * index
    console.log(`${imageFile} ${width}x${chunkHeight} at 0x${top}`)

    await sharp(buffer)
      .extract({ top, left: 0, width, height: chunkHeight })[FORMAT](FORMAT_OPTIONS)
      .toFile(`${OUTPUT_FOLDER}/${imageFile}`)
  }

  console.log(`Done.`)
})()
