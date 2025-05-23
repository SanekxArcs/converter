import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (    <header className="text-center mb-2 md:mb-8">
      <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-1 md:mb-2">
        {title}
      </h1>
      <p className="text-xs md:text-base text-gray-600">
        {subtitle}
      </p>
    </header>
  );
};

export default Header;
