import { CropPreset } from "./cropPresets";

export function drawCroppedImage({
  ctx,
  image,
  crop,
  preset,
  scaleX,
  scaleY,
}: {
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
  crop: { x: number; y: number; width: number; height: number };
  preset: CropPreset | undefined;
  scaleX: number;
  scaleY: number;
}) {
  if (preset) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, preset.width, preset.height);
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      preset.width,
      preset.height,
    );
  } else {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, crop.width, crop.height);
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
  }
}
