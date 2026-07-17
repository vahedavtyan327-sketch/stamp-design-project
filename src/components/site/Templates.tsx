import { useState } from 'react';
import StampPreview, { StampConfig } from './StampPreview';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

const TEMPLATES: Record<string, StampConfig[]> = {
  'ИП': [
    { ...base, symbol: 'star', symbolRing: 'outer', symbolAngle: 90, symbolMirror: true, showInnerRing: true, showCenterRing: false, topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ', bottomText: 'ОГРНИП 0000123456789', innerBottomText: 'ИНН 0001234567889 · РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА', centerText: 'Петров', centerSub: 'Олег', centerSub2: 'Иванович' },
    { ...base, symbol: 'none', showInnerRing: true, showCenterRing: true, topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ', bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА', innerTopText: 'ОГРНИП 115774000000', innerBottomText: 'ИНН 7745550000', centerText: 'Носов', centerSub: 'Илья', centerSub2: 'Олегович' },
    { ...base, symbol: 'star', symbolRing: 'outer', symbolAngle: 90, symbolMirror: true, showInnerRing: true, showCenterRing: true, topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ', bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА', innerTopText: 'ОГРНИП 115774000000', innerBottomText: 'ИНН 7745550000', centerText: 'Петров', centerSub: 'Петр', centerSub2: 'Андреевич' },
  ],
  'ООО': [
    { ...base, showInnerRing: true, symbolMirror: true, topText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА', innerTopText: 'ИНН 0123456789', innerBottomText: 'ОГРН 0001123456789', centerText: 'НАЗВАНИЕ', centerSub: 'КОМПАНИИ' },
    { ...base, showInnerRing: true, showCenterRing: true, border: 'double', topText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', bottomText: 'ГОРОД МОСКВА', innerTopText: 'ОГРН 5127746000000', innerBottomText: 'ИНН 7700000000', centerText: '«АЛЬФА ТРЕЙД»' },
  ],
  'Врачи': [
    { ...base, symbol: 'star', symbolAngle: 180, symbolMirror: false, topText: 'Хмаренко Антон Николаевич', centerText: 'ВРАЧ' },
    { ...base, symbol: 'star', symbolAngle: 180, symbolMirror: false, topText: 'Козлова Мария Игоревна', centerText: 'ВРАЧ' },
  ],
  'Гербовые': [
    { ...base, showInnerRing: true, showCenterRing: true, symbol: 'star8', symbolMirror: true, topText: 'ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ', bottomText: 'ДЕПАРТАМЕНТ ЗДРАВООХРАНЕНИЯ · ГОРОД МОСКВА', innerTopText: 'ЗАРЕГИСТРИРОВАНО В РЕЕСТРЕ', innerBottomText: 'ОГРН 0000000000000 · ИНН 0000000000', centerText: 'ГЕРБ', centerSub: 'ОФИЦИАЛЬНАЯ', border: 'double' },
    { ...base, showInnerRing: true, showCenterRing: true, symbol: 'star8', symbolMirror: true, topText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ · НОТАРИУС', bottomText: 'ГОРОД МОСКВА', innerTopText: 'ЗАРЕГИСТРИРОВАНО В РЕЕСТРЕ', innerBottomText: 'ЛИЦЕНЗИЯ № 0000000000', centerText: 'ГЕРБ', centerSub: 'ЛИЦЕНЗИЯ', border: 'double' },
  ],
  'Треугольные': [
    { ...base, shape: 'triangle', border: 'double', triangleLeftText: 'ЛИЦЕНЗИЯ № ЛО-11-22-000001', triangleRightText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', triangleBottomText: 'ЛИЦЕНЗИЯ № ЛО-11-22-000001', centerText: 'ДЛЯ', centerSub: 'РЕЦЕПТОВ', centerSub2: 'ООО «ВАШЕ НАЗВАНИЕ»' },
    { ...base, shape: 'triangle', triangleLeftText: 'ДЛЯ СЛУЖЕБНЫХ ОТМЕТОК', triangleRightText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', triangleBottomText: 'ОТДЕЛ КАДРОВ', centerText: 'ОТК', centerSub: 'КОНТРОЛЬ', border: 'double' },
  ],
  'Квадратные': [
    { ...base, shape: 'square', topText: '', bottomText: '', centerText: 'КОПИЯ', centerSub: 'ВЕРНА' },
    { ...base, shape: 'square', topText: '', bottomText: '', centerText: 'ОПЛАЧЕНО', centerSub: '', border: 'double' },
    { ...base, shape: 'square', topText: '', bottomText: '', centerText: 'ДОКУМЕНТЫ', centerSub: 'ПОЛУЧЕНЫ', border: 'dashed' },
  ],
};

const TABS = Object.keys(TEMPLATES);

const Templates = () => {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <section id="templates" className="py-20">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="font-display text-4xl font-700 tracking-tight md:text-5xl">
            ГОТОВЫЕ <span className="text-primary">МАКЕТЫ</span>
          </h2>
          <p className="mt-3 text-muted-foreground">Выберите основу — доработаете детали в редакторе</p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-4 py-2 text-sm font-500 transition ${tab === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES[tab].map((cfg, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card/50 p-5 text-center hover-scale animate-fade-in">
              <div className="mx-auto mb-4 w-fit rounded-xl bg-white p-3">
                <StampPreview config={cfg} size={180} />
              </div>
              <Button asChild variant="outline" size="sm" className="border-primary/40 w-full">
                <a href="#editor"><Icon name="PenTool" size={16} />Открыть в редакторе</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Templates;