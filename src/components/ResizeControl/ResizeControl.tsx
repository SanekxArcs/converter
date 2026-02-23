import React, { useState, useEffect } from 'react';

export interface ResizeSettings {
  enabled: boolean;
  width: number;
  height: number;
  aspectRatio: 'preserve' | 'free' | 'square';
}

interface ResizeControlProps {
  resizeSettings: ResizeSettings;
  onResizeSettingsChange: (settings: ResizeSettings) => void;
}

const ResizeControl: React.FC<ResizeControlProps> = ({
  resizeSettings,
  onResizeSettingsChange
}) => {
  const [localWidth, setLocalWidth] = useState(() =>
			resizeSettings.width.toString(),
		);
		const [localHeight, setLocalHeight] = useState(() =>
			resizeSettings.height.toString(),
		);

		const presets = [
			{ label: "HD", width: 1280, height: 720 },
			{ label: "FHD", width: 1920, height: 1080 },
			{ label: "4K", width: 3840, height: 2160 },
			{ label: "Square", width: 1080, height: 1080 },
		];

		const applyPreset = (width: number, height: number) => {
			onResizeSettingsChange({
				...resizeSettings,
				enabled: true,
				width,
				height,
				aspectRatio: width === height ? "square" : "preserve",
			});
		};

		useEffect(() => {
			setLocalWidth(resizeSettings.width.toString());
			setLocalHeight(resizeSettings.height.toString());
		}, [resizeSettings.width, resizeSettings.height]);

		const handleWidthChange = (value: string) => {
			setLocalWidth(value);
			const width = parseInt(value) || 0;
			let height = resizeSettings.height;

			if (resizeSettings.aspectRatio === "preserve" && width > 0) {
				height = Math.round((width * 9) / 16);
			} else if (resizeSettings.aspectRatio === "square") {
				height = width;
			}

			onResizeSettingsChange({
				...resizeSettings,
				width,
				height,
			});
		};

		const handleHeightChange = (value: string) => {
			setLocalHeight(value);
			const height = parseInt(value) || 0;
			let width = resizeSettings.width;

			if (resizeSettings.aspectRatio === "preserve" && height > 0) {
				width = Math.round((height * 16) / 9);
			} else if (resizeSettings.aspectRatio === "square") {
				width = height;
			}

			onResizeSettingsChange({
				...resizeSettings,
				width,
				height,
			});
		};

		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-display font-medium text-black dark:text-white">
						Resize
					</h3>
					<button
						type="button"
						onClick={() =>
							onResizeSettingsChange({
								...resizeSettings,
								enabled: !resizeSettings.enabled,
							})
						}
						className={`text-[10px] uppercase tracking-widest transition-colors ${resizeSettings.enabled ? "text-black dark:text-white" : "text-gray-300 dark:text-neutral-600"}`}
					>
						{resizeSettings.enabled ? "Enabled" : "Disabled"}
					</button>
				</div>

				<div className="flex flex-wrap gap-2">
					{presets.map((preset) => (
						<button
							key={preset.label}
							type="button"
							onClick={() => applyPreset(preset.width, preset.height)}
							className={`px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all ${
								resizeSettings.enabled &&
								resizeSettings.width === preset.width &&
								resizeSettings.height === preset.height
									? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10"
									: "bg-gray-50 dark:bg-neutral-900 text-black/60 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-neutral-800"
							}`}
						>
							{preset.label}
						</button>
					))}
				</div>

				{resizeSettings.enabled && (
					<div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
						<div className="space-y-1">
							<label className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-tighter">
								Width
							</label>
							<input
								type="number"
								value={localWidth}
								onChange={(e) => handleWidthChange(e.target.value)}
								className="w-full bg-gray-50 dark:bg-neutral-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-black dark:text-white"
							/>
						</div>
						<div className="space-y-1">
							<label className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-tighter">
								Height
							</label>
							<input
								type="number"
								value={localHeight}
								onChange={(e) => handleHeightChange(e.target.value)}
								className="w-full bg-gray-50 dark:bg-neutral-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-black dark:text-white"
							/>
						</div>
					</div>
				)}
			</div>
		);
};

export default ResizeControl;
