import React, { useMemo, useEffect, useState } from "react";
import type { ConvertedImage, NamingSettings } from "../../types";
import { formatFileSize } from "../../utils/fileUtils";
import { generateFileName } from "../../services/downloadService";

interface ConversionResultItemProps {
	convertedImage: ConvertedImage;
	onDownload: (convertedImage: ConvertedImage) => void;
	onCompare: (convertedImage: ConvertedImage) => void;
	namingSettings: NamingSettings;
	index: number;
}

const ConversionResultItem: React.FC<ConversionResultItemProps> = ({
	convertedImage,
	onDownload,
	onCompare,
	namingSettings,
	index,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string>("");

	useEffect(() => {
		const url = URL.createObjectURL(convertedImage.webpBlob);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [convertedImage.webpBlob]);

	const getOriginalFileType = (mimeType: string): string => {
		switch (mimeType) {
			case "image/png":
				return "PNG";
			case "image/avif":
				return "AVIF";
			case "image/jpeg":
				return "JPEG";
			case "image/gif":
				return "GIF";
			default:
				return "IMG";
		}
	};

	const originalFileName = useMemo(
		() =>
			convertedImage.originalFile.name.replace(
				/\.(png|avif|jpe?g|gif)$/i,
				".webp",
			),
		[convertedImage.originalFile.name],
	);

	const newFileName = useMemo(
		() => generateFileName(convertedImage, namingSettings, index),
		[convertedImage, namingSettings, index],
	);

	const hasRenamed = originalFileName !== newFileName;

	return (
		<div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-5 rounded-[2rem] group animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all overflow-hidden text-black dark:text-white">
			<div className="flex gap-4 mb-6">
				{/* Image Preview */}
				<div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/5 dark:border-white/5 relative">
					{previewUrl ? (
						<img
							src={previewUrl}
							alt="Result Preview"
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full animate-pulse bg-gray-100 dark:bg-neutral-700" />
					)}
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors" />
				</div>

				<div className="flex-1 min-w-0 flex flex-col justify-center">
					<div className="flex items-center justify-between mb-1.5">
						<div className="flex items-center gap-1.5">
							<span className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-[9px] font-bold text-gray-500 dark:text-neutral-400 rounded-lg uppercase tracking-wider">
								WebP
							</span>
							<span className="text-[10px] text-gray-300 dark:text-neutral-600 uppercase tracking-widest font-medium">
								from {getOriginalFileType(convertedImage.originalFile.type)}
							</span>
						</div>
						<span className="text-[10px] font-mono text-black/20 dark:text-white/20 font-medium">
							{formatFileSize(convertedImage.webpSize)}
						</span>
					</div>

					<div className="pr-4 space-y-1">
						{hasRenamed && (
							<h5 className="text-[11px] text-gray-300 dark:text-neutral-600 line-through truncate leading-tight font-medium decoration-gray-200 dark:decoration-neutral-800">
								{originalFileName}
							</h5>
						)}
						<h4
							className="font-display font-medium text-black dark:text-white text-base leading-tight truncate"
							title={newFileName}
						>
							{newFileName}
						</h4>
					</div>
				</div>

				<div className="flex-shrink-0 flex items-center">
					<div className="flex flex-col items-center justify-center min-w-[3.5rem] h-8 bg-black dark:bg-white rounded-xl shadow-lg shadow-black/10 dark:shadow-white/5">
						<span className="text-[11px] font-bold text-white dark:text-black tracking-tighter">
							-{convertedImage.compressionRatio.toFixed(0)}%
						</span>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => onCompare(convertedImage)}
					className="flex-1 h-12 border border-black/5 dark:border-white/10 text-black dark:text-white text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all font-bold"
				>
					Compare
				</button>
				<button
					type="button"
					onClick={() => onDownload(convertedImage)}
					className="flex-1 h-12 bg-black dark:bg-white text-white dark:text-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all font-bold shadow-lg shadow-black/5 dark:shadow-white/5 active:scale-[0.98]"
				>
					Download
				</button>
			</div>
		</div>
	);
};

export default ConversionResultItem;
