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
  Separator,
  Panel
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
        const calculatedHeight = props.$imageHeight + 106;
        // ヘッダー(64px) + フッター(64px) + 余白(32px) = 160pxを引く
        const availableHeight = props.$viewportHeight - 160;
        const maxViewportHeight = Math.max(availableHeight, 300); // 最小300px確保
        return `${Math.min(calculatedHeight, maxViewportHeight)}px`;
      }
      return 'auto';
    }};
    max-width: 100vw;
    max-height: 100vh;
    min-width: ${props => props.$isMobile ? '320px' : '400px'};
    min-height: ${props => props.$imageHeight ? 'auto' : props.$isMobile ? '200px' : '400px'};
    
    /* 右下の拡大縮小アイコン（リサイズハンドル）を非表示にする */
    &::after {
      display: none !important;
    }
    
    /* より具体的にリサイズハンドルを非表示にする */
    .resize-handle,
    [class*="resize"],
    [class*="ResizeHandle"] {
      display: none !important;
    }
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
  const [showSavePopup, setShowSavePopup] = useState<boolean>(false);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
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

  // スクロール完全無効化
  useEffect(() => {
    // ドラッグやピンチ操作のために全てのスクロールを無効化
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // タッチイベントでのスクロール防止（画像選択エリアは除外）
    const preventScroll = (e: TouchEvent) => {
      // ポップアップ表示中は全てのタッチイベントを許可
      if (showSavePopup) {
        return;
      }
      
      const target = e.target as HTMLElement;
      
      // file inputやChoose画像エリア、メニューエリアでのイベントは許可
      if (target && (
        target.tagName === 'INPUT' ||
        target.closest('[id="image-upload"]') ||
        target.closest('.cursor-pointer') ||
        target.closest('button') ||
        target.closest('[role="menuitem"]') ||
        target.closest('[class*="MenuList"]') ||
        target.closest('[class*="Button"]') ||
        (!baseImage && target.closest('[variant="field"]'))
      )) {
        return;
      }
      
      e.preventDefault();
    };
    
    // パッシブリスナーではなく、積極的にpreventDefaultを実行
    document.addEventListener('touchstart', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchend', preventScroll, { passive: false });
    
    return () => {
      // クリーンアップ時に元に戻す
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      document.removeEventListener('touchstart', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('touchend', preventScroll);
    };
  }, [showSavePopup]);

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
    console.log('handleSave called, isMobile:', isMobile);
    setEditedImage(image);
    
    if (isMobile) {
      // モバイルの場合はポップアップで画像を表示
      console.log('Showing save popup for mobile');
      setSavedImageUrl(image);
      setShowSavePopup(true);
      return;
    }
    
    // デスクトップの場合は従来通りのダウンロード
    console.log('Desktop download');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'edited-bolana.png';
    link.click();
  };

  const handleImageLoad = (width: number, height: number) => {
    setImageWidth(width);
    setImageHeight(height);
    setBaseImage('loaded'); // 画像が読み込まれたことを示すフラグ
  };

  const handleSaveClick = () => {
    console.log('Save button clicked, baseImage:', baseImage);
    // ImageEditorのsave関数を呼び出す
    imageEditorRef.current?.save();
  };

  const closeSavePopup = () => {
    setShowSavePopup(false);
    setSavedImageUrl(null);
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
    <div 
      className={`min-h-screen flex flex-col bg-[#53bba5]`}
      style={{
        overflow: 'hidden',
        touchAction: 'auto',
        userSelect: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      <Header />

      <main 
        className={`flex-1 flex items-center justify-center`}
        style={{
          overflow: 'hidden',
          touchAction: 'auto',
          padding: '4px'
        }}
      >
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
            <Toolbar style={{ touchAction: 'auto', userSelect: 'auto', pointerEvents: 'auto' }}>
              <div style={{ position: 'relative', touchAction: 'auto', pointerEvents: 'auto' }}>
                <Button 
                  variant='menu' 
                  size='sm'
                  onClick={(e) => {
                    console.log('File menu button clicked');
                    e.stopPropagation();
                    setIsFileMenuOpen(!isFileMenuOpen);
                  }}
                  active={isFileMenuOpen}
                  style={{
                    touchAction: 'auto',
                    pointerEvents: 'auto',
                    userSelect: 'auto',
                    cursor: 'pointer'
                  }}
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
                      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                      touchAction: 'auto',
                      pointerEvents: 'auto',
                      userSelect: 'auto'
                    }}
                    onClick={(e) => {
                      console.log('File menu dropdown clicked');
                      e.stopPropagation();
                    }}
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
              <div style={{ position: 'relative', touchAction: 'auto', pointerEvents: 'auto' }}>
                <Button 
                  variant='menu' 
                  size='sm'
                  onClick={(e) => {
                    console.log('Edit menu button clicked');
                    e.stopPropagation();
                    setIsEditMenuOpen(!isEditMenuOpen);
                  }}
                  active={isEditMenuOpen}
                  disabled={!baseImage}
                  style={{
                    touchAction: 'auto',
                    pointerEvents: 'auto',
                    userSelect: 'auto',
                    cursor: 'pointer'
                  }}
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
                      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                      touchAction: 'auto',
                      pointerEvents: 'auto',
                      userSelect: 'auto'
                    }}
                    onClick={(e) => {
                      console.log('Edit menu dropdown clicked');
                      e.stopPropagation();
                    }}
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
              <Button 
                variant='menu' 
                size='sm' 
                disabled
                style={{
                  touchAction: 'auto',
                  pointerEvents: 'auto',
                  userSelect: 'auto'
                }}
              >
                Mint
              </Button>
              <Button 
                variant='menu' 
                size='sm' 
                onClick={(e) => {
                  console.log('Save button clicked');
                  handleSaveClick();
                }} 
                disabled={!baseImage}
                style={{
                  touchAction: 'auto',
                  pointerEvents: 'auto',
                  userSelect: 'auto',
                  cursor: 'pointer'
                }}
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

      {/* 画像保存用ポップアップ（モバイル専用） */}
      {showSavePopup && savedImageUrl && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            touchAction: 'auto'
          }}
          onClick={closeSavePopup}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflow: 'auto',
              textAlign: 'center',
              touchAction: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
              Save Image
            </h3>
            
            <img
              src={savedImageUrl}
              alt="Edited Bolana"
              style={{
                maxWidth: '100%',
                maxHeight: '50vh',
                objectFit: 'contain',
                marginBottom: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              onContextMenu={(e) => e.preventDefault()}
            />
            
            <div style={{
              backgroundColor: '#f0f0f0',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                📱 How to save:
              </p>
              <p style={{ margin: '0 0 4px 0' }}>
                <strong>Long press</strong> the image above
              </p>
              <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                Select "Save Image" to save to camera roll
              </p>
            </div>
            
            <button
              onClick={closeSavePopup}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                touchAction: 'auto'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 