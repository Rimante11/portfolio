'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const linkStyle = {
    fontFamily: 'Inconsolata, monospace',
    fontSize: '1.125rem',
    color: '#374151',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'color 0.3s ease, transform 0.3s ease, background-color 0.3s ease'
  };

  const mobileLinkStyle = {
    ...linkStyle,
    padding: '12px 16px',
    transition: 'background-color 0.3s ease'
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '#dbeafe';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleMenu}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '8px',
            color: '#374151',
            marginRight: '10px'
          }}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
        {isMenuOpen && (
          <div style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            // bottom: 0,
            background: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: '1rem',
            maxHeight: 'calc(100vh - 80px)',
            overflow: 'auto'
          }}>
            <Link
              href="/"
              onClick={closeMenu}
              style={mobileLinkStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              style={mobileLinkStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              About
            </Link>
            <Link
              href="/projects"
              onClick={closeMenu}
              style={mobileLinkStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Projects
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              style={mobileLinkStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Contact
            </Link>
          </div>
        )}
      </>
    );
  }

  return (
    <nav style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '32px',
      alignItems: 'center'
    }}>
      <Link
        href="/"
        style={linkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Home
      </Link>
      <Link
        href="/about"
        style={linkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        About
      </Link>
      <Link
        href="/projects"
        style={linkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Projects
      </Link>
      <Link
        href="/contact"
        style={{
          ...linkStyle,
          marginRight: '0px'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Contact
      </Link>
    </nav>
  );
};

export default Navigation;