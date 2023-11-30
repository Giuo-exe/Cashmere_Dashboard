// CartContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Definire il tipo dell'elemento del carrello
interface CartItem {
  idcart: number; 
  lottoname: string;
  lotto: string;
  colorename?: string;
  colore?: string;
  hex: string | undefined;
  kg: number;
  n: number;
}

// Creare un contesto per il carrello
const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;

} | undefined>(undefined);

// Custom hook per accedere al contesto del carrello
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve essere utilizzato all interno di un CartProvider');
  }
  return context;
}

// Componente provider del contesto del carrello
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Funzione per aggiungere un elemento al carrello
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (itemToRemove: CartItem) => {
    setCart((prevCart) => prevCart.filter((item) => item !== itemToRemove));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}