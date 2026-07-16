import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const Contacts = () => {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Укажите имя';
    if (!/^[+\d][\d\s()-]{6,}$/.test(form.phone)) errs.phone = 'Проверьте телефон';
    if (!form.message.trim()) errs.message = 'Напишите сообщение';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    toast({ title: 'Сообщение отправлено!', description: 'Мы свяжемся с вами в ближайшее время.' });
    setForm({ name: '', phone: '', message: '' });
  };

  return (
    <section id="contacts" className="py-20">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-700 tracking-tight md:text-5xl">
              СВЯЖИТЕСЬ <span className="text-primary">С НАМИ</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Ответим на вопросы, поможем с макетом и оформим заказ.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                { icon: 'Phone', label: '+7 (900) 000-00-00', href: 'tel:+79000000000' },
                { icon: 'Mail', label: 'zakaz@stampcopy.ru', href: 'mailto:zakaz@stampcopy.ru' },
                { icon: 'Send', label: 'Написать в Telegram', href: 'https://t.me/stampcopy' },
                { icon: 'MapPin', label: 'г. Москва, ул. Печатная, 1', href: '#' },
              ].map((c) => (
                <a key={c.label} href={c.href} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-4 transition hover:border-primary/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon name={c.icon} size={20} />
                  </div>
                  <span className="text-sm">{c.label}</span>
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="grid content-start gap-4 rounded-2xl border border-border/60 bg-card/50 p-6">
            <div>
              <Label className="mb-1.5 block text-sm">Имя</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Как к вам обращаться" />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">Телефон</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+7 (___) ___-__-__" />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">Сообщение</Label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Опишите заказ или вопрос" rows={4} />
              {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
            </div>
            <Button type="submit" className="glow">
              <Icon name="Send" size={18} />Отправить сообщение
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
