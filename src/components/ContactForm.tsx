'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

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
  display: block;

  &:hover {
    transform: ${props => props.$isFlipped ? 'rotateY(180deg) scale(1.1)' : 'rotateY(0deg) scale(1.1)'};
  }

  &:hover + ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  transition: opacity 0.3s ease;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  background-color: white;
  color: #1f2937;

  &:focus {
    outline: none;
    border-color:#3b82f6;
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
`;

const StatusMessage = styled.p<{ type: 'success' | 'error' }>`
  color: ${props => props.type === 'success' ? 'green' : 'red'};
  margin-top: 1rem;
  text-align: center;
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
    <div className="flex flex-col items-center justify-center">
      <TooltipContainer>
        <RedDot onClick={handleDotClick} $isFlipped={isFlipped} />
        <Tooltip $hideTooltip={showForm}>Get in touch</Tooltip>
      </TooltipContainer>
      {!showForm && (
        <div style={{ textAlign: 'center', fontSize: '10rem', fontWeight: 'bold', marginTop: '1rem' }}>
          <p style={{
            color: '#f4f4f4',
            fontSize: '10rem',
            fontFamily: 'Syne, sans-serif',
            fontWeight: '800',
            margin: '10px 0',
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
            fontSize: '10rem',
            fontFamily: 'Syne, sans-serif',
            fontWeight: '800',
            margin: '10px 0',
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
            fontSize: '10rem',
            fontFamily: 'Syne, sans-serif',
            fontWeight: '800',
            margin: '10px 0',
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
      {status === 'success' && !showForm && (
        <>
          <Image
            src="/success_msg.png"
            alt="Success"
            width={50}
            height={50}
            style={{ marginTop: '20px' }}
          />
          <StatusMessage type="success">Message sent successfully!</StatusMessage>
        </>
      )}
    </div>
  );
};

export default ContactForm;