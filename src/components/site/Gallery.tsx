import StampPreview, { StampConfig } from './StampPreview';

const base: StampConfig = {
  shape: 'circle', size: 40, topText: '', bottomText: '', innerTopText: '', innerBottomText: '', centerText: '', centerSub: '', centerSub2: '',
  fontSize: 14, letterSpacing: 2, outerRadius: 130, innerRadius: 95, centerRadius: 62, ringGap: 14,
  showOuterRing: true, showInnerRing: false, showCenterRing: false, border: 'single', symbol: 'star', symbolAngle: 90, symbolOffset: 0, symbolRing: 'outer', symbolMirror: true, symbol2Angle: 270, symbol2Offset: 0,
  symbol3: false, symbol3Angle: 0, symbol3Offset: 0, symbol4: false, symbol4Angle: 0, symbol4Offset: 0, symbol5: false, symbol5Angle: 0, symbol5Offset: 0,
  topTextOffset: 0, bottomTextOffset: 0, innerTopTextOffset: 0, innerBottomTextOffset: 0, font: 'Golos Text',
  logo: '', logoSize: 60, logoRotation: 0, logoAngle: 0, logoDistance: 0, logoGap: 10, textMirror: {},
  triangleLeftText: '', triangleRightText: '', triangleBottomText: '',
  barcodeType: 'none', barcodeValue: '', barcodeSize: 44, barcodeAngle: 0, barcodeDistance: 0,
};

const SAMPLES: StampConfig[] = [
  { ...base, showInnerRing: true, symbolMirror: true, topText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА', innerTopText: 'ИНН 0123456789', innerBottomText: 'ОГРН 0001123456789', centerText: 'НАЗВАНИЕ', centerSub: 'КОМПАНИИ' },
  { ...base, showInnerRing: true, symbol: 'star', symbolMirror: true, topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ', bottomText: 'ОГРНИП 0000123456789', innerBottomText: 'ИНН 0001234567889 · РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА', centerText: 'Смирнов', centerSub: 'Алексей', centerSub2: 'Викторович' },
  { ...base, symbol: 'star', symbolAngle: 180, symbolMirror: false, topText: 'Козлова Мария Игоревна', centerText: 'ВРАЧ' },
  { ...base, shape: 'triangle', border: 'double', triangleLeftText: 'ЛИЦЕНЗИЯ № ЛО-11-22-000001', triangleRightText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', triangleBottomText: 'ЛИЦЕНЗИЯ № ЛО-11-22-000001', centerText: 'ДЛЯ', centerSub: 'РЕЦЕПТОВ', centerSub2: 'ООО «ВАШЕ НАЗВАНИЕ»' },
  { ...base, shape: 'square', centerText: 'КОПИЯ', centerSub: 'ВЕРНА', border: 'dashed' },
  { ...base, showInnerRing: true, showCenterRing: true, symbol: 'star8', symbolMirror: true, topText: 'ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ', bottomText: 'ДЕПАРТАМЕНТ ЗДРАВООХРАНЕНИЯ · ГОРОД МОСКВА', innerTopText: 'ЗАРЕГИСТРИРОВАНО В РЕЕСТРЕ', innerBottomText: 'ОГРН 0000000000000 · ИНН 0000000000', centerText: 'ГЕРБ', centerSub: 'ОФИЦИАЛЬНАЯ', border: 'double' },
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