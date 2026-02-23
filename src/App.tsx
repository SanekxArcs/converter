import React, { useState, useRef, useCallback } from "react";
import SEO from "./components/SEO/SEO";
import FileUploadZone from "./components/FileUpload/FileUploadZone";
import FilePreviewGrid from "./components/FilePreview/FilePreviewGrid";
import QualityControl from "./components/QualityControl/QualityControl";
import ResizeControl, {
	type ResizeSettings,
} from "./components/ResizeControl/ResizeControl";
import NamingControl from "./components/NamingControl/NamingControl";
import ConversionResults from "./components/ConversionResults/ConversionResults";
import ErrorDisplay from "./components/ErrorDisplay/ErrorDisplay";
import Footer from "./components/Footer/Footer";
import PWAStatus from "./components/PWAStatus/PWAStatus";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import { useFileManagement } from "./hooks/useFileManagement";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { convertMultipleImages } from "./services/conversionService";
import {
	downloadSingleFile,
	downloadMultipleFiles,
	downloadAsZip,
} from "./services/downloadService";
import { SUPPORTED_EXTENSIONS } from "./types";
import type { ConversionSettings, NamingSettings } from "./types";

function App() {
	const [quality, setQuality] = useState<number>(80);
	const [isConverting, setIsConverting] = useState<boolean>(false);
	const [conversionProgress, setConversionProgress] = useState<{
		current: number;
		total: number;
	} | null>(null);
	const [resizeSettings, setResizeSettings] = useState<ResizeSettings>({
		enabled: false,
		width: 1920,
		height: 1080,
		aspectRatio: "preserve",
	});
	const [conversionSettings] = useState<ConversionSettings>({
		preserveExif: false,
		stripExif: true,
		sanitizeExif: true,
	});
	const [namingSettings, setNamingSettings] = useState<NamingSettings>({
		customName: "",
		addNumber: false,
		addDate: false,
		addTime: false,
	});

	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		selectedFiles,
		convertedImages,
		error,
		addFiles,
		removeFile,
		clearAllFiles,
		clearError,
		setConvertedImages,
		setError,
	} = useFileManagement();

	const { dragActive, handleDrag, handleDrop } = useDragAndDrop(addFiles);

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			clearError();
			if (e.target.files) {
				const files = Array.from(e.target.files);
				addFiles(files);
			}
		},
		[addFiles, clearError],
	);

	const handleConversion = useCallback(async () => {
		if (selectedFiles.length === 0) return;

		setIsConverting(true);
		setConversionProgress({ current: 0, total: selectedFiles.length });
		setError("");

		try {
			const converted = await convertMultipleImages(
				selectedFiles,
				quality,
				resizeSettings,
				{}, // metadata removed
				conversionSettings,
				(current, total) => {
					setConversionProgress({ current, total });
				},
			);
			setConvertedImages(converted);
			setConversionProgress(null);
		} catch {
			setError("Error converting images. Please try again.");
			setConversionProgress(null);
		} finally {
			setIsConverting(false);
		}
	}, [
		selectedFiles,
		quality,
		resizeSettings,
		conversionSettings,
		setConvertedImages,
		setError,
	]);

	const handleDownloadAll = useCallback(() => {
		downloadMultipleFiles(convertedImages, namingSettings);
	}, [convertedImages, namingSettings]);

	const handleDownloadZip = useCallback(async () => {
		try {
			await downloadAsZip(convertedImages, namingSettings);
		} catch {
			setError("Error creating ZIP file. Please try again.");
		}
	}, [convertedImages, namingSettings, setError]);

	return (
		<>
			<SEO />
			<div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 flex flex-col font-body text-black dark:text-white">
				<PWAStatus />

				<div className="slim-container flex flex-col flex-1 w-full py-8 pt-20">
					<div className="fixed top-4 right-4 z-[70] md:right-[calc(50%-240px+16px)] flex items-center gap-2">
						<ThemeToggle />
						{selectedFiles.length > 0 && (
							<button
								onClick={clearAllFiles}
								className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-gray-100 dark:border-neutral-800 text-black dark:text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all active:scale-95 flex items-center gap-2 group animate-in fade-in slide-in-from-right-4 duration-300"
							>
								<svg
									className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300"
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
								Clear
							</button>
						)}
					</div>

					<header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
						<h1 className="text-4xl font-display font-medium tracking-tight mb-2 text-black dark:text-white">
							Converter
						</h1>
						<p className="text-gray-400 dark:text-neutral-500 text-sm tracking-wider uppercase">
							WebP Optimizer
						</p>
					</header>

					<main className="flex-1 space-y-12">
						<section className="animate-in fade-in duration-700 delay-100">
							<FileUploadZone
								dragActive={dragActive}
								onDragEnter={handleDrag}
								onDragLeave={handleDrag}
								onDragOver={handleDrag}
								onDrop={handleDrop}
								onFileSelect={() => fileInputRef.current?.click()}
								acceptedFormats="Images"
							/>

							<input
								ref={fileInputRef}
								type="file"
								accept={SUPPORTED_EXTENSIONS.join(",")}
								multiple
								onChange={handleFileSelect}
								className="hidden"
							/>
						</section>

						<ErrorDisplay error={error} onDismiss={clearError} />

						<FilePreviewGrid
							selectedFiles={selectedFiles}
							onRemoveFile={removeFile}
							onClearAll={clearAllFiles}
						/>

						{selectedFiles.length > 0 && (
							<section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
								<div className="space-y-8">
									<QualityControl
										quality={quality}
										onQualityChange={setQuality}
									/>

									<div className="pt-4 border-t border-gray-100">
										<ResizeControl
											resizeSettings={resizeSettings}
											onResizeSettingsChange={setResizeSettings}
										/>
									</div>

									<div className="pt-8 border-t border-gray-100">
										<NamingControl
											settings={namingSettings}
											onSettingsChange={setNamingSettings}
										/>
									</div>
								</div>

								<div className="sticky bottom-8 z-30 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
									{conversionProgress && (
										<div className="mb-4 bg-white/80 backdrop-blur-md border border-gray-100 p-4 rounded-3xl shadow-xl shadow-black/5 animate-in zoom-in-95 duration-300">
											<div className="flex items-center justify-between mb-2">
												<span className="text-[10px] uppercase tracking-widest font-bold text-black/40">
													Converting
												</span>
												<span className="text-[10px] font-mono font-bold">
													{Math.round(
														(conversionProgress.current /
															conversionProgress.total) *
															100,
													)}
													%
												</span>
											</div>
											<div className="h-1.5 w-full bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
												<div
													className="h-full bg-black dark:bg-white transition-all duration-300 ease-out"
													style={{
														width: `${(conversionProgress.current / conversionProgress.total) * 100}%`,
													}}
												/>
											</div>
											<p className="mt-2 text-[9px] text-center text-gray-400 dark:text-neutral-500 uppercase tracking-tighter">
												{conversionProgress.current} of{" "}
												{conversionProgress.total} images
											</p>
										</div>
									)}

									<button
										type="button"
										onClick={handleConversion}
										disabled={isConverting}
										className={`w-full py-6 rounded-[2rem] font-display text-xl tracking-tight transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl ${
											isConverting
												? "bg-gray-50 dark:bg-neutral-900 text-gray-200 dark:text-neutral-700 cursor-not-allowed shadow-none"
												: "bg-black dark:bg-white text-white dark:text-black shadow-black/20 dark:shadow-white/5 hover:bg-neutral-800 dark:hover:bg-neutral-200"
										}`}
									>
										{isConverting ? (
											<div className="flex items-center gap-3">
												<svg
													className="animate-spin h-5 w-5 text-current"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													/>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													/>
												</svg>
												<span>Processing...</span>
											</div>
										) : (
											`Convert ${selectedFiles.length} ${selectedFiles.length === 1 ? "Image" : "Images"}`
										)}
									</button>
								</div>
							</section>
						)}

						{convertedImages.length > 0 && (
							<section
								id="results-section"
								className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32"
							>
								<ConversionResults
									convertedImages={convertedImages}
									onDownloadSingle={(img) =>
										downloadSingleFile(img, namingSettings)
									}
									onDownloadAll={handleDownloadAll}
									onDownloadZip={handleDownloadZip}
									namingSettings={namingSettings}
								/>
							</section>
						)}
					</main>

					<Footer />
				</div>
				<PWAStatus />
			</div>
		</>
	);
}

export default App;

