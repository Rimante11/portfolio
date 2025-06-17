'use client';

import React from 'react';
import Link from 'next/link';

const Navigation = () => {
  return (
    <div className="flex flex-row gap-4 pr-10">
      <Link href="/" className="font-['Inconsolata'] text-gray-800 hover:text-blue-500 transition-colors duration-300">Home</Link>
      <Link href="/about" className="font-['Inconsolata'] text-gray-800 hover:text-blue-500 transition-colors duration-300">About</Link>
      <Link href="/music_app" className="font-['Inconsolata'] text-gray-800 hover:text-blue-500 transition-colors duration-300">Projects</Link>
      <Link href="/contact" className="font-['Inconsolata'] text-gray-800 hover:text-blue-500 transition-colors duration-300">Contact</Link>
    </div>
  );
};

export default Navigation;