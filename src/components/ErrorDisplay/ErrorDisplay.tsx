import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onDismiss?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
			<div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl mb-4 flex justify-between items-center shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
				<div className="flex items-center gap-3">
					<svg
						className="w-5 h-5 text-red-500 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span className="text-sm font-medium">{error}</span>
				</div>
				{onDismiss && (
					<button
						onClick={onDismiss}
						className="text-red-400 hover:text-red-600 hover:bg-red-100 p-1.5 rounded-lg transition-colors ml-4"
						aria-label="Dismiss error"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				)}
			</div>
		);
};

export default ErrorDisplay;
