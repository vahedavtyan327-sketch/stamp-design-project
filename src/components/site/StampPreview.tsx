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
  showInnerRing: boolean;
  showCenterRing: boolean;
  border: 'single' | 'double' | 'dashed' | 'none';
  symbol: 'none' | 'star' | 'star8' | 'dot' | 'diamond';
  font: string;
}

const SYMBOLS: Record<string, string> = {
  star: '★',
  star8: '✷',
  dot: '●',
  diamond: '◆',
};

const StampPreview = ({ config, size = 320 }: { config: StampConfig; size?: number }) => {
  const c = 160;
  const outerBorderR = 150;

  const renderArcText = (text: string, position: 'top' | 'bottom', radius: number) => {
    if (!text) return null;
    const chars = text.split('');

    // arc length (px) needed per character, based on font size + letter spacing
    const charArc = config.fontSize * 0.62 + config.letterSpacing;
    const anglePerChar = (charArc / radius) * (180 / Math.PI);
    const totalAngle = Math.min(anglePerChar * chars.length, 210);

    const isTop = position === 'top';
    const startAngle = isTop ? -90 - totalAngle / 2 : 90 - totalAngle / 2;
    const step = chars.length > 1 ? totalAngle / (chars.length - 1) : 0;

    return chars.map((ch, i) => {
      const angle = (startAngle + step * i) * (Math.PI / 180);
      const x = c + radius * Math.cos(angle);
      const y = c + radius * Math.sin(angle);
      const rot = isTop
        ? (startAngle + step * i) + 90
        : (startAngle + step * i) - 90;
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
    });
  };

  const borderEls = () => {
    if (config.shape === 'circle') {
      return (
        <>
          <circle cx={c} cy={c} r={outerBorderR} fill="none" stroke="#000" strokeWidth={config.border === 'none' ? 0 : 4} strokeDasharray={config.border === 'dashed' ? '10 6' : undefined} />
          {config.border === 'double' && (
            <circle cx={c} cy={c} r={outerBorderR - 10} fill="none" stroke="#000" strokeWidth={2} />
          )}
          {config.showInnerRing && (
            <circle cx={c} cy={c} r={config.innerRadius + 14} fill="none" stroke="#000" strokeWidth={1.5} />
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

  const centerY = config.shape === 'triangle' ? 200 : c;
  const centerLinesCount = 1 + (config.centerSub ? 1 : 0) + (config.centerSub2 ? 1 : 0);
  const lineH = config.fontSize * 0.95;

  const centerLineY = (idx: number) => {
    // idx: 0 = centerText, 1 = centerSub, 2 = centerSub2
    if (centerLinesCount === 1) return centerY;
    if (centerLinesCount === 2) return centerY + (idx === 0 ? -lineH / 2 : lineH / 2);
    return centerY + (idx - 1) * lineH;
  };

  const symbolR = config.outerRadius + (outerBorderR - config.outerRadius) / 2 + 4;

  return (
    <svg
      viewBox="0 0 320 320"
      width={size}
      height={size}
      className="mx-auto max-w-full"
      style={{ background: '#fff', borderRadius: 12 }}
    >
      {borderEls()}

      {config.shape === 'circle' && (
        <>
          {renderArcText(config.topText, 'top', config.outerRadius)}
          {renderArcText(config.bottomText, 'bottom', config.outerRadius)}
          {renderArcText(config.innerTopText, 'top', config.innerRadius)}
          {renderArcText(config.innerBottomText, 'bottom', config.innerRadius)}
          {config.symbol !== 'none' && (
            <>
              <text x={c - symbolR} y={c + 6} fontSize={20} textAnchor="middle" fill="#000">{SYMBOLS[config.symbol]}</text>
              <text x={c + symbolR} y={c + 6} fontSize={20} textAnchor="middle" fill="#000">{SYMBOLS[config.symbol]}</text>
            </>
          )}
        </>
      )}

      {config.centerText && (
        <text
          x={c}
          y={centerLineY(0)}
          fontSize={config.fontSize + 2}
          fontFamily={config.font}
          fontWeight={700}
          fill="#000"
          textAnchor="middle"
          dominantBaseline="central"
          letterSpacing={config.letterSpacing / 3}
        >
          {config.centerText}
        </text>
      )}
      {config.centerSub && (
        <text
          x={c}
          y={centerLineY(1)}
          fontSize={config.fontSize + 1}
          fontFamily={config.font}
          fontWeight={600}
          fill="#000"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {config.centerSub}
        </text>
      )}
      {config.centerSub2 && (
        <text
          x={c}
          y={centerLineY(2)}
          fontSize={config.fontSize + 1}
          fontFamily={config.font}
          fontWeight={600}
          fill="#000"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {config.centerSub2}
        </text>
      )}
    </svg>
  );
};

export default StampPreview;
