
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ChevronDown } from 'lucide-react';

const Products: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState('newest');

  // Örnek ürün verileri
  const allProducts = [
    {
      id: '1',
      name: 'Bali Hasır Çanta',
      price: 1250,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c3RyYXclMjBiYWd8ZW58MHx8fHwxNzE2MDYxNDM3fDA&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'Hasır Çanta',
      isNew: true,
    },
    {
      id: '2',
      name: 'Tulum Hasır El Çantası',
      price: 980,
      image: 'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHN0cmF3JTIwYmFnfGVufDB8fHx8MTcxNjA2MTQzN3ww&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'El Çantası',
      isBestseller: true,
    },
    {
      id: '3',
      name: 'Marakeş Örgü Tote',
      price: 1450,
      image: 'https://images.unsplash.com/photo-1590739225497-56c33d413340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzV8fHdvdmVuJTIwYmFnfGVufDB8fHx8MTcxNjA2MTY3NHww&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'Örgü Çanta',
    },
    {
      id: '4',
      name: 'Sardunya Mini Hasır',
      price: 850,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c3RyYXclMjBiYWd8ZW58MHx8fHwxNzE2MDYxNDM3fDA&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'Mini Çanta',
    },
    {
      id: '5',
      name: 'Portofino Hasır Çanta',
      price: 1350,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c3RyYXclMjBiYWd8ZW58MHx8fHwxNzE2MDYxNDM3fDA&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'Hasır Çanta',
    },
    {
      id: '6',
      name: 'Mykonos Mavi Hasır',
      price: 1100,
      image: 'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHN0cmF3JTIwYmFnfGVufDB8fHx8MTcxNjA2MTQzN3ww&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'Hasır Çanta',
      isNew: true,
    },
    {
      id: '7',
      name: 'Bali Örgü Plaj Çantası',
      price: 1550,
      image: 'https://images.unsplash.com/photo-1590739225497-56c33d413340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzV8fHdvdmVuJTIwYmFnfGVufDB8fHx8MTcxNjA2MTY3NHww&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'Örgü Çanta',
    },
    {
      id: '8',
      name: 'Maldiv Mini Örgü',
      price: 950,
      image: 'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHN0cmF3JTIwYmFnfGVufDB8fHx8MTcxNjA2MTQzN3ww&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'Mini Çanta',
      isBestseller: true,
    },
  ];

  // Kategorileri oluştur
  const categories = [...new Set(allProducts.map(product => product.category))];
  
  // Filtreleme işlemi
  const filteredProducts = selectedCategory 
    ? allProducts.filter(product => product.category === selectedCategory) 
    : allProducts;
    
  // Sıralama işlemi
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === 'price-asc') {
      return a.price - b.price;
    } else if (selectedSort === 'price-desc') {
      return b.price - a.price;
    } else if (selectedSort === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (selectedSort === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    // Varsayılan olarak en yeniler
    return 0;
  });

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
    if (sortOpen) setSortOpen(false);
  };

  const toggleSort = () => {
    setSortOpen(!sortOpen);
    if (filterOpen) setFilterOpen(false);
  };

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero Banner */}
        <div className="bg-shule-beige py-14">
          <div className="shule-container">
            <h1 className="shule-heading text-center">Ürünlerimiz</h1>
          </div>
        </div>
        
        {/* Filtre ve Sıralama Bölümü */}
        <div className="border-b border-shule-grey">
          <div className="shule-container flex justify-between py-4">
            <div className="relative">
              <button 
                className="flex items-center space-x-2 uppercase text-sm font-medium"
                onClick={toggleFilter}
              >
                <span>Filtrele</span>
                <ChevronDown size={16} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {filterOpen && (
                <div className="absolute left-0 top-full bg-white shadow-md min-w-48 z-20 border border-shule-grey">
                  <div className="p-4">
                    <h3 className="font-medium mb-2">Kategoriler</h3>
                    <ul className="space-y-2">
                      <li>
                        <button 
                          className={`text-sm ${selectedCategory === null ? 'font-medium text-shule-brown' : ''}`}
                          onClick={() => setSelectedCategory(null)}
                        >
                          Tümü
                        </button>
                      </li>
                      {categories.map((category) => (
                        <li key={category}>
                          <button 
                            className={`text-sm ${selectedCategory === category ? 'font-medium text-shule-brown' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                className="flex items-center space-x-2 uppercase text-sm font-medium"
                onClick={toggleSort}
              >
                <span>Sırala</span>
                <ChevronDown size={16} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {sortOpen && (
                <div className="absolute right-0 top-full bg-white shadow-md min-w-48 z-20 border border-shule-grey">
                  <div className="p-4">
                    <ul className="space-y-2">
                      <li>
                        <button 
                          className={`text-sm ${selectedSort === 'newest' ? 'font-medium text-shule-brown' : ''}`}
                          onClick={() => setSelectedSort('newest')}
                        >
                          En Yeniler
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`text-sm ${selectedSort === 'price-asc' ? 'font-medium text-shule-brown' : ''}`}
                          onClick={() => setSelectedSort('price-asc')}
                        >
                          Fiyat: Düşükten Yükseğe
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`text-sm ${selectedSort === 'price-desc' ? 'font-medium text-shule-brown' : ''}`}
                          onClick={() => setSelectedSort('price-desc')}
                        >
                          Fiyat: Yüksekten Düşüğe
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`text-sm ${selectedSort === 'name-asc' ? 'font-medium text-shule-brown' : ''}`}
                          onClick={() => setSelectedSort('name-asc')}
                        >
                          İsim: A-Z
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`text-sm ${selectedSort === 'name-desc' ? 'font-medium text-shule-brown' : ''}`}
                          onClick={() => setSelectedSort('name-desc')}
                        >
                          İsim: Z-A
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Ürünler Bölümü */}
        <section className="py-12">
          <div className="shule-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  isNew={product.isNew}
                  isBestseller={product.isBestseller}
                />
              ))}
            </div>
            
            {/* Ürün bulunamadı mesajı */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl mb-2">Üzgünüz, bu kriterlere uygun ürün bulunamadı.</h3>
                <p>Lütfen farklı bir filtre seçin veya tüm ürünleri görüntüleyin.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Products;
