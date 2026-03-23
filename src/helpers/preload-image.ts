export const preloadImage = (url: string) => {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.src = url
    image.onerror = reject
    image.onload = resolve
  })
}

export const preloadImageQuietly = (url: string) => {
  return new Promise<boolean>((resolve) => {
    const image = new Image()

    image.src = url
    image.onerror = () => resolve(false)
    image.onload = () => resolve(true)
  })
}
