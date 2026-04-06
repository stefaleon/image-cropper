import React from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";

interface CropperProps {
  imgSrc: string;
  crop: Crop | undefined;
  setCrop: (crop: Crop) => void;
  setCompletedCrop: (crop: PixelCrop) => void;
  imgRef: React.RefObject<HTMLImageElement>;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  selectedPreset: string | null;
  setSelectedPreset: (preset: string | null) => void;
}

const Cropper: React.FC<CropperProps> = ({
  imgSrc,
  crop,
  setCrop,
  setCompletedCrop,
  imgRef,
  onImageLoad,
  selectedPreset,
  setSelectedPreset,
}) => (
  <div className="crop-container">
    <ReactCrop
      crop={crop}
      onChange={(c) => {
        setCrop(c);
        // Do not clear selectedPreset; always use preset size for output if a preset was last selected
      }}
      onComplete={(c) => setCompletedCrop(c)}
      aspect={undefined}
    >
      <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} />
    </ReactCrop>
  </div>
);

export default Cropper;
