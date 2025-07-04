import React, { useEffect, useState, useRef } from 'react';
import { Window, WindowHeader, WindowContent, Button } from 'react95';
import { Systray220, Systray221, Wmsui322226, Wmsui322225 } from '@react95/icons';

interface VideoProps {
  width?: number;
  height?: number;
  title?: string;
  onClose?: () => void;
}

const Video: React.FC<VideoProps> = ({ 
  width = 320, 
  height = 240,
  title = 'Video Player',
  onClose
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
    <>
      <style jsx>{`
        .window-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          width: 100%;
        }
        .close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .close-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-left: -1px;
          margin-top: -1px;
          transform: rotateZ(45deg);
          position: relative;
        }
        .close-icon:before,
        .close-icon:after {
          content: '';
          position: absolute;
          background: black;
        }
        .close-icon:before {
          height: 100%;
          width: 3px;
          left: 50%;
          transform: translateX(-50%);
        }
        .close-icon:after {
          height: 3px;
          width: 100%;
          left: 0px;
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>
      <Window className="window" style={{ width: containerWidth }}>
        <WindowHeader style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>{title} - {currentVideoIndex + 1}/{videos.length}</span>
          {onClose && (
            <Button onClick={onClose} style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className='close-icon' />
            </Button>
          )}
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
              <Wmsui322226 variant="32x32_4" />
            </Button>
            <Button onClick={handlePlayPause}>
              {isPlaying ? (
                <Systray221 variant="16x16_4" style={{ transform: 'scale(1.5)' }} />
              ) : (
                <Systray220 variant="16x16_4" style={{ transform: 'scale(1.5)' }} />
              )}
            </Button>
            <Button onClick={handleNext} disabled={currentVideoIndex === videos.length - 1}>
              <Wmsui322225 variant="32x32_4" />
            </Button>
          </div>
        </WindowContent>
      </Window>
    </>
  );
};

export default Video; 