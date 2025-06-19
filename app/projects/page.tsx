'use client';

import A4Layout from "../../src/components/A4Layout";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import styled from 'styled-components';

const PlayButton = styled.div`
  border-radius: 5%;
  background: rgb(255, 255, 255);
  cursor: pointer;
  border: none;
  transition: all 0.3s;
  box-shadow: 6px 6px 12px rgb(221, 219, 219), -6px -6px 12px #ffffff;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: not-allowed;

  &:hover {
    border: none;
    transform: scale(1.05);
  }

  &:active {
    box-shadow: inset 4px 4px 12px rgb(235, 19, 19),
            inset -5px -5px 12px #fbfbfb;
    transform: scale(0.95);
  }

  /* Triangle */
  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 20px solid red;
    border-top: 14px solid transparent;
    border-bottom: 14px solid transparent;
    margin-left: 4px;
    filter: drop-shadow(inset 2px 2px 4px rgba(0, 0, 0, 0.3));
    position: relative;
  }

  /* Inner shadow effect for triangle */
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 20px solid rgba(139, 0, 0, 0.4);
    border-top: 14px solid transparent;
    border-bottom: 14px solid transparent;
    margin-left: 4px;
    z-index: 1;
  }
`;

export default function MusicApp() {
  const handlePlayClick = () => {
    // window.open('/melofy-app', '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e8e8e8'
    }}>
      <A4Layout>
        <Header />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          padding: '2rem',
          paddingTop: '3rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#374151',
              textAlign: 'left',
              marginBottom: '1rem'
            }}>
              Melofy
            </h1>
            <p style={{
              fontFamily: 'Inconsolata, monospace',
              fontSize: '1.125rem',
              color: '#6b7280',
              textAlign: 'justify',
              lineHeight: '1.7'
            }}>
              This is an exciting project currently in development. I&apos;m building a modern music streaming application
              with innovative features and a sleek user interface. Stay tuned for updates as I bring this vision to life!
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              <span style={{
                fontFamily: 'Inconsolata, monospace',
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Coming Soon...
              </span>

              <div style={{
                width: '32px',
                height: '32px',
                border: '4px solid #d1d5db',
                borderTop: '4px solid #6b7280',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>

              <PlayButton onClick={handlePlayClick}></PlayButton>
            </div>
          </div>
        </div>
        <Footer />
      </A4Layout>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
