import { useState } from 'react';
import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import Editor from '@/components/site/Editor';
import Catalog from '@/components/site/Catalog';
import Templates from '@/components/site/Templates';
import Gallery from '@/components/site/Gallery';
import Services from '@/components/site/Services';
import Contacts from '@/components/site/Contacts';
import Footer from '@/components/site/Footer';
import CartSheet from '@/components/site/CartSheet';
import { toast } from '@/hooks/use-toast';
import type { CartItem } from '@/components/site/types';

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    toast({ title: 'Добавлено в корзину', description: item.title });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen scroll-smooth">
      <Header cartCount={cart.length} onCartClick={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Editor onAddToCart={addToCart} />
        <Catalog onAddToCart={addToCart} />
        <Templates />
        <Gallery />
        <Services />
        <Contacts />
      </main>
      <Footer />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} items={cart} onRemove={removeFromCart} onClear={clearCart} />
    </div>
  );
};

export default Index;