import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartLine, MenuItem } from "@/types";

const STORAGE_KEY = "@forkfast/cart";

type CartContextValue = {
  restaurantId: string | null;
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (restaurantId: string, item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as {
            restaurantId: string | null;
            lines: CartLine[];
          };
          setRestaurantId(parsed.restaurantId);
          setLines(parsed.lines);
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ restaurantId, lines }));
  }, [restaurantId, lines, hydrated]);

  const addItem = useCallback(
    (newRestaurantId: string, item: MenuItem) => {
      setLines((prev) => {
        const sameRestaurant = restaurantId === newRestaurantId || prev.length === 0;
        const base = sameRestaurant ? prev : [];
        const existing = base.find((l) => l.item.id === item.id);
        if (existing) {
          return base.map((l) =>
            l.item.id === item.id ? { ...l, quantity: l.quantity + 1 } : l
          );
        }
        return [...base, { restaurantId: newRestaurantId, item, quantity: 1 }];
      });
      setRestaurantId(newRestaurantId);
    },
    [restaurantId]
  );

  const removeItem = useCallback((itemId: string) => {
    setLines((prev) => {
      const next = prev.filter((l) => l.item.id !== itemId);
      if (next.length === 0) setRestaurantId(null);
      return next;
    });
  }, []);

  const incrementItem = useCallback((itemId: string) => {
    setLines((prev) =>
      prev.map((l) =>
        l.item.id === itemId ? { ...l, quantity: l.quantity + 1 } : l
      )
    );
  }, []);

  const decrementItem = useCallback((itemId: string) => {
    setLines((prev) => {
      const next = prev
        .map((l) =>
          l.item.id === itemId ? { ...l, quantity: l.quantity - 1 } : l
        )
        .filter((l) => l.quantity > 0);
      if (next.length === 0) setRestaurantId(null);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    setRestaurantId(null);
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity * l.item.price, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      restaurantId,
      lines,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      clearCart,
    }),
    [restaurantId, lines, itemCount, subtotal, addItem, removeItem, incrementItem, decrementItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
