
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Heart, ShoppingBag } from "lucide-react";
import ProductImageCarousel from "@/components/ProductImageCarousel";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  
  // Ürün detaylarını Supabase'den çek
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Ürün detayları yüklenirken hata:', error);
        throw error;
      }
      
      return data;
    }
  });

  useEffect(() => {
    const getUserAndCheckFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user && id) {
        checkIfFavorite(user.id, id);
      }
    };
    
    getUserAndCheckFavorite();
  }, [id]);
  
  const checkIfFavorite = async (userId: string, productId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single() as { data: { id: string } | null; error: unknown };
      
      if (error) {
        console.error("Favori kontrolü sırasında hata:", error);
        return;
      }
      
      if (data) {
        setIsFavorite(true);
        setFavoriteId(data.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      console.error("Favori kontrolü sırasında hata:", error);
    }
  };

  // Sepete ürün ekleme
  const addToCart = () => {
    if (!product) return;
    
    // LocalStorage'dan mevcut sepeti al
    const savedCart = localStorage.getItem("shuleCart");
    let currentCart: CartItem[] = [];
    
    if (savedCart) {
      try {
        currentCart = JSON.parse(savedCart);
      } catch (e) {
        console.error("Sepet verisi yüklenirken hata oluştu:", e);
      }
    }
    
    // Ürün sepette var mı kontrol et
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Ürün zaten sepette, miktarını güncelle
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // Yeni ürün ekle
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.is_on_sale && product.sale_price ? product.sale_price : product.price,
        quantity: quantity,
        image: product.image
      });
    }
    
    // Sepeti kaydet
    localStorage.setItem("shuleCart", JSON.stringify(currentCart));
    
    toast.success("Ürün sepete eklendi");
  };

  // Favorilere ekleme/çıkarma
  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Favorilere eklemek için giriş yapmalısınız");
      return;
    }
    
    if (!product) return;
    
    setIsAddingToFavorites(true);
    
    try {
      if (isFavorite && favoriteId) {
        // Favorilerden çıkar
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', favoriteId) as { error: unknown };
          
        if (error) throw error;
        
        setIsFavorite(false);
        setFavoriteId(null);
        toast.success("Ürün favorilerden çıkarıldı");
      } else {
        // Favorilere ekle
        const { data, error } = await supabase
          .from('favorites')
          .insert([{
            user_id: user.id,
            product_id: product.id
          }])
          .select('id')
          .single() as { data: { id: string } | null; error: unknown };
          
        if (error) throw error;
        
        if (data) {
          setIsFavorite(true);
          setFavoriteId(data.id);
          toast.success("Ürün favorilere eklendi");
        }
      }
    } catch (error) {
      console.error("Favori işlemi sırasında hata:", error);
      toast.error("Bir hata oluştu");
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  // Ürün resimlerini hazırla
  const getProductImages = () => {
    if (!product) return [];
    
    // Ana görsel ve diğer görselleri bir araya getir
    let allImages = [];
    
    // Ana resmi ekle
    if (product.image) {
      allImages.push(product.image);
    }
    
    // Diğer resimleri ekle (eğer varsa)
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      // Tekrar eden resimleri filtrele
      const additionalImages = product.images.filter(img => img !== product.image);
      allImages = [...allImages, ...additionalImages];
    }
    
    return allImages;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="shule-container">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2">Ürün yükleniyor...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="shule-container">
            <div className="text-center py-12">
              <h2 className="shule-heading mb-4">Ürün Bulunamadı</h2>
              <p className="mb-6">Aradığınız ürün bulunamadı veya bir hata oluştu.</p>
              <Button asChild className="bg-shule-brown hover:bg-shule-darkBrown text-white">
                <Link to="/products">Tüm Ürünlere Dön</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="bg-shule-lightGrey py-3">
          <div className="shule-container">
            <nav className="flex items-center text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Ana Sayfa
              </Link>
              <span className="mx-2">&#8250;</span>
              <Link to="/products" className="text-gray-500 hover:text-gray-700">
                Ürünler
              </Link>
              <span className="mx-2">&#8250;</span>
              <span className="font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="shule-container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Ürün Görsel Carousel */}
            <div>
              <ProductImageCarousel 
                images={getProductImages()}
                productName={product.name}
              />
            </div>
            
            {/* Ürün Bilgileri */}
            <div>
              <h1 className="shule-heading mb-2">{product.name}</h1>
              
              {/* Fiyat Bilgisi */}
              <div className="text-2xl font-medium mb-6">
                {product.is_on_sale && product.sale_price ? (
                  <div className="flex items-center space-x-2">
                    <span>{product.sale_price.toFixed(2)} ₺</span>
                    <span className="text-lg line-through text-gray-500">{product.price.toFixed(2)} ₺</span>
                  </div>
                ) : (
                  <span>{product.price.toFixed(2)} ₺</span>
                )}
              </div>
              
              {/* Ürün Açıklaması */}
              <div className="mb-6">
                <p>{product.description || "Bu ürün için açıklama bulunmamaktadır."}</p>
              </div>
              
              {/* Kategori */}
              <div className="mb-6">
                <div className="font-medium mb-2">Kategori:</div>
                <p>{product.category}</p>
              </div>
              
              {/* Koleksiyon */}
              {product.collection && (
                <div className="mb-6">
                  <div className="font-medium mb-2">Koleksiyon:</div>
                  <p>{product.collection}</p>
                </div>
              )}

              {/* Adet Seçimi */}
              <div className="mb-6">
                <div className="font-medium mb-2">Adet:</div>
                <div className="flex items-center">
                  <button 
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="w-10 h-10 border border-shule-grey flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-16 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-shule-grey flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Butonlar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button 
                  onClick={addToCart}
                  className="flex-1 bg-shule-brown hover:bg-shule-darkBrown text-white py-3 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Sepete Ekle
                </Button>
                <Button
                  onClick={toggleFavorite}
                  variant={isFavorite ? "destructive" : "outline"}
                  className="py-3 flex items-center justify-center gap-2"
                  disabled={isAddingToFavorites}
                >
                  <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                  {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                </Button>
              </div>
              
              {/* Etiketler */}
              {(product.is_new || product.is_bestseller || product.is_featured) && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.is_new && (
                    <span className="bg-black text-white text-xs uppercase tracking-wider py-1 px-2">
                      Yeni
                    </span>
                  )}
                  {product.is_bestseller && (
                    <span className="bg-shule-brown text-white text-xs uppercase tracking-wider py-1 px-2">
                      Çok Satan
                    </span>
                  )}
                  {product.is_featured && (
                    <span className="bg-shule-brown text-white text-xs uppercase tracking-wider py-1 px-2">
                      Öne Çıkan
                    </span>
                  )}
                </div>
              )}
              
              {/* Kargo Bilgileri */}
              <div className="space-y-4 mt-8">
                <div className="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck mt-0.5">
                    <path d="M10 17h4V5H2v12h3"/>
                    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/>
                    <path d="M14 17a2 2 0 1 1-4 0"/>
                    <path d="M20 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium">Ücretsiz Kargo</h4>
                    <p className="text-xs text-gray-500">1000 TL üzeri alışverişlerde ücretsiz kargo</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check mt-0.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium">30 Gün İade Garantisi</h4>
                    <p className="text-xs text-gray-500">Sorunsuz iade ve değişim imkanı</p>
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

export default ProductDetail;
