import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Button, Frame } from 'react95';
import { Pbrush1 } from '@react95/icons';

interface ImageEditorProps {
  onSave: (editedImage: string) => void;
  onImageLoad: (width: number, height: number) => void;
  viewportWidth: number;
  viewportHeight: number;
}

export interface ImageEditorRef {
  chooseImage: () => void;
  save: () => void;
  addBolhat: () => void;
  getBolhats: () => BolhatState[];
  selectBolhat: (id: string) => void;
  deleteBolhat: (id: string) => void;
}

interface BolhatState {
  id: string;
  x: number;
  y: number;
  scale: number;
  visible: boolean;
  rotation: number; // 回転角度（度）
}

const ImageEditor = forwardRef<ImageEditorRef, ImageEditorProps>(({ onSave, onImageLoad, viewportWidth, viewportHeight }, ref) => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [bolhats, setBolhats] = useState<BolhatState[]>([]);
  const [selectedBolhatId, setSelectedBolhatId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'rotate'>('move');
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [initialAngle, setInitialAngle] = useState(0);
  const [previousAngle, setPreviousAngle] = useState(0);
  const [cursorType, setCursorType] = useState<'default' | 'move' | 'rotate'>('default');
  const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);
  const [bolhatImage, setBolhatImage] = useState<HTMLImageElement | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // bolhat画像を読み込み
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => setBolhatImage(img);
    img.src = '/images/bolhat.png';
  }, []);

  // ウォーターマーク画像（bolana.png）を読み込み
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => setWatermarkImage(img);
    img.src = '/images/bolana.png';
  }, []);

  // 外部から呼び出し可能な関数を公開
  useImperativeHandle(ref, () => ({
    chooseImage: () => {
      document.getElementById('image-upload')?.click();
    },
    save: () => {
      if (baseImage && canvasRef.current) {
        // 最終的な合成画像を作成
        redrawCanvas();
        const savedImage = canvasRef.current.toDataURL();
        if (savedImage) {
          onSave(savedImage);
        }
      }
    },
    addBolhat: () => {
      const newId = `bolhat-${Date.now()}`;
      const newBolhat: BolhatState = {
        id: newId,
        x: imageWidth / 2,
        y: imageHeight / 2,
        scale: 0.3,
        visible: true,
        rotation: 0
      };
      setBolhats(prev => [...prev, newBolhat]);
      setSelectedBolhatId(newId);
    },
    getBolhats: () => bolhats,
    selectBolhat: (id: string) => {
      setSelectedBolhatId(id);
    },
    deleteBolhat: (id: string) => {
      setBolhats(prev => prev.filter(b => b.id !== id));
      if (selectedBolhatId === id) {
        setSelectedBolhatId(null);
      }
    }
  }));

  // キャンバスを再描画
  const redrawCanvas = () => {
    if (!canvasRef.current || !baseImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ベース画像を描画
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // 全てのbolhatを描画
      bolhats.forEach(bolhat => {
        if (bolhat.visible && bolhatImage) {
          const bolhatWidth = bolhatImage.width * bolhat.scale;
          const bolhatHeight = bolhatImage.height * bolhat.scale;
          
          ctx.save();
          
          // 選択中のbolhatの場合、枠線を描画
          if (bolhat.id === selectedBolhatId) {
            ctx.strokeStyle = '#0066cc';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(
              bolhat.x - bolhatWidth / 2 - 5,
              bolhat.y - bolhatHeight / 2 - 5,
              bolhatWidth + 10,
              bolhatHeight + 10
            );
            ctx.setLineDash([]);
          }
          
          ctx.translate(bolhat.x, bolhat.y);
          ctx.rotate((bolhat.rotation * Math.PI) / 180); // 度をラジアンに変換
          ctx.drawImage(
            bolhatImage,
            -bolhatWidth / 2,
            -bolhatHeight / 2,
            bolhatWidth,
            bolhatHeight
          );
          ctx.restore();
        }
      });

      // ウォーターマーク（bolana.png）を右下に描画
      if (watermarkImage) {
        ctx.save();
        ctx.globalAlpha = 0.2; // 80%透過（20%不透明）
        
        // ウォーターマークのサイズを調整（画像サイズの1/8程度）
        const watermarkScale = Math.min(canvas.width, canvas.height) / 8 / Math.max(watermarkImage.width, watermarkImage.height);
        const watermarkWidth = watermarkImage.width * watermarkScale;
        const watermarkHeight = watermarkImage.height * watermarkScale;
        
        // 右下に配置（マージン10px）
        const watermarkX = canvas.width - watermarkWidth - 10;
        const watermarkY = canvas.height - watermarkHeight - 10;
        
        ctx.drawImage(
          watermarkImage,
          watermarkX,
          watermarkY,
          watermarkWidth,
          watermarkHeight
        );
        
        ctx.restore();
      }
    };
    img.src = baseImage;
  };

  // 選択中のbolhatを取得するヘルパー関数
  const getSelectedBolhat = () => {
    return bolhats.find(b => b.id === selectedBolhatId) || null;
  };

  // 選択中のbolhatを更新するヘルパー関数
  const updateSelectedBolhat = (updates: Partial<BolhatState>) => {
    if (!selectedBolhatId) return;
    setBolhats(prev => prev.map(b => 
      b.id === selectedBolhatId ? { ...b, ...updates } : b
    ));
  };

  // マウス位置からの角度を計算
  const getAngleFromMouse = (mouseX: number, mouseY: number, bolhat: BolhatState): number => {
    const dx = mouseX - bolhat.x;
    const dy = mouseY - bolhat.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  // マウスイベント（PC用）
  const handleMouseDown = (e: React.MouseEvent) => {
    // 左クリックまたは右クリックのみ処理
    if (e.button !== 0 && e.button !== 2) return;
    
    if (!bolhatImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // クリック位置にあるbolhatを検索（後ろから前に向かって検索）
    let clickedBolhat: BolhatState | null = null;
    for (let i = bolhats.length - 1; i >= 0; i--) {
      const bolhat = bolhats[i];
      if (!bolhat.visible) continue;
      
      const bolhatWidth = bolhatImage.width * bolhat.scale;
      const bolhatHeight = bolhatImage.height * bolhat.scale;
      
      // 回転を考慮した範囲判定
      const dx = x - bolhat.x;
      const dy = y - bolhat.y;
      const cos = Math.cos((-bolhat.rotation * Math.PI) / 180);
      const sin = Math.sin((-bolhat.rotation * Math.PI) / 180);
      const rotatedX = dx * cos - dy * sin;
      const rotatedY = dx * sin + dy * cos;
      
      if (Math.abs(rotatedX) <= bolhatWidth / 2 && Math.abs(rotatedY) <= bolhatHeight / 2) {
        clickedBolhat = bolhat;
        break;
      }
    }
    
    if (clickedBolhat) {
      // bolhatを選択
      setSelectedBolhatId(clickedBolhat.id);
      setIsDragging(true);
      setLastMousePos({ x, y });
      
      if (e.button === 0) {
        // 左クリックは移動
        setDragType('move');
      } else if (e.button === 2) {
        // 右クリックは回転
        setDragType('rotate');
        const angle = getAngleFromMouse(x, y, clickedBolhat);
        setInitialAngle(angle);
        setPreviousAngle(angle);
      }
    } else {
      // 何もない場所をクリックした場合は選択を解除
      setSelectedBolhatId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedBolhatId) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const selectedBolhat = getSelectedBolhat();
    if (!selectedBolhat) return;
    
    if (dragType === 'rotate') {
      // 回転処理
      const currentAngle = getAngleFromMouse(x, y, selectedBolhat);
      let angleDiff = currentAngle - previousAngle;
      
      // 角度差を-180度から180度の範囲に正規化
      while (angleDiff > 180) angleDiff -= 360;
      while (angleDiff < -180) angleDiff += 360;
      
      // 回転感度を調整（より精密な操作のため）
      if (Math.abs(angleDiff) > 0.2) { // 0.2度以上の変化のみ適用
        // 回転感度を30%に下げる（より精密な操作）
        const adjustedAngleDiff = angleDiff * 0.3;
        updateSelectedBolhat({
          rotation: (selectedBolhat.rotation + adjustedAngleDiff + 360) % 360 // 常に正の値にする
        });
      }
      
      setPreviousAngle(currentAngle);
    } else {
      // 移動処理
      const dx = x - lastMousePos.x;
      const dy = y - lastMousePos.y;
      
      updateSelectedBolhat({
        x: Math.max(0, Math.min(imageWidth, selectedBolhat.x + dx)),
        y: Math.max(0, Math.min(imageHeight, selectedBolhat.y + dy))
      });
      
      setLastMousePos({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType('move');
    setPreviousAngle(0); // 回転状態をリセット
  };

  // 右クリック処理（コンテキストメニューの無効化）
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // コンテキストメニューを無効化
  };

  // マウスムーブ時のカーソル更新（ドラッグ中でない場合）
  const handleMouseHover = (e: React.MouseEvent) => {
    if (isDragging || !bolhatImage) {
      setCursorType('default');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // いずれかのbolhatの範囲内かチェック
    let isOverBolhat = false;
    for (let i = bolhats.length - 1; i >= 0; i--) {
      const bolhat = bolhats[i];
      if (!bolhat.visible) continue;
      
      const bolhatWidth = bolhatImage.width * bolhat.scale;
      const bolhatHeight = bolhatImage.height * bolhat.scale;
      const dx = x - bolhat.x;
      const dy = y - bolhat.y;
      const cos = Math.cos((-bolhat.rotation * Math.PI) / 180);
      const sin = Math.sin((-bolhat.rotation * Math.PI) / 180);
      const rotatedX = dx * cos - dy * sin;
      const rotatedY = dx * sin + dy * cos;
      
      if (Math.abs(rotatedX) <= bolhatWidth / 2 && Math.abs(rotatedY) <= bolhatHeight / 2) {
        isOverBolhat = true;
        break;
      }
    }
    
    setCursorType(isOverBolhat ? 'move' : 'default');
  };

  // ホイールイベント（拡大縮小）
  const handleWheel = (e: React.WheelEvent) => {
    if (!selectedBolhatId) return;
    
    e.preventDefault();
    const scaleDelta = e.deltaY > 0 ? 0.97 : 1.03; // より細かい調整（3%ずつ）
    
    const selectedBolhat = getSelectedBolhat();
    if (selectedBolhat) {
      updateSelectedBolhat({
        scale: Math.max(0.01, Math.min(3, selectedBolhat.scale * scaleDelta))
      });
    }
  };

  // タッチイベント（モバイル用）
  const handleTouchStart = (e: React.TouchEvent) => {
    // 複数のタッチポイントがある場合は、デフォルト動作を無効化
    if (e.touches.length > 1) {
      e.preventDefault();
    }
    
    if (!bolhatImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // タッチ位置にあるbolhatを検索
    let touchedBolhat: BolhatState | null = null;
    for (let i = bolhats.length - 1; i >= 0; i--) {
      const bolhat = bolhats[i];
      if (!bolhat.visible) continue;
      
      const bolhatWidth = bolhatImage.width * bolhat.scale;
      const bolhatHeight = bolhatImage.height * bolhat.scale;
      const dx = x - bolhat.x;
      const dy = y - bolhat.y;
      
      if (Math.abs(dx) <= bolhatWidth / 2 && Math.abs(dy) <= bolhatHeight / 2) {
        touchedBolhat = bolhat;
        break;
      }
    }
    
    if (touchedBolhat) {
      setSelectedBolhatId(touchedBolhat.id);
      setIsDragging(true);
      setLastMousePos({ x, y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // 複数のタッチポイントがある場合は、デフォルト動作を無効化
    if (e.touches.length > 1) {
      e.preventDefault();
    }
    
    if (!isDragging) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches.length === 1) {
      // 移動
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const dx = x - lastMousePos.x;
      const dy = y - lastMousePos.y;
      
      const selectedBolhat = getSelectedBolhat();
      if (selectedBolhat) {
        updateSelectedBolhat({
          x: Math.max(0, Math.min(imageWidth, selectedBolhat.x + dx)),
          y: Math.max(0, Math.min(imageHeight, selectedBolhat.y + dy))
        });
      }
      
      setLastMousePos({ x, y });
    } else if (e.touches.length === 2) {
      // ピンチ拡大縮小
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (lastPinchDistance !== null) {
        const distanceRatio = currentDistance / lastPinchDistance;
        // より細かく、安定した拡大縮小
        const scaleFactor = Math.min(Math.max(distanceRatio, 0.95), 1.05);
        
        const selectedBolhat = getSelectedBolhat();
        if (selectedBolhat) {
          updateSelectedBolhat({
            scale: Math.max(0.01, Math.min(3, selectedBolhat.scale * scaleFactor))
          });
        }
      }
      
      setLastPinchDistance(currentDistance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastPinchDistance(null); // ピンチ距離をリセット
  };

  // bolhatsの状態が変わったら再描画
  React.useEffect(() => {
    if (baseImage) {
      redrawCanvas();
    }
  }, [baseImage, bolhats, selectedBolhatId, bolhatImage, watermarkImage]);

  // 画像ファイル処理
  const processImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            
            // 最大サイズを設定（ビューポートに収まるように動的計算）
            // ヘッダー、ツールバー、パディング等を考慮して実用的な最大サイズを計算
            const maxWidth = Math.min(viewportWidth * 0.85, 1000); // ビューポート幅の85%、最大1000px
            const maxHeight = Math.min(viewportHeight * 0.6, 600); // ビューポート高さの60%、最大600px
            
            let { width, height } = img;
            
            // アスペクト比を維持しながらサイズ調整
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              setBaseImage(canvas.toDataURL());
              setImageWidth(width);
              setImageHeight(height);
              onImageLoad(width, height);
              // 新しい画像をロードしたらbolhatsをクリア
              setBolhats([]);
              setSelectedBolhatId(null);
            }
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // 基本画像のアップロード
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // ドラッグドロップイベントハンドラー
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  };

  return (
    <div className="w-full h-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="image-upload"
      />

      {/* Main Canvas */}
      <Frame 
        variant="field" 
        className={`relative w-full ${isDragOver ? 'bg-blue-50 border-blue-300' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ 
          height: baseImage ? `${imageHeight}px` : '500px', 
          minHeight: baseImage ? `${imageHeight}px` : '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: baseImage ? '0' : '1rem'
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => {
            handleMouseMove(e);
            handleMouseHover(e);
          }}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onContextMenu={handleContextMenu}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            display: baseImage ? 'block' : 'none',
            objectFit: 'contain',
            margin: '0 auto',
            border: 'none',
            outline: 'none',
            touchAction: 'none', // ブラウザのデフォルトタッチ動作を無効化
            cursor: isDragging 
              ? (dragType === 'rotate' ? 'crosshair' : 'grabbing')
              : cursorType === 'move' 
                ? 'grab' 
                : 'default'
          }}
        />
        {!baseImage && (
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center text-center cursor-pointer ${
              isDragOver ? 'text-blue-600' : 'text-gray-500'
            }`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
              height: '100%',
              minHeight: '500px'
            }}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <div className="mb-4">
              <Pbrush1 
                style={{ 
                  width: '64px', 
                  height: '64px',
                  imageRendering: 'pixelated'
                }} 
              />
            </div>
            <div className="text-lg font-medium mb-2">
              {isDragOver ? 'Drop your image here' : 'Choose an image or drag & drop'}
            </div>
            <div className="text-sm">
              Supports: JPG, PNG, GIF, WebP
            </div>
          </div>
        )}
      </Frame>
    </div>
  );
});

ImageEditor.displayName = 'ImageEditor';

export default ImageEditor; 