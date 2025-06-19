'use client';

import A4Layout from "../../src/components/A4Layout";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function About() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
          paddingTop: '6rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'left',
            color: '#374151',
            fontFamily: 'Syne, sans-serif',
            marginBottom: '1rem'
          }}>
            About Me
          </h1>
          <div style={{
            display: isMobile ? 'block' : 'flex',
            alignItems: 'flex-start',
            gap: '2rem',
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'nowrap',
            ...(isMobile && { alignItems: 'flex-start', textAlign: 'left' })
          }}>
            <Image
              src="/me_img.jpeg"
              alt="Profile Picture"
              width={isMobile ? 120 : 200}
              height={isMobile ? 150 : 250}
              style={{
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                paddingTop: '8px',
                flexShrink: 0,
                ...(isMobile && {
                  float: 'left',
                  marginRight: '1rem',
                  marginBottom: '0.5rem',
                  clear: 'left'
                })
              }}
            />
            <p style={{
              fontFamily: 'Inconsolata, monospace',
              fontSize: isMobile ? '0.9rem' : '1.125rem',
              textAlign: isMobile ? 'left' : 'justify',
              color: "rgb(107, 114, 128)",
              lineHeight: '1.7',
              flex: isMobile ? 'none' : 1,
              marginTop: '0px',
              ...(isMobile && {
                display: 'block',
                marginTop: '0px',
                marginRight: '0px',
                marginBottom: '0px',
                marginLeft: '0px',
                padding: '0',
                textAlign: 'justify'
              })
            }}>
              Welcome to my portfolio! I am Rimante a frontend/fullstack developer passionate about creating beautiful and functional web experiences.
              <br /><br />
              I like clean, aesthetic interfaces that are not only visually distinct but also intuitive and safe for users to navigate. I focus on creating well-structured layouts that balance creativity with usability, guided by solid UX/UI principles. Skill development is a key part of my journey — I am always learning, improving, and pushing myself to build better, smarter web solutions.
            </p>
          </div>
        </div>
        <Footer />
      </A4Layout>
    </div>
  );
}