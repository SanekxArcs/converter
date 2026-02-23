import React, { useState } from 'react';
import type { ImageMetadata } from '../../types';
import {
	cleanMetadata,
	saveMetadataToLocalStorage,
	loadMetadataFromLocalStorage,
	hasMetadataInLocalStorage,
} from "../../utils/metadataUtils";

interface MetadataControlProps {
  metadata: ImageMetadata;
  onMetadataChange: (metadata: ImageMetadata) => void;
}

const MetadataControl: React.FC<MetadataControlProps> = ({
  metadata,
  onMetadataChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");

  const handleFieldChange = (field: keyof ImageMetadata, value: string) => {
    const newMetadata = {
      ...metadata,
      [field]: value
    };
    
    // Validate and clean metadata
				onMetadataChange(cleanMetadata(newMetadata));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = metadata.keywords || [];
      onMetadataChange({
        ...metadata,
        keywords: [...currentKeywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const currentKeywords = metadata.keywords || [];
    onMetadataChange({
      ...metadata,
      keywords: currentKeywords.filter((_, i) => i !== index)
    });
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSaveMetadata = () => {
    saveMetadataToLocalStorage(metadata);
    // You could add a toast notification here
  };

  const handleLoadMetadata = () => {
    const savedMetadata = loadMetadataFromLocalStorage();
    onMetadataChange(savedMetadata);
  };

  return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-display font-medium">Metadata</h3>
					<button
						type="button"
						onClick={() => setIsExpanded(!isExpanded)}
						className={`text-[10px] uppercase tracking-widest transition-colors ${isExpanded ? "text-black" : "text-gray-300"}`}
					>
						{isExpanded ? "Close" : "Open"}
					</button>
				</div>

				{isExpanded && (
					<div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Author */}
							<div className="space-y-1">
								<label className="text-[10px] text-gray-400 uppercase tracking-tighter">
									Author
								</label>
								<input
									type="text"
									value={metadata.author || ""}
									onChange={(e) => handleFieldChange("author", e.target.value)}
									className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-black transition-all"
									placeholder="Photographer name"
								/>
							</div>

							{/* Title */}
							<div className="space-y-1">
								<label className="text-[10px] text-gray-400 uppercase tracking-tighter">
									Title
								</label>
								<input
									type="text"
									value={metadata.title || ""}
									onChange={(e) => handleFieldChange("title", e.target.value)}
									className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-black transition-all"
									placeholder="Image title"
								/>
							</div>
						</div>

						{/* Description */}
						<div className="space-y-1">
							<label className="text-[10px] text-gray-400 uppercase tracking-tighter">
								Description
							</label>
							<textarea
								value={metadata.description || ""}
								onChange={(e) =>
									handleFieldChange("description", e.target.value)
								}
								className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-black transition-all resize-none min-h-[60px]"
								placeholder="Small story behind the image..."
							/>
						</div>

						{/* Keywords */}
						<div className="space-y-2">
							<label className="text-[10px] text-gray-400 uppercase tracking-tighter">
								Keywords
							</label>
							<div className="flex gap-2">
								<input
									type="text"
									value={keywordInput}
									onChange={(e) => setKeywordInput(e.target.value)}
									onKeyPress={handleKeywordKeyPress}
									className="flex-1 bg-gray-50 border-none rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-black transition-all"
									placeholder="nature, travel, art..."
								/>
								<button
									type="button"
									onClick={handleAddKeyword}
									className="px-4 py-2 bg-black text-white text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors"
								>
									Add
								</button>
							</div>
							{metadata.keywords && metadata.keywords.length > 0 && (
								<div className="flex flex-wrap gap-1.5 pt-1">
									{metadata.keywords.map((keyword, index) => (
										<span
											key={`keyword-${keyword}`}
											className="inline-flex items-center px-2 py-1 text-[10px] font-medium bg-gray-100 text-black rounded-md"
										>
											{keyword}
											<button
												type="button"
												onClick={() => handleRemoveKeyword(index)}
												className="ml-1.5 text-gray-400 hover:text-black transition-colors"
											>
												×
											</button>
										</span>
									))}
								</div>
							)}
						</div>

						{/* Actions */}
						<div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100 italic">
							<button
								type="button"
								onClick={handleSaveMetadata}
								className="text-[10px] text-gray-400 hover:text-black transition-colors"
							>
								Save to Browser
							</button>
							<button
								type="button"
								onClick={handleLoadMetadata}
								disabled={!hasMetadataInLocalStorage()}
								className="text-[10px] text-gray-400 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
							>
								Load Saved
							</button>
							<button
								type="button"
								onClick={() => onMetadataChange({})}
								className="text-[10px] text-red-300 hover:text-red-500 transition-colors ml-auto"
							>
								Clear All
							</button>
						</div>
					</div>
				)}
			</div>
		);
};

export default MetadataControl;
