import React, { useState, useRef, useEffect } from 'react';
import { Button, Frame } from 'react95';
import { useGesture } from '@use-gesture/react';

interface ImageEditorProps {
  onSave: (editedImage: string) => void;
  onImageLoad: (width: number) => void;
}

interface OverlayPosition {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onSave, onImageLoad }) => {
  const [image, setImage] = useState<string | null>(null);
  const [overlayPosition, setOverlayPosition] = useState<OverlayPosition>({
    x: 0,
    y: 0,
    scale: 0.5,
    rotation: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayImageRef = useRef<HTMLImageElement | null>(null);
  const watermarkRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // BOLハット画像の読み込み
    const overlayImg = new Image();
    overlayImg.src = '/images/bolhat.png';
    overlayImg.onload = () => {
      console.log('loaded');
      overlayImageRef.current = overlayImg;
      const canvas = canvasRef.current;
      if (canvas) {
        setOverlayPosition(prev => ({
          ...prev,
          x: canvas.width / 2,
          y: canvas.height / 2
        }));
      }
      drawCanvas();
    };
    overlayImg.onerror = (error) => {
      console.error('failed to load', error);
    };

    // ウォーターマーク画像の読み込み
    const watermarkImg = new Image();
    watermarkImg.src = '/images/bolana.png';
    watermarkImg.onload = () => {
      watermarkRef.current = watermarkImg;
      drawCanvas();
    };
    watermarkImg.onerror = (error) => {
      console.error('failed to load watermark', error);
    };
  }, [image]);

  const addWatermark = (ctx: CanvasRenderingContext2D) => {
    if (!watermarkRef.current || !ctx.canvas) return;

    const canvas = ctx.canvas;
    // キャンバスの短辺を基準に6.9%のサイズを計算
    const baseSize = Math.min(canvas.width, canvas.height);
    const watermarkSize = baseSize * 0.069;
    
    // 一時的なキャンバスを作成してグレースケール処理
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = watermarkSize;
    tempCanvas.height = watermarkSize;

    // 画像を一時キャンバスに描画
    tempCtx.drawImage(watermarkRef.current, 0, 0, watermarkSize, watermarkSize);
    
    // グレースケール変換
    const imageData = tempCtx.getImageData(0, 0, watermarkSize, watermarkSize);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;     // R
      data[i + 1] = avg; // G
      data[i + 2] = avg; // B
    }
    tempCtx.putImageData(imageData, 0, 0);

    // メインキャンバスに半透明で描画
    ctx.save();
    ctx.globalAlpha = 0.69;
    ctx.drawImage(
      tempCanvas,
      canvas.width - watermarkSize - 10,
      canvas.height - watermarkSize - 10,
      watermarkSize,
      watermarkSize
    );
    ctx.restore();
  };

  const drawCanvas = () => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseImg = new Image();
    baseImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseImg, 0, 0);

      if (overlayImageRef.current) {
        ctx.save();
        ctx.translate(overlayPosition.x, overlayPosition.y);
        ctx.rotate((overlayPosition.rotation * Math.PI) / 180);
        ctx.scale(overlayPosition.scale, overlayPosition.scale);
        ctx.drawImage(
          overlayImageRef.current,
          -overlayImageRef.current.width / 2,
          -overlayImageRef.current.height / 2
        );
        ctx.restore();
      }

      // プレビュー時にもウォーターマークを追加
      addWatermark(ctx);
    };
    baseImg.src = image;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - overlayPosition.x,
      y: e.clientY - overlayPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setOverlayPosition(prev => ({
      ...prev,
      x: newX,
      y: newY
    }));
    drawCanvas();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScale = (delta: number) => {
    setOverlayPosition(prev => ({
      ...prev,
      scale: Math.max(0.1, prev.scale + delta)
    }));
    drawCanvas();
  };

  const handleRotate = (delta: number) => {
    setOverlayPosition(prev => ({
      ...prev,
      rotation: prev.rotation + delta
    }));
    drawCanvas();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              setImage(canvas.toDataURL());
              onImageLoad(img.width);
              setOverlayPosition(prev => ({
                ...prev,
                x: canvas.width / 2,
                y: canvas.height / 2
              }));
            }
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (image && canvasRef.current) {
      drawCanvas();  
      const savedImage = canvasRef.current.toDataURL();
      onSave(savedImage);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!image) return;

    // シフトキーが押されている場合は、より細かい調整を可能に
    const scaleFactor = e.shiftKey ? 0.01 : 0.03;
    
    // 現在のスケールに応じて変化量を調整
    const delta = e.deltaY > 0 
      ? -scaleFactor * overlayPosition.scale
      : scaleFactor * overlayPosition.scale;

    handleScale(delta);
  };

  // Frame内でのホイールイベントを防止
  const preventScroll = (e: React.WheelEvent) => {
    e.preventDefault();
  };

  const bind = useGesture({
    onPinch: ({ offset: [scale], movement: [rotation], event }) => {
      event.preventDefault();
      setOverlayPosition(prev => ({
        ...prev,
        scale: Math.max(0.1, scale * 0.01),
        rotation: prev.rotation + rotation
      }));
      drawCanvas();
    },
    onDrag: ({ offset: [x, y] }) => {
      setOverlayPosition(prev => ({
        ...prev,
        x: x,
        y: y
      }));
      drawCanvas();
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button onClick={() => document.getElementById('image-upload')?.click()}>
          Choose image
        </Button>
        {image && (
          <Button onClick={handleSave}>
            Save
          </Button>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="image-upload"
      />
      <Frame 
        variant="field" 
        className="relative"
        onWheel={preventScroll}
      >
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: image ? 'block' : 'none',
            touchAction: 'none'
          }}
          {...bind()}
          onWheel={handleWheel}
        />
        {!image && (
          <div className="p-4 text-center text-gray-500 absolute inset-0 flex items-center justify-center">
            Choose image.
          </div>
        )}
      </Frame>
    </div>
  );
};

export default ImageEditor; 