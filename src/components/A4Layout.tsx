'use client';

import React from 'react';
import styled from 'styled-components';

const A4Container = styled.div`
  width: 210mm;
  min-height: 247mm;
  padding: 20mm;
  margin: 0 auto;
  background: white !important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin: 20px auto;
  padding: 40px 20px;
  position: relative; /* Enable absolute positioning for footer */

  h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
  }

  @media (max-width: 794px) {
    width: 100vw;
    margin: 0;
    padding: 15px;
    box-shadow: none;
    max-width: 100vw;
    background: white !important;

  }

  @media (max-width: 480px) {
    width: 100vw;
    padding: 10px;
    margin: 0;
    background: white !important;
  }
`;

interface A4LayoutProps {
  children: React.ReactNode;
}

const A4Layout: React.FC<A4LayoutProps> = ({ children }) => {
  return (
    <A4Container>
      {children}
    </A4Container>
  );
};

export default A4Layout;