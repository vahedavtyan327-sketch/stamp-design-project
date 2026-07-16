import { useMemo, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  { id: 'trodat-printy-4642', name: 'Trodat Printy 4642', shape: 'circle', price: 690, sizes: [30, 35, 38, 40, 42, 45, 50] },
  { id: 'colop-r40', name: 'Colop R40', shape: 'circle', price: 750, sizes: [30, 35, 38, 40, 42, 45, 50] },
  { id: 'trodat-micro-9342', name: 'Trodat Micro Printy 9342 (карманная)', shape: 'circle', price: 590, sizes: [22] },
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
    label: 'ИП 1',
    config: {
      shape: 'circle',
      topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ',
      bottomText: 'ОГРНИП 000000000000',
      innerTopText: '',
      innerBottomText: '',
      centerText: 'Петров',
      centerSub: 'Олег',
      centerSub2: 'Иванович',
      symbol: 'star',
      symbolRing: 'outer',
      symbolAngle: 90,
      symbolMirror: true,
      border: 'single',
      showInnerRing: false,
      showCenterRing: false,
    },
  },
  ip_photo2: {
    label: 'ИП 2',
    config: {
      shape: 'circle',
      topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ',
      bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА',
      innerTopText: 'ОГРНИП 115774000000',
      innerBottomText: 'ИНН 7745550000',
      centerText: 'Носов',
      centerSub: 'Илья',
      centerSub2: 'Олегович',
      symbol: 'none',
      border: 'single',
      showInnerRing: true,
      showCenterRing: true,
    },
  },
  ip_photo3: {
    label: 'ИП 3',
    config: {
      shape: 'circle',
      topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ',
      bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА',
      innerTopText: 'ОГРНИП 115774000000',
      innerBottomText: 'ИНН 7745550000',
      centerText: 'Петров',
      centerSub: 'Петр',
      centerSub2: 'Андреевич',
      symbol: 'star',
      symbolRing: 'outer',
      symbolAngle: 90,
      symbolMirror: true,
      border: 'single',
      showInnerRing: true,
      showCenterRing: true,
    },
  },
  ooo: {
    label: 'ООО',
    config: {
      shape: 'circle',
      topText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ',
      bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА',
      innerTopText: 'ОГРН 5147746000000',
      innerBottomText: 'ИНН 7700000000',
      centerText: '«РОМАШКА»',
      centerSub: '',
      centerSub2: '',
      symbol: 'star',
      border: 'single',
      showInnerRing: true,
      showCenterRing: true,
    },
  },
  doctor: {
    label: 'Врач',
    config: {
      shape: 'circle',
      topText: 'ВРАЧ-СТОМАТОЛОГ',
      bottomText: 'КЛИНИКА «ЗДОРОВЬЕ»',
      innerTopText: 'ЛИЦЕНЗИЯ ЛО-77-01-000000',
      innerBottomText: '',
      centerText: 'Хмаренко',
      centerSub: 'Антон',
      centerSub2: 'Николаевич',
      symbol: 'star',
      border: 'double',
      showInnerRing: true,
      showCenterRing: true,
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
      centerSub2: '',
      symbol: 'star8',
      border: 'double',
      showInnerRing: true,
      showCenterRing: false,
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
      centerSub2: '',
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
      centerSub2: '',
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
      centerSub2: '',
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
      centerSub2: '',
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
    symbolRing: PRESETS.ip_photo.config.symbolRing ?? 'outer',
    symbolMirror: PRESETS.ip_photo.config.symbolMirror ?? true,
    font: 'Golos Text',
    logo: '',
    logoSize: 60,
  });
  const [osnastka, setOsnastka] = useState(OSNASTKI[0]);
  const [osnastkaSize, setOsnastkaSize] = useState(OSNASTKI[0].sizes[Math.floor(OSNASTKI[0].sizes.length / 2)]);
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('logo', reader.result as string);
    reader.readAsDataURL(file);
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
          <div className="order-1 lg:order-2 grid content-start gap-4 rounded-2xl border border-border/60 bg-card/50 p-6 max-h-[80vh] overflow-y-auto">
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

            <Accordion type="multiple" defaultValue={['osnastka', 'text']} className="grid gap-1">
              {/* osnastka */}
              <AccordionItem value="osnastka" className="border-border/60">
                <AccordionTrigger className="py-2.5 text-xs uppercase tracking-wide text-muted-foreground hover:no-underline">
                  Оснастка и размер
                </AccordionTrigger>
                <AccordionContent className="grid gap-3 pt-1">
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
                </AccordionContent>
              </AccordionItem>

              {/* text fields */}
              <AccordionItem value="text" className="border-border/60">
                <AccordionTrigger className="py-2.5 text-xs uppercase tracking-wide text-muted-foreground hover:no-underline">
                  Текст макета
                </AccordionTrigger>
                <AccordionContent className="grid gap-3 pt-1">
                  {config.shape === 'circle' && (
                    <>
                      <TextField label="Внешнее кольцо — верх" value={config.topText} onChange={(v) => set('topText', v)} />
                      <TextField label="Внешнее кольцо — низ" value={config.bottomText} onChange={(v) => set('bottomText', v)} />
                      <TextField label="Внутреннее кольцо — верх" value={config.innerTopText} onChange={(v) => set('innerTopText', v)} />
                      <TextField label="Внутреннее кольцо — низ" value={config.innerBottomText} onChange={(v) => set('innerBottomText', v)} />
                    </>
                  )}
                  <TextField label="Центр — фамилия" value={config.centerText} onChange={(v) => set('centerText', v)} />
                  <TextField label="Центр — имя" value={config.centerSub} onChange={(v) => set('centerSub', v)} />
                  <TextField label="Центр — отчество" value={config.centerSub2} onChange={(v) => set('centerSub2', v)} />
                </AccordionContent>
              </AccordionItem>

              {/* rings visibility + logo */}
              {config.shape === 'circle' && (
                <AccordionItem value="rings" className="border-border/60">
                  <AccordionTrigger className="py-2.5 text-xs uppercase tracking-wide text-muted-foreground hover:no-underline">
                    Овалы и логотип
                  </AccordionTrigger>
                  <AccordionContent className="grid gap-3 pt-1">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => set('showOuterRing', !config.showOuterRing)}
                        className={`rounded-lg border p-2 text-xs transition ${config.showOuterRing ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                      >
                        Внешний овал
                      </button>
                      <button
                        onClick={() => set('showInnerRing', !config.showInnerRing)}
                        className={`rounded-lg border p-2 text-xs transition ${config.showInnerRing ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                      >
                        Внутренний овал
                      </button>
                      <button
                        onClick={() => set('showCenterRing', !config.showCenterRing)}
                        className={`rounded-lg border p-2 text-xs transition ${config.showCenterRing ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                      >
                        Центральный овал
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-border p-2.5 text-center text-xs text-muted-foreground transition hover:border-primary/50">
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        <Icon name="Upload" size={14} className="mr-1 inline" />
                        {config.logo ? 'Заменить изображение' : 'Загрузить логотип/герб'}
                      </label>
                      {config.logo && (
                        <button onClick={() => set('logo', '')} className="text-muted-foreground hover:text-destructive">
                          <Icon name="Trash2" size={16} />
                        </button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* appearance: font, border, symbol */}
              <AccordionItem value="appearance" className="border-border/60">
                <AccordionTrigger className="py-2.5 text-xs uppercase tracking-wide text-muted-foreground hover:no-underline">
                  Шрифт, рамка, символ
                </AccordionTrigger>
                <AccordionContent className="grid gap-4 pt-1">
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
                    <div>
                      <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Кольцо для символа</Label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
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
                      <button
                        onClick={() => set('symbolMirror', !config.symbolMirror)}
                        className={`w-full rounded-lg border p-2 text-xs transition ${config.symbolMirror ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                      >
                        Зеркально с другой стороны
                      </button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* sizes & spacing sliders */}
              <AccordionItem value="sizes" className="border-border/60">
                <AccordionTrigger className="py-2.5 text-xs uppercase tracking-wide text-muted-foreground hover:no-underline">
                  Размеры и интервалы
                </AccordionTrigger>
                <AccordionContent className="grid gap-4 pt-1">
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
                      {config.symbol !== 'none' && (
                        <SliderRow
                          label="Положение символа по кругу"
                          value={config.symbolAngle}
                          min={0}
                          max={359}
                          onChange={(v) => set('symbolAngle', v)}
                          unit="°"
                        />
                      )}
                      {config.logo && (
                        <SliderRow
                          label="Размер логотипа"
                          value={config.logoSize}
                          min={30}
                          max={110}
                          onChange={(v) => set('logoSize', v)}
                          unit="px"
                        />
                      )}
                    </>
                  )}
                  <SliderRow label="Размер оттиска" value={config.size} min={20} max={60} onChange={(v) => set('size', v)} unit="мм" />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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