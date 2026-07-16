import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import type { CartItem } from './types';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: CartItem[];
  onRemove: (id: string) => void;
}

const CartSheet = ({ open, onOpenChange, items, onRemove }: CartSheetProps) => {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = () => {
    toast({ title: 'Заказ оформлен!', description: 'Скоро подключим онлайн-оплату и доставку.' });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2 text-2xl">
            <Icon name="ShoppingCart" size={22} className="text-primary" />
            Корзина
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
            <Icon name="PackageOpen" size={48} className="mb-3 opacity-50" />
            <p>Корзина пуста</p>
            <p className="text-sm">Добавьте печать из редактора или каталога</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto py-4">
              {items.map((i) => (
                <div key={i.id} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon name="Stamp" size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-500">{i.title}</p>
                    <p className="text-xs text-muted-foreground">{i.subtitle}</p>
                    <p className="mt-1 font-display font-700 text-primary">{i.price} ₽</p>
                  </div>
                  <button onClick={() => onRemove(i.id)} className="text-muted-foreground hover:text-destructive">
                    <Icon name="Trash2" size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-muted-foreground">Итого</span>
                <span className="font-display text-2xl font-700 text-primary">{total} ₽</span>
              </div>
              <Button onClick={checkout} className="w-full glow" size="lg">
                <Icon name="CreditCard" size={18} />Оформить и оплатить
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
