
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OrderType, OrderItemType, OrderNotificationType } from "@/types/order";

const OrdersTab = ({ user }: { user: User }) => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
  const [notifications, setNotifications] = useState<OrderNotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchOrders();
    fetchNotifications();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
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
        const mappedItems = data.map(item => ({
          ...item,
          product: item.product ? {
            name: item.product.name,
            image: item.product.image,
            id: item.product.id
          } : undefined
        }));
        setOrderItems(mappedItems);
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('order_notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setNotifications(data as OrderNotificationType[]);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('order_notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      if (error) throw error;
      
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("Tüm bildirimler okundu olarak işaretlendi");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast.error("Bildirimler güncellenirken bir hata oluştu");
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('order_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const viewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    fetchOrderItems(orderId);
  };

  const closeDetails = () => {
    setSelectedOrderId(null);
    setOrderItems([]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('tr-TR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': 
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': 
        return 'bg-blue-100 text-blue-800';
      case 'PREPARING': 
        return 'bg-indigo-100 text-indigo-800';
      case 'SHIPPED': 
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': 
        return 'bg-green-100 text-green-800';
      case 'CANCELLED': 
        return 'bg-red-100 text-red-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Beklemede';
      case 'CONFIRMED': return 'Onaylandı';
      case 'PREPARING': return 'Hazırlanıyor';
      case 'SHIPPED': return 'Kargoya Verildi';
      case 'DELIVERED': return 'Teslim Edildi';
      case 'CANCELLED': return 'İptal Edildi';
      default: return status;
    }
  };

  const getSelectedOrder = () => {
    return orders.find(order => order.id === selectedOrderId);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Siparişlerim</h2>
          <p className="text-gray-500 mt-1">Tüm siparişlerinizi ve durumlarını buradan takip edebilirsiniz.</p>
        </div>
        <Button variant="outline" onClick={fetchOrders}>Yenile</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`${selectedOrderId ? 'hidden lg:block' : ''} col-span-2`}>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="divide-y">
                {orders.map(order => (
                  <div key={order.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sipariş #{order.id.substring(0, 8)}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => viewOrderDetails(order.id)}
                        >
                          Detaylar
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium">Toplam: </span>
                        {order.total_amount.toFixed(2)} ₺
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-8 text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M9 5H2v7h7V5z" />
                  <path d="M9 12H2v7h7v-7z" />
                  <path d="M16 5H9v7h7V5z" />
                  <path d="M16 12H9v7h7v-7z" />
                  <path d="M23 5h-7v7h7V5z" />
                  <path d="M23 12h-7v7h7v-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Henüz siparişiniz bulunmuyor</h3>
              <p className="text-gray-500">Mağazamızdan alışveriş yaparak siparişlerinizi buradan takip edebilirsiniz.</p>
              <Button className="mt-4" asChild>
                <a href="/products">Alışverişe Başla</a>
              </Button>
            </div>
          )}
        </div>

        {selectedOrderId && (
          <div className={`${selectedOrderId ? 'lg:col-span-2' : 'hidden'}`}>
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-medium">Sipariş Detayı</h3>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={closeDetails}
                  className="lg:hidden"
                >
                  Geri Dön
                </Button>
              </div>
              
              {getSelectedOrder() && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-medium">Sipariş Numarası</p>
                      <p className="text-sm">#{getSelectedOrder()?.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sipariş Tarihi</p>
                      <p className="text-sm">{formatDate(getSelectedOrder()?.created_at || '')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sipariş Durumu</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(getSelectedOrder()?.status || '')}`}>
                        {getStatusText(getSelectedOrder()?.status || '')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Toplam Tutar</p>
                      <p className="text-sm">{getSelectedOrder()?.total_amount.toFixed(2)} ₺</p>
                    </div>
                  </div>

                  {getSelectedOrder()?.tracking_number && (
                    <div className="mb-6 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium text-blue-900">Kargo Takip Numarası</p>
                      <p className="text-sm text-blue-900">{getSelectedOrder().tracking_number}</p>
                    </div>
                  )}
                  
                  <h4 className="font-medium mb-3">Ürünler</h4>
                  <div className="divide-y">
                    {orderItems.map(item => (
                      <div key={item.id} className="py-3 flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                          {item.product?.image && (
                            <img 
                              src={item.product.image} 
                              alt={item.product?.name || "Ürün"} 
                              className="w-full h-full object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{item.product?.name}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{item.quantity} adet</span>
                            <span>{(item.price_at_purchase * item.quantity).toFixed(2)} ₺</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Bildirimler</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    {unreadCount} yeni
                  </span>
                )}
              </div>
              {notifications.some(n => !n.read) && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={markAllAsRead}
                >
                  Tümünü Okundu İşaretle
                </Button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => !notification.read ? markAsRead(notification.id) : null}
                    >
                      <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500 text-sm">Henüz bildiriminiz bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTab;
