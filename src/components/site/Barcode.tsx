import { useEffect, useRef, useState } from 'react';

interface BarcodeProps {
  type: 'barcode' | 'qr' | 'datamatrix';
  value: string;
  x: number;
  y: number;
  size: number;
  className?: string;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

const BCID: Record<BarcodeProps['type'], string> = {
  barcode: 'code128',
  qr: 'qrcode',
  datamatrix: 'datamatrix',
};

const Barcode = ({ type, value, x, y, size, className, onPointerDown, onPointerMove, onPointerUp, onClick }: BarcodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const [dataUrl, setDataUrl] = useState('');
  const [aspect, setAspect] = useState(1);

  useEffect(() => {
    let cancelled = false;
    if (!value) {
      setDataUrl('');
      return;
    }
    import('bwip-js/browser').then((bwipjs) => {
      if (cancelled) return;
      try {
        const canvas = canvasRef.current;
        bwipjs.toCanvas(canvas, {
          bcid: BCID[type],
          text: value,
          scale: 3,
          includetext: false,
          barcolor: '000000',
          backgroundcolor: 'ffffff',
          ...(type === 'barcode' ? { height: 12 } : {}),
        });
        setDataUrl(canvas.toDataURL('image/png'));
        setAspect(canvas.width / canvas.height);
      } catch {
        setDataUrl('');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [type, value]);

  if (!dataUrl) return null;

  const height = type === 'barcode' ? size * 0.55 : size;
  const width = type === 'barcode' ? height * aspect : size;

  return (
    <image
      href={dataUrl}
      x={x - width / 2}
      y={y - height / 2}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={onClick}
    />
  );
};

export default Barcode;