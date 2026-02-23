import React from 'react';

interface QualityControlProps {
	quality: number;
	onQualityChange: (quality: number) => void;
}

const QualityControl: React.FC<QualityControlProps> = ({
	quality,
	onQualityChange,
}) => {
	return (
		<div className="space-y-6">
			<div className="flex items-end justify-between">
				<div>
					<h3 className="text-xl font-display font-medium mb-1 text-black dark:text-white">
						Quality
					</h3>
					<p className="text-gray-400 dark:text-neutral-500 text-xs">
						Adjust compression level
					</p>
				</div>
				<span className="text-4xl font-display font-light text-black dark:text-white">
					{quality}
					<span className="text-lg ml-0.5 text-gray-300 dark:text-neutral-600">
						%
					</span>
				</span>
			</div>

			<div className="grid grid-cols-3 gap-2">
				<button
					type="button"
					onClick={() => onQualityChange(Math.max(10, quality - 5))}
					className="py-3 rounded-2xl text-[10px] uppercase tracking-widest bg-gray-50 dark:bg-neutral-900 text-black/60 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all font-bold"
				>
					-5%
				</button>
				<button
					type="button"
					onClick={() => onQualityChange(80)}
					className={`py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all font-bold ${
						quality === 80
							? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10"
							: "bg-gray-50 dark:bg-neutral-900 text-black/60 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-neutral-800"
					}`}
				>
					Default (80%)
				</button>
				<button
					type="button"
					onClick={() => onQualityChange(Math.min(100, quality + 5))}
					className="py-3 rounded-2xl text-[10px] uppercase tracking-widest bg-gray-50 dark:bg-neutral-900 text-black/60 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all font-bold"
				>
					+5%
				</button>
			</div>

			<div className="relative py-2">
				<input
					type="range"
					min="10"
					max="100"
					value={quality}
					onChange={(e) => onQualityChange(Number(e.target.value))}
					className="w-full h-1.5 bg-gray-100 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
				/>
			</div>
		</div>
	);
};

export default QualityControl;
