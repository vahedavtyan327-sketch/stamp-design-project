import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StampPreview, { StampConfig } from './StampPreview';
import type { CartItem } from './types';

interface Osnastka {
  id: string;
  name: string;
  shape: StampConfig['shape'];
  price: number;
  sizes: number[];
}

const OSNASTKI: Osnastka[] = [
  { id: 'trodat-circle', name: 'Trodat 46040', shape: 'circle', price: 690, sizes: [38, 40, 45] },
  { id: 'colop-circle', name: 'Colop R40', shape: 'circle', price: 750, sizes: [38, 40, 45, 50] },
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
  ip: {
    label: 'ИП',
    config: {
      shape: 'circle',
      topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ · ОГРНИП 115774000000',
      bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА · ИНН 7745550000',
      centerText: 'НОСОВ',
      centerSub: 'ИЛЬЯ ОЛЕГОВИЧ',
      symbol: 'none',
      border: 'single',
    },
  },
  ooo: {
    label: 'ООО',
    config: {
      shape: 'circle',
      topText: 'ОГРН 00001234567890 · ИНН 01234567890',
      bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА · ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ',
      centerText: 'НАЗВАНИЕ',
      centerSub: 'КОМПАНИИ',
      symbol: 'star',
      border: 'single',
    },
  },
  doctor: {
    label: 'Врач',
    config: {
      shape: 'circle',
      topText: 'ХМАРЕНКО',
      bottomText: 'АНТОН НИКОЛАЕВИЧ',
      centerText: 'ВРАЧ',
      centerSub: 'стоматолог',
      symbol: 'star',
      border: 'double',
    },
  },
  gerb: {
    label: 'Гос',
    config: {
      shape: 'circle',
      topText: 'ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ',
      bottomText: 'ДЕПАРТАМЕНТ ЗДРАВООХРАНЕНИЯ · ГОРОД МОСКВА',
      innerTopText: 'ЗАРЕГИСТРИРОВАНО В РЕЕСТРЕ',
      innerBottomText: 'ПЕЧАТЕЙ №764754744164',
      centerText: 'ГЕРБ',
      centerSub: 'ОФИЦИАЛЬНАЯ',
      symbol: 'star8',
      border: 'double',
    },
  },
  triangle: {
    label: 'Треуг.',
    config: {
      shape: 'triangle',
      topText: '',
      bottomText: '',
      centerText: 'ДЛЯ',
      centerSub: 'СПРАВОК',
      border: 'single',
    },
  },
  square1: {
    label: 'Квадрат 1',
    config: {
      shape: 'square',
      topText: '',
      bottomText: '',
      centerText: 'КОПИЯ',
      centerSub: 'ВЕРНА',
      border: 'single',
    },
  },
  square2: {
    label: 'Квадрат 2',
    config: {
      shape: 'square',
      topText: '',
      bottomText: '',
      centerText: 'ОПЛАЧЕНО',
      centerSub: '',
      border: 'double',
    },
  },
  square3: {
    label: 'Квадрат 3',
    config: {
      shape: 'square',
      topText: '',
      bottomText: '',
      centerText: 'ДОКУМЕНТЫ',
      centerSub: 'ПОЛУЧЕНЫ',
      border: 'dashed',
    },
  },
};

const PRESET_KEYS = Object.keys(PRESETS);

const cleshePrice = (shape: string) =>
  shape === 'triangle' ? 550 : shape === 'square' ? 500 : 450;

interface EditorProps {
  onAddToCart: (item: CartItem) => void;
}

const Editor = ({ onAddToCart }: EditorProps) => {
  const [config, setConfig] = useState<StampConfig>({
    shape: 'circle',
    size: 40,
    topText: PRESETS.ip.config.topText!,
    bottomText: PRESETS.ip.config.bottomText!,
    innerTopText: '',
    innerBottomText: '',
    centerText: PRESETS.ip.config.centerText!,
    centerSub: PRESETS.ip.config.centerSub!,
    fontSize: 15,
    letterSpacing: 2,
    outerRadius: 130,
    innerRadius: 95,
    border: 'single',
    symbol: 'star',
    font: 'Golos Text',
  });
  const [osnastka, setOsnastka] = useState(OSNASTKI[0]);
  const [osnastkaSize, setOsnastkaSize] = useState(OSNASTKI[0].sizes[1]);
  const [urgent, setUrgent] = useState(false);
  const [readyAt, setReadyAt] = useState('');

  const set = <K extends keyof StampConfig>(k: K, v: StampConfig[K]) =>
    setConfig((p) => ({ ...p, [k]: v }));

  const applyPreset = (key: string) => {
    const preset = PRESETS[key].config;
    setConfig((p) => ({ ...p, ...preset }));
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

  const clashe = cleshePrice(config.shape);
  const osnastkaPrice = osnastka.price + sizePriceAdd(osnastka.sizes[0], osnastkaSize);
  const total = useMemo(() => {
    const base = clashe + osnastkaPrice;
    return urgent ? base * 2 : base;
  }, [clashe, osnastkaPrice, urgent]);

  const handleAdd = () => {
    onAddToCart({
      id: `${Date.now()}`,
      title: `Печать ${config.shape === 'circle' ? 'круглая' : config.shape === 'square' ? 'квадратная' : 'треугольная'} · ${osnastka.name} Ø${osnastkaSize}мм`,
      subtitle: `Клеше + оснастка${urgent ? ' · СРОЧНО' : ''}`,
      price: total,
      qty: 1,
    });
  };

  const OSN_FILTERED = OSNASTKI.filter((o) => o.shape === config.shape);

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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* Preview */}
          <div className="order-2 lg:order-1 rounded-2xl border border-border/60 bg-card/50 p-6 grid content-start gap-6">
            <div className="rounded-xl border border-border/60 bg-[#fff] p-6 flex items-center justify-center">
              <StampPreview config={config} />
            </div>

            {/* Order type + price */}
            <div className="grid gap-3 rounded-xl border border-border/60 bg-secondary/40 p-4">
              <div className="flex items-center gap-2 text-sm font-600">
                <Icon name="Receipt" size={16} className="text-primary" />
                Стоимость и исполнение
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Клеше ({config.shape})</span>
                <span className="text-right">{clashe} ₽</span>
                <span className="text-muted-foreground">Оснастка Ø{osnastkaSize}мм</span>
                <span className="text-right">{osnastkaPrice} ₽</span>
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
                <span className="font-display text-2xl font-700 text-primary">{total} ₽</span>
              </div>
              <Button onClick={handleAdd} className="glow">
                <Icon name="ShoppingCart" size={18} />
                В корзину
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="order-1 lg:order-2 grid content-start gap-5 rounded-2xl border border-border/60 bg-card/50 p-6">
            {/* presets */}
            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Готовый макет по образцу</Label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_KEYS.map((k) => (
                  <Button key={k} variant="outline" size="sm" onClick={() => applyPreset(k)} className="px-1 text-xs">
                    {PRESETS[k].label}
                  </Button>
                ))}
              </div>
            </div>

            {/* shape */}
            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Форма</Label>
              <Tabs value={config.shape} onValueChange={(v) => setShape(v as StampConfig['shape'])}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="circle">Круг</TabsTrigger>
                  <TabsTrigger value="square">Квадрат</TabsTrigger>
                  <TabsTrigger value="triangle">Треугольник</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* osnastka */}
            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Оснастка</Label>
              <div className="grid gap-2">
                {OSN_FILTERED.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => selectOsnastka(o)}
                    className={`flex items-center justify-between rounded-lg border p-2.5 text-sm transition ${osnastka.id === o.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                  >
                    <span>{o.name}</span>
                    <span className="text-primary">{o.price} ₽</span>
                  </button>
                ))}
              </div>
            </div>

            {/* osnastka size */}
            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Размер оснастки</Label>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${osnastka.sizes.length}, minmax(0, 1fr))` }}>
                {osnastka.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setOsnastkaSize(s)}
                    className={`rounded-lg border p-2 text-sm transition ${osnastkaSize === s ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                  >
                    Ø{s} мм
                  </button>
                ))}
              </div>
            </div>

            {/* text fields */}
            <div className="grid gap-3">
              {config.shape === 'circle' && (
                <>
                  <TextField label="Внешнее кольцо — верх" value={config.topText} onChange={(v) => set('topText', v)} />
                  <TextField label="Внешнее кольцо — низ" value={config.bottomText} onChange={(v) => set('bottomText', v)} />
                  <TextField label="Внутреннее кольцо — верх" value={config.innerTopText} onChange={(v) => set('innerTopText', v)} />
                  <TextField label="Внутреннее кольцо — низ" value={config.innerBottomText} onChange={(v) => set('innerBottomText', v)} />
                </>
              )}
              <TextField label="Центр — название / фамилия" value={config.centerText} onChange={(v) => set('centerText', v)} />
              <TextField label="Центр — доп. строка (имя, ОГРН)" value={config.centerSub} onChange={(v) => set('centerSub', v)} />
            </div>

            {/* font */}
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

            {/* sliders */}
            <SliderRow label="Размер шрифта" value={config.fontSize} min={10} max={24} onChange={(v) => set('fontSize', v)} unit="px" />
            <SliderRow label="Интервал между букв" value={config.letterSpacing} min={0} max={10} onChange={(v) => set('letterSpacing', v)} />
            {config.shape === 'circle' && (
              <>
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
              </>
            )}
            <SliderRow label="Размер оттиска" value={config.size} min={20} max={60} onChange={(v) => set('size', v)} unit="мм" />

            {/* border */}
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

            {/* symbol */}
            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Символ по бокам</Label>
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
          </div>
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

const SliderRow = ({ label, value, min, max, onChange, unit }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; unit?: string }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <span className="text-xs font-600 text-primary">{value}{unit || ''}</span>
    </div>
    <Slider value={[value]} min={min} max={max} step={1} onValueChange={([v]) => onChange(v)} />
  </div>
);

export default Editor;