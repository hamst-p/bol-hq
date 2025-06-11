'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Button,
  Frame,
  Toolbar,
  Window,
  WindowContent,
  WindowHeader
} from 'react95';
import styled from 'styled-components';
import ImageEditor from '../components/ImageEditor';

const WindowWrapper = styled.div<{ $imageWidth?: number, $isMobile: boolean }>`
  .window-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: '';
      position: absolute;
      background: black;
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .window {
    width: ${props => props.$imageWidth ? `${props.$imageWidth + 32}px` : props.$isMobile ? '90vw' : '640px'};
    max-width: 90vw;
    min-width: 400px;
    min-height: 400px;
  }
  .footer {
    display: block;
    margin: 0.25rem;
    height: 31px;
    line-height: 31px;
    padding-left: 0.25rem;
  }
`;

export default function BolanaMaker() {
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    setIsMobile(checkMobile());
  }, []);

  const handleSave = (image: string) => {
    setEditedImage(image);
    const link = document.createElement('a');
    link.href = image;
    link.download = 'edited-bolana.png';
    link.click();
  };

  const handleImageLoad = (width: number) => {
    setImageWidth(width);
  };

  return (
    <div className="h-screen flex flex-col bg-[#53bba5] overflow-auto">
      <Header />

      <main className="flex-1 flex items-center justify-center pt-16">
        <WindowWrapper $imageWidth={imageWidth} $isMobile={isMobile}>
          <Window resizable className='window'>
            <WindowHeader className='window-title'>
              <span>bolanamaker.exe</span>
              <Button>
                <span className='close-icon' />
              </Button>
            </WindowHeader>
            <Toolbar>
              <Button variant='menu' size='sm'>
                File
              </Button>
              <Button variant='menu' size='sm'>
                Edit
              </Button>
              <Button variant='menu' size='sm' disabled>
                Mint
              </Button>
              <Button 
                variant='menu' 
                size='sm' 
                onClick={() => editedImage && handleSave(editedImage)} 
                disabled={!editedImage}
              >
                Save
              </Button>
            </Toolbar>
            <WindowContent>
              <ImageEditor onSave={handleSave} onImageLoad={handleImageLoad} />
            </WindowContent>

          </Window>
        </WindowWrapper>
      </main>

      <Footer />
    </div>
  );
} 