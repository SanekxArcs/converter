import React, { useState } from 'react';
import type { ConvertedImage, NamingSettings } from "../../types";
import ConversionResultItem from './ConversionResultItem';
import ImageComparison from '../ImageComparison/ImageComparison';

interface ConversionResultsProps {
	convertedImages: ConvertedImage[];
	onDownloadSingle: (convertedImage: ConvertedImage) => void;
	onDownloadAll: () => void;
	onDownloadZip: () => void;
	namingSettings: NamingSettings;
}

const ConversionResults: React.FC<ConversionResultsProps> = ({
	convertedImages,
	onDownloadSingle,
	onDownloadAll,
	onDownloadZip,
	namingSettings,
}) => {
	const [comparisonImage, setComparisonImage] = useState<ConvertedImage | null>(
		null,
	);

	const handleCompareImage = (convertedImage: ConvertedImage) => {
		setComparisonImage(convertedImage);
	};

	const handleCloseComparison = () => {
		setComparisonImage(null);
	};

	if (convertedImages.length === 0) return null;
	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 relative">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-display font-medium text-black dark:text-white">
					Results
				</h3>
			</div>

			<div className="grid grid-cols-1 gap-4">
				{convertedImages.map((convertedImage, index) => (
					<ConversionResultItem
						key={convertedImage.id}
						convertedImage={convertedImage}
						onDownload={() => onDownloadSingle(convertedImage)}
						onCompare={() => handleCompareImage(convertedImage)}
						namingSettings={namingSettings}
						index={index}
					/>
				))}
			</div>

			{/* Sticky Results Actions */}
			<div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 z-40">
				<div className="bg-black/90 dark:bg-white/90 backdrop-blur-lg rounded-[2rem] p-2 flex gap-2 shadow-2xl shadow-black/20 dark:shadow-white/10 border border-white/5 dark:border-black/5">
					<button
						onClick={onDownloadAll}
						className="flex-1 h-14 rounded-[1.5rem] bg-white dark:bg-black text-black dark:text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all active:scale-95"
					>
						Download All
					</button>
					<button
						onClick={onDownloadZip}
						className="flex-1 h-14 rounded-[1.5rem] bg-transparent text-white dark:text-black border border-white/10 dark:border-black/10 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/5 dark:hover:bg-black/5 transition-all active:scale-95"
					>
						Save as ZIP
					</button>
				</div>
			</div>

			{comparisonImage && (
				<ImageComparison
					convertedImage={comparisonImage}
					onClose={handleCloseComparison}
				/>
			)}
		</div>
	);
};

export default ConversionResults;
