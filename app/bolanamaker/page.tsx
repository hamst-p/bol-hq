'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Button,
  Frame,
  Toolbar,
  Window,
  WindowContent,
  WindowHeader,
  MenuList,
  MenuListItem,
  Separator
} from 'react95';
import styled from 'styled-components';
import ImageEditor, { ImageEditorRef } from '../components/ImageEditor';

const WindowWrapper = styled.div<{ $imageWidth?: number, $imageHeight?: number, $isMobile: boolean, $viewportWidth: number, $viewportHeight: number }>`
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
    width: ${props => {
      if (props.$imageWidth) {
        // 画像幅 + WindowContentの左右パディング(8px × 2) + ウィンドウボーダー等(約8px)
        const calculatedWidth = props.$imageWidth + 24;
        // ビューポートの95%を上限とし、最小幅も考慮
        const maxViewportWidth = props.$viewportWidth * 0.95;
        const finalWidth = Math.min(calculatedWidth, maxViewportWidth);
        return props.$isMobile 
          ? `${Math.max(finalWidth, 320)}px` 
          : `${Math.max(finalWidth, 400)}px`;
      }
      return props.$isMobile ? '90vw' : '800px';
    }};
    height: ${props => {
      if (props.$imageHeight) {
        // 画像高さ + ウィンドウヘッダー(約32px) + ツールバー(約32px) + WindowContentパディング(上下10px) + ボーダー等(約8px)
        const calculatedHeight = props.$imageHeight + 82;
        // ヘッダー(64px) + フッター(64px) + 余白(32px) = 160pxを引く
        const availableHeight = props.$viewportHeight - 160;
        const maxViewportHeight = Math.max(availableHeight, 300); // 最小300px確保
        return `${Math.min(calculatedHeight, maxViewportHeight)}px`;
      }
      return 'auto';
    }};
    max-width: 95vw;
    max-height: ${props => props.$isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 120px)'};
    min-width: ${props => props.$isMobile ? '320px' : '400px'};
    min-height: ${props => props.$imageHeight ? 'auto' : props.$isMobile ? '300px' : '400px'};
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
  const router = useRouter();
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState<number | undefined>(undefined);
  const [imageHeight, setImageHeight] = useState<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState<boolean>(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(1200);
  const [viewportHeight, setViewportHeight] = useState<number>(800);
  const [bolhats, setBolhats] = useState<any[]>([]);
  const imageEditorRef = useRef<ImageEditorRef>(null);

  useEffect(() => {
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    setIsMobile(checkMobile());
  }, []);

  // ビューポートサイズを監視
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    // 初期サイズを設定
    updateViewportSize();

    // リサイズイベントを監視
    window.addEventListener('resize', updateViewportSize);

    return () => {
      window.removeEventListener('resize', updateViewportSize);
    };
  }, []);

  // bolhatの状態を監視
  useEffect(() => {
    const updateBolhats = () => {
      if (imageEditorRef.current) {
        const currentBolhats = imageEditorRef.current.getBolhats();
        setBolhats(currentBolhats);
      }
    };

    // 定期的にbolhatの状態を更新
    const interval = setInterval(updateBolhats, 100);

    return () => clearInterval(interval);
  }, [baseImage]);

  // モバイル時の適切なスクロール制御
  useEffect(() => {
    if (isMobile) {
      // モバイルの場合は適切なスクロール制御を設定
      document.body.style.overflowX = 'hidden'; // 横スクロールのみ無効化
      document.body.style.overflowY = 'auto'; // 縦スクロールは有効
      
      return () => {
        // クリーンアップ時に元に戻す
        document.body.style.overflowX = '';
        document.body.style.overflowY = '';
      };
    }
  }, [isMobile]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFileMenuOpen) {
        setIsFileMenuOpen(false);
      }
      if (isEditMenuOpen) {
        setIsEditMenuOpen(false);
      }
    };

    if (isFileMenuOpen || isEditMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isFileMenuOpen, isEditMenuOpen]);

  const handleSave = async (image: string) => {
    setEditedImage(image);
    
    if (isMobile && navigator.share) {
      // モバイルでWeb Share APIが利用可能な場合
      try {
        // Data URLからBlobに変換
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], 'edited-bolana.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Edited Bolana Image',
          files: [file]
        });
        return;
      } catch (error) {
        console.log('Web Share API failed, falling back to download:', error);
      }
    }
    
    // デスクトップまたはWeb Share APIが利用できない場合の通常のダウンロード
    const link = document.createElement('a');
    link.href = image;
    link.download = 'edited-bolana.png';
    
    // モバイルでのダウンロードを改善
    if (isMobile) {
      link.target = '_blank';
      // モバイルブラウザでダウンロードリンクを確実に動作させる
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      link.click();
    }
  };

  const handleImageLoad = (width: number, height: number) => {
    setImageWidth(width);
    setImageHeight(height);
    setBaseImage('loaded'); // 画像が読み込まれたことを示すフラグ
  };

  const handleSaveClick = () => {
    // ImageEditorのsave関数を呼び出す
    imageEditorRef.current?.save();
  };

  const handleMenuItemClick = (action: string) => {
    console.log(`Menu action: ${action}`);
    setIsFileMenuOpen(false);
    
    if (action === 'view') {
      // Choose Image機能を呼び出し
      imageEditorRef.current?.chooseImage();
    } else if (action === 'properties') {
      // Exit - トップページに移動
      router.push('/');
    }
  };

  const handleEditMenuItemClick = (action: string) => {
    console.log(`Edit menu action: ${action}`);
    setIsEditMenuOpen(false);
    
    if (action === 'add-bolhat') {
      imageEditorRef.current?.addBolhat();
    } else if (action.startsWith('select-bolhat-')) {
      const bolhatId = action.replace('select-bolhat-', '');
      imageEditorRef.current?.selectBolhat(bolhatId);
    } else if (action.startsWith('delete-bolhat-')) {
      const bolhatId = action.replace('delete-bolhat-', '');
      imageEditorRef.current?.deleteBolhat(bolhatId);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#53bba5]`}>
      <Header />

      <main className={`flex-1 flex items-center justify-center pt-4 pb-4`}>
        <WindowWrapper 
          $imageWidth={imageWidth} 
          $imageHeight={imageHeight} 
          $isMobile={isMobile}
          $viewportWidth={viewportWidth}
          $viewportHeight={viewportHeight}
        >
          <Window className='window'>
            <WindowHeader className='window-title'>
              <span>bolanamaker.exe</span>
              <Button>
                <span className='close-icon' />
              </Button>
            </WindowHeader>
            <Toolbar>
              <div style={{ position: 'relative' }}>
                <Button 
                  variant='menu' 
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFileMenuOpen(!isFileMenuOpen);
                  }}
                  active={isFileMenuOpen}
                >
                  File
                </Button>
                {isFileMenuOpen && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      left: 0, 
                      zIndex: 1000,
                      background: 'white',
                      border: '1px solid #ccc',
                      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MenuList>
                      <MenuListItem 
                        primary 
                        size='sm'
                        onClick={() => handleMenuItemClick('view')}
                      >
                        Choose Image
                      </MenuListItem>
                      <Separator />
                      <MenuListItem 
                        size='sm'
                        disabled
                        onClick={() => handleMenuItemClick('paste-shortcut')}
                      >
                        Undo
                      </MenuListItem>
                      <MenuListItem 
                        size='sm'
                        disabled
                        onClick={() => handleMenuItemClick('undo-copy')}
                      >
                        Redo
                      </MenuListItem>
                      <Separator />
                      <MenuListItem 
                        size='sm'
                        onClick={() => handleMenuItemClick('properties')}
                      >
                        Exit
                      </MenuListItem>
                    </MenuList>
                  </div>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Button 
                  variant='menu' 
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditMenuOpen(!isEditMenuOpen);
                  }}
                  active={isEditMenuOpen}
                  disabled={!baseImage}
                >
                  Edit
                </Button>
                {isEditMenuOpen && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      left: 0, 
                      zIndex: 1000,
                      background: 'white',
                      border: '1px solid #ccc',
                      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MenuList>
                      <MenuListItem 
                        primary 
                        size='sm'
                        onClick={() => handleEditMenuItemClick('add-bolhat')}
                      >
                        Add Bolhat
                      </MenuListItem>
                      {bolhats.length > 0 && (
                        <>
                          <Separator />
                          {bolhats.map((bolhat, index) => (
                            <MenuListItem 
                              key={bolhat.id}
                              size='sm'
                              onClick={() => handleEditMenuItemClick(`select-bolhat-${bolhat.id}`)}
                            >
                              bol {index + 1}
                            </MenuListItem>
                          ))}
                        </>
                      )}
                    </MenuList>
                  </div>
                )}
              </div>
              <Button variant='menu' size='sm' disabled>
                Mint
              </Button>
              <Button 
                variant='menu' 
                size='sm' 
                onClick={handleSaveClick} 
                disabled={!baseImage}
              >
                Save
              </Button>
            </Toolbar>
            <WindowContent style={{ 
              padding: imageWidth ? '4px' : '8px', 
              paddingBottom: imageWidth ? '2px' : '8px',
              height: imageHeight ? `${imageHeight + 6}px` : '100%', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ImageEditor 
                ref={imageEditorRef} 
                onSave={handleSave} 
                onImageLoad={handleImageLoad}
                viewportWidth={viewportWidth}
                viewportHeight={viewportHeight}
              />
            </WindowContent>

          </Window>
        </WindowWrapper>
      </main>

      <Footer />
    </div>
  );
} 