'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background: #e8e8e8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Inconsolata', monospace;
`;

const MusicPlayer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  width: 400px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const AlbumArt = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSpinning',
}) <{ isSpinning: boolean }>`
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 15px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  animation: ${props => props.isSpinning ? 'spin 3s linear infinite' : 'none'};
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const PlayButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin: 1rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const SongInfo = styled.div`
  color: white;
  margin: 1rem 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  margin: 1rem 0;
  overflow: hidden;
`;

const Progress = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

export default function MelofyApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = 25;

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <AppContainer>
      <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '2rem' }}>
        Melofy
      </h1>

      <MusicPlayer>
        <AlbumArt $isSpinning={isPlaying}>
          🎶
        </AlbumArt>

        <SongInfo>
          <h2 style={{ margin: '0.5rem 0', fontSize: '1.5rem' }}>Demo Song</h2>
          <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>Artist Name</p>
        </SongInfo>

        <ProgressBar>
          <Progress $progress={progress} />
        </ProgressBar>

        <div>
          <PlayButton onClick={handlePlay}>
            {isPlaying ? '⏸️' : '▶️'}
          </PlayButton>
        </div>

        <p style={{ color: 'white', opacity: 0.7, fontSize: '0.9rem', marginTop: '1rem' }}>
          This is a demo of the music streaming app in development.
          <br />
          Full features coming soon!
        </p>
      </MusicPlayer>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => window.close()}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          Close App
        </button>
      </div>
    </AppContainer>
  );
}
