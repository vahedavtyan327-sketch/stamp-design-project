import Icon from '@/components/ui/icon';

const SERVICES = [
  { icon: 'Stamp', title: 'Печати ООО и ИП', desc: 'По ГОСТ и требованиям банков. Круглые, с реквизитами и логотипом.' },
  { icon: 'Stethoscope', title: 'Печати для врачей', desc: 'Именные и для медучреждений с указанием специальности и лицензии.' },
  { icon: 'ShieldCheck', title: 'Гербовые печати', desc: 'Для госучреждений и нотариусов по установленному образцу.' },
  { icon: 'Square', title: 'Штампы', desc: 'Прямоугольные, квадратные, треугольные: «Оплачено», «Копия верна» и др.' },
  { icon: 'Zap', title: 'Срочное изготовление', desc: 'Готовим печать за 15 минут. Стоимость срочного заказа удваивается.' },
  { icon: 'Truck', title: 'Доставка', desc: 'Курьером по городу и доставка по РФ. Или самовывоз из мастерской.' },
];

const Services = () => (
  <section id="services" className="py-20">
    <div className="container">
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-700 tracking-tight md:text-5xl">
          УСЛУГИ И <span className="text-primary">ТИПЫ ПЕЧАТЕЙ</span>
        </h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <div key={s.title} className="rounded-2xl border border-border/60 bg-card/50 p-6 hover-scale">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name={s.icon} size={24} />
            </div>
            <h3 className="font-display text-xl font-600">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
