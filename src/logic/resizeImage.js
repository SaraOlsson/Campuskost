const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

export default async function getResizedImg(imageSrc, size = 300) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = size
    canvas.height = size

    ctx.drawImage(
        image,
        size,
        size
    )
    
    
    const data = ctx.getImageData(0, 0, size, size)

    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
        data,
        size,
        size
    ) 

    // As Base64 string
    return canvas.toDataURL('image/jpeg');
}