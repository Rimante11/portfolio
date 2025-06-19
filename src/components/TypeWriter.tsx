"use client";

import { useEffect, useState } from 'react';
import styled from 'styled-components';

const TypeWriterContainer = styled.div<{ textLength: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;

  .typing-text {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid;
    width: 0;
    font-family: 'Inconsolata', monospace;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-align: center;
    margin: 0 auto;
    animation:
      typing 3.5s steps(${props => props.textLength}, end) forwards,
      blink-caret .75s step-end 4.5;
  }

  @keyframes typing {
    from { width: 0 }
    to { width: ${props => props.textLength * 1.1}ch }
  }

  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: currentColor }
  }

  @media (max-width: 768px) {
    .typing-text {
      font-size: 1rem;
      text-align: center;
      width: 100%;
      max-width: 90vw;
    }
  }
`;

interface TypeWriterProps {
  text: string;
  className?: string;
}

const TypeWriter = ({ text, className }: TypeWriterProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} style={{ visibility: 'hidden' }}>{text}</div>;
  }

  return (
    <TypeWriterContainer className={className} textLength={text.length}>
      <p className="typing-text">{text}</p>
    </TypeWriterContainer>
  );
};

export default TypeWriter;
