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
  symbolRing: 'outer' | 'inner' | 'center';
  symbolMirror: boolean;
  font: string;
  logo: string;
  logoSize: number;
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

interface StampPreviewProps {
  config: StampConfig;
  size?: number;
  onTextChange?: (field: EditableField, value: string) => void;
}

const StampPreview = ({ config, size = 320, onTextChange }: StampPreviewProps) => {
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

  const editable = !!onTextChange;

  const getScale = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect && rect.width ? rect.width / 320 : size / 320;
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

  const renderArcText = (text: string, position: 'top' | 'bottom', radius: number, field: EditableField) => {
    if (!text) return null;
    const chars = text.split('');

    // arc length (px) needed per character, based on font size + letter spacing
    const charArc = config.fontSize * 0.62 + config.letterSpacing;
    const anglePerChar = (charArc / radius) * (180 / Math.PI);
    const totalAngle = Math.min(anglePerChar * chars.length, 210);

    const isTop = position === 'top';
    // startAngle/step are defined so characters always progress left-to-right
    // along the arc, whether the arc sits above (top) or below (bottom) center
    const startAngle = isTop ? -90 - totalAngle / 2 : 90 + totalAngle / 2;
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
  const logoOffset = hasLogo ? config.logoSize / 2 + 10 : 0;

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

  const ringRadius: Record<StampConfig['symbolRing'], number> = {
    outer: config.outerRadius + (outerBorderR - config.outerRadius) / 2 + 4,
    inner: config.innerRadius + config.ringGap,
    center: config.centerRadius,
  };
  const symbolR = ringRadius[config.symbolRing] ?? ringRadius.outer;
  // angle measured clockwise from the top (12 o'clock)
  const symbolAngleRad = ((config.symbolAngle - 90) * Math.PI) / 180;
  const mirrorAngleRad = ((config.symbolAngle + 180 - 90) * Math.PI) / 180;

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
            {renderArcText(config.topText, 'top', config.outerRadius, 'topText')}
            {renderArcText(config.bottomText, 'bottom', config.outerRadius, 'bottomText')}
            {renderArcText(config.innerTopText, 'top', config.innerRadius, 'innerTopText')}
            {renderArcText(config.innerBottomText, 'bottom', config.innerRadius, 'innerBottomText')}
            {config.symbol !== 'none' && (
              <>
                <text
                  x={c + symbolR * Math.cos(symbolAngleRad)}
                  y={c + symbolR * Math.sin(symbolAngleRad)}
                  fontSize={20}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#000"
                >
                  {SYMBOLS[config.symbol]}
                </text>
                {config.symbolMirror && (
                  <text
                    x={c + symbolR * Math.cos(mirrorAngleRad)}
                    y={c + symbolR * Math.sin(mirrorAngleRad)}
                    fontSize={20}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#000"
                  >
                    {SYMBOLS[config.symbol]}
                  </text>
                )}
              </>
            )}
          </>
        )}

        {hasLogo && (
          <image
            href={config.logo}
            x={c - config.logoSize / 2}
            y={baseCenterY - logoOffset / 2 - config.logoSize / 2}
            width={config.logoSize}
            height={config.logoSize}
            preserveAspectRatio="xMidYMid meet"
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