/* eslint-disable no-console */
import fs from 'node:fs'
import sharp from 'sharp'

const FORMAT = 'png'
const FORMAT_OPTIONS = { quality: 92 }
const INPUT_FOLDER = 'raw-feed'
const OUTPUT_FOLDER = 'feed'
const SCALE = 0.5

;(async () => {
  const imageFiles = fs.readdirSync(INPUT_FOLDER).sort()

  console.log(`Processing ${imageFiles.length} images...`)
  for (const [index, imageInputFile] of imageFiles.entries()) {
    const imageOutputFile = `${String(index + 1).padStart(3, '0')}.${FORMAT}`

    const image = sharp(`${INPUT_FOLDER}/${imageInputFile}`)
    const meta = await image.metadata()
    let buffer = await image.toBuffer()

    // @ts-expect-error constant may be changed
    if (SCALE !== 1) {
      const width = Math.round(meta.width * SCALE)
      const height = Math.round(meta.height * SCALE)

      console.log(`Scaling image to ${width}x${height}...`)

      buffer = await sharp(buffer)
        .resize(width, height, { fit: 'cover' })
        .toBuffer()
    }

    await sharp(buffer)[FORMAT](FORMAT_OPTIONS)
      .toFile(`${OUTPUT_FOLDER}/${imageOutputFile}`)

    console.log(`${imageInputFile} converted to ${imageOutputFile}`)
  }

  console.log(`Done.`)
})()
