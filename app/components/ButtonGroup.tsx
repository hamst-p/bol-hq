import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Window, WindowHeader, WindowContent } from 'react95';

interface ButtonGroupProps {
  width?: number;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ width = 480 }) => {
  const [showModal, setShowModal] = useState(false);
  const [containerWidth, setContainerWidth] = useState(width);
  const handleClose = () => setShowModal(false);

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
      <div style={{ width: containerWidth }} className="mx-auto">
        <div className="flex flex-wrap gap-2 justify-center items-center">
          <Button 
            className="text-xs sm:text-sm px-2 sm:px-4"
            onClick={() => setShowModal(true)}
          >
            What is BOL?
          </Button>
          <Link href="https://jup.ag/swap/SOL-JDjprgWYuidVGfExWzMp7Z81K3T6Qsg5aJCnG6srRLGW" target="_blank" rel="noopener noreferrer">
            <Button className="text-xs sm:text-sm px-2 sm:px-4">
              Swap
            </Button>
          </Link>
          <Link href="https://memedepot.com/d/bol" target="_blank" rel="noopener noreferrer">
            <Button className="text-xs sm:text-sm px-2 sm:px-4">
              Meme Bank
            </Button>
          </Link>
          <Link href="/tapitwebol">
            <Button disabled className="text-xs sm:text-sm px-2 sm:px-4">
              <span className="hidden sm:inline">TAP IT WE BOL</span>
              <span className="sm:hidden">TAP WE BOL</span>
            </Button>
          </Link>
          <Link href="/bolanamaker">
            <Button className="text-xs sm:text-sm px-2 sm:px-4">
              Bolana Maker
            </Button>
          </Link>
          <Link href="/3d">
            <Button className="text-xs sm:text-sm px-2 sm:px-4">
              <span className="hidden sm:inline">3D Bol Experiment</span>
              <span className="sm:hidden">3D Bol</span>
            </Button>
          </Link>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
          <Window className="window w-full max-w-sm sm:max-w-md">
            <WindowHeader style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontFamily: 'inherit' }}>What is BOL<span style={{ fontWeight: 'normal' }}>?</span></span>
              <Button onClick={handleClose} style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className='close-icon' />
              </Button>
            </WindowHeader>
            <WindowContent>
              <div className="text-sm leading-relaxed">
                is boowl.
              </div>
            </WindowContent>
          </Window>
        </div>
      )}
    </>
  );
};

export default ButtonGroup; 