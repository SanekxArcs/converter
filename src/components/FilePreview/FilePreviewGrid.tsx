import React from 'react';
import type { SelectedFile } from '../../types';
import { formatFileSize } from '../../utils/fileUtils';

interface FilePreviewGridProps {
  selectedFiles: SelectedFile[];
  onRemoveFile: (id: string) => void;
  onClearAll: () => void;
}

const FilePreviewGrid: React.FC<FilePreviewGridProps> = ({
  selectedFiles,
  onRemoveFile,
  onClearAll
}) => {
  if (selectedFiles.length === 0) return null;
  return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-display font-medium text-black dark:text-white">
						Selected
					</h3>
					<button
						onClick={onClearAll}
						className="text-xs text-gray-400 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest"
					>
						Clear All
					</button>
				</div>
				<div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3">
					{selectedFiles.map((selectedFile) => (
						<div
							key={selectedFile.id}
							className="flex-shrink-0 w-48 sm:w-full group relative bg-gray-50 dark:bg-neutral-900 rounded-2xl p-3 transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-neutral-800/50"
						>
							<button
								onClick={() => onRemoveFile(selectedFile.id)}
								className="absolute top-2 right-2 z-10 w-6 h-6 bg-white/80 dark:bg-black/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black dark:text-white"
							>
								<svg
									className="w-3 h-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
							<div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-black/5 dark:border-white/5">
								<img
									src={selectedFile.preview}
									alt=""
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="px-1 text-black dark:text-white">
								<p className="text-xs font-medium truncate mb-0.5">
									{selectedFile.file.name}
								</p>
								<p className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-tighter">
									{formatFileSize(selectedFile.file.size)}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		);
};

export default FilePreviewGrid;
