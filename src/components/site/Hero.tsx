import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/7f21717d-d583-4317-a94d-0d54cb052dc7/files/54139648-358c-4753-8a9c-715202130158.jpg';

const STATS = [
  { value: '15 мин', label: 'срочное изготовление' },
  { value: '12 000+', label: 'печатей сделано' },
  { value: '3 формы', label: 'круг · квадрат · треугольник' },
];

const Hero = () => {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 grid-tech opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

      <div className="container relative py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-500 text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Онлайн-редактор макетов · производство под ключ
            </div>

            <h1 className="font-display text-5xl font-700 leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              ПЕЧАТИ И ШТАМПЫ
              <br />
              <span className="text-primary text-glow">НОВОГО ПОКОЛЕНИЯ</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Соберите макет печати онлайн — ООО, ИП, для врачей или гербовый.
              Настройте шрифт, интервалы, форму и размер. Оформите заказ с доставкой.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="glow">
                <a href="#editor">
                  <Icon name="PenTool" size={18} />
                  Собрать макет
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40">
                <a href="#catalog">
                  <Icon name="LayoutGrid" size={18} />
                  Каталог оснасток
                </a>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-600 text-primary md:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in [animation-delay:200ms]">
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border/60 glow">
              <img
                src={HERO_IMG}
                alt="Оснастки для печатей и штампов"
                className="h-full w-full object-cover animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
