import React from "react";
import { cropPresets, CropPreset } from "./cropPresets";

interface PresetSelectorProps {
  selectedPreset: string | null;
  onSelect: (preset: CropPreset) => void;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({
  selectedPreset,
  onSelect,
}) => (
  <div className="presets-section">
    <h2>Choose Crop Dimensions</h2>
    <div className="presets-grid">
      {cropPresets.map((preset) => (
        <button
          key={preset.name}
          className={`preset-card ${selectedPreset === preset.name ? "active" : ""}`}
          onClick={() => {
            if (selectedPreset === preset.name) {
              onSelect(null as any); // Deselect preset, allow custom crop
            } else {
              onSelect(preset);
            }
          }}
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
);

export default PresetSelector;
