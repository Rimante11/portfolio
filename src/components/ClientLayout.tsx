'use client';

import React from 'react';
import PageTransition from './PageTransition';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <PageTransition>
      {children}
    </PageTransition>
  );
};

export default ClientLayout;
