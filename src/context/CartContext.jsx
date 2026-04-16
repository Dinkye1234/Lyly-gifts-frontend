import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const userId = useMemo(() => user?._id || user?.id || null, [user]);
  const cartKey = useMemo(
    () => (userId ? `cart_${userId}` : "cart_guest"),
    [userId],
  );

  const [items, setItems] = useState([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const saved = localStorage.getItem(cartKey);
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems([]);
    }

    isInitialMount.current = true;
  }, [cartKey]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, cartKey]);

  const addItem = (item) => {
    setItems((prev) => {
      const itemId = item._id || item.id || item.productId;
      const existing = prev.find(
        (i) => (i._id || i.id || i.productId) === itemId,
      );

      if (existing) {
        return prev.map((i) =>
          (i._id || i.id || i.productId) === itemId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setItems((prev) =>
      prev.map((item) =>
        (item._id || item.id || item.productId) === id
          ? { ...item, quantity: Math.max(newQuantity, 1) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setItems((prev) =>
      prev.filter((item) => (item._id || item.id || item.productId) !== id),
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(cartKey);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
        0,
      ),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
