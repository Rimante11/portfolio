'use client';

import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleBackToHomePage = () => {
    router.push('/');
  }


  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      minHeight: isMobile ? '60px' : '80px',
      padding: isMobile ? '0 10px' : '0 20px',
      maxWidth: '100vw',
      boxSizing: 'border-box'
    }}>
      <h1 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: isMobile ? '3rem' : '5rem',
        fontWeight: '900',
        color: '#374151',
        margin: 0,
        cursor: 'default',
        transition: 'all 0.3s ease',
        paddingLeft: isMobile ? '20px' : '10px'
      }}
        onClick={handleBackToHomePage}
      >
        r
      </h1>
      <Navigation />
    </div>
  );
};

export default Header;