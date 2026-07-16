import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const NAV = [
  { label: 'Редактор', href: '#editor' },
  { label: 'Оснастки', href: '#catalog' },
  { label: 'Макеты', href: '#templates' },
  { label: 'Галерея', href: '#gallery' },
  { label: 'Услуги', href: '#services' },
  { label: 'Контакты', href: '#contacts' },
];

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <img src={logo} alt="Stampcopy" className="h-9 w-9 rounded-lg" />
          <span className="font-display text-xl font-600 tracking-wide">
            STAMP<span className="text-primary">COPY</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCartClick}
            className="relative border-primary/40 hover:border-primary"
          >
            <Icon name="ShoppingCart" size={18} />
            <span className="hidden sm:inline">Корзина</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-700 text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Button>
          <button
            className="lg:hidden text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            <Icon name={open ? 'X' : 'Menu'} size={24} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border/60 bg-background/95 animate-fade-in">
          <div className="container flex flex-col py-3">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-muted-foreground hover:text-primary"
              >
                {n.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;