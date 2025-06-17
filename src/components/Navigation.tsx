'use client';

import React from 'react';
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '32px',
      alignItems: 'center'
    }}>
      <Link
        href="/"
        style={{
          fontFamily: 'Inconsolata, monospace',
          fontSize: '1.125rem',
          color: '#374151',
          textDecoration: 'none',
          transition: 'color 0.3s ease, transform 0.3s ease'
        }}
      >
        Home
      </Link>
      <Link
        href="/about"
        style={{
          fontFamily: 'Inconsolata, monospace',
          fontSize: '1.125rem',
          color: '#374151',
          textDecoration: 'none',
          transition: 'color 0.3s ease, transform 0.3s ease'
        }}
      >
        About
      </Link>
      <Link
        href="/music_app"
        style={{
          fontFamily: 'Inconsolata, monospace',
          fontSize: '1.125rem',
          color: '#374151',
          textDecoration: 'none',
          transition: 'color 0.3s ease, transform 0.3s ease'
        }}
      >
        Projects
      </Link>
      <Link
        href="/contact"
        style={{
          fontFamily: 'Inconsolata, monospace',
          fontSize: '1.125rem',
          color: '#374151',
          textDecoration: 'none',
          transition: 'color 0.3s ease, transform 0.3s ease',
          marginRight: '50px'
        }}
      >
        Contact
      </Link>
    </nav>
  );
};

export default Navigation;