'use client';

import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { useRouter } from 'next/navigation';

const MOBILE_BREAKPOINT = 1024;

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleBackToHomePage = () => {
    router.push('/');
  }

  const sideSlotWidth = 'clamp(220px, 24vw, 380px)';

  if (isMobile) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        minHeight: '100px',
        padding: '12px 10px 0',
        boxSizing: 'border-box',
        gap: '8px'
      }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '2rem',
          fontWeight: '900',
          color: '#374151',
          margin: 0,
          cursor: 'default',
          transition: 'all 0.3s ease',
          textAlign: 'center'
        }}
          onClick={handleBackToHomePage}
        >
          rimante
        </h1>
        <Navigation />
      </div>
    );
  }


  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      // justifyContent: 'space-between',
      width: '100%',
      minHeight: isMobile ? '100px' : '120px',
      padding: '24px 60px 6px',
      maxWidth: '100vw',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: sideSlotWidth,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
      }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: isMobile ? '2rem' : '3rem',
          fontWeight: '900',
          color: '#374151',
          margin: 0,
          cursor: 'default',
          transition: 'all 0.3s ease'
        }}
          onClick={handleBackToHomePage}
        >
          rimante
        </h1>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end'
      }}>
        <Navigation />
      </div>

      <div style={{ width: sideSlotWidth }} />
    </div>
  );
};

export default Header;