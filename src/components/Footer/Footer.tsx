import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center text-gray-600 text-sm space-y-1 mt-auto">
      <p className='text-balance'>Built with Vite, React, TypeScript, and Tailwind CSS</p>
      <p>Created by <span className="font-medium text-gray-700">Sanekx Arcs</span></p>
    </footer>
  );
};

export default Footer;
