import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto pt-8 text-center font-['Inconsolata'] text-sm text-gray-600">
      {currentYear}© All rights reserved by law.
    </footer>
  );
};

export default Footer;