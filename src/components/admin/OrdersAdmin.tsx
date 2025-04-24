import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderType, OrderItemType } from "@/types/order";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
  const [trackingNumber, setTrackingNumber] = useState("");

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
      
      // Send notification to user
      const { error: notificationError } = await supabase
        .from('order_notifications')
        .insert({
          order_id: orderId,
          user_id: selectedOrder?.user_id,
          message: getStatusMessage(status)
        });

      if (notificationError) throw notificationError;

      // Update local state
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
    setTrackingNumber(order.tracking_number || "");
    fetchOrderItems(order.id);
  };

  const closeDetails = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const updateTrackingNumber = async () => {
    if (!selectedOrder) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ tracking_number: trackingNumber })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? { ...order, tracking_number: trackingNumber } : order
      ));
      
      setSelectedOrder({ ...selectedOrder, tracking_number: trackingNumber });

      // Send notification to user
      if (trackingNumber) {
        const { error: notificationError } = await supabase
          .from('order_notifications')
          .insert({
            order_id: selectedOrder.id,
            user_id: selectedOrder.user_id,
            message: `Siparişinize kargo takip numarası eklendi: ${trackingNumber}`
          });

        if (notificationError) console.error("Notification error:", notificationError);
      }

      toast.success("Takip numarası güncellendi");
    } catch (error) {
      console.error("Error updating tracking number:", error);
      toast.error("Takip numarası güncellenirken bir hata oluştu");
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING': 
        return 'Siparişiniz alındı ve inceleniyor.';
      case 'CONFIRMED': 
        return 'Siparişiniz onaylandı ve hazırlanmaya başlandı.';
      case 'PREPARING': 
        return 'Siparişiniz hazırlanıyor.';
      case 'SHIPPED': 
        return 'Siparişiniz kargoya verildi.';
      case 'DELIVERED': 
        return 'Siparişiniz teslim edildi.';
      case 'CANCELLED': 
        return 'Siparişiniz iptal edildi.';
      default: 
        return 'Sipariş durumu güncellendi.';
    }
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
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Sipariş #{selectedOrder.id.substring(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedOrder.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={closeDetails}
                    >
                      Geri Dön
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Sipariş Bilgileri</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Müşteri: </span>
                      {selectedOrder.profiles?.full_name || "İsimsiz Müşteri"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email: </span>
                      {selectedOrder.profiles?.email || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Sipariş Tarihi: </span>
                      {formatDate(selectedOrder.created_at)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Toplam Tutar: </span>
                      {selectedOrder.total_amount.toFixed(2)} ₺
                    </p>
                  </div>
                  
                  {selectedOrder.notes && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2">Sipariş Notu</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded border">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Teslimat Adresi</h4>
                  <div className="space-y-1">
                    {selectedOrder.shipping_address && (
                      <>
                        <p className="text-sm">
                          {selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}
                        </p>
                        <p className="text-sm">{selectedOrder.shipping_address.phone}</p>
                        <p className="text-sm">{selectedOrder.shipping_address.address}</p>
                        <p className="text-sm">
                          {selectedOrder.shipping_address.postalCode} {selectedOrder.shipping_address.city} / {selectedOrder.shipping_address.country}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-b">
                <h4 className="font-semibold mb-4">Sipariş Durumu Güncelle</h4>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <Select 
                      defaultValue={selectedOrder.status}
                      onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Beklemede</SelectItem>
                        <SelectItem value="CONFIRMED">Onaylandı</SelectItem>
                        <SelectItem value="PREPARING">Hazırlanıyor</SelectItem>
                        <SelectItem value="SHIPPED">Kargoya Verildi</SelectItem>
                        <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                        <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Kargo takip numarası"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button onClick={updateTrackingNumber}>Kaydet</Button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-semibold mb-4">Sipariş Ürünleri</h4>
                {orderItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Ürün</TableHead>
                          <TableHead>İsim</TableHead>
                          <TableHead className="text-right">Miktar</TableHead>
                          <TableHead className="text-right">Fiyat</TableHead>
                          <TableHead className="text-right">Toplam</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.product?.image && (
                                <div className="w-12 h-12">
                                  <img
                                    src={item.product.image}
                                    alt={item.product?.name || "Ürün"}
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{item.product?.name}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{item.price_at_purchase.toFixed(2)} ₺</TableCell>
                            <TableCell className="text-right">{(item.price_at_purchase * item.quantity).toFixed(2)} ₺</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Ürün detayları yüklenemedi.</p>
                )}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sipariş No</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>{order.profiles?.full_name || "İsimsiz Müşteri"}</TableCell>
                      <TableCell>{order.total_amount.toFixed(2)} ₺</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => viewOrderDetails(order)}
                        >
                          Detaylar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Henüz sipariş bulunmuyor
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
