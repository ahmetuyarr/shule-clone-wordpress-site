
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SearchDialog } from './SearchDialog';

interface MenuItem {
  id: string;
  name: string;
  link: string;
  parent_id: string | null;
  position: number;
  is_active: boolean;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation(); // URL'yi takip etmek için kullanılır

  // Menü öğelerini yükle
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_active', true)
          .is('parent_id', null) // Use is() instead of eq() for null values
          .order('position');
          
        if (error) throw error;
        setMenuItems(data || []);
      } catch (error) {
        console.error('Menü öğeleri yüklenirken hata:', error);
      }
    };
    
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('shuleCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartCount(parsedCart.reduce((total: number, item: any) => total + item.quantity, 0));
      } catch (e) {
        console.error('Cart loading error:', e);
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'shuleCart') {
        const newCart = e.newValue ? JSON.parse(e.newValue) : [];
        setCartCount(newCart.reduce((total: number, item: any) => total + item.quantity, 0));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // URL'yi kontrol eden yardımcı fonksiyon
  const handleNavigation = (path: string, event: React.MouseEvent) => {
    // Eğer şu anki konum ile gidilecek konum aynı ise, olayı engelleyelim
    if (location.pathname === path) {
      event.preventDefault();
      // İsteğe bağlı olarak sayfayı yenileyebiliriz veya başka bir işlem yapabiliriz
      // window.location.reload(); // Sayfayı yenilemek isterseniz
      return;
    }
    
    setIsMenuOpen(false); // Menüyü kapatalım
  };

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="shule-container flex items-center justify-between py-4">
        <div className="flex items-center">
          <button onClick={toggleMenu} className="p-2 lg:hidden">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="mx-auto lg:mx-0">
            <Link to="/" className="block">
              <h1 className="text-3xl md:text-5xl text-zinc-950 font-bold">ÖZEL ÇANTA</h1>
            </Link>
          </div>
        </div>
        
        <nav className={`fixed lg:relative top-0 left-0 h-full w-full lg:w-auto lg:h-auto bg-white lg:bg-transparent transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out lg:flex lg:items-center z-40`}>
          <div className="p-6 lg:hidden flex justify-between items-center border-b border-shule-grey">
            <h2 className="font-playfair text-xl">Menu</h2>
            <button onClick={toggleMenu}>
              <X size={24} />
            </button>
          </div>
          <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 p-6 lg:p-0">
            {/* Dinamik menü öğeleri */}
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link 
                  to={item.link} 
                  onClick={(e) => handleNavigation(item.link, e)} 
                  className="uppercase text-sm font-medium tracking-wide shule-link"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            {/* Menü öğeleri yoksa statik öğeleri göster */}
            {menuItems.length === 0 && (
              <>
                <li>
                  <Link 
                    to="/" 
                    onClick={(e) => handleNavigation("/", e)} 
                    className="uppercase text-sm font-medium tracking-wide shule-link"
                  >
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products" 
                    onClick={(e) => handleNavigation("/products", e)} 
                    className="uppercase text-sm font-medium tracking-wide shule-link"
                  >
                    Ürünler
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/collections" 
                    onClick={(e) => handleNavigation("/collections", e)} 
                    className="uppercase text-sm font-medium tracking-wide shule-link"
                  >
                    Koleksiyonlar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="p-1" onClick={() => setIsSearchOpen(true)}>
            <Search size={20} />
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/account" className="p-1 hidden md:block">
                <User size={20} />
              </Link>
              <Link to="/favorites" className="p-1 hidden md:block">
                <Heart size={20} />
              </Link>
            </>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/auth')} className="hidden md:block">
              Giriş Yap
            </Button>
          )}
          <Link to="/cart" className="p-1 relative">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-shule-brown text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      <SearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
      />
      
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
};

export default Header;
