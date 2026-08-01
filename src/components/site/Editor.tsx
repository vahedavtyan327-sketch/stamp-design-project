import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { recognizeStamp } from '@/lib/api';
import StampPreview, { StampConfig, EditableField } from './StampPreview';
import type { CartItem } from './types';

interface Osnastka {
  id: string;
  name: string;
  shape: StampConfig['shape'];
  price: number;
  sizes: number[];
}

const OSNASTKI: Osnastka[] = [
  { id: 'trodat-printy-4642', name: 'Trodat Printy 4642', shape: 'circle', price: 690, sizes: [30, 35, 38, 40, 42, 45, 50] },
  { id: 'colop-r40', name: 'Colop R40', shape: 'circle', price: 750, sizes: [30, 35, 38, 40] },
  { id: 'trodat-micro-9342', name: 'Trodat Micro Printy 9342 (карманная)', shape: 'circle', price: 590, sizes: [22, 30, 35, 38, 40] },
  { id: 'square-holder', name: 'Оснастка 4924', shape: 'square', price: 820, sizes: [38, 40, 45] },
  { id: 'triangle-holder', name: 'Треугольная оснастка', shape: 'triangle', price: 890, sizes: [40, 45, 50] },
];

const sizePriceAdd = (base: number, size: number) => Math.round((size - base) * 12);

const FONTS = ['Golos Text', 'Oswald', 'Times New Roman', 'Georgia', 'Arial'];

interface PresetDef {
  label: string;
  config: Partial<StampConfig>;
}

const PRESETS: Record<string, PresetDef> = {
  ip_photo: {
    label: 'ИП',
    config: {
      shape: 'circle',
      topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ',
      bottomText: 'ОГРНИП 0000123456789',
      innerTopText: '',
      innerBottomText: 'ИНН 0001234567889 · РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА',
      centerText: 'Фамилия',
      centerSub: 'Имя',
      centerSub2: 'Отчество',
      symbol: 'star',
      symbolRing: 'outer',
      symbolAngle: 90,
      symbolMirror: true,
      border: 'single',
      showInnerRing: true,
      showCenterRing: false,
    },
  },
  ooo: {
    label: 'ООО',
    config: {
      shape: 'circle',
      topText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ',
      bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА',
      innerTopText: 'ИНН 0123456789',
      innerBottomText: 'ОГРН 0001123456789',
      centerText: 'НАЗВАНИЕ',
      centerSub: 'КОМПАНИИ',
      centerSub2: '',
      symbol: 'star',
      symbolMirror: true,
      border: 'single',
      showInnerRing: true,
      showCenterRing: false,
    },
  },
  doctor: {
    label: 'Врач',
    config: {
      shape: 'circle',
      topText: 'Иванов Иван Иванович',
      bottomText: '',
      innerTopText: '',
      innerBottomText: '',
      centerText: 'ВРАЧ',
      centerSub: '',
      centerSub2: '',
      symbol: 'star',
      symbolRing: 'outer',
      symbolAngle: 180,
      symbolMirror: false,
      border: 'single',
      showInnerRing: false,
      showCenterRing: false,
    },
  },
  gerb: {
    label: 'Гос',
    config: {
      shape: 'circle',
      topText: 'ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ',
      bottomText: 'ДЕПАРТАМЕНТ ЗДРАВООХРАНЕНИЯ · ГОРОД МОСКВА',
      innerTopText: 'ЗАРЕГИСТРИРОВАНО В РЕЕСТРЕ',
      innerBottomText: 'ОГРН 0000000000000 · ИНН 0000000000',
      centerText: 'ГЕРБ',
      centerSub: 'ОФИЦИАЛЬНАЯ',
      centerSub2: '',
      symbol: 'star8',
      symbolRing: 'outer',
      symbolMirror: true,
      border: 'double',
      showInnerRing: true,
      showCenterRing: true,
    },
  },
  triangle: {
    label: 'Треуг.',
    config: {
      shape: 'triangle',
      topText: '',
      bottomText: '',
      triangleLeftText: 'ЛИЦЕНЗИЯ № ЛО-11-22-000001',
      triangleRightText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ',
      triangleBottomText: 'ЛИЦЕНЗИЯ № ЛО-11-22-000001',
      centerText: 'ДЛЯ',
      centerSub: 'РЕЦЕПТОВ',
      centerSub2: 'ООО «ВАШЕ НАЗВАНИЕ»',
      border: 'double',
    },
  },
};

const PRESET_KEYS = Object.keys(PRESETS);

const cleshePrice = (shape: string) =>
  shape === 'triangle' ? 550 : shape === 'square' ? 500 : 450;

const INITIAL_CONFIG: StampConfig = {
  shape: 'circle',
  size: 40,
  topText: PRESETS.ip_photo.config.topText!,
  bottomText: PRESETS.ip_photo.config.bottomText!,
  innerTopText: PRESETS.ip_photo.config.innerTopText || '',
  innerBottomText: PRESETS.ip_photo.config.innerBottomText || '',
  centerText: PRESETS.ip_photo.config.centerText!,
  centerSub: PRESETS.ip_photo.config.centerSub!,
  centerSub2: PRESETS.ip_photo.config.centerSub2 || '',
  fontSize: 15,
  letterSpacing: 2,
  outerRadius: 130,
  innerRadius: 95,
  centerRadius: 62,
  ringGap: 14,
  showOuterRing: true,
  showInnerRing: PRESETS.ip_photo.config.showInnerRing ?? false,
  showCenterRing: PRESETS.ip_photo.config.showCenterRing ?? false,
  border: 'single',
  symbol: PRESETS.ip_photo.config.symbol ?? 'star',
  symbolAngle: PRESETS.ip_photo.config.symbolAngle ?? 90,
  symbolOffset: 0,
  symbolRing: PRESETS.ip_photo.config.symbolRing ?? 'outer',
  symbolMirror: PRESETS.ip_photo.config.symbolMirror ?? true,
  symbol2Angle: ((PRESETS.ip_photo.config.symbolAngle ?? 90) + 180) % 360,
  symbol2Offset: 0,
  symbol3: false,
  symbol3Angle: 45,
  symbol3Offset: 0,
  symbol4: false,
  symbol4Angle: 135,
  symbol4Offset: 0,
  symbol5: false,
  symbol5Angle: 225,
  symbol5Offset: 0,
  topTextOffset: 0,
  bottomTextOffset: 0,
  innerTopTextOffset: 0,
  innerBottomTextOffset: 0,
  font: 'Golos Text',
  logo: '',
  logoSize: 60,
  logoRotation: 0,
  logoAngle: 0,
  logoDistance: 0,
  logoGap: 10,
  textMirror: {},
  triangleLeftText: '',
  triangleRightText: '',
  triangleBottomText: '',
  barcodeType: 'none',
  barcodeValue: '',
  barcodeSize: 44,
  barcodeAngle: 0,
  barcodeDistance: 0,
};

const LAYER_DEFS = [
  { key: 'name', label: 'Фамилия / Имя / Отчество', fields: ['centerText', 'centerSub', 'centerSub2'] as const, shapes: ['circle', 'square', 'triangle'] as const },
  { key: 'top', label: 'Внешнее кольцо — верх', fields: ['topText'] as const, shapes: ['circle'] as const },
  { key: 'bottom', label: 'Внешнее кольцо — низ', fields: ['bottomText'] as const, shapes: ['circle'] as const },
  { key: 'innerTop', label: 'Внутреннее кольцо — верх', fields: ['innerTopText'] as const, shapes: ['circle'] as const },
  { key: 'innerBottom', label: 'Внутреннее кольцо — низ', fields: ['innerBottomText'] as const, shapes: ['circle'] as const },
  { key: 'triLeft', label: 'Левая грань', fields: ['triangleLeftText'] as const, shapes: ['triangle'] as const },
  { key: 'triRight', label: 'Правая грань', fields: ['triangleRightText'] as const, shapes: ['triangle'] as const },
  { key: 'triBottom', label: 'Нижняя грань', fields: ['triangleBottomText'] as const, shapes: ['triangle'] as const },
] as const;

const FIELD_LABELS: Record<string, string> = {
  centerText: 'Фамилия',
  centerSub: 'Имя',
  centerSub2: 'Отчество',
  topText: 'Текст',
  bottomText: 'Текст',
  innerTopText: 'Текст',
  innerBottomText: 'Текст',
  triangleLeftText: 'Текст',
  triangleRightText: 'Текст',
  triangleBottomText: 'Текст',
};

interface EditorProps {
  onAddToCart: (item: CartItem) => void;
}

const Editor = ({ onAddToCart }: EditorProps) => {
  const [config, setConfig] = useState<StampConfig>(INITIAL_CONFIG);
  const [history, setHistory] = useState<StampConfig[]>([INITIAL_CONFIG]);
  const [histIndex, setHistIndex] = useState(0);
  const [step, setStep] = useState<'design' | 'order'>('design');
  const [rightTab, setRightTab] = useState<'text' | 'shape' | 'symbols' | 'logo' | 'barcode'>('text');
  const [zoom, setZoom] = useState(100);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<string | null>('name');

  const [osnastka, setOsnastka] = useState(OSNASTKI[0]);
  const [osnastkaSize, setOsnastkaSize] = useState(OSNASTKI[0].sizes[Math.floor(OSNASTKI[0].sizes.length / 2)]);
  const [urgent, setUrgent] = useState(false);
  const [readyAt, setReadyAt] = useState('');
  const [kit, setKit] = useState<'both' | 'cleshe' | 'osnastka'>('both');
  const [recognizing, setRecognizing] = useState(false);

  const applyChange = (updater: (prev: StampConfig) => StampConfig) => {
    setConfig((prev) => {
      const next = updater(prev);
      setHistory((h) => [...h.slice(0, histIndex + 1), next]);
      setHistIndex((i) => i + 1);
      return next;
    });
  };

  const set = <K extends keyof StampConfig>(k: K, v: StampConfig[K]) =>
    applyChange((p) => ({ ...p, [k]: v }));

  const undo = () => {
    if (histIndex <= 0) return;
    const nextIndex = histIndex - 1;
    setHistIndex(nextIndex);
    setConfig(history[nextIndex]);
  };

  const redo = () => {
    if (histIndex >= history.length - 1) return;
    const nextIndex = histIndex + 1;
    setHistIndex(nextIndex);
    setConfig(history[nextIndex]);
  };

  const applyPreset = (key: string) => {
    const preset = PRESETS[key].config;
    applyChange((p) => ({ ...p, ...preset }));
    if (preset.shape) {
      const match = OSNASTKI.find((o) => o.shape === preset.shape);
      if (match) {
        setOsnastka(match);
        setOsnastkaSize(match.sizes[Math.floor(match.sizes.length / 2)]);
      }
    }
  };

  const setShape = (shape: StampConfig['shape']) => {
    set('shape', shape);
    const match = OSNASTKI.find((o) => o.shape === shape);
    if (match) {
      setOsnastka(match);
      setOsnastkaSize(match.sizes[Math.floor(match.sizes.length / 2)]);
    }
  };

  const selectOsnastka = (o: Osnastka) => {
    setOsnastka(o);
    setOsnastkaSize(o.sizes[Math.floor(o.sizes.length / 2)]);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('logo', reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: 'Файл слишком большой', description: 'Загрузите изображение до 8 МБ.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setRecognizing(true);
      try {
        const r = await recognizeStamp(dataUrl);
        applyChange((p) => ({
          ...p,
          shape: r.shape,
          topText: r.topText,
          bottomText: r.bottomText,
          innerTopText: r.innerTopText,
          innerBottomText: r.innerBottomText,
          centerText: r.centerText,
          centerSub: r.centerSub,
          centerSub2: r.centerSub2,
          showInnerRing: r.showInnerRing,
          showCenterRing: r.showCenterRing,
          symbol: r.symbol,
          border: r.border,
        }));
        const match = OSNASTKI.find((o) => o.shape === r.shape);
        if (match) {
          setOsnastka(match);
          setOsnastkaSize(match.sizes[Math.floor(match.sizes.length / 2)]);
        }
        toast({ title: 'Оттиск распознан!', description: 'Проверьте и поправьте текст макета ниже.' });
      } catch (err) {
        toast({
          title: 'Не удалось распознать',
          description: err instanceof Error ? err.message : 'Попробуйте другое фото поближе и почётче.',
          variant: 'destructive',
        });
      } finally {
        setRecognizing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const clashe = cleshePrice(config.shape);
  const osnastkaPrice = osnastka.price + sizePriceAdd(osnastka.sizes[0], osnastkaSize);
  const includeCleshe = kit !== 'osnastka';
  const includeOsnastka = kit !== 'cleshe';
  const total = (includeCleshe ? clashe : 0) + (includeOsnastka ? osnastkaPrice : 0);
  const finalTotal = urgent ? total * 2 : total;

  const kitLabel = kit === 'both' ? 'Клеше + оснастка' : kit === 'cleshe' ? 'Только клеше' : 'Только оснастка';

  const handleAdd = () => {
    const shapeName = config.shape === 'circle' ? 'круглая' : config.shape === 'square' ? 'квадратная' : 'треугольная';
    const title =
      kit === 'osnastka'
        ? `Оснастка ${osnastka.name} Ø${osnastkaSize}мм`
        : `Печать ${shapeName}${kit === 'both' ? ` · ${osnastka.name} Ø${osnastkaSize}мм` : ''}`;
    onAddToCart({
      id: `${Date.now()}`,
      title,
      subtitle: `${kitLabel}${urgent ? ' · СРОЧНО' : ''}`,
      price: finalTotal,
      qty: 1,
    });
    toast({ title: 'Добавлено в корзину!', description: 'Оформите заказ в корзине справа сверху.' });
  };

  const OSN_FILTERED = OSNASTKI.filter((o) => o.shape === config.shape);
  const previewSize = Math.round(320 * (zoom / 100));

  const layerPreview = (fields: readonly string[]) => {
    const text = fields
      .map((f) => (config as unknown as Record<string, string>)[f])
      .filter(Boolean)
      .join(' / ');
    return text || '—';
  };

  return (
    <section id="editor" className="relative py-20">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-700 tracking-tight md:text-5xl">
            ОНЛАЙН-РЕДАКТОР <span className="text-primary">МАКЕТА</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Настройте печать под себя — форма, размер, шрифт, интервалы и рамка
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
          {/* Top bar: tabs + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setStep('design')}
                className={`border-b-2 pb-1 text-sm font-500 transition ${step === 'design' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Редактировать дизайн
              </button>
              <button
                onClick={() => setStep('order')}
                className={`border-b-2 pb-1 text-sm font-500 transition ${step === 'order' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Проверить и заказать
              </button>
            </div>
            <div className="flex items-center gap-2">
              {step === 'design' ? (
                <Button size="sm" className="glow" onClick={() => setStep('order')}>
                  Далее
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={() => setStep('design')}>
                    Внести изменения
                  </Button>
                  <Button size="sm" className="glow" onClick={handleAdd}>
                    Завершить
                  </Button>
                </>
              )}
            </div>
          </div>

          {step === 'design' ? (
            <>
              {/* History toolbar */}
              <div className="flex items-center gap-1 border-b border-border/60 px-4 py-2">
                <button
                  title="История"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  onClick={() => {
                    setHistIndex(0);
                    setConfig(history[0]);
                  }}
                >
                  <Icon name="History" size={16} />
                </button>
                <div className="mx-1 h-4 w-px bg-border" />
                <button
                  title="Отменить"
                  disabled={histIndex <= 0}
                  onClick={undo}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Icon name="Undo2" size={16} />
                </button>
                <button
                  title="Повторить"
                  disabled={histIndex >= history.length - 1}
                  onClick={redo}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Icon name="Redo2" size={16} />
                </button>
              </div>

              {/* AI upload + presets strip */}
              <div className="grid gap-3 border-b border-border/60 p-4 sm:grid-cols-2 px-4">
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-600 text-primary">
                    <Icon name="Sparkles" size={14} />
                    Распознать по фото оттиска
                  </div>
                  <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 p-2.5 text-center text-xs transition hover:border-primary ${recognizing ? 'pointer-events-none opacity-70' : ''}`}>
                    <input type="file" accept="image/*" className="hidden" onChange={handleStampUpload} disabled={recognizing} />
                    <Icon name={recognizing ? 'Loader2' : 'Upload'} size={14} className={recognizing ? 'animate-spin' : ''} />
                    {recognizing ? 'Распознаём оттиск…' : 'Загрузить оттиск — ИИ соберёт макет'}
                  </label>
                </div>
                <div>
                  <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Готовый макет по образцу</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_KEYS.map((k) => (
                      <Button key={k} variant="outline" size="sm" onClick={() => applyPreset(k)} className="px-1 text-xs">
                        {PRESETS[k].label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main 3-column layout */}
              <div className="grid lg:grid-cols-[220px_1fr_380px]">
                {/* Layers panel */}
                <div className="border-b border-border/60 p-3 lg:border-b-0 lg:border-r py-0 px-0 mx-0">
                  <div className="mb-2 px-1 text-xs uppercase tracking-wide text-muted-foreground">Слои</div>
                  <div className="grid gap-1 py-100 my-0 rounded-sm px-0 mx-0">
                    {LAYER_DEFS.filter((l) => (l.shapes as readonly string[]).includes(config.shape)).map((layer) => (
                      <div key={layer.key}>
                        <button
                          onClick={() => setSelectedLayer((cur) => (cur === layer.key ? null : layer.key))}
                          className={`flex w-full items-center gap-2 rounded-lg p-2 text-left text-xs transition ${selectedLayer === layer.key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary/50'}`}
                        >
                          <Icon name="GripVertical" size={13} className="shrink-0 opacity-50" />
                          <Icon name="Type" size={13} className="shrink-0" />
                          <span className="flex-1 truncate">
                            <span className="block text-[11px] opacity-70">{layer.label}</span>
                            <span className="block truncate font-500">{layerPreview(layer.fields)}</span>
                          </span>
                        </button>
                        {selectedLayer === layer.key && (
                          <div className="grid gap-2 bg-secondary/30 p-2 pt-1 animate-fade-in rounded-sm px-0 mx-0">
                            {layer.fields.map((f) => (
                              <TextField
                                key={f}
                                label={FIELD_LABELS[f] || f}
                                value={config[f] as string}
                                onChange={(v) => set(f as keyof StampConfig, v as never)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Canvas */}
                <div className="grid content-between gap-3 p-6">
                  <div className="flex flex-1 items-center justify-center rounded-xl border border-border/60 bg-white p-6">
                    <div style={{ transform: `rotate(${rotateDeg}deg)`, transition: 'transform 0.3s' }}>
                      <StampPreview
                        config={config}
                        size={previewSize}
                        onTextChange={(field, value) => set(field, value)}
                        onSymbolChange={(which, change) => {
                          const map: Record<string, [keyof StampConfig, keyof StampConfig]> = {
                            main: ['symbolAngle', 'symbolOffset'],
                            mirror: ['symbol2Angle', 'symbol2Offset'],
                            s3: ['symbol3Angle', 'symbol3Offset'],
                            s4: ['symbol4Angle', 'symbol4Offset'],
                            s5: ['symbol5Angle', 'symbol5Offset'],
                          };
                          const [angleKey, offsetKey] = map[which];
                          applyChange((p) => ({
                            ...p,
                            [angleKey]: ((change.angle % 360) + 360) % 360,
                            [offsetKey]: change.offset,
                          }));
                        }}
                        onLogoChange={(change) => {
                          applyChange((p) => ({
                            ...p,
                            logoAngle: ((change.angle % 360) + 360) % 360,
                            logoDistance: change.distance,
                          }));
                        }}
                        onMirrorToggle={(field: EditableField, axis) => {
                          applyChange((p) => {
                            const current = p.textMirror?.[field] || {};
                            return {
                              ...p,
                              textMirror: {
                                ...p.textMirror,
                                [field]: { ...current, [axis]: !current[axis] },
                              },
                            };
                          });
                        }}
                        onBarcodeChange={(change) => {
                          applyChange((p) => ({
                            ...p,
                            barcodeAngle: ((change.angle % 360) + 360) % 360,
                            barcodeDistance: change.distance,
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    Кликните по тексту, чтобы выделить его — появятся иконки редактирования, отражения и удаления. Символы и логотип можно перетаскивать мышкой.
                  </p>

                  {/* bottom toolbar: rotate + zoom */}
                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <button
                      onClick={() => setRotateDeg((d) => (d + 90) % 360)}
                      className="text-sm text-primary hover:underline"
                    >
                      Повернуть
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setZoom((z) => Math.max(50, z - 10))}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      >
                        <Icon name="ZoomOut" size={16} />
                      </button>
                      <span className="w-12 text-center text-xs text-muted-foreground">{zoom}%</span>
                      <button
                        onClick={() => setZoom((z) => Math.min(200, z + 10))}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      >
                        <Icon name="ZoomIn" size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setZoom(100);
                          setRotateDeg(0);
                        }}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      >
                        <Icon name="Maximize2" size={16} />
                      </button>
                      <button className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground">
                        <Icon name="Settings2" size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right rail + panel */}
                <div className="flex border-t border-border/60 lg:border-l lg:border-t-0">
                  <div className="grid content-start gap-1 border-r border-border/60 p-2">
                    {([
                      { v: 'text', icon: 'Type', label: 'Текст' },
                      { v: 'shape', icon: 'Shapes', label: 'Фигура' },
                      { v: 'symbols', icon: 'Sparkles', label: 'Символы' },
                      { v: 'logo', icon: 'Image', label: 'Лого' },
                      { v: 'barcode', icon: 'ScanLine', label: 'Штрихкод' },
                    ] as const).map((t) => (
                      <button
                        key={t.v}
                        onClick={() => setRightTab(t.v)}
                        className={`flex flex-col items-center gap-1 rounded-lg p-2.5 text-[10px] transition ${rightTab === t.v ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary/50'}`}
                      >
                        <Icon name={t.icon} size={18} />
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-[70vh] flex-1 overflow-y-auto p-4">
                    {rightTab === 'text' && (
                      <div className="grid gap-4">
                        <div>
                          <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Шрифт</Label>
                          <div className="flex flex-wrap gap-2">
                            {FONTS.map((f) => (
                              <button
                                key={f}
                                onClick={() => set('font', f)}
                                style={{ fontFamily: f }}
                                className={`rounded-lg border px-3 py-1.5 text-sm transition ${config.font === f ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>
                        <SliderRow label="Размер шрифта" value={config.fontSize} min={10} max={24} onChange={(v) => set('fontSize', v)} unit="px" />
                        <SliderRow label="Интервал между букв" value={config.letterSpacing} min={0} max={10} onChange={(v) => set('letterSpacing', v)} />
                        {config.shape === 'circle' && (
                          <>
                            <div className="text-xs font-600 uppercase tracking-wide text-muted-foreground pt-2 border-t border-border/60">
                              Положение текста по кругу
                            </div>
                            {config.topText && (
                              <SliderRow label="Верх — внешнее кольцо" value={config.topTextOffset} min={-180} max={180} onChange={(v) => set('topTextOffset', v)} unit="°" />
                            )}
                            {config.bottomText && (
                              <SliderRow label="Низ — внешнее кольцо" value={config.bottomTextOffset} min={-180} max={180} onChange={(v) => set('bottomTextOffset', v)} unit="°" />
                            )}
                            {config.innerTopText && (
                              <SliderRow label="Верх — внутреннее кольцо" value={config.innerTopTextOffset} min={-180} max={180} onChange={(v) => set('innerTopTextOffset', v)} unit="°" />
                            )}
                            {config.innerBottomText && (
                              <SliderRow label="Низ — внутреннее кольцо" value={config.innerBottomTextOffset} min={-180} max={180} onChange={(v) => set('innerBottomTextOffset', v)} unit="°" />
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {rightTab === 'shape' && (
                      <div className="grid gap-4">
                        <div>
                          <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Форма</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['circle', 'square', 'triangle'] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => setShape(s)}
                                className={`rounded-lg border p-2 text-xs transition ${config.shape === s ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                              >
                                {s === 'circle' ? 'Круг' : s === 'square' ? 'Квадрат' : 'Треугольник'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Оснастка</Label>
                          <div className="grid gap-2">
                            {OSN_FILTERED.map((o) => (
                              <button
                                key={o.id}
                                onClick={() => selectOsnastka(o)}
                                className={`flex items-center justify-between gap-2 rounded-lg border p-2.5 text-sm transition ${osnastka.id === o.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                              >
                                <span className="text-left">{o.name}</span>
                                <span className="shrink-0 text-primary">{o.price} ₽</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Размер оснастки</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {osnastka.sizes.map((s) => (
                              <button
                                key={s}
                                onClick={() => setOsnastkaSize(s)}
                                className={`rounded-lg border p-2 text-sm transition ${osnastkaSize === s ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                              >
                                Ø{s}мм
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Рамка</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {(['single', 'double', 'dashed', 'none'] as const).map((b) => (
                              <button
                                key={b}
                                onClick={() => set('border', b)}
                                className={`rounded-lg border p-2 text-xs transition ${config.border === b ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                              >
                                {b === 'single' ? 'Одна' : b === 'double' ? 'Двойная' : b === 'dashed' ? 'Пунктир' : 'Нет'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {config.shape === 'circle' && (
                          <div>
                            <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Овалы</Label>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <button
                                onClick={() => set('showOuterRing', !config.showOuterRing)}
                                className={`rounded-lg border p-2 text-xs transition ${config.showOuterRing ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                              >
                                Внешний
                              </button>
                              <button
                                onClick={() => set('showInnerRing', !config.showInnerRing)}
                                className={`rounded-lg border p-2 text-xs transition ${config.showInnerRing ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                              >
                                Внутренний
                              </button>
                              <button
                                onClick={() => set('showCenterRing', !config.showCenterRing)}
                                className={`rounded-lg border p-2 text-xs transition ${config.showCenterRing ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                              >
                                Центральный
                              </button>
                            </div>
                            <SliderRow
                              label="Внешнее кольцо — расстояние от края"
                              value={config.outerRadius}
                              min={115}
                              max={145}
                              onChange={(v) => set('outerRadius', Math.max(v, config.innerRadius + 20))}
                              unit="px"
                            />
                            <SliderRow
                              label="Внутреннее кольцо — расстояние от центра"
                              value={config.innerRadius}
                              min={55}
                              max={110}
                              onChange={(v) => set('innerRadius', Math.min(v, config.outerRadius - 20))}
                              unit="px"
                            />
                            <SliderRow
                              label="Интервал между овалами"
                              value={config.ringGap}
                              min={6}
                              max={24}
                              onChange={(v) => set('ringGap', v)}
                              unit="px"
                            />
                            {config.showCenterRing && (
                              <SliderRow
                                label="Центральный овал — радиус"
                                value={config.centerRadius}
                                min={40}
                                max={80}
                                onChange={(v) => set('centerRadius', v)}
                                unit="px"
                              />
                            )}
                          </div>
                        )}

                        <SliderRow label="Размер оттиска" value={config.size} min={20} max={60} onChange={(v) => set('size', v)} unit="мм" />
                      </div>
                    )}

                    {rightTab === 'symbols' && (
                      <div className="grid gap-4">
                        <div>
                          <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Символ-разделитель</Label>
                          <div className="grid grid-cols-5 gap-2">
                            {(['none', 'star', 'star8', 'dot', 'diamond'] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => set('symbol', s)}
                                className={`rounded-lg border p-2 text-lg transition ${config.symbol === s ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                              >
                                {s === 'none' ? '—' : s === 'star' ? '★' : s === 'star8' ? '✷' : s === 'dot' ? '●' : '◆'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {config.shape === 'circle' && config.symbol !== 'none' && (
                          <>
                            <div>
                              <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Кольцо для символов</Label>
                              <div className="grid grid-cols-3 gap-2">
                                {([
                                  { v: 'outer', label: 'Внешнее' },
                                  { v: 'inner', label: 'Внутреннее' },
                                  { v: 'center', label: 'Центральное' },
                                ] as const).map((r) => (
                                  <button
                                    key={r.v}
                                    onClick={() => set('symbolRing', r.v)}
                                    className={`rounded-lg border p-2 text-xs transition ${config.symbolRing === r.v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                                  >
                                    {r.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <SliderRow label="Символ 1 — положение" value={config.symbolAngle} min={0} max={359} onChange={(v) => set('symbolAngle', v)} unit="°" />
                            <SliderRow label="Символ 1 — отступ" value={config.symbolOffset} min={-15} max={15} onChange={(v) => set('symbolOffset', v)} unit="px" />

                            <button
                              onClick={() => {
                                const next = !config.symbolMirror;
                                set('symbolMirror', next);
                                if (next) {
                                  applyChange((p) => ({ ...p, symbol2Angle: (p.symbolAngle + 180) % 360, symbol2Offset: p.symbolOffset }));
                                }
                              }}
                              className={`w-full rounded-lg border p-2 text-xs transition ${config.symbolMirror ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                            >
                              {config.symbolMirror ? '✓ Символ 2 включён' : 'Добавить символ 2'}
                            </button>
                            {config.symbolMirror && (
                              <>
                                <SliderRow label="Символ 2 — положение" value={config.symbol2Angle} min={0} max={359} onChange={(v) => set('symbol2Angle', v)} unit="°" />
                                <SliderRow label="Символ 2 — отступ" value={config.symbol2Offset} min={-15} max={15} onChange={(v) => set('symbol2Offset', v)} unit="px" />
                              </>
                            )}

                            <button
                              onClick={() => set('symbol3', !config.symbol3)}
                              className={`w-full rounded-lg border p-2 text-xs transition ${config.symbol3 ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                            >
                              {config.symbol3 ? '✓ Символ 3 включён' : 'Добавить символ 3'}
                            </button>
                            {config.symbol3 && (
                              <>
                                <SliderRow label="Символ 3 — положение" value={config.symbol3Angle} min={0} max={359} onChange={(v) => set('symbol3Angle', v)} unit="°" />
                                <SliderRow label="Символ 3 — отступ" value={config.symbol3Offset} min={-15} max={15} onChange={(v) => set('symbol3Offset', v)} unit="px" />
                              </>
                            )}

                            <button
                              onClick={() => set('symbol4', !config.symbol4)}
                              className={`w-full rounded-lg border p-2 text-xs transition ${config.symbol4 ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                            >
                              {config.symbol4 ? '✓ Символ 4 включён' : 'Добавить символ 4'}
                            </button>
                            {config.symbol4 && (
                              <>
                                <SliderRow label="Символ 4 — положение" value={config.symbol4Angle} min={0} max={359} onChange={(v) => set('symbol4Angle', v)} unit="°" />
                                <SliderRow label="Символ 4 — отступ" value={config.symbol4Offset} min={-15} max={15} onChange={(v) => set('symbol4Offset', v)} unit="px" />
                              </>
                            )}

                            <button
                              onClick={() => set('symbol5', !config.symbol5)}
                              className={`w-full rounded-lg border p-2 text-xs transition ${config.symbol5 ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                            >
                              {config.symbol5 ? '✓ Символ 5 включён' : 'Добавить символ 5'}
                            </button>
                            {config.symbol5 && (
                              <>
                                <SliderRow label="Символ 5 — положение" value={config.symbol5Angle} min={0} max={359} onChange={(v) => set('symbol5Angle', v)} unit="°" />
                                <SliderRow label="Символ 5 — отступ" value={config.symbol5Offset} min={-15} max={15} onChange={(v) => set('symbol5Offset', v)} unit="px" />
                              </>
                            )}
                            <p className="text-[11px] text-muted-foreground">
                              Символы можно перетаскивать мышкой прямо на макете
                            </p>
                          </>
                        )}
                        {config.shape !== 'circle' && (
                          <p className="text-xs text-muted-foreground">Символы-разделители доступны только для круглой печати</p>
                        )}
                      </div>
                    )}

                    {rightTab === 'logo' && config.shape === 'circle' && (
                      <div className="grid gap-4">
                        <div className="flex items-center gap-3">
                          <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-border p-2.5 text-center text-xs text-muted-foreground transition hover:border-primary/50">
                            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                            <Icon name="Upload" size={14} className="mr-1 inline" />
                            {config.logo ? 'Заменить логотип/герб' : 'Загрузить логотип/герб'}
                          </label>
                          {config.logo && (
                            <button onClick={() => set('logo', '')} className="text-muted-foreground hover:text-destructive">
                              <Icon name="Trash2" size={16} />
                            </button>
                          )}
                        </div>

                        {config.logo && (
                          <>
                            <SliderRow label="Размер" value={config.logoSize} min={30} max={130} onChange={(v) => set('logoSize', v)} unit="px" />
                            <SliderRow label="Интервал до текста" value={config.logoGap} min={0} max={40} onChange={(v) => set('logoGap', v)} unit="px" />
                            <SliderRow label="Поворот" value={config.logoRotation} min={0} max={359} onChange={(v) => set('logoRotation', v)} unit="°" />
                            <SliderRow label="Отступ от центра" value={config.logoDistance} min={0} max={90} onChange={(v) => set('logoDistance', v)} unit="px" />
                            {config.logoDistance > 0 && (
                              <SliderRow label="Положение по кругу" value={config.logoAngle} min={0} max={359} onChange={(v) => set('logoAngle', v)} unit="°" />
                            )}
                            <p className="text-[11px] text-muted-foreground">
                              Логотип можно перетаскивать мышкой прямо на макете
                            </p>
                          </>
                        )}
                      </div>
                    )}
                    {rightTab === 'logo' && config.shape !== 'circle' && (
                      <p className="text-xs text-muted-foreground">Логотип доступен только для круглой печати</p>
                    )}

                    {rightTab === 'barcode' && (
                      <div className="grid gap-4">
                        <div>
                          <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Тип кода</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {([
                              { v: 'none', label: 'Нет' },
                              { v: 'barcode', label: 'Штрихкод' },
                              { v: 'qr', label: 'QR' },
                              { v: 'datamatrix', label: 'Data Matrix' },
                            ] as const).map((b) => (
                              <button
                                key={b.v}
                                onClick={() => set('barcodeType', b.v)}
                                className={`rounded-lg border p-2 text-xs transition ${config.barcodeType === b.v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                              >
                                {b.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {config.barcodeType !== 'none' && (
                          <>
                            <TextField
                              label={config.barcodeType === 'qr' ? 'Ссылка или текст' : 'Значение кода'}
                              value={config.barcodeValue}
                              onChange={(v) => set('barcodeValue', v)}
                            />
                            <SliderRow label="Размер" value={config.barcodeSize} min={24} max={90} onChange={(v) => set('barcodeSize', v)} unit="px" />
                            <SliderRow label="Отступ от центра" value={config.barcodeDistance} min={0} max={110} onChange={(v) => set('barcodeDistance', v)} unit="px" />
                            {config.barcodeDistance > 0 && (
                              <SliderRow label="Положение по кругу" value={config.barcodeAngle} min={0} max={359} onChange={(v) => set('barcodeAngle', v)} unit="°" />
                            )}
                            <p className="text-[11px] text-muted-foreground">
                              Код можно перетаскивать мышкой прямо на макете
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Order review step */
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_380px]">
              <div className="flex items-center justify-center rounded-xl border border-border/60 bg-white p-6">
                <StampPreview config={config} size={340} />
              </div>

              <div className="grid gap-3 rounded-xl border border-border/60 bg-secondary/40 p-4 content-start">
                <div className="flex items-center gap-2 text-sm font-600">
                  <Icon name="Receipt" size={16} className="text-primary" />
                  Стоимость и исполнение
                </div>

                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Что заказываете</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { v: 'both', label: 'Клеше + оснастка' },
                      { v: 'cleshe', label: 'Только клеше' },
                      { v: 'osnastka', label: 'Только оснастка' },
                    ] as const).map((k) => (
                      <button
                        key={k.v}
                        onClick={() => setKit(k.v)}
                        className={`rounded-lg border p-2 text-xs transition ${kit === k.v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                      >
                        {k.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {includeCleshe && (
                    <>
                      <span className="text-muted-foreground">Клеше ({config.shape})</span>
                      <span className="text-right">{clashe} ₽</span>
                    </>
                  )}
                  {includeOsnastka && (
                    <>
                      <span className="text-muted-foreground">Оснастка Ø{osnastkaSize}мм</span>
                      <span className="text-right">{osnastkaPrice} ₽</span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setUrgent(false)}
                    className={`rounded-lg border p-2 text-sm transition ${!urgent ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    Стандартный
                  </button>
                  <button
                    onClick={() => setUrgent(true)}
                    className={`rounded-lg border p-2 text-sm transition ${urgent ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    Срочный ×2
                  </button>
                </div>

                {urgent && (
                  <div className="animate-fade-in">
                    <Label className="text-xs text-muted-foreground">Дата и время готовности</Label>
                    <Input
                      type="datetime-local"
                      value={readyAt}
                      onChange={(e) => setReadyAt(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="text-sm text-muted-foreground">Итого</span>
                  <span className="font-display text-2xl font-700 text-primary">{finalTotal} ₽</span>
                </div>
                <Button onClick={handleAdd} className="glow">
                  <Icon name="ShoppingCart" size={18} />
                  В корзину
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const TextField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <Label className="mb-1.5 block text-xs text-muted-foreground">{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const SliderRow = ({ label, value, min, max, onChange, unit }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; unit?: string }) => {
  const dragState = useRef<{ startY: number; startValue: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { startY: e.clientY, startValue: value };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const deltaY = dragState.current.startY - e.clientY;
    const range = max - min;
    const sensitivity = range / 150;
    const next = Math.round(dragState.current.startValue + deltaY * sensitivity);
    onChange(Math.min(max, Math.max(min, next)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    dragState.current = null;
  };

  return (
    <div>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="mb-1.5 flex cursor-ns-resize select-none items-center justify-between rounded px-1 -mx-1 py-0.5 hover:bg-primary/5 active:bg-primary/10"
        title="Потяните вверх/вниз, чтобы изменить значение"
      >
        <Label className="pointer-events-none text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
        <span className="pointer-events-none text-xs font-600 text-primary">
          {value}{unit || ''}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={1} onValueChange={([v]) => onChange(v)} />
    </div>
  );
};

export default Editor;