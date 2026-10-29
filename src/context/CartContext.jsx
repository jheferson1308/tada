import { createContext, useContext, useEffect, useState } from 'react';
import { products } from '../data/products';

const CartContext = createContext();
const STORAGE_KEY = 'tada-cart';

const readStoredEntries = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(stored)) return [];
    return stored
      .filter(
        (entry) =>
          entry &&
          Number.isInteger(entry.qty) &&
          entry.qty > 0 &&
          products.some((product) => product.id === entry.id)
      )
      .map((entry) => ({ id: entry.id, qty: entry.qty }));
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [entries, setEntries] = useState(readStoredEntries);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  const items = entries
    .map((entry) => {
      const product = products.find((candidate) => candidate.id === entry.id);
      return product ? { ...product, qty: entry.qty } : null;
    })
    .filter(Boolean);

  const addToCart = (product) => {
    setEntries((prev) => {
      const existing = prev.find((entry) => entry.id === product.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === product.id ? { ...entry, qty: entry.qty + 1 } : entry
        );
      }
      return [...prev, { id: product.id, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, qty } : entry))
    );
  };

  const clearCart = () => setEntries([]);

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, count, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
