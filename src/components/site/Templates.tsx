import { useState } from 'react';
import StampPreview, { StampConfig } from './StampPreview';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const base: StampConfig = {
  shape: 'circle', size: 40, topText: '', bottomText: '', innerTopText: '', innerBottomText: '', centerText: '', centerSub: '', centerSub2: '',
  fontSize: 14, letterSpacing: 2, outerRadius: 130, innerRadius: 95, centerRadius: 62, ringGap: 14,
  showOuterRing: true, showInnerRing: false, showCenterRing: false, border: 'single', symbol: 'star', symbolAngle: 90, symbolOffset: 0, symbolRing: 'outer', symbolMirror: true, symbol2Angle: 270, symbol2Offset: 0, font: 'Golos Text',
  logo: '', logoSize: 60,
};

const TEMPLATES: Record<string, StampConfig[]> = {
  'ИП': [
    { ...base, symbol: 'star', symbolRing: 'outer', symbolAngle: 90, symbolMirror: true, showInnerRing: false, showCenterRing: false, topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ', bottomText: 'ОГРНИП 000000000000', centerText: 'Петров', centerSub: 'Олег', centerSub2: 'Иванович' },
    { ...base, symbol: 'none', showInnerRing: true, showCenterRing: true, topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ', bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА', innerTopText: 'ОГРНИП 115774000000', innerBottomText: 'ИНН 7745550000', centerText: 'Носов', centerSub: 'Илья', centerSub2: 'Олегович' },
    { ...base, symbol: 'star', symbolRing: 'outer', symbolAngle: 90, symbolMirror: true, showInnerRing: true, showCenterRing: true, topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ', bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА', innerTopText: 'ОГРНИП 115774000000', innerBottomText: 'ИНН 7745550000', centerText: 'Петров', centerSub: 'Петр', centerSub2: 'Андреевич' },
  ],
  'ООО': [
    { ...base, showInnerRing: true, showCenterRing: true, topText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА', innerTopText: 'ОГРН 5147746000000', innerBottomText: 'ИНН 7700000000', centerText: '«РОМАШКА»' },
    { ...base, showInnerRing: true, showCenterRing: true, border: 'double', topText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', bottomText: 'ГОРОД МОСКВА', innerTopText: 'ОГРН 5127746000000', innerBottomText: 'ИНН 7700000000', centerText: '«АЛЬФА ТРЕЙД»' },
  ],
  'Врачи': [
    { ...base, showInnerRing: true, showCenterRing: true, border: 'double', topText: 'ВРАЧ-СТОМАТОЛОГ', bottomText: 'КЛИНИКА «ЗДОРОВЬЕ»', innerTopText: 'ЛИЦЕНЗИЯ ЛО-77-01-000000', centerText: 'Хмаренко', centerSub: 'Антон', centerSub2: 'Николаевич' },
    { ...base, showInnerRing: true, showCenterRing: true, border: 'double', symbol: 'dot', topText: 'ВРАЧ-КАРДИОЛОГ', bottomText: 'КЛИНИКА «ЗДОРОВЬЕ»', innerTopText: 'ЛИЦЕНЗИЯ ЛО-77-01-000001', centerText: 'Козлова', centerSub: 'Мария', centerSub2: 'Игоревна' },
  ],
  'Гербовые': [
    { ...base, topText: 'ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ', bottomText: 'ДЕПАРТАМЕНТ ЗДРАВООХРАНЕНИЯ · ГОРОД МОСКВА', centerText: 'ГЕРБ', centerSub: 'ОФИЦИАЛЬНАЯ', border: 'double', symbol: 'star8' },
    { ...base, topText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ · НОТАРИУС', bottomText: 'ГОРОД МОСКВА', centerText: 'ГЕРБ', centerSub: 'ЛИЦЕНЗИЯ', border: 'double' },
  ],
  'Треугольные': [
    { ...base, shape: 'triangle', topText: '', bottomText: '', centerText: 'ДЛЯ', centerSub: 'СПРАВОК' },
    { ...base, shape: 'triangle', topText: '', bottomText: '', centerText: 'ОТК', centerSub: 'КОНТРОЛЬ', border: 'double' },
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