import React, { useState } from 'react';
import type { ConversionSettings, ExifData } from '../../types';
import { getReadableExifInfo } from "../../services/exifService";

interface ExifControlProps {
  conversionSettings: ConversionSettings;
  onSettingsChange: (settings: ConversionSettings) => void;
  selectedFilesExif?: ExifData[];
}

const EMPTY_EXIF_ARRAY: ExifData[] = [];

const ExifControl: React.FC<ExifControlProps> = ({
	conversionSettings,
	onSettingsChange,
	selectedFilesExif = EMPTY_EXIF_ARRAY,
}) => {
	const [showExifData, setShowExifData] = useState(false);
	const [selectedFileIndex, setSelectedFileIndex] = useState(0);

	const hasExifData =
		selectedFilesExif.length > 0 &&
		selectedFilesExif.some((exif) => exif && Object.keys(exif).length > 0);
	const currentExif = selectedFilesExif[selectedFileIndex];

	const handlePreserveExifChange = (preserve: boolean) => {
		onSettingsChange({
			...conversionSettings,
			preserveExif: preserve,
			stripExif: !preserve,
			sanitizeExif: false,
		});
	};

	const handleStripExifChange = (strip: boolean) => {
		onSettingsChange({
			...conversionSettings,
			stripExif: strip,
			preserveExif: !strip,
			sanitizeExif: false,
		});
	};

	const handleSanitizeExifChange = (sanitize: boolean) => {
		onSettingsChange({
			...conversionSettings,
			sanitizeExif: sanitize,
			preserveExif: !sanitize,
			stripExif: !sanitize,
		});
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-display font-medium">EXIF</h3>
				{hasExifData && (
					<button
						onClick={() => setShowExifData(!showExifData)}
						className={`text-[10px] uppercase tracking-widest transition-colors ${showExifData ? "text-black" : "text-gray-300"}`}
					>
						{showExifData ? "Close" : "Data"}
					</button>
				)}
			</div>

			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => handlePreserveExifChange(true)}
					className={`flex-1 px-3 py-2 text-[10px] uppercase tracking-widest rounded-xl transition-all ${
						conversionSettings.preserveExif
							? "bg-black text-white"
							: "bg-gray-50 text-gray-400 hover:text-black"
					}`}
				>
					Keep
				</button>
				<button
					onClick={() => handleStripExifChange(true)}
					className={`flex-1 px-3 py-2 text-[10px] uppercase tracking-widest rounded-xl transition-all ${
						conversionSettings.stripExif
							? "bg-black text-white"
							: "bg-gray-50 text-gray-400 hover:text-black"
					}`}
				>
					Remove
				</button>
				<button
					onClick={() => handleSanitizeExifChange(true)}
					className={`flex-1 px-3 py-2 text-[10px] uppercase tracking-widest rounded-xl transition-all ${
						conversionSettings.sanitizeExif
							? "bg-black text-white"
							: "bg-gray-50 text-gray-400 hover:text-black"
					}`}
				>
					Sanitize
				</button>
			</div>

			{showExifData && currentExif && (
				<div className="mt-4 p-4 bg-gray-50 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
					<div className="flex items-center justify-between pb-2 border-b border-gray-100">
						<span className="text-[10px] text-gray-400 uppercase tracking-tighter">
							Details
						</span>
						{selectedFilesExif.length > 1 && (
							<select
								value={selectedFileIndex}
								onChange={(e) => setSelectedFileIndex(Number(e.target.value))}
								className="bg-transparent border-none text-[10px] font-medium focus:ring-0 p-0"
							>
								{selectedFilesExif.map((_, i) => (
									<option key={i} value={i}>
										File {i + 1}
									</option>
								))}
							</select>
						)}
					</div>

					<div className="grid grid-cols-2 gap-y-2 gap-x-4">
						{currentExif &&
							Object.entries(getReadableExifInfo(currentExif)).map(
								([label, value], idx) => (
									<div key={idx} className="space-y-0.5">
										<p className="text-[9px] text-gray-400 uppercase tracking-tighter">
											{label}
										</p>
										<p className="text-[11px] font-medium text-black truncate">
											{value}
										</p>
									</div>
								),
							)}
					</div>
				</div>
			)}
		</div>
	);
};

export default ExifControl;
