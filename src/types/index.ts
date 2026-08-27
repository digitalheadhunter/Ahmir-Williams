export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  isPopular?: boolean;
};

export type Restaurant = {
  id: string;
  name: string;
  image: string;
  cuisines: string[];
  rating: number;
  ratingCount: number;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  distanceKm: number;
  categoryIds: string[];
  isPromoted?: boolean;
  menu: MenuItem[];
};

export type CartLine = {
  restaurantId: string;
  item: MenuItem;
  quantity: number;
};

export type Address = {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
};

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered";

export type Order = {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  lines: CartLine[];
  total: number;
  status: OrderStatus;
  placedAt: string;
  address: Address;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
};
