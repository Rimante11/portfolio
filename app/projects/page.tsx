'use client';

import A4Layout from "../../src/components/A4Layout";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import projectsData from '../../src/data/projects.json';

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
    max-height: ${props => props.$isOpen ? '1000px' : '0'};
    padding: ${props => props.$isOpen ? '0.75rem' : '0'};
    margin-top: 4px;
  }
`;

export default function MusicApp() {
  const [dropdownStates, setDropdownStates] = useState<{ [key: string]: boolean }>({});
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Only initialize after component mounts to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
    const initialStates: { [key: string]: boolean } = {};
    projectsData.forEach(project => {
      initialStates[project.id] = false;
    });
    setDropdownStates(initialStates);
  }, []);

  // Don't render dropdowns until component is mounted
  if (!isMounted) {
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
                Projects
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
                    }}>
                      <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>{project.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>{project.category}</p>
                        <DropdownArrow $isOpen={false} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Footer />
        </A4Layout>
      </div>
    );
  }

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

  const renderDescriptionWithLinks = (description: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = description.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#3b82f6',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
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
              Projects
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
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        color: '#6b7280',
                        lineHeight: '1.6',
                        fontFamily: 'Inconsolata, monospace',
                        flex: 1,
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}>
                        <b>{project.name}</b><br></br>
                        {renderDescriptionWithLinks(project.description)}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalImage}
                alt="Full screen"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  width: 'auto',
                  height: 'auto',
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
        
        @media (max-width: 768px) {
          p {
            word-break: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div >
  );
}
