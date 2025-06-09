import React from 'react';
import styled from 'styled-components';

interface AnimatedImageProps {
  src: string;
}

// Styled component for image animation with optimized performance
const ImageWrapper = styled.img`
  position: absolute;
  top: ${() => Math.random() * 100}vh;
  left: ${() => Math.random() * 100}vw;
  width: ${() => 5 + Math.random() * 100}px; /* Reduced max size for better performance */
  opacity: 0.7; /* Slightly transparent for better visual effect */
  will-change: transform; /* Optimize transform animations */
  transition: transform 0.3s ease-out;

  &:hover {
    transform: scale(1.2) rotate(${() => Math.random() * 180}deg); /* Simplified hover effect */
  }

  /* Optimized movement animation */
  @keyframes move {
    0% { transform: translate(0, 0); }
    50% { transform: translate(${() => Math.random() * 200 - 100}px, ${() => Math.random() * 200 - 100}px); }
    100% { transform: translate(0, 0); }
  }

  animation: move ${() => 8 + Math.random() * 7}s infinite alternate ease-in-out; /* Optimized duration range */
`;

const AnimatedImage: React.FC<AnimatedImageProps> = ({ src }) => {
  return <ImageWrapper src={src} alt="Animated element" />;
};

export default AnimatedImage; 