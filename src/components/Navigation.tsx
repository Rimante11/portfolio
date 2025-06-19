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
          padding: '8px 12px',
          borderRadius: '6px',
          transition: 'color 0.3s ease, transform 0.3s ease, background-color 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#dbeafe';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
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
          padding: '8px 12px',
          borderRadius: '6px',
          transition: 'color 0.3s ease, transform 0.3s ease, background-color 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#dbeafe';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
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
          padding: '8px 12px',
          borderRadius: '6px',
          transition: 'color 0.3s ease, transform 0.3s ease, background-color 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#dbeafe';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
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
          padding: '8px 12px',
          borderRadius: '6px',
          transition: 'color 0.3s ease, transform 0.3s ease, background-color 0.3s ease',
          marginRight: '35px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#dbeafe';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        Contact
      </Link>
    </nav>
  );
};

export default Navigation;