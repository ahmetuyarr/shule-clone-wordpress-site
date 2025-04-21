
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Trash2 } from "lucide-react";

interface FavoriteItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  };
}

const Favorites = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      await fetchFavorites(user.id);
    };

    getUser();
  }, [navigate]);

  const fetchFavorites = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', userId) as { data: FavoriteItem[] | null; error: unknown };

      if (error) throw error;
      if (data) setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Favoriler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId) as { error: unknown };
      
      if (error) throw error;
      
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      toast.success("Ürün favorilerden kaldırıldı");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Bir hata oluştu");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="shule-container">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="text-red-500" />
            <h1 className="text-3xl font-semibold">Favorilerim</h1>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={favorite.product.image}
                      alt={favorite.product.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      onClick={() => removeFavorite(favorite.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                      title="Favorilerden kaldır"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg truncate">{favorite.product.name}</h3>
                    <p className="text-green-700 font-semibold mt-1">
                      {favorite.product.price} ₺
                    </p>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {favorite.product.description}
                    </p>
                    <div className="mt-4">
                      <Button asChild className="w-full">
                        <Link to={`/products/${favorite.product.id}`}>
                          Ürüne Git
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                <Heart size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Favori ürününüz bulunmuyor</h3>
              <p className="text-gray-500 mb-6">Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca ulaşabilirsiniz.</p>
              <Button asChild>
                <Link to="/products">Ürünlere Göz At</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
