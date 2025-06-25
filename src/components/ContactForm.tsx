'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Tooltip = styled.div<{ $hideTooltip: boolean }>`
  position: absolute;
  bottom: 50%;
  left: -90%;
  transform: translateX(-50%);
  background-color: #1f2937;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  pointer-events: none;
  z-index: 1000;
  display: ${props => props.$hideTooltip ? 'none' : 'block'};

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 92%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #1f2937;
  }
`;

const RedDot = styled.div<{ $isFlipped: boolean }>`
  width: 50px;
  height: 50px;
  background-color: ${props => props.$isFlipped ? '#3b82f6' : 'red'};
  border-radius: 50%;
  margin: 20px auto;
  cursor: pointer;
  transition: all 0.5s ease;
  transform: ${props => props.$isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  transform-style: preserve-3d;
  perspective: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: ${props => props.$isFlipped ? 'rotateY(180deg) scale(1.1)' : 'rotateY(0deg) scale(1.1)'};
  }

  &:hover + ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }

  @media (max-width: 768px) {
    margin: 10px auto;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  margin: 1rem auto;
  padding: 0.5rem;
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    max-width: 95%;
    margin: 0.5rem auto;
    padding: 0.25rem;
    gap: 0.75rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #e5e7eb;
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  background-color: white;
  color: #1f2937;
  box-sizing: border-box;
  outline: none;

  &:focus {
    outline: none;
    border-bottom-color: #3b82f6;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  background-color: white;
  color: #1f2937;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 16px; /* Prevents zoom on iOS */
    min-height: 120px;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4b5563;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #374151;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

const StatusMessage = styled.p<{ type: 'success' | 'error' }>`
  color: ${props => props.type === 'success' ? 'green' : 'red'};
  margin-top: 1rem;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    min-height: auto;
    padding: 0.5rem;
  }
`;

const ContactForm = () => {
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setShowForm(false);
        setIsFlipped(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleDotClick = () => {
    setIsFlipped(!isFlipped);
    setShowForm(!showForm);
    if (status === 'success') {
      setStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ email: '', subject: '', message: '' });
      setShowForm(false);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!mounted) {
    return null;
  }

  return (
    <Container>
      <TooltipContainer>
        <RedDot onClick={handleDotClick} $isFlipped={isFlipped}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFlipped ? "#cce5ff" : "#ffcccc"}
            style={{
              transition: 'transform 0.5s ease',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </RedDot>
        <Tooltip $hideTooltip={showForm}>Get in touch</Tooltip>
      </TooltipContainer>
      {!showForm && status !== 'success' && (
        <div style={{
          textAlign: 'center',
          fontWeight: 'bold',
          marginTop: '1rem',
          fontSize: 'clamp(3rem, 15vw, 10rem)'
        }}>
          <p style={{
            color: '#f4f4f4',
            fontSize: 'clamp(2rem, 12vw, 10rem)',
            fontFamily: 'Syne, sans-serif',
            fontWeight: '800',
            margin: '10px 0',
            lineHeight: '1.2',
            textShadow: `
              1px 1px 2px #ffffff,
              -1px -1px 2px #cbd5e1,
              inset 2px 2px 2px rgba(0, 0, 0, 0.15),
              inset -2px -2px 2px rgba(255, 255, 255, 0.8)
            `,
          }}>
            PO
          </p>
          <p style={{
            color: '#f4f4f4',
            fontSize: 'clamp(2rem, 12vw, 10rem)',
            fontFamily: 'Syne, sans-serif',
            fontWeight: '800',
            margin: '10px 0',
            lineHeight: '1.2',
            textShadow: `
              1px 1px 2px #ffffff,
              -1px -1px 2px #cbd5e1,
              inset 2px 2px 2px rgba(0, 0, 0, 0.15),
              inset -2px -2px 2px rgba(255, 255, 255, 0.8)
            `,
          }}>
            RTF
          </p>
          <p style={{
            color: '#f4f4f4',
            fontSize: 'clamp(2rem, 12vw, 10rem)',
            fontFamily: 'Syne, sans-serif',
            fontWeight: '800',
            margin: '10px 0',
            lineHeight: '1.2',
            textShadow: `
              1px 1px 2px #ffffff,
              -1px -1px 2px #cbd5e1,
              inset 2px 2px 2px rgba(0, 0, 0, 0.15),
              inset -2px -2px 2px rgba(255, 255, 255, 0.8)
            `,
          }}>
            OLIO
          </p>
        </div>
      )}
      {showForm && (
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <TextArea
            name="message"
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </Button>
          {status === 'error' && <StatusMessage type="error">Failed to send message. Please try again.</StatusMessage>}
        </Form>
      )}
      {status === 'success' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            fontFamily: 'Syne, sans-serif',
            fontWeight: '400',
            color: '#10b981',
          }}>
            Email sent successfully!
          </div>
        </div>
      )}
    </Container>
  );
};

export default ContactForm;