import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { sendRequest } from '@/lib/api';

const Contacts = () => {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [file, setFile] = useState<{ name: string; data: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      toast({ title: 'Файл слишком большой', description: 'Максимальный размер — 10 МБ.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setFile({ name: f.name, data: reader.result as string });
    reader.readAsDataURL(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Укажите имя';
    if (!/^[+\d][\d\s()-]{6,}$/.test(form.phone)) errs.phone = 'Проверьте телефон';
    if (!form.message.trim()) errs.message = 'Напишите сообщение';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await sendRequest({ type: 'contact', ...form, attachment: file ?? undefined });
      toast({ title: 'Сообщение отправлено!', description: 'Мы свяжемся с вами в ближайшее время.' });
      setForm({ name: '', phone: '', message: '' });
      setFile(null);
    } catch {
      toast({ title: 'Не удалось отправить', description: 'Попробуйте ещё раз или напишите в Telegram.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
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
                { icon: 'Mail', label: 'zakaz@stampcopy.com', href: 'mailto:zakaz@stampcopy.com' },
                { icon: 'Send', label: 'Написать в Telegram', href: 'https://t.me/stampcopy' },
                { icon: 'MapPin', label: 'г. Москва, град Московский, ул. Радужная, дом 6', href: '#' },
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
            <div>
              <Label className="mb-1.5 block text-sm">Файл (оттиск, макет)</Label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground transition hover:border-primary/50">
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
                  <Icon name="Upload" size={14} className="mr-1 inline" />
                  {file ? file.name : 'Прикрепить файл (до 10 МБ)'}
                </label>
                {file && (
                  <button type="button" onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive">
                    <Icon name="Trash2" size={16} />
                  </button>
                )}
              </div>
            </div>
            <Button type="submit" className="glow" disabled={loading}>
              <Icon name={loading ? 'Loader2' : 'Send'} size={18} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Отправляем…' : 'Отправить сообщение'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contacts;