
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import OrdersTab from "@/components/account/OrdersTab";
import { Heart } from "lucide-react";

const Account = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      await fetchProfile(user.id);
    };

    getUser();

    // Check if there's a tab query parameter
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [navigate, searchParams]);

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Çıkış yapıldı");
  };

  const updateProfile = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;
      setProfile({ ...profile, ...formData });
      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profil güncellenirken bir hata oluştu");
    }
  };

  const ProfileTab = () => {
    const [formData, setFormData] = useState({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone: profile?.phone || "",
      address_street: profile?.address_street || "",
      address_city: profile?.address_city || "",
      address_postal_code: profile?.address_postal_code || "",
      address_country: profile?.address_country || "",
    });
    const [updating, setUpdating] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setUpdating(true);
      await updateProfile(formData);
      setUpdating(false);
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Profil Bilgilerim</h2>
          <p className="text-gray-500 mt-1">Kişisel bilgilerinizi ve adresinizi düzenleyebilirsiniz.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Hesap Bilgileri</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">E-posta</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Üyelik Tarihi</p>
                  <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</p>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" onClick={handleSignOut}>Çıkış Yap</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-medium mb-4">Kişisel Bilgiler</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Ad</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Soyad</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-4">Adres Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Adres</label>
                    <input
                      type="text"
                      name="address_street"
                      value={formData.address_street}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Şehir</label>
                      <input
                        type="text"
                        name="address_city"
                        value={formData.address_city}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Posta Kodu</label>
                      <input
                        type="text"
                        name="address_postal_code"
                        value={formData.address_postal_code}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Ülke</label>
                    <input
                      type="text"
                      name="address_country"
                      value={formData.address_country}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Button type="submit" disabled={updating}>
                    {updating ? "Güncelleniyor..." : "Bilgileri Güncelle"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const FavoritesTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="text-red-500" />
          <h2 className="text-2xl font-semibold">Favorilerim</h2>
        </div>
        <div className="text-center py-8">
          <Button asChild>
            <a href="/favorites">Favorilere Git</a>
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="shule-container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profilim</TabsTrigger>
              <TabsTrigger value="orders">Siparişlerim</TabsTrigger>
              <TabsTrigger value="favorites">Favorilerim</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
            
            <TabsContent value="orders">
              {user && <OrdersTab user={user} />}
            </TabsContent>
            
            <TabsContent value="favorites">
              <FavoritesTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
