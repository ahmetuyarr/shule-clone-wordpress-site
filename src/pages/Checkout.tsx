
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
}

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    notes: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Sepeti localStorage'dan yükle
    const savedCart = localStorage.getItem("shuleCart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Sepet verisi yüklenirken hata oluştu:", e);
        localStorage.removeItem("shuleCart");
      }
    }

    // Kullanıcı bilgilerini yükle
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Ödeme yapabilmek için giriş yapmalısınız");
        navigate("/auth");
        return;
      }

      setUser(user);

      // Kullanıcı profilini yükle
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFormData({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          email: profile.email || user.email || "",
          phone: profile.phone || "",
          address: profile.address_street || "",
          city: profile.address_city || "",
          postalCode: profile.address_postal_code || "",
          country: profile.address_country || "",
          notes: ""
        });
      }
    };

    getUser();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return calculateTotal() > 1000 ? 0 : 29.99;
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateShipping();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Ödeme yapabilmek için giriş yapmalısınız");
      navigate("/auth");
      return;
    }

    if (cart.length === 0) {
      toast.error("Sepetiniz boş");
      return;
    }

    setIsLoading(true);

    try {
      // Sipariş oluştur
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: calculateGrandTotal(),
          status: "PENDING",
          shipping_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country
          },
          notes: formData.notes
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Sipariş öğelerini ekle
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Bildirim oluştur
      const { error: notificationError } = await supabase
        .from("order_notifications")
        .insert({
          order_id: order.id,
          user_id: user.id,
          message: "Siparişiniz alındı ve inceleniyor."
        });

      if (notificationError) console.error("Bildirim oluşturulurken hata:", notificationError);

      // Sepeti temizle
      localStorage.removeItem("shuleCart");
      
      toast.success("Siparişiniz başarıyla oluşturuldu!");
      navigate("/account?tab=orders");
    } catch (error) {
      console.error("Sipariş oluşturulurken hata:", error);
      toast.error("Sipariş oluşturulurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="shule-container">
          <h1 className="text-3xl font-semibold mb-8">Ödeme Bilgileri</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 border rounded-md shadow-sm">
                  <h2 className="text-xl font-medium mb-4">Teslimat Bilgileri</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-1">Ad</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-1">Soyad</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">E-posta</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefon</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium mb-1">Adres</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">Şehir</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium mb-1">Posta Kodu</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium mb-1">Ülke</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 border rounded-md shadow-sm">
                  <h2 className="text-xl font-medium mb-4">Sipariş Notları</h2>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">Eklemek istediğiniz notlar</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
                
                <div className="bg-white p-6 border rounded-md shadow-sm">
                  <h2 className="text-xl font-medium mb-4">Ödeme Yöntemi</h2>
                  <div className="flex items-center border p-4 rounded-md">
                    <input
                      type="radio"
                      id="cashOnDelivery"
                      name="paymentMethod"
                      checked
                      readOnly
                      className="mr-2"
                    />
                    <label htmlFor="cashOnDelivery">Kapıda Ödeme</label>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-shule-brown hover:bg-shule-darkBrown text-white py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "İşleniyor..." : "Siparişi Tamamla"}
                </Button>
              </form>
            </div>
            
            <div>
              <div className="bg-white p-6 border rounded-md shadow-sm sticky top-24">
                <h2 className="text-xl font-medium mb-4">Sipariş Özeti</h2>
                
                <div className="divide-y">
                  {cart.map(item => (
                    <div key={item.id} className="py-3 flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{item.name}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{item.quantity} adet</span>
                          <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 space-y-2 pt-3 border-t">
                  <div className="flex justify-between">
                    <span>Ara Toplam</span>
                    <span>{calculateTotal().toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kargo</span>
                    <span>
                      {calculateShipping() === 0 ? 'Ücretsiz' : `${calculateShipping().toFixed(2)} ₺`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Toplam</span>
                    <span>{calculateGrandTotal().toFixed(2)} ₺</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
