
import { Json } from "@/integrations/supabase/types";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderType {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  created_at: string;
  shipping_address: ShippingAddress;
  notes?: string;
  tracking_number?: string;
  profiles: {
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
  };
}

export interface OrderNotificationType {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
  order_id?: string;
  user_id?: string;
}
