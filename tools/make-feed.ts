/* eslint-disable no-console */
import fs from 'node:fs'
import sharp from 'sharp'

const QUALITY = 92
const INPUT_FOLDER = 'raw-feed'
const OUTPUT_FOLDER = 'feed'

;(async () => {
  const imageFiles = fs.readdirSync(INPUT_FOLDER).sort()

  console.log(`Processing ${imageFiles.length} images...`)
  for (const [index, imageInputFile] of imageFiles.entries()) {
    const imageOutputFile = `${String(index + 1).padStart(3, '0')}.webp`

    await sharp(`${INPUT_FOLDER}/${imageInputFile}`)
      .webp({ quality: QUALITY })
      .toFile(`${OUTPUT_FOLDER}/${imageOutputFile}`)

    console.log(`${imageInputFile} converted to ${imageOutputFile}`)
  }

  console.log(`Done.`)
})()
