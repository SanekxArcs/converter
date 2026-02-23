import React from 'react';

const Footer: React.FC = () => {
  return (
			<footer className="py-12 flex flex-col items-center gap-4">
				<div className="w-8 h-px bg-black/10" />
				<div className="flex flex-col items-center gap-1">
					<p className="text-[10px] uppercase tracking-[0.2em] font-medium text-black/20">
						Created by <span className="text-black/40">Sanekx Arcs</span>
					</p>
					<p className="text-[10px] uppercase tracking-[0.2em] font-medium text-black/10">
						Built with precision
					</p>
				</div>
			</footer>
		);
};

export default Footer;
