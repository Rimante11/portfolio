'use client';

import React from 'react';
import Navigation from './Navigation';

const Header = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      minHeight: '80px',
      padding: '0 20px',
    }}>
      <h1 style={{
        fontFamily: 'Inconsolata, monospace',
        fontSize: '4rem',
        fontWeight: '900',
        color: '#374151',
        margin: 0,
        cursor: 'default',
        transition: 'all 0.3s ease'
      }}>
        r
      </h1>
      <Navigation />
    </div>
  );
};

export default Header;