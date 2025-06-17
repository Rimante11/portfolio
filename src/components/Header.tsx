'use client';

import React from 'react';
import Navigation from './Navigation';

const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <h1 className="font-['Inconsolata'] text-6xl text-gray-800 hover:text-blue-500 transition-all duration-300 cursor-default hover:scale-105 pl-8">r</h1>
      <Navigation />
    </div>
  );
};

export default Header;