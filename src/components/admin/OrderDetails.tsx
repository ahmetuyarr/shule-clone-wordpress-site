
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderType, OrderItemType } from "@/types/order";
import { supabase } from "@/integrations/supabase/client";
import { getStatusColor, formatDate } from "@/utils/orderUtils";

interface OrderDetailsProps {
  order: OrderType;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderType["status"]) => void;
  orderItems: OrderItemType[];
}

export const OrderDetails = ({ order, onClose, onStatusUpdate, orderItems }: OrderDetailsProps) => {
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || "");

  const updateTrackingNumber = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ tracking_number: trackingNumber })
        .eq('id', order.id);

      if (error) throw error;

      // Send notification to user
      if (trackingNumber) {
        const { error: notificationError } = await supabase
          .from('order_notifications')
          .insert({
            order_id: order.id,
            user_id: order.user_id,
            message: `Siparişinize kargo takip numarası eklendi: ${trackingNumber}`
          });

        if (notificationError) throw notificationError;
      }

      toast.success("Takip numarası güncellendi");
    } catch (error) {
      console.error("Error updating tracking number:", error);
      toast.error("Takip numarası güncellenirken bir hata oluştu");
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              Sipariş #{order.id.substring(0, 8)}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(order.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
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
              {order.profiles?.full_name || "İsimsiz Müşteri"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email: </span>
              {order.profiles?.email || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Toplam Tutar: </span>
              {order.total_amount.toFixed(2)} ₺
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Teslimat Adresi</h4>
          <div className="space-y-1">
            {typeof order.shipping_address === 'object' && order.shipping_address && (
              <>
                <p className="text-sm">
                  {(order.shipping_address as any).firstName} {(order.shipping_address as any).lastName}
                </p>
                <p className="text-sm">{(order.shipping_address as any).phone}</p>
                <p className="text-sm">{(order.shipping_address as any).address}</p>
                <p className="text-sm">
                  {(order.shipping_address as any).postalCode} {(order.shipping_address as any).city} / {(order.shipping_address as any).country}
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
              defaultValue={order.status}
              onValueChange={(value) => onStatusUpdate(order.id, value as OrderType["status"])}
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
            <Input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Kargo takip numarası"
            />
            <Button onClick={updateTrackingNumber}>Kaydet</Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h4 className="font-semibold mb-4">Ürünler</h4>
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
    </div>
  );
};
