import React, { useState, useEffect } from 'react';

interface MoleProps {
  isVisible: boolean;
  onWhack?: () => void;
}

export default function Mole({ isVisible, onWhack }: MoleProps) {
  const [show, setShow] = useState(isVisible);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setAnimate(true);
    } else if (show) {
      setAnimate(false);
      const timer = setTimeout(() => {
        setShow(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, show]);

  const handleClick = () => {
    if (onWhack) {
      onWhack();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <img
      src="/images/bolmole.png"
      alt="mole"
      className={`mole ${animate ? 'enter' : 'exit'}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    />
  );
} 