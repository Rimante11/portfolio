'use client';

import React, { useEffect, useState } from 'react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [fillHeight, setFillHeight] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);

  const trackHeight = 170;

  useEffect(() => {
    // Small delay to ensure smooth landing
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateScrollIndicator = () => {
      const documentElement = document.documentElement;
      const scrollTop = window.scrollY || documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const scrollHeight = documentElement.scrollHeight;
      const maxScroll = Math.max(scrollHeight - viewportHeight, 0);

      if (maxScroll <= 0) {
        setShowIndicator(false);
        setFillHeight(0);
        return;
      }

      setShowIndicator(true);

      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      const calculatedFillHeight = Math.round(trackHeight * progress);

      setFillHeight(calculatedFillHeight);
    };

    updateScrollIndicator();
    window.addEventListener('scroll', updateScrollIndicator, { passive: true });
    window.addEventListener('resize', updateScrollIndicator);

    return () => {
      window.removeEventListener('scroll', updateScrollIndicator);
      window.removeEventListener('resize', updateScrollIndicator);
    };
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
    >
      {children}
      {showIndicator && (
        <div className="floatingScrollbar" aria-hidden="true">
          <div
            className="floatingScrollbarFill"
            style={{
              height: `${fillHeight}px`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ClientLayout;
