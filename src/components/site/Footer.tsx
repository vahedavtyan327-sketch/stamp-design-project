import Icon from '@/components/ui/icon';
import logo from '@/assets/logo.png';

const Footer = () => (
  <footer className="border-t border-border/60 bg-card/30">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Stampcopy" className="h-9 w-9 rounded-lg" />
            <span className="font-display text-xl font-600 tracking-wide">
              STAMP<span className="text-primary">COPY</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Изготовление печатей и штампов с онлайн-редактором макетов.
            Быстро, точно, с доставкой.
          </p>
          <a href="https://t.me/stampcopy" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/40 px-3 py-2 text-sm text-primary transition hover:bg-primary/10">
            <Icon name="Send" size={16} />Telegram
          </a>
        </div>

        <div>
          <h4 className="font-display text-sm font-600 uppercase tracking-wide text-muted-foreground">Разделы</h4>
          <div className="mt-4 grid gap-2 text-sm">
            <a href="#editor" className="text-muted-foreground hover:text-primary">Редактор</a>
            <a href="#catalog" className="text-muted-foreground hover:text-primary">Оснастки</a>
            <a href="#templates" className="text-muted-foreground hover:text-primary">Макеты</a>
            <a href="#gallery" className="text-muted-foreground hover:text-primary">Галерея</a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-600 uppercase tracking-wide text-muted-foreground">Контакты</h4>
          <div className="mt-4 grid gap-2 text-sm">
            <a href="tel:+79000000000" className="text-muted-foreground hover:text-primary">+7 (900) 000-00-00</a>
            <a href="mailto:zakaz@stampcopy.com" className="text-muted-foreground hover:text-primary">zakaz@stampcopy.com</a>
            <span className="text-muted-foreground">г. Москва, град Московский, ул. Радужная, дом 6</span>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-border/60 pt-6">
        <h4 className="font-display text-sm font-600 uppercase tracking-wide text-muted-foreground">Способы оплаты</h4>
        <div className="mt-3 flex flex-wrap gap-3">
          <span className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground">
            <Icon name="Banknote" size={16} className="text-primary" />
            Наличными при получении
          </span>
          <span className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground">
            <Icon name="Landmark" size={16} className="text-primary" />
            Переводом на счёт
          </span>
        </div>
      </div>

      <div className="mt-6 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Stampcopy. Все права защищены.
      </div>
    </div>
  </footer>
);

export default Footer;