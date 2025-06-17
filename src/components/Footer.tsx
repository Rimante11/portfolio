import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      marginTop: 'auto',
      paddingTop: '2rem',
      textAlign: 'center',
      fontFamily: 'Inconsolata, monospace',
      fontSize: '0.875rem',
      color: '#6b7280',
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%'
    }}>
      {currentYear}© All rights reserved by law.
    </footer>
  );
};

export default Footer;