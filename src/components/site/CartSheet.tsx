import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { sendRequest } from '@/lib/api';
import type { CartItem } from './types';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const CartSheet = ({ open, onOpenChange, items, onRemove, onClear }: CartSheetProps) => {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const [contact, setContact] = useState({ name: '', phone: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    const errs: Record<string, string> = {};
    if (!contact.name.trim()) errs.name = 'Укажите имя';
    if (!/^[+\d][\d\s()-]{6,}$/.test(contact.phone)) errs.phone = 'Проверьте телефон';
    if (!contact.address.trim()) errs.address = 'Укажите адрес доставки';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await sendRequest({
        type: 'order',
        items: items.map((i) => ({ title: i.title, subtitle: i.subtitle, price: i.price })),
        total,
        contact,
      });
      toast({ title: 'Заказ оформлен!', description: 'Мы свяжемся с вами для подтверждения оплаты и доставки.' });
      onClear();
      setContact({ name: '', phone: '', address: '' });
    } catch {
      toast({ title: 'Не удалось оформить заказ', description: 'Попробуйте ещё раз или напишите в Telegram.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
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

            <div className="border-t border-border/60 pt-4 space-y-3">
              <div>
                <Label className="mb-1 block text-xs text-muted-foreground">Имя</Label>
                <Input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Как к вам обращаться" />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <Label className="mb-1 block text-xs text-muted-foreground">Телефон</Label>
                <Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+7 (___) ___-__-__" />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div>
                <Label className="mb-1 block text-xs text-muted-foreground">Адрес доставки</Label>
                <Input value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} placeholder="Город, улица, дом" />
                {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">Итого</span>
                <span className="font-display text-2xl font-700 text-primary">{total} ₽</span>
              </div>
              <Button onClick={checkout} className="w-full glow" size="lg" disabled={loading}>
                <Icon name={loading ? 'Loader2' : 'CreditCard'} size={18} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Оформляем…' : 'Оформить и оплатить'}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;