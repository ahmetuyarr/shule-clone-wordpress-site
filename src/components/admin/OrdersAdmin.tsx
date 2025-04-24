import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OrderType, OrderItemType } from "@/types/order";
import { OrderDetails } from "./OrderDetails";
import { OrdersList } from "./OrdersList";
import { getStatusMessage } from "@/utils/orderUtils";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as OrderType[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Siparişler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(name, image, id)
        `)
        .eq('order_id', orderId);

      if (error) throw error;
      if (data) {
        setOrderItems(data.map(item => ({
          ...item,
          product: item.product ? {
            name: item.product.name,
            image: item.product.image,
            id: item.product.id
          } : undefined
        })));
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      toast.error("Sipariş detayları yüklenirken bir hata oluştu");
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderType["status"]) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (orderToUpdate) {
        const { error: notificationError } = await supabase
          .from('order_notifications')
          .insert({
            order_id: orderId,
            user_id: orderToUpdate.user_id,
            message: getStatusMessage(status)
          });

        if (notificationError) throw notificationError;
      }

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }

      toast.success("Sipariş durumu güncellendi");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Sipariş durumu güncellenirken bir hata oluştu");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrderDetails = (order: OrderType) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
  };

  const closeDetails = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Siparişler</h2>
        <Button 
          onClick={() => fetchOrders()}
          variant="outline"
        >
          Yenile
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div>
          {selectedOrder ? (
            <OrderDetails
              order={selectedOrder}
              onClose={closeDetails}
              onStatusUpdate={updateOrderStatus}
              orderItems={orderItems}
            />
          ) : (
            <OrdersList
              orders={orders}
              onViewDetails={viewOrderDetails}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
