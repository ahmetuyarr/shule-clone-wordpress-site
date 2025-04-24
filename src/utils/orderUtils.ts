
export const getStatusColor = (status: string) => {
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

export const getStatusMessage = (status: string) => {
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

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('tr-TR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
