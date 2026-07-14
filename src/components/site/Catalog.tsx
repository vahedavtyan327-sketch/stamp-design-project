import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import type { CartItem } from './types';

const IMG_ROUND =
  'https://cdn.poehali.dev/projects/7f21717d-d583-4317-a94d-0d54cb052dc7/files/fadb6984-5af3-4d89-bda0-c9d39885ebc1.jpg';
const IMG_SQUARE =
  'https://cdn.poehali.dev/projects/7f21717d-d583-4317-a94d-0d54cb052dc7/files/343cfa29-1279-4800-b43f-3ec44b3579e4.jpg';

const PRODUCTS = [
  { id: 'trodat-46040', name: 'Trodat 46040', desc: 'Круглая автоматическая · Ø40 мм', price: 690, img: IMG_ROUND },
  { id: 'colop-r40', name: 'Colop Printer R40', desc: 'Круглая · Ø40 мм · тихий ход', price: 750, img: IMG_ROUND },
  { id: 'osn-4924', name: 'Оснастка 4924', desc: 'Квадратный штамп · 40×40 мм', price: 820, img: IMG_SQUARE },
  { id: 'osn-triangle', name: 'Треугольная оснастка', desc: 'Штамп-треугольник · 45 мм', price: 890, img: IMG_SQUARE },
  { id: 'trodat-4913', name: 'Trodat 4913', desc: 'Прямоугольный штамп · 58×22 мм', price: 640, img: IMG_SQUARE },
  { id: 'pocket', name: 'Карманная оснастка', desc: 'Складная · Ø40 мм', price: 990, img: IMG_ROUND },
];

const Catalog = ({ onAddToCart }: { onAddToCart: (item: CartItem) => void }) => (
  <section id="catalog" className="py-20">
    <div className="container">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl font-700 tracking-tight md:text-5xl">
            КАТАЛОГ <span className="text-primary">ОСНАСТОК</span>
          </h2>
          <p className="mt-3 text-muted-foreground">Реальные оснастки Trodat и Colop — в наличии</p>
        </div>
        <Button asChild variant="outline" className="border-primary/40">
          <a href="#editor"><Icon name="PenTool" size={18} />Сделать печать</a>
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card/50 hover-scale">
            <div className="aspect-[4/3] overflow-hidden bg-secondary/40">
              <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-600">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-xl font-700 text-primary">{p.price} ₽</span>
                <Button size="sm" onClick={() => onAddToCart({ id: `${p.id}-${Date.now()}`, title: p.name, subtitle: p.desc, price: p.price, qty: 1 })}>
                  <Icon name="Plus" size={16} />В корзину
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Catalog;
