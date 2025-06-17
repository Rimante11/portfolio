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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e8e8e8]">
      <A4Layout>
        <Header />
        <div className="flex flex-col gap-8 p-8 pt-26">
          <div className="flex flex-col gap-6">
            <h1 className="font-['Inconsolata'] text-4xl font-bold text-gray-800 text-left">Melofy</h1>
            <p className="font-['Inconsolata'] text-lg text-gray-600 text-justify">
              This is an exciting project currently in development. I&apos;m building a modern music streaming application
              with innovative features and a sleek user interface. Stay tuned for updates as I bring this vision to life!
            </p>
            {/* <p>Spin around the song image or set the round liner how mutch left. Connect via: https://developer.spotify.com/documentation/web-api (get access keys &id) </p> */}
            <div className="text-center">
              <span className="font-['Inconsolata'] text-4xl text-center text-lg font-semibold">Coming Soon...</span>
              <div className="mt-4 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
              </div>
              <br />
              <div className="flex justify-center items-center">
                <PlayButton onClick={handlePlayClick}></PlayButton>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </A4Layout>
    </div>
  );
}
