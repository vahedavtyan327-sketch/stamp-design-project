import { useState } from 'react';
import StampPreview, { StampConfig } from './StampPreview';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const base: StampConfig = {
  shape: 'circle', size: 40, topText: '', bottomText: '', centerText: '', centerSub: '',
  fontSize: 14, letterSpacing: 2, textRadius: 130, border: 'single', symbol: 'star', font: 'Golos Text',
};

const TEMPLATES: Record<string, StampConfig[]> = {
  'ООО': [
    { ...base, topText: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ', bottomText: 'ГОРОД МОСКВА', centerText: 'РОМАШКА', centerSub: 'ОГРН 1234567890123' },
    { ...base, topText: 'ООО «ТЕХНОЛОГИИ БУДУЩЕГО»', bottomText: 'ИНН 7700000000', centerText: 'ТБ', centerSub: 'г. Санкт-Петербург', border: 'double' },
  ],
  'ИП': [
    { ...base, topText: 'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ', bottomText: 'ОГРНИП 000000000000', centerText: 'ИВАНОВ', centerSub: 'ИВАН ИВАНОВИЧ' },
    { ...base, topText: 'ИП ПЕТРОВ П. П.', bottomText: 'ИНН 770000000000', centerText: 'ПЕТРОВ', centerSub: 'ПАВЕЛ ПАВЛОВИЧ', symbol: 'diamond' },
  ],
  'Врачи': [
    { ...base, topText: 'ВРАЧ-ТЕРАПЕВТ', bottomText: 'ЛИЦЕНЗИЯ ЛО-00-00-000000', centerText: 'ПЕТРОВА', centerSub: 'АННА СЕРГЕЕВНА' },
    { ...base, topText: 'СТОМАТОЛОГ', bottomText: 'КЛИНИКА «ЗДОРОВЬЕ»', centerText: 'СИДОРОВ', centerSub: 'ВРАЧ ВЫСШЕЙ КАТЕГОРИИ', symbol: 'dot' },
  ],
  'Гербовые': [
    { ...base, topText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ', bottomText: 'ГОСУДАРСТВЕННОЕ УЧРЕЖДЕНИЕ', centerText: '⬤', centerSub: 'ОФИЦИАЛЬНАЯ', border: 'double', symbol: 'star8' },
    { ...base, topText: 'НОТАРИУС', bottomText: 'ГОРОД МОСКВА', centerText: 'ГЕРБ', centerSub: 'ЛИЦЕНЗИЯ', border: 'double' },
  ],
  'Треугольные': [
    { ...base, shape: 'triangle', topText: '', bottomText: '', centerText: 'КОНТРОЛЬ', centerSub: 'ОТК №5' },
    { ...base, shape: 'triangle', centerText: 'ОПЛАЧЕНО', centerSub: 'касса №2', border: 'double' },
  ],
  'Квадратные': [
    { ...base, shape: 'square', topText: '', bottomText: '', centerText: 'ДОКУМЕНТЫ', centerSub: 'ПОЛУЧЕНЫ' },
    { ...base, shape: 'square', centerText: 'КОПИЯ', centerSub: 'ВЕРНА', border: 'dashed' },
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
