import React, { useEffect, useState } from 'react';
import { Window, WindowHeader, WindowContent } from 'react95';

interface VideoProps {
  src: string;
  width?: number;
  height?: number;
  title?: string;
}

const Video: React.FC<VideoProps> = ({ 
  src, 
  width = 320, 
  height = 240,
  title = 'Video Player'
}) => {
  const [containerWidth, setContainerWidth] = useState(width);

  useEffect(() => {
    const updateWidth = () => {
      const viewportWidth = window.innerWidth;
      const maxWidth = Math.min(width, viewportWidth * 0.9);
      setContainerWidth(maxWidth);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [width]);

  const aspectRatio = height / width;
  const calculatedHeight = containerWidth * aspectRatio;

  return (
    <Window className="window" style={{ width: containerWidth }}>
      <WindowHeader className="window-header">
        <span>{title}</span>
      </WindowHeader>
      <WindowContent style={{ padding: 2 }}>
        <video
          src={src}
          width={containerWidth}
          height={calculatedHeight}
          controls
          playsInline
          webkit-playsinline="true"
          style={{ 
            display: 'block',
            maxWidth: '100%'
          }}
        />
      </WindowContent>
    </Window>
  );
};

export default Video; 