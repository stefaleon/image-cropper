import { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./App.css";
import { cropPresets, CropPreset } from "./cropPresets";
import useCropCanvas from "./useCropCanvas";

function App() {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update canvas preview in real time
  useCropCanvas({
    completedCrop,
    imgRef,
    canvasRef,
    selectedPreset,
    cropPresets,
    imgSrc,
  });
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
      a.download = selectedPreset
        ? `${selectedPreset.replace(/\s+/g, "_").toLowerCase()}_crop.png`
        : "cropped-image.png";
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
      unit: "%" as const,
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
    // Calculate the largest crop that matches the preset aspect ratio and fits in the image
    const aspectRatio = presetWidth / presetHeight;
    let cropWidth = imgWidth;
    let cropHeight = cropWidth / aspectRatio;
    if (cropHeight > imgHeight) {
      cropHeight = imgHeight;
      cropWidth = cropHeight * aspectRatio;
    }
    // Center the crop
    const x = Math.round((imgWidth - cropWidth) / 2);
    const y = Math.round((imgHeight - cropHeight) / 2);
    const newCrop = {
      unit: "px" as const,
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
      x,
      y,
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
            width={(() => {
              const preset = cropPresets.find((p) => p.name === selectedPreset);
              return preset ? preset.width : completedCrop.width;
            })()}
            height={(() => {
              const preset = cropPresets.find((p) => p.name === selectedPreset);
              return preset ? preset.height : completedCrop.height;
            })()}
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
