import React, { useEffect, useState, useRef } from 'react';
import { Window, WindowHeader, WindowContent, Button } from 'react95';
import { Mplayer12, Mplayer14, Mplayer11 } from '@react95/icons';

interface VideoProps {
  width?: number;
  height?: number;
  title?: string;
}

const Video: React.FC<VideoProps> = ({ 
  width = 320, 
  height = 240,
  title = 'Video Player'
}) => {
  const [containerWidth, setContainerWidth] = useState(width);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videos] = useState([
    '/videos/bol_vid_01.mp4',
    '/videos/bol_vid_02.mp4',
    '/videos/bol_vid_03.mp4',
    '/videos/bol_vid_04.mp4',
    '/videos/bol_vid_05.mp4',
    '/videos/bol_vid_06.mp4',
    '/videos/bol_vid_07.mp4',
    '/videos/bol_vid_08.mp4',
    '/videos/bol_vid_09.mp4',
    '/videos/bol_vid_10.mp4',
    '/videos/bol_vid_11.mp4',
    '/videos/bol_vid_12.mp4',
    '/videos/bol_vid_13.mp4',
    '/videos/bol_vid_14.mp4',
    '/videos/bol_vid_15.mp4',
    '/videos/bol_vid_16.mp4',
    '/videos/bol_vid_17.mp4',
    '/videos/bol_vid_18.mp4',
  ]);

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

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      if (currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
        setIsPlaying(true);
      } else {
        setCurrentVideoIndex(0);
        setIsPlaying(false);
      }
    };

    videoElement.addEventListener('ended', handleEnded);
    return () => videoElement.removeEventListener('ended', handleEnded);
  }, [currentVideoIndex, videos.length]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentVideoIndex]);

  const aspectRatio = height / width;
  const calculatedHeight = containerWidth * aspectRatio;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  return (
    <Window className="window" style={{ width: containerWidth }}>
      <WindowHeader className="window-header">
        <span>{title} - {currentVideoIndex + 1}/{videos.length}</span>
      </WindowHeader>
      <WindowContent style={{ padding: 2 }}>
        <video
          ref={videoRef}
          src={videos[currentVideoIndex]}
          width={containerWidth}
          height={calculatedHeight}
          playsInline
          webkit-playsinline="true"
          style={{ 
            display: 'block',
            maxWidth: '100%'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
          <Button onClick={handlePrevious} disabled={currentVideoIndex === 0}>
            <Mplayer11 variant="32x32_4" />
          </Button>
          <Button onClick={handlePlayPause}>
            {isPlaying ? <Mplayer14 variant="32x32_4" /> : <Mplayer12 variant="32x32_4" />}
          </Button>
          <Button onClick={handleNext} disabled={currentVideoIndex === videos.length - 1}>
            <Mplayer11 variant="32x32_4" style={{ transform: 'scaleX(-1)' }} />
          </Button>
        </div>
      </WindowContent>
    </Window>
  );
};

export default Video; 