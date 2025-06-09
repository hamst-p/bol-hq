import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Window, WindowHeader, WindowContent } from 'react95';

const ButtonGroup = () => {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button onClick={() => setShowModal(true)}>What is BOL?</Button>
        <Link href="https://jup.ag/swap/SOL-JDjprgWYuidVGfExWzMp7Z81K3T6Qsg5aJCnG6srRLGW" target="_blank" rel="noopener noreferrer">
          <Button>Swap</Button>
        </Link>
        <Link href="https://memedepot.com/d/bol" target="_blank" rel="noopener noreferrer">
          <Button>Meme Bank</Button>
        </Link>
        <Link href="https://google.com" target="_blank" rel="noopener noreferrer">
          <Button disabled title="Coming Soon🍜">TAP IT WE BOL</Button>
        </Link>
        <Link href="https://google.com" target="_blank" rel="noopener noreferrer">
          <Button disabled title="Coming Soon🍜">Bolana Maker</Button>
        </Link>
        <Link href="/3d">
          <Button>3D Bol Experiment</Button>
        </Link>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
          <Window className="window" style={{ width: '400px' }}>
            <WindowHeader className="window-header">
              <span>What is BOL?</span>
              <button
                onClick={handleClose}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                style={{ 
                  fontFamily: 'Px437 IBM VGA8',
                  fontSize: '14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
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