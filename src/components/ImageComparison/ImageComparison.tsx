import React, { useReducer, useRef, useCallback, useEffect } from "react";
import type { ConvertedImage } from '../../types';

interface ImageComparisonProps {
  convertedImage: ConvertedImage;
  onClose: () => void;
}

interface ComparisonState {
	zoomLevel: number;
	panPosition: { x: number; y: number };
	isDragging: boolean;
	dragStart: { x: number; y: number };
	showSplit: boolean;
	splitPosition: number;
}

type ComparisonAction =
	| { type: "ZOOM_IN" }
	| { type: "ZOOM_OUT" }
	| { type: "ZOOM_RESET" }
	| { type: "ZOOM_WHEEL"; delta: number }
	| { type: "DRAG_START"; x: number; y: number }
	| { type: "DRAG_MOVE"; x: number; y: number }
	| { type: "DRAG_END" }
	| { type: "SET_SPLIT_VIEW"; show: boolean }
	| { type: "SET_SPLIT_POSITION"; position: number };

const comparisonReducer = (
	state: ComparisonState,
	action: ComparisonAction,
): ComparisonState => {
	switch (action.type) {
		case "ZOOM_IN":
			return { ...state, zoomLevel: Math.min(state.zoomLevel * 1.5, 5) };
		case "ZOOM_OUT":
			return { ...state, zoomLevel: Math.max(state.zoomLevel / 1.5, 0.1) };
		case "ZOOM_RESET":
			return { ...state, zoomLevel: 1, panPosition: { x: 0, y: 0 } };
		case "ZOOM_WHEEL":
			return {
				...state,
				zoomLevel: Math.max(0.1, Math.min(5, state.zoomLevel * action.delta)),
			};
		case "DRAG_START":
			if (state.zoomLevel <= 1) return state;
			return {
				...state,
				isDragging: true,
				dragStart: {
					x: action.x - state.panPosition.x,
					y: action.y - state.panPosition.y,
				},
			};
		case "DRAG_MOVE":
			if (!state.isDragging || state.zoomLevel <= 1) return state;
			return {
				...state,
				panPosition: {
					x: action.x - state.dragStart.x,
					y: action.y - state.dragStart.y,
				},
			};
		case "DRAG_END":
			return { ...state, isDragging: false };
		case "SET_SPLIT_VIEW":
			return { ...state, showSplit: action.show };
		case "SET_SPLIT_POSITION":
			return {
				...state,
				splitPosition: Math.max(0, Math.min(100, action.position)),
			};
		default:
			return state;
	}
};

const ImageComparison: React.FC<ImageComparisonProps> = ({ convertedImage, onClose }) => {
  const [state, dispatch] = useReducer(comparisonReducer, {
			zoomLevel: 1,
			panPosition: { x: 0, y: 0 },
			isDragging: false,
			dragStart: { x: 0, y: 0 },
			showSplit: true,
			splitPosition: 50,
		});

		const containerRef = useRef<HTMLDivElement>(null);
		const originalImageRef = useRef<HTMLImageElement>(null);
		const convertedImageRef = useRef<HTMLImageElement>(null);

		// Create object URLs for images
		const originalUrl = URL.createObjectURL(convertedImage.originalFile);
		const convertedUrl = URL.createObjectURL(convertedImage.webpBlob);

		// Cleanup URLs on unmount
		useEffect(() => {
			return () => {
				URL.revokeObjectURL(originalUrl);
				URL.revokeObjectURL(convertedUrl);
			};
		}, [originalUrl, convertedUrl]);

		const handleZoomIn = useCallback(() => dispatch({ type: "ZOOM_IN" }), []);
		const handleZoomOut = useCallback(() => dispatch({ type: "ZOOM_OUT" }), []);
		const handleZoomReset = useCallback(
			() => dispatch({ type: "ZOOM_RESET" }),
			[],
		);

		const handleMouseDown = useCallback((e: React.MouseEvent) => {
			dispatch({ type: "DRAG_START", x: e.clientX, y: e.clientY });
		}, []);

		const handleMouseMove = useCallback((e: React.MouseEvent) => {
			dispatch({ type: "DRAG_MOVE", x: e.clientX, y: e.clientY });
		}, []);

		const handleMouseUp = useCallback(() => {
			dispatch({ type: "DRAG_END" });
		}, []);

		const handleWheel = useCallback((e: React.WheelEvent) => {
			e.preventDefault();
			const delta = e.deltaY > 0 ? 0.9 : 1.1;
			dispatch({ type: "ZOOM_WHEEL", delta });
		}, []);

		const handleTouchStart = useCallback((e: React.TouchEvent) => {
			if (e.touches.length === 1) {
				dispatch({
					type: "DRAG_START",
					x: e.touches[0].clientX,
					y: e.touches[0].clientY,
				});
			}
		}, []);

		const handleTouchMove = useCallback((e: React.TouchEvent) => {
			if (e.touches.length === 1) {
				dispatch({
					type: "DRAG_MOVE",
					x: e.touches[0].clientX,
					y: e.touches[0].clientY,
				});
			}
		}, []);

		const handleSplitDrag = useCallback(
			(e: React.MouseEvent | React.TouchEvent) => {
				if (!containerRef.current) return;

				const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
				const rect = containerRef.current.getBoundingClientRect();
				const newPosition = ((clientX - rect.left) / rect.width) * 100;
				dispatch({ type: "SET_SPLIT_POSITION", position: newPosition });
			},
			[],
		);

		const formatFileSize = (bytes: number): string => {
			if (bytes === 0) return "0 B";
			const k = 1024;
			const sizes = ["B", "KB", "MB", "GB"];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
		};

		return (
			<div className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-300">
				{/* Header */}
				<div className="bg-black border-b border-white/10 p-4 md:p-6 flex items-center justify-between">
					<div className="space-y-0.5">
						<h2 className="text-lg font-display font-medium text-white tracking-tight">
							Comparison
						</h2>
						<div className="text-[10px] text-white/40 font-medium uppercase tracking-widest truncate max-w-[150px] md:max-w-md">
							{convertedImage.originalFile.name}
						</div>
					</div>

					<div className="flex items-center gap-6">
						{/* View Toggle */}
						<div className="hidden md:flex items-center gap-4">
							<button
								type="button"
								onClick={() => dispatch({ type: "SET_SPLIT_VIEW", show: true })}
								className={`text-[10px] uppercase tracking-widest transition-colors ${
									state.showSplit
										? "text-white"
										: "text-white/30 hover:text-white/60"
								}`}
							>
								Split
							</button>
							<div className="w-px h-2 bg-white/10" />
							<button
								type="button"
								onClick={() =>
									dispatch({ type: "SET_SPLIT_VIEW", show: false })
								}
								className={`text-[10px] uppercase tracking-widest transition-colors ${
									!state.showSplit
										? "text-white"
										: "text-white/30 hover:text-white/60"
								}`}
							>
								Side
							</button>
						</div>

						{/* Zoom Info */}
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={handleZoomOut}
								className="text-white/40 hover:text-white transition-colors"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M20 12H4"
									/>
								</svg>
							</button>
							<span className="text-[10px] font-medium text-white/40 w-8 text-center tabular-nums">
								{Math.round(state.zoomLevel * 100)}%
							</span>
							<button
								type="button"
								onClick={handleZoomIn}
								className="text-white/40 hover:text-white transition-colors"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M12 4v16m8-8H4"
									/>
								</svg>
							</button>
						</div>

						<button
							type="button"
							onClick={handleZoomReset}
							className="px-4 py-2 border border-white/10 rounded-full text-[9px] uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all"
						>
							Reset
						</button>

						<button
							type="button"
							onClick={onClose}
							className="text-[10px] text-white/40 hover:text-white font-medium uppercase tracking-widest transition-colors"
						>
							Close
						</button>
					</div>
				</div>

				<div
					role="presentation"
					ref={containerRef}
					className="flex-1 relative overflow-hidden cursor-move bg-[#050505] touch-none"
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleMouseUp}
					onWheel={handleWheel}
				>
					{state.showSplit ? (
						<div className="relative w-full h-full">
							{/* Original */}
							<div
								className="absolute inset-0 overflow-hidden"
								style={{
									clipPath: `inset(0 ${100 - state.splitPosition}% 0 0)`,
								}}
							>
								<img
									ref={originalImageRef}
									src={originalUrl}
									alt="Original"
									className="w-full h-full object-contain"
									style={{
										transform: `scale(${state.zoomLevel}) translate(${state.panPosition.x / state.zoomLevel}px, ${state.panPosition.y / state.zoomLevel}px)`,
										transformOrigin: "center",
									}}
									draggable={false}
								/>
							</div>

							{/* Converted */}
							<div
								className="absolute inset-0 overflow-hidden"
								style={{ clipPath: `inset(0 0 0 ${state.splitPosition}%)` }}
							>
								<img
									ref={convertedImageRef}
									src={convertedUrl}
									alt="Converted"
									className="w-full h-full object-contain"
									style={{
										transform: `scale(${state.zoomLevel}) translate(${state.panPosition.x / state.zoomLevel}px, ${state.panPosition.y / state.zoomLevel}px)`,
										transformOrigin: "center",
									}}
									draggable={false}
								/>
							</div>

							{/* Split UI */}
							<div
								className="absolute top-0 bottom-0 w-12 -ml-6 cursor-ew-resize z-20 flex items-center justify-center touch-none"
								style={{ left: `${state.splitPosition}%` }}
								onMouseDown={(e) => {
									e.preventDefault();
									const handleMove = (ev: MouseEvent) =>
										handleSplitDrag(ev as any);
									const handleUp = () => {
										document.removeEventListener("mousemove", handleMove);
										document.removeEventListener("mouseup", handleUp);
									};
									document.addEventListener("mousemove", handleMove);
									document.addEventListener("mouseup", handleUp);
								}}
								onTouchStart={() => {
									const handleMove = (ev: TouchEvent) =>
										handleSplitDrag(ev as any);
									const handleUp = () => {
										document.removeEventListener("touchmove", handleMove);
										document.removeEventListener("touchend", handleUp);
									};
									document.addEventListener("touchmove", handleMove, {
										passive: false,
									});
									document.addEventListener("touchend", handleUp);
								}}
							>
								<div className="w-1 h-32 bg-white/20 rounded-full" />
								<div className="absolute w-10 h-10 rounded-full border border-white/20 bg-black/80 backdrop-blur-md flex items-center justify-center shadow-xl shadow-black/50 overflow-hidden">
									<div className="flex gap-1">
										<div className="w-0.5 h-3 bg-white/60 rounded-full" />
										<div className="w-0.5 h-3 bg-white/60 rounded-full" />
									</div>
								</div>
							</div>

							{/* Labels */}
							<div className="absolute top-4 left-4 flex gap-2">
								<span className="text-[10px] uppercase tracking-widest text-white/40 bg-black/40 px-2 py-1 rounded">
									Original
								</span>
							</div>
							<div className="absolute top-4 right-4 flex gap-2">
								<span className="text-[10px] uppercase tracking-widest text-white bg-black/40 px-2 py-1 rounded">
									WebP
								</span>
							</div>
						</div>
					) : (
						<div className="flex w-full h-full">
							<div className="flex-1 relative border-r border-white/5">
								<img
									ref={originalImageRef}
									src={originalUrl}
									alt="Original"
									className="w-full h-full object-contain"
									style={{
										transform: `scale(${state.zoomLevel}) translate(${state.panPosition.x / state.zoomLevel}px, ${state.panPosition.y / state.zoomLevel}px)`,
										transformOrigin: "center",
									}}
									draggable={false}
								/>
								<span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-white/40 bg-black/40 px-2 py-1 rounded">
									Original
								</span>
							</div>
							<div className="flex-1 relative">
								<img
									ref={convertedImageRef}
									src={convertedUrl}
									alt="Converted"
									className="w-full h-full object-contain"
									style={{
										transform: `scale(${state.zoomLevel}) translate(${state.panPosition.x / state.zoomLevel}px, ${state.panPosition.y / state.zoomLevel}px)`,
										transformOrigin: "center",
									}}
									draggable={false}
								/>
								<span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-white bg-black/40 px-2 py-1 rounded">
									WebP
								</span>
							</div>
						</div>
					)}
				</div>

				{/* Footer Stats */}
				<div className="bg-black border-t border-white/10 p-6 md:p-8">
					<div className="max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-8">
						<div className="flex flex-col gap-1">
							<span className="text-[10px] uppercase tracking-widest text-white/30">
								Original Size
							</span>
							<span className="text-sm font-medium text-white/60 tabular-nums">
								{formatFileSize(convertedImage.originalSize)}
							</span>
						</div>

						<div className="flex flex-col gap-1">
							<span className="text-[10px] uppercase tracking-widest text-white/30">
								New Size
							</span>
							<span className="text-sm font-medium text-white tabular-nums">
								{formatFileSize(convertedImage.webpSize)}
							</span>
						</div>

						<div className="flex flex-col gap-1">
							<span className="text-[10px] uppercase tracking-widest text-white/30">
								Reduction
							</span>
							<span className="text-sm font-medium text-white tabular-nums">
								-{convertedImage.compressionRatio.toFixed(1)}%
							</span>
						</div>

						<div className="hidden md:flex flex-col gap-1">
							<span className="text-[10px] uppercase tracking-widest text-white/30">
								Savings
							</span>
							<span className="text-sm font-medium text-white tabular-nums">
								{formatFileSize(
									convertedImage.originalSize - convertedImage.webpSize,
								)}
							</span>
						</div>

						<div className="flex items-center gap-2 px-3 py-1.5 bg-white text-black rounded-full">
							<span className="text-[10px] font-bold uppercase tracking-tight">
								Saved
							</span>
							<span className="text-xs font-bold tabular-nums">
								{Math.round(
									(1 - convertedImage.webpSize / convertedImage.originalSize) *
										100,
								)}
								%
							</span>
						</div>
					</div>
				</div>
				<button type="button" onClick={handleZoomReset} className="sr-only">
					Reset Zoom
				</button>
			</div>
		);
};

export default ImageComparison;
