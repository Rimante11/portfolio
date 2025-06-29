'use client';

import A4Layout from "../../src/components/A4Layout";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import styled from 'styled-components';
import { useState } from 'react';
import Image from 'next/image';
import projectsData from '../../src/data/projects.json';

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

const DropdownArrow = styled.div<{ $isOpen: boolean }>`
  width: 12px;
  height: 12px;
  position: relative;
  cursor: pointer;
  margin-left: 8px;
  transition: transform 0.3s ease;
  color: '#374151';
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};

  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: #374151;
    transition: all 0.3s ease;
  }

  &::before {
    width: 2px;
    height: 8px;
    top: 2px;
    left: 5px;
    transform: rotate(45deg);
    transform-origin: center bottom;
  }

  &::after {
    width: 2px;
    height: 8px;
    top: 2px;
    left: 5px;
    transform: rotate(-45deg);
    transform-origin: center bottom;
  }
`;

const DropdownContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-top: 8px;
  padding: ${props => props.$isOpen ? '1rem' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  transform-origin: top;
  transform: ${props => props.$isOpen ? 'scaleY(1)' : 'scaleY(0)'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};

  @media (max-width: 768px) {
    max-height: ${props => props.$isOpen ? '400px' : '0'};
    padding: ${props => props.$isOpen ? '0.75rem' : '0'};
    margin-top: 4px;
  }
`;

export default function MusicApp() {
  const [dropdownStates, setDropdownStates] = useState<{ [key: string]: boolean }>({});
  const [modalImage, setModalImage] = useState<string | null>(null);

  const handlePlayClick = () => {
    // window.open('/melofy-app', '_blank');
  };

  const toggleDropdown = (projectId: string) => {
    setDropdownStates(prev => {
      const isCurrentlyOpen = prev[projectId] || false;

      if (isCurrentlyOpen) {
        return {
          ...prev,
          [projectId]: false
        };
      }

      const newState: { [key: string]: boolean } = {};
      projectsData.forEach(project => {
        newState[project.id] = project.id === projectId;
      });

      return newState;
    });
  };

  const openModal = (imageSrc: string) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
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
              Work
            </h1>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {projectsData.map((project) => (
                <li key={project.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderBottom: '1px solid #e5e7eb',
                  fontFamily: 'Inconsolata, monospace'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 0',
                    cursor: 'pointer'
                  }} onClick={() => toggleDropdown(project.id)}>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>{project.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>{project.category}</p>
                      <DropdownArrow $isOpen={dropdownStates[project.id] || false} />
                    </div>
                  </div>
                  <DropdownContent $isOpen={dropdownStates[project.id] || false}>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      minHeight: '120px',
                      width: '100%',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '120px',
                        flexShrink: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                      }}>
                        {project.modalType === 'image' && project.image && (
                          <div style={{
                            width: '120px',
                            height: '80px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6b7280',
                            fontSize: '0.8rem',
                            fontFamily: 'Inconsolata, monospace',
                            cursor: 'pointer'
                          }} onClick={() => openModal(project.modalContent || '')}>
                            <Image
                              src={project.image}
                              alt={`${project.name} App`}
                              width={120}
                              height={80}
                              style={{
                                borderRadius: '8px',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                        )}
                        {project.modalType === 'pdf' && project.image && (
                          <Image
                            src={project.image}
                            alt={`${project.name} App`}
                            width={120}
                            height={80}
                            style={{
                              borderRadius: '8px',
                              objectFit: 'cover',
                              cursor: 'pointer'
                            }}
                            onClick={() => openModal(project.modalContent || '')}
                          />
                        )}
                        {project.modalType === 'play-button' && (
                          <div style={{
                            width: '120px',
                            height: '80px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <PlayButton onClick={handlePlayClick}></PlayButton>
                          </div>
                        )}
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        color: '#6b7280',
                        lineHeight: '1.6',
                        fontFamily: 'Inconsolata, monospace',
                        flex: 1
                      }}>
                        <b>{project.name}</b><br></br>
                        {project.description}
                      </p>
                    </div>
                  </DropdownContent>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Footer />
      </A4Layout >

      {/* Modal for full-screen image */}
      {modalImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer',
            touchAction: 'none'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          {modalImage.endsWith('.pdf') ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                height: '100%',
                maxWidth: '90vw',
                maxHeight: '90vh',
                cursor: 'default'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`${modalImage}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  maxHeight: '80vh'
                }}
                allowFullScreen
                title="PDF Viewer"
              />
              <a
                href={modalImage}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Inconsolata, monospace',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                Open PDF in New Tab
              </a>
            </div>
          ) : (
            <div
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={modalImage}
                alt="Full screen"
                width={1200}
                height={800}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div >
  );
}

// TODO:
// - Add Authentication/login for music app
// - Connnect Spotify Dev
// - Add testing for more complex features (user authentication, data management, etc.)

// INTEGRATING TWO PROJECTS (two separare repositories)
// - Deploy your music app as a separate project on Vercel (from its own Git repo).
// - Get the live URL (e.g., https://music-app.vercel.app).
// - In your portfolio site, simply link to it or embed it via an iframe.

// - Add cv view available with one time acces key generated sent to user and set session timeout 10min.
// (check gitLab pipelines)

// - Learn both, but in this order:

//     Basic AWS (EC2, S3, IAM, VPC, CloudFormation)

//     CI/CD concepts (pipelines, build/test/deploy)

//     CI/CD tools on AWS (CodePipeline, CodeBuild, or integrate Jenkins/GitHub Actions with AWS)

