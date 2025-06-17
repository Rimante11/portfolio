'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsVisible(false);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-4'
        }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
