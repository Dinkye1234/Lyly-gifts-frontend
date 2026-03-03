import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id || i.productId === item.id
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id || i.productId === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id || item.productId === id
          ? { ...item, quantity: Math.max(newQuantity, 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id && item.productId !== id)
    );
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
