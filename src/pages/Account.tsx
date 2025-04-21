
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_country: string;
}

const Account = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_street: "",
    address_city: "",
    address_postal_code: "",
    address_country: ""
  });
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      fetchProfile(user.id);
      fetchOrders(user.id);
      fetchFavorites(user.id);
    };

    getUser();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            product: products (*)
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          *,
          product: products (*)
        `)
        .eq("user_id", userId);

      if (error) throw error;
      if (data) setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", user?.id);

      if (error) throw error;
      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profil güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="shule-container">
          <h1 className="text-3xl font-semibold mb-8">Hesabım</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profil Bilgileri</TabsTrigger>
              <TabsTrigger value="orders">Siparişlerim</TabsTrigger>
              <TabsTrigger value="favorites">Favorilerim</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profil Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={updateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">Ad</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={profile.first_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Soyad</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={profile.last_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address_street">Adres</Label>
                      <Input
                        id="address_street"
                        name="address_street"
                        value={profile.address_street}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address_city">Şehir</Label>
                        <Input
                          id="address_city"
                          name="address_city"
                          value={profile.address_city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address_postal_code">Posta Kodu</Label>
                        <Input
                          id="address_postal_code"
                          name="address_postal_code"
                          value={profile.address_postal_code}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address_country">Ülke</Label>
                      <Input
                        id="address_country"
                        name="address_country"
                        value={profile.address_country}
                        onChange={handleInputChange}
                      />
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading ? "Güncelleniyor..." : "Bilgileri Güncelle"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Siparişlerim</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <p className="font-medium">Sipariş #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{order.total_amount} ₺</p>
                              <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {order.order_items.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                  <p>{item.product.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {item.quantity} adet x {item.price_at_purchase} ₺
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Henüz sipariş bulunmuyor.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Favorilerim</CardTitle>
                </CardHeader>
                <CardContent>
                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map((favorite: any) => (
                        <div key={favorite.id} className="border rounded-lg overflow-hidden">
                          <img
                            src={favorite.product.image}
                            alt={favorite.product.name}
                            className="w-full aspect-square object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-medium">{favorite.product.name}</h3>
                            <p className="text-shule-brown mt-1">
                              {favorite.product.price} ₺
                            </p>
                            <div className="mt-4 flex gap-2">
                              <Button asChild variant="outline" className="flex-1">
                                <Link to={`/products/${favorite.product.id}`}>
                                  Ürüne Git
                                </Link>
                              </Button>
                              <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={async () => {
                                  try {
                                    await supabase
                                      .from("favorites")
                                      .delete()
                                      .eq("id", favorite.id);
                                    
                                    fetchFavorites(user?.id as string);
                                    toast.success("Ürün favorilerden kaldırıldı");
                                  } catch (error) {
                                    console.error("Error removing favorite:", error);
                                    toast.error("Bir hata oluştu");
                                  }
                                }}
                              >
                                Kaldır
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Henüz favori ürününüz bulunmuyor.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
