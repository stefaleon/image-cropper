export interface CropPreset {
  name: string;
  width: number;
  height: number;
  description: string;
}

export const cropPresets: CropPreset[] = [
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
