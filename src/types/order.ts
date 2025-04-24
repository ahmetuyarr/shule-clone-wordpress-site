
import { Json } from "@/integrations/supabase/types";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderType {
  id: string;
  user_id: string;
  profile_id: string;
  total_amount: number;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "PROCESSING";
  created_at: string;
  updated_at: string;
  shipping_address: ShippingAddress | Json;
  notes?: string;
  tracking_number?: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export interface OrderItemType {
  id: string;
  quantity: number;
  price_at_purchase: number;
  product: {
    name: string;
    image: string;
    id?: string;
  };
  order_id?: string;
  product_id?: string;
}

export interface OrderNotificationType {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
  order_id?: string;
  user_id?: string;
}
