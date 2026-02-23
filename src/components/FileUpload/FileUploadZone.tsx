import React from 'react';

interface FileUploadZoneProps {
  dragActive: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: () => void;
  acceptedFormats: string;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
	dragActive,
	onDragEnter,
	onDragLeave,
	onDragOver,
	onDrop,
	onFileSelect,
}) => {
	return (
		<div
			role="button"
			tabIndex={0}
			className={`relative min-h-[200px] flex flex-col items-center justify-center border border-gray-100 dark:border-neutral-800 rounded-3xl transition-all duration-500 ease-out cursor-pointer group hover:bg-gray-50/50 dark:hover:bg-neutral-900/50 ${
				dragActive
					? "bg-gray-50/80 dark:bg-neutral-900/80 scale-[0.98] border-black dark:border-white"
					: ""
			}`}
			onClick={onFileSelect}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onFileSelect();
				}
			}}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
		>
			<div className="relative z-10 text-center px-6">
				<div className="mb-4 flex justify-center">
					<div className="w-10 h-10 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black transform group-hover:scale-110 transition-transform duration-500">
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M12 4v16m8-8H4"
							/>
						</svg>
					</div>
				</div>
				<h3 className="text-lg font-display font-medium mb-1 text-black dark:text-white">
					Add Images
				</h3>
				<p className="text-gray-400 dark:text-neutral-500 text-xs max-w-[180px] mx-auto leading-relaxed">
					Tap or drop files to start
				</p>
			</div>
		</div>
	);
};

export default FileUploadZone;
