import { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./App.css";

interface CropPreset {
  name: string;
  width: number;
  height: number;
  description: string;
}

const cropPresets: CropPreset[] = [
  { name: "Instagram Square", width: 1080, height: 1080, description: "1:1" },
  { name: "Instagram Portrait", width: 1080, height: 1350, description: "4:5" },
  { name: "Instagram Story", width: 1080, height: 1920, description: "9:16" },
  { name: "YouTube Thumbnail", width: 1280, height: 720, description: "16:9" },
  { name: "Facebook Cover", width: 820, height: 312, description: "Cover" },
  { name: "Twitter Post", width: 1200, height: 675, description: "16:9" },
  { name: "LinkedIn Post", width: 1200, height: 627, description: "Post" },
  { name: "HD Landscape", width: 1920, height: 1080, description: "16:9" },
  { name: "HD Portrait", width: 1080, height: 1920, description: "9:16" },
  { name: "Standard 4:3", width: 800, height: 600, description: "4:3" },
  { name: "Square 600", width: 600, height: 600, description: "1:1" },
  { name: "Pinterest Pin", width: 1000, height: 1500, description: "2:3" },
];

function App() {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update canvas preview in real time
  useEffect(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;
    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Use preset size if selected, otherwise crop size
    const preset = cropPresets.find(p => p.name === selectedPreset);
    
    if (preset) {
      // When preset is selected, output EXACT preset dimensions (no pixelRatio)
      canvas.width = preset.width;
      canvas.height = preset.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        preset.width,
        preset.height
      );
    } else {
      // When no preset, use crop size with pixelRatio for quality
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }
  }, [completedCrop, imgSrc, selectedPreset]);
  const downloadCroppedImage = () => {
    if (!canvasRef.current) {
      return;
    }
    // Use the same logic as preview: output at preset size if selected
    canvasRef.current.toBlob((blob) => {
      if (!blob) {
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedPreset ? `${selectedPreset.replace(/\s+/g, '_').toLowerCase()}_crop.png` : "cropped-image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setCrop({
      unit: "%",
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    });
  };

  const applyPreset = (preset: CropPreset) => {
    if (!imgRef.current) return;

    const image = imgRef.current;
    const { width: presetWidth, height: presetHeight } = preset;
    const { width: imgWidth, height: imgHeight } = image;

    // Calculate the crop size to fit the preset aspect ratio
    const aspectRatio = presetWidth / presetHeight;
    const imgAspectRatio = imgWidth / imgHeight;

    let cropWidth: number;
    let cropHeight: number;

    if (imgAspectRatio > aspectRatio) {
      // Image is wider than preset - constrain by height
      cropHeight = imgHeight;
      cropWidth = cropHeight * aspectRatio;
    } else {
      // Image is taller than preset - constrain by width
      cropWidth = imgWidth;
      cropHeight = cropWidth / aspectRatio;
    }

    // Center the crop
    const x = (imgWidth - cropWidth) / 2;
    const y = (imgHeight - cropHeight) / 2;

    const newCrop = {
      unit: "px",
      width: cropWidth,
      height: cropHeight,
      x: x,
      y: y,
    };
    setCrop(newCrop);
    setCompletedCrop(newCrop);
    setSelectedPreset(preset.name);
  };

  const generateCroppedImage = async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );
  };

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
        <>
          <div className="presets-section">
            <h2>Choose Crop Dimensions</h2>
            <div className="presets-grid">
              {cropPresets.map((preset) => (
                <button
                  key={preset.name}
                  className={`preset-card ${selectedPreset === preset.name ? "active" : ""}`}
                  onClick={() => applyPreset(preset)}
                >
                  <div className="preset-name">{preset.name}</div>
                  <div className="preset-dimensions">
                    {preset.width} × {preset.height}
                  </div>
                  <div className="preset-description">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="crop-container">
            <ReactCrop
              crop={crop}
              onChange={(c) => {
                setCrop(c);
                setSelectedPreset(null); // Clear selection when manually adjusting
              }}
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
        </>
      )}

      {completedCrop && (
        <div className="actions">
          <button onClick={generateCroppedImage}>Preview Crop</button>
          <button onClick={downloadCroppedImage}>Download Cropped Image</button>
        </div>
      )}

      {completedCrop && (
        <div className="preview-section">
          <h2>Preview:</h2>
          <canvas
            ref={canvasRef}
            style={{
              border: "1px solid #ccc",
              objectFit: "contain",
              width: Math.max(completedCrop.width, 100),
              height: Math.max(completedCrop.height, 100),
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
