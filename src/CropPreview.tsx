import React from "react";

interface CropPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  completedCrop: { width: number; height: number } | null | undefined;
  selectedPreset: string | null;
  cropPresets: { name: string; width: number; height: number }[];
}

const CropPreview: React.FC<CropPreviewProps> = ({
  canvasRef,
  completedCrop,
  selectedPreset,
  cropPresets,
}) => {
  if (!completedCrop) return null;
  const preset = cropPresets.find((p) => p.name === selectedPreset);
  return (
    <div className="preview-section">
      <h2>Preview:</h2>
      <canvas
        ref={canvasRef}
        width={preset ? preset.width : completedCrop.width}
        height={preset ? preset.height : completedCrop.height}
        style={{
          border: "1px solid #ccc",
          objectFit: "contain",
          width: Math.max(completedCrop.width, 100),
          height: Math.max(completedCrop.height, 100),
        }}
      />
    </div>
  );
};

export default CropPreview;
