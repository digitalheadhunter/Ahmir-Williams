import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Address, CartLine, Order, OrderStatus } from "@/types";

type OrdersContextValue = {
  orders: Order[];
  placeOrder: (params: {
    restaurantName: string;
    restaurantImage: string;
    lines: CartLine[];
    total: number;
    address: Address;
  }) => Order;
  getOrder: (id: string) => Order | undefined;
};

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

const STATUS_SEQUENCE: OrderStatus[] = [
  "placed",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const advanceStatus = useCallback((orderId: string, stepIndex: number) => {
    if (stepIndex >= STATUS_SEQUENCE.length) return;
    const timer = setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: STATUS_SEQUENCE[stepIndex] } : o
        )
      );
      advanceStatus(orderId, stepIndex + 1);
    }, 6000);
    timers.current.push(timer);
  }, []);

  const placeOrder: OrdersContextValue["placeOrder"] = useCallback(
    ({ restaurantName, restaurantImage, lines, total, address }) => {
      const order: Order = {
        id: `ord-${Date.now()}`,
        restaurantName,
        restaurantImage,
        lines,
        total,
        status: "placed",
        placedAt: new Date().toISOString(),
        address,
      };
      setOrders((prev) => [order, ...prev]);
      advanceStatus(order.id, 1);
      return order;
    },
    [advanceStatus]
  );

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  const value = useMemo(
    () => ({ orders, placeOrder, getOrder }),
    [orders, placeOrder, getOrder]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
};
