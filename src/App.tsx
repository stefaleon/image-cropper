import { useState, useRef } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import './App.css'

function App() {
  const [imgSrc, setImgSrc] = useState<string>('')
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '')
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop({
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25
    })
  }

  const generateCroppedImage = async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = canvasRef.current
    const crop = completedCrop

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return
    }

    const pixelRatio = window.devicePixelRatio || 1

    canvas.width = crop.width * pixelRatio * scaleX
    canvas.height = crop.height * pixelRatio * scaleY

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    )
  }

  const downloadCroppedImage = () => {
    if (!canvasRef.current) {
      return
    }

    canvasRef.current.toBlob((blob) => {
      if (!blob) {
        return
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cropped-image.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="App">
      <h1>React Image Crop</h1>
      
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          id="file-input"
        />
        <label htmlFor="file-input" className="file-label">
          Choose Image
        </label>
      </div>

      {imgSrc && (
        <div className="crop-container">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={undefined}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
      )}

      {completedCrop && (
        <div className="actions">
          <button onClick={generateCroppedImage}>
            Preview Crop
          </button>
          <button onClick={downloadCroppedImage}>
            Download Cropped Image
          </button>
        </div>
      )}

      {completedCrop && (
        <div className="preview-section">
          <h2>Preview:</h2>
          <canvas
            ref={canvasRef}
            style={{
              border: '1px solid #ccc',
              objectFit: 'contain',
              width: Math.max(completedCrop.width, 100),
              height: Math.max(completedCrop.height, 100),
            }}
          />
        </div>
      )}
    </div>
  )
}

export default App
