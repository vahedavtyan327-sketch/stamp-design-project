import StampPreview, { StampConfig } from './StampPreview';

const base: StampConfig = {
  shape: 'circle', size: 40, topText: '', bottomText: '', innerTopText: '', innerBottomText: '', centerText: '', centerSub: '', centerSub2: '',
  fontSize: 14, letterSpacing: 2, outerRadius: 130, innerRadius: 95, centerRadius: 62, ringGap: 14,
  showOuterRing: true, showInnerRing: false, showCenterRing: false, border: 'single', symbol: 'star', symbolAngle: 90, symbolOffset: 0, symbolRing: 'outer', symbolMirror: true, symbol2Angle: 270, symbol2Offset: 0, font: 'Golos Text',
  logo: '', logoSize: 60,
};

const SAMPLES: StampConfig[] = [
  { ...base, showInnerRing: true, showCenterRing: true, topText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', bottomText: 'ГОРОД МОСКВА', innerTopText: 'ОГРН 5127746000000', innerBottomText: 'ИНН 7700000000', centerText: '«АЛЬФА ТРЕЙД»' },
  { ...base, showInnerRing: false, showCenterRing: false, symbol: 'star', topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ', bottomText: 'ОГРНИП 770000000000', centerText: 'Смирнов', centerSub: 'Алексей', centerSub2: 'Викторович' },
  { ...base, showInnerRing: true, showCenterRing: true, border: 'double', symbol: 'dot', topText: 'ВРАЧ-КАРДИОЛОГ', bottomText: 'КЛИНИКА «ЗДОРОВЬЕ»', innerTopText: 'ЛИЦЕНЗИЯ ЛО-77', centerText: 'Козлова', centerSub: 'Мария', centerSub2: 'Игоревна' },
  { ...base, shape: 'triangle', centerText: 'ОПЛАЧЕНО', centerSub: 'касса №2' },
  { ...base, shape: 'square', centerText: 'КОПИЯ', centerSub: 'ВЕРНА', border: 'dashed' },
  { ...base, topText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ', bottomText: 'ГОС. УЧРЕЖДЕНИЕ', centerText: 'ГЕРБ', centerSub: 'ОФИЦИАЛЬНО', border: 'double', symbol: 'star8' },
];

const Gallery = () => (
  <section id="gallery" className="py-20">
    <div className="container">
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-700 tracking-tight md:text-5xl">
          ГАЛЕРЕЯ <span className="text-primary">ПРИМЕРОВ</span>
        </h2>
        <p className="mt-3 text-muted-foreground">Так выглядят готовые макеты наших клиентов</p>
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {SAMPLES.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border/60 bg-white p-3 hover-scale animate-fade-in">
            <StampPreview config={s} size={140} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Gallery;