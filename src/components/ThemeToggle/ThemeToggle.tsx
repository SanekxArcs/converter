import React from "react";
import { useTheme } from "../ThemeProvider/ThemeProvider";

const ThemeToggle: React.FC = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 transition-all hover:scale-110 active:scale-95 border border-transparent dark:border-neutral-700 shadow-sm"
			aria-label="Toggle theme"
		>
			{theme === "light" ? (
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
					/>
				</svg>
			) : (
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707-.707M7.757 7.757l.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			)}
		</button>
	);
};

export default ThemeToggle;
