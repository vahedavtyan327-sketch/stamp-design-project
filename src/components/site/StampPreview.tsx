import { useRef, useState } from 'react';

export interface StampConfig {
  shape: 'circle' | 'square' | 'triangle';
  size: number;
  topText: string;
  bottomText: string;
  innerTopText: string;
  innerBottomText: string;
  centerText: string;
  centerSub: string;
  centerSub2: string;
  fontSize: number;
  letterSpacing: number;
  outerRadius: number;
  innerRadius: number;
  centerRadius: number;
  ringGap: number;
  showOuterRing: boolean;
  showInnerRing: boolean;
  showCenterRing: boolean;
  border: 'single' | 'double' | 'dashed' | 'none';
  symbol: 'none' | 'star' | 'star8' | 'dot' | 'diamond';
  symbolAngle: number;
  symbolOffset: number;
  symbolRing: 'outer' | 'inner' | 'center';
  symbolMirror: boolean;
  symbol2Angle: number;
  symbol2Offset: number;
  symbol3: boolean;
  symbol3Angle: number;
  symbol3Offset: number;
  symbol4: boolean;
  symbol4Angle: number;
  symbol4Offset: number;
  symbol5: boolean;
  symbol5Angle: number;
  symbol5Offset: number;
  topTextOffset: number;
  bottomTextOffset: number;
  innerTopTextOffset: number;
  innerBottomTextOffset: number;
  font: string;
  logo: string;
  logoSize: number;
  logoRotation: number;
  logoAngle: number;
  logoDistance: number;
  logoGap: number;
}

const SYMBOLS: Record<string, string> = {
  star: '★',
  star8: '✷',
  dot: '●',
  diamond: '◆',
};

export type EditableField =
  | 'topText'
  | 'bottomText'
  | 'innerTopText'
  | 'innerBottomText'
  | 'centerText'
  | 'centerSub'
  | 'centerSub2';

export interface SymbolChange {
  angle: number;
  offset: number;
}

export type SymbolSlot = 'main' | 'mirror' | 's3' | 's4' | 's5';

export interface LogoChange {
  angle: number;
  distance: number;
}

interface StampPreviewProps {
  config: StampConfig;
  size?: number;
  onTextChange?: (field: EditableField, value: string) => void;
  onSymbolChange?: (which: SymbolSlot, change: SymbolChange) => void;
  onLogoChange?: (change: LogoChange) => void;
}

const StampPreview = ({ config, size = 320, onTextChange, onSymbolChange, onLogoChange }: StampPreviewProps) => {
  const c = 160;
  const outerBorderR = 150;
  const svgRef = useRef<SVGSVGElement>(null);
  const [editing, setEditing] = useState<{
    field: EditableField;
    original: string;
    value: string;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const dragState = useRef<{ which: SymbolSlot | 'logo' } | null>(null);

  const editable = !!onTextChange;
  const symbolDraggable = !!onSymbolChange;
  const logoDraggable = !!onLogoChange;

  const getScale = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect && rect.width ? rect.width / 320 : size / 320;
  };

  const pointToPolar = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const scale = rect.width / 320;
    const px = (clientX - rect.left) / scale - c;
    const py = (clientY - rect.top) / scale - c;
    const dist = Math.sqrt(px * px + py * py);
    let angleDeg = (Math.atan2(py, px) * 180) / Math.PI + 90;
    if (angleDeg < 0) angleDeg += 360;
    return { angleDeg, dist };
  };

  const handleSymbolPointerDown = (which: SymbolSlot) => (e: React.PointerEvent) => {
    if (!symbolDraggable) return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { which };
  };

  const handleSymbolPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current || dragState.current.which === 'logo' || !onSymbolChange) return;
    const polar = pointToPolar(e.clientX, e.clientY);
    if (!polar) return;
    const baseR = ringRadiusFor(config.symbolRing);
    onSymbolChange(dragState.current.which, {
      angle: Math.round(polar.angleDeg),
      offset: Math.round(polar.dist - baseR),
    });
  };

  const handleSymbolPointerUp = () => {
    dragState.current = null;
  };

  const handleLogoPointerDown = (e: React.PointerEvent) => {
    if (!logoDraggable) return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { which: 'logo' };
  };

  const handleLogoPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current || dragState.current.which !== 'logo' || !onLogoChange) return;
    const polar = pointToPolar(e.clientX, e.clientY);
    if (!polar) return;
    onLogoChange({ angle: Math.round(polar.angleDeg), distance: Math.round(polar.dist) });
  };

  const ringRadiusFor = (ring: StampConfig['symbolRing']) => {
    if (ring === 'inner') return config.innerRadius + config.ringGap;
    if (ring === 'center') return config.centerRadius;
    return config.outerRadius + (outerBorderR - config.outerRadius) / 2 + 4;
  };

  const startEdit = (field: EditableField, el: SVGGraphicsElement, initial: string) => {
    if (!editable) return;
    const bbox = el.getBBox();
    const scale = getScale();
    setEditing({
      field,
      original: initial,
      value: initial,
      x: bbox.x * scale - 6,
      y: bbox.y * scale - 4,
      width: Math.max(bbox.width * scale + 12, 50),
      height: Math.max(bbox.height * scale + 8, 22),
    });
  };

  const commitEdit = () => setEditing(null);
  const cancelEdit = () => {
    if (editing) onTextChange?.(editing.field, editing.original);
    setEditing(null);
  };

  const renderArcText = (text: string, position: 'top' | 'bottom', radius: number, field: EditableField, centerOffsetDeg = 0) => {
    if (!text) return null;
    const chars = text.split('');

    // arc length (px) needed per character, based on font size + letter spacing
    const charArc = config.fontSize * 0.62 + config.letterSpacing;
    const anglePerChar = (charArc / radius) * (180 / Math.PI);
    const totalAngle = Math.min(anglePerChar * chars.length, 210);

    const isTop = position === 'top';
    // base center angle: -90 (12 o'clock) for top arcs, 90 (6 o'clock) for bottom arcs,
    // shifted around the circle by centerOffsetDeg (position by circle control)
    const centerAngle = (isTop ? -90 : 90) + centerOffsetDeg;
    // startAngle/step are defined so characters always progress left-to-right
    // along the arc, whether the arc sits above (top) or below (bottom) center
    const startAngle = isTop ? centerAngle - totalAngle / 2 : centerAngle + totalAngle / 2;
    const step = chars.length > 1 ? totalAngle / (chars.length - 1) : 0;

    return (
      <g
        className={editable ? 'cursor-pointer' : undefined}
        onClick={editable ? (e) => startEdit(field, e.currentTarget, text) : undefined}
      >
        {chars.map((ch, i) => {
          const angleDeg = isTop ? startAngle + step * i : startAngle - step * i;
          const angle = angleDeg * (Math.PI / 180);
          const x = c + radius * Math.cos(angle);
          const y = c + radius * Math.sin(angle);
          const rot = isTop ? angleDeg + 90 : angleDeg - 90;
          return (
            <text
              key={`${position}-${radius}-${i}`}
              x={x}
              y={y}
              fontSize={config.fontSize}
              fontFamily={config.font}
              fontWeight={600}
              fill="#000"
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${rot} ${x} ${y})`}
            >
              {ch}
            </text>
          );
        })}
      </g>
    );
  };

  const borderEls = () => {
    if (config.shape === 'circle') {
      return (
        <>
          {config.showOuterRing && (
            <>
              <circle cx={c} cy={c} r={outerBorderR} fill="none" stroke="#000" strokeWidth={config.border === 'none' ? 0 : 4} strokeDasharray={config.border === 'dashed' ? '10 6' : undefined} />
              {config.border === 'double' && (
                <circle cx={c} cy={c} r={outerBorderR - 10} fill="none" stroke="#000" strokeWidth={2} />
              )}
            </>
          )}
          {config.showInnerRing && (
            <circle cx={c} cy={c} r={config.innerRadius + config.ringGap} fill="none" stroke="#000" strokeWidth={1.5} />
          )}
          {config.showCenterRing && (
            <circle cx={c} cy={c} r={config.centerRadius} fill="none" stroke="#000" strokeWidth={1.5} />
          )}
        </>
      );
    }
    if (config.shape === 'square') {
      return (
        <>
          <rect x={20} y={20} width={280} height={280} rx={8} fill="none" stroke="#000" strokeWidth={config.border === 'none' ? 0 : 4} strokeDasharray={config.border === 'dashed' ? '10 6' : undefined} />
          {config.border === 'double' && (
            <rect x={32} y={32} width={256} height={256} rx={6} fill="none" stroke="#000" strokeWidth={2} />
          )}
        </>
      );
    }
    return (
      <>
        <polygon points="160,24 300,290 20,290" fill="none" stroke="#000" strokeWidth={config.border === 'none' ? 0 : 4} strokeDasharray={config.border === 'dashed' ? '10 6' : undefined} />
        {config.border === 'double' && (
          <polygon points="160,44 282,278 38,278" fill="none" stroke="#000" strokeWidth={2} />
        )}
      </>
    );
  };

  const hasLogo = !!config.logo;
  const logoOffset = hasLogo ? config.logoSize / 2 + (config.logoGap ?? 10) : 0;

  const baseCenterY = config.shape === 'triangle' ? 200 : c;
  const centerY = baseCenterY + logoOffset / 2;
  const centerLinesCount = 1 + (config.centerSub ? 1 : 0) + (config.centerSub2 ? 1 : 0);
  const lineH = config.fontSize * 0.95;

  const centerLineY = (idx: number) => {
    // idx: 0 = centerText, 1 = centerSub, 2 = centerSub2
    if (centerLinesCount === 1) return centerY;
    if (centerLinesCount === 2) return centerY + (idx === 0 ? -lineH / 2 : lineH / 2);
    return centerY + (idx - 1) * lineH;
  };

  const baseRingR = ringRadiusFor(config.symbolRing);

  const renderSymbol = (which: SymbolSlot, angleDeg: number, offset: number) => {
    const r = baseRingR + (offset ?? 0);
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return (
      <text
        key={which}
        x={c + r * Math.cos(rad)}
        y={c + r * Math.sin(rad)}
        fontSize={20}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#000"
        className={symbolDraggable ? 'cursor-move touch-none' : undefined}
        onPointerDown={handleSymbolPointerDown(which)}
        onPointerMove={handleSymbolPointerMove}
        onPointerUp={handleSymbolPointerUp}
      >
        {SYMBOLS[config.symbol]}
      </text>
    );
  };

  const logoAngleRad = ((config.logoAngle - 90) * Math.PI) / 180;
  const hasCustomLogoPos = (config.logoDistance ?? 0) > 0;
  const logoCx = hasCustomLogoPos ? c + config.logoDistance * Math.cos(logoAngleRad) : c;
  const logoCy = hasCustomLogoPos
    ? c + config.logoDistance * Math.sin(logoAngleRad)
    : undefined;

  const centerTextEl = (field: EditableField, text: string, y: number, fontSize: number, weight: number) => (
    <text
      x={c}
      y={y}
      fontSize={fontSize}
      fontFamily={config.font}
      fontWeight={weight}
      fill="#000"
      textAnchor="middle"
      dominantBaseline="central"
      letterSpacing={field === 'centerText' ? config.letterSpacing / 3 : undefined}
      className={editable ? 'cursor-pointer' : undefined}
      onClick={editable ? (e) => startEdit(field, e.currentTarget, text) : undefined}
    >
      {text}
    </text>
  );

  return (
    <div className="relative mx-auto" style={{ width: size, maxWidth: '100%' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 320 320"
        width={size}
        height={size}
        className="mx-auto max-w-full"
        style={{ background: '#fff', borderRadius: 12 }}
      >
        {borderEls()}

        {config.shape === 'circle' && (
          <>
            {renderArcText(config.topText, 'top', config.outerRadius, 'topText', config.topTextOffset ?? 0)}
            {renderArcText(config.bottomText, 'bottom', config.outerRadius, 'bottomText', config.bottomTextOffset ?? 0)}
            {renderArcText(config.innerTopText, 'top', config.innerRadius, 'innerTopText', config.innerTopTextOffset ?? 0)}
            {renderArcText(config.innerBottomText, 'bottom', config.innerRadius, 'innerBottomText', config.innerBottomTextOffset ?? 0)}
            {config.symbol !== 'none' && (
              <>
                {renderSymbol('main', config.symbolAngle, config.symbolOffset)}
                {config.symbolMirror && renderSymbol('mirror', config.symbol2Angle, config.symbol2Offset)}
                {config.symbol3 && renderSymbol('s3', config.symbol3Angle, config.symbol3Offset)}
                {config.symbol4 && renderSymbol('s4', config.symbol4Angle, config.symbol4Offset)}
                {config.symbol5 && renderSymbol('s5', config.symbol5Angle, config.symbol5Offset)}
              </>
            )}
          </>
        )}

        {hasLogo && (
          <image
            href={config.logo}
            x={(hasCustomLogoPos ? logoCx : c) - config.logoSize / 2}
            y={(hasCustomLogoPos ? logoCy! : baseCenterY - logoOffset / 2) - config.logoSize / 2}
            width={config.logoSize}
            height={config.logoSize}
            preserveAspectRatio="xMidYMid meet"
            transform={config.logoRotation ? `rotate(${config.logoRotation} ${hasCustomLogoPos ? logoCx : c} ${hasCustomLogoPos ? logoCy : baseCenterY - logoOffset / 2})` : undefined}
            className={logoDraggable ? 'cursor-move touch-none' : undefined}
            onPointerDown={handleLogoPointerDown}
            onPointerMove={handleLogoPointerMove}
            onPointerUp={handleSymbolPointerUp}
          />
        )}

        {config.centerText && centerTextEl('centerText', config.centerText, centerLineY(0), config.fontSize + 2, 700)}
        {config.centerSub && centerTextEl('centerSub', config.centerSub, centerLineY(1), config.fontSize + 1, 600)}
        {config.centerSub2 && centerTextEl('centerSub2', config.centerSub2, centerLineY(2), config.fontSize + 1, 600)}
      </svg>

      {editing && (
        <input
          autoFocus
          value={editing.value}
          onChange={(e) => {
            const value = e.target.value;
            setEditing((p) => (p ? { ...p, value } : p));
            onTextChange?.(editing.field, value);
          }}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit();
            if (e.key === 'Escape') cancelEdit();
          }}
          style={{
            position: 'absolute',
            left: editing.x,
            top: editing.y,
            width: editing.width,
            height: editing.height,
            fontSize: 13,
          }}
          className="rounded border-2 border-primary bg-white px-1 text-black shadow-lg outline-none"
        />
      )}
    </div>
  );
};

export default StampPreview;