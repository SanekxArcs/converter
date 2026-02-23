import React from 'react';
import type { NamingSettings } from '../../types';

interface NamingControlProps {
  settings: NamingSettings;
  onSettingsChange: (settings: NamingSettings) => void;
}

const NamingControl: React.FC<NamingControlProps> = ({ settings, onSettingsChange }) => {
  const handleChange = (field: keyof NamingSettings, value: string | boolean) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  return (
			<div className="space-y-6">
				<div className="flex items-end justify-between">
					<div>
						<h3 className="text-xl font-display font-medium mb-1 text-black dark:text-white">
							Rename
						</h3>
						<p className="text-gray-400 dark:text-neutral-500 text-xs">
							Custom filename pattern
						</p>
					</div>
				</div>

				<div className="space-y-4">
					<div className="space-y-2">
						<label className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-widest font-bold">
							Custom Name
						</label>
						<input
							type="text"
							value={settings.customName}
							onChange={(e) => handleChange("customName", e.target.value)}
							placeholder="e.g. holiday-2024"
							className="w-full bg-gray-50 dark:bg-neutral-900 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all text-black dark:text-white"
						/>
					</div>

					<div className="grid grid-cols-3 gap-2">
						<button
							onClick={() => handleChange("addNumber", !settings.addNumber)}
							className={`py-3 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all ${
								settings.addNumber
									? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10"
									: "bg-gray-50 dark:bg-neutral-900 text-black/60 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-neutral-800"
							}`}
						>
							Number
						</button>
						<button
							onClick={() => handleChange("addDate", !settings.addDate)}
							className={`py-3 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all ${
								settings.addDate
									? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10"
									: "bg-gray-50 dark:bg-neutral-900 text-black/60 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-neutral-800"
							}`}
						>
							Date
						</button>
						<button
							onClick={() => handleChange("addTime", !settings.addTime)}
							className={`py-3 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all ${
								settings.addTime
									? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10"
									: "bg-gray-50 dark:bg-neutral-900 text-black/60 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-neutral-800"
							}`}
						>
							Time
						</button>
					</div>
				</div>
			</div>
		);
};

export default NamingControl;
