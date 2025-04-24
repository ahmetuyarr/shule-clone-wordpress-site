
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderType } from "@/types/order";
import { getStatusColor, formatDate } from "@/utils/orderUtils";

interface OrdersListProps {
  orders: OrderType[];
  onViewDetails: (order: OrderType) => void;
}

export const OrdersList = ({ orders, onViewDetails }: OrdersListProps) => {
  return (
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
                  onClick={() => onViewDetails(order)}
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
  );
};
