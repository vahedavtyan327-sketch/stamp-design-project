import { useState } from 'react';
import StampPreview, { StampConfig } from './StampPreview';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const base: StampConfig = {
  shape: 'circle', size: 40, topText: '', bottomText: '', innerTopText: '', innerBottomText: '', centerText: '', centerSub: '',
  fontSize: 14, letterSpacing: 2, outerRadius: 130, innerRadius: 95, border: 'single', symbol: 'star', font: 'Golos Text',
};

const TEMPLATES: Record<string, StampConfig[]> = {
  'ИП': [
    { ...base, symbol: 'none', topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ · ОГРНИП 115774000000', bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА · ИНН 7745550000', centerText: 'НОСОВ', centerSub: 'ИЛЬЯ ОЛЕГОВИЧ' },
    { ...base, symbol: 'none', topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ · ИНН 770000000000', bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ · ОГРНИП 000000000000', centerText: 'ПЕТРОВ', centerSub: 'ПАВЕЛ ПАВЛОВИЧ' },
  ],
  'ООО': [
    { ...base, topText: 'ОГРН 00001234567890 · ИНН 01234567890', bottomText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ ГОРОД МОСКВА · ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', centerText: 'НАЗВАНИЕ', centerSub: 'КОМПАНИИ' },
    { ...base, topText: 'ОГРН 5127746000000 · ИНН 7700000000', bottomText: 'ГОРОД МОСКВА · ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', centerText: 'АЛЬФА', centerSub: 'ТРЕЙД', border: 'double' },
  ],
  'Врачи': [
    { ...base, border: 'double', topText: 'ХМАРЕНКО', bottomText: 'АНТОН НИКОЛАЕВИЧ', centerText: 'ВРАЧ', centerSub: 'стоматолог' },
    { ...base, border: 'double', symbol: 'dot', topText: 'КОЗЛОВА', bottomText: 'МАРИЯ ИГОРЕВНА', centerText: 'ВРАЧ', centerSub: 'кардиолог' },
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