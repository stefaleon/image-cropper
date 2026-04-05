import { useEffect } from "react";
import { CropPreset } from "./cropPresets";
import { drawCroppedImage } from "./drawCroppedImage";
import { Crop, PixelCrop } from "react-image-crop";

export default function useCropCanvas({
  completedCrop,
  imgRef,
  canvasRef,
  selectedPreset,
  cropPresets,
  imgSrc,
}: {
  completedCrop: PixelCrop | undefined;
  imgRef: React.RefObject<HTMLImageElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  selectedPreset: string | null;
  cropPresets: CropPreset[];
  imgSrc: string;
}) {
  useEffect(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;
    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const preset = cropPresets.find((p) => p.name === selectedPreset);
    if (preset) {
      canvas.width = preset.width;
      canvas.height = preset.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }
    drawCroppedImage({ ctx, image, crop, preset, scaleX, scaleY });
  }, [completedCrop, imgSrc, selectedPreset, cropPresets, imgRef, canvasRef]);
}
