
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("newest");

  // Ürünleri Supabase'den çek
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('Ürünler yüklenirken hata:', error);
        return [];
      }
      
      return data || [];
    }
  });

  // Kategorileri Supabase'den çek
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .order('category');
      
      if (error) {
        console.error('Kategoriler yüklenirken hata:', error);
        return [];
      }

      // Benzersiz kategorileri döndür
      const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
      return uniqueCategories || [];
    }
  });

  // Filtrelenmiş ve sıralanmış ürünleri hazırla
  const filteredProducts = products.filter(product => 
    !selectedCategory || product.category === selectedCategory
  );

  // Sıralama işlemi
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
      default:
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });

  // Mobil filtre görünümü için
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
              <span className="font-medium">Ürünler</span>
            </nav>
          </div>
        </div>

        <div className="shule-container py-12">
          <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:space-x-8">
            {/* Sol Filtreler */}
            <div className="lg:w-1/4">
              <div className="mb-6 lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <h2 className="font-medium">Filtreler</h2>
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                </div>
                
                <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block space-y-6`}>
                  <div>
                    <h3 className="text-lg font-playfair mb-3">Kategoriler</h3>
                    <ul className="space-y-2">
                      <li>
                        <button 
                          onClick={() => setSelectedCategory(null)}
                          className={`flex items-center w-full text-left ${!selectedCategory ? 'font-medium text-shule-brown' : ''}`}
                        >
                          Tümü
                        </button>
                      </li>
                      {categories.map((category, index) => (
                        <li key={index}>
                          <button 
                            onClick={() => setSelectedCategory(category)}
                            className={`flex items-center w-full text-left ${selectedCategory === category ? 'font-medium text-shule-brown' : ''}`}
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sağ Ürünler */}
            <div className="lg:w-3/4">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h1 className="shule-heading mb-3 md:mb-0">
                  Ürünler
                </h1>
                
                <div className="flex items-center space-x-4">
                  <select 
                    className="shule-input py-1 px-2"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="newest">En Yeniler</option>
                    <option value="price-low">Fiyata Göre (Artan)</option>
                    <option value="price-high">Fiyata Göre (Azalan)</option>
                    <option value="name">İsme Göre (A-Z)</option>
                  </select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="mt-2">Ürünler yükleniyor...</p>
                </div>
              ) : (
                <>
                  {sortedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          image={product.image}
                          category={product.category}
                          isNew={product.is_new}
                          isBestseller={product.is_bestseller}
                          isOnSale={product.is_on_sale}
                          salePrice={product.sale_price}
                          isFeatured={product.is_featured}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p>Bu kriterlere uygun ürün bulunamadı.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
