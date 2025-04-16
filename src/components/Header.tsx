
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="shule-container flex items-center justify-between">
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <div className="flex-1 lg:flex-none">
          <Link to="/" className="block">
            <h1 className="font-playfair text-2xl md:text-3xl font-bold">SHULE</h1>
          </Link>
        </div>
        
        <nav className={`fixed lg:relative top-0 left-0 h-full w-full lg:w-auto lg:h-auto bg-white lg:bg-transparent transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out lg:flex lg:items-center z-40`}>
          <div className="p-6 lg:hidden flex justify-between items-center border-b border-shule-grey">
            <h2 className="font-playfair text-xl">Menu</h2>
            <button onClick={toggleMenu}>
              <X size={24} />
            </button>
          </div>
          <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 p-6 lg:p-0">
            <li>
              <Link to="/" className="uppercase text-sm font-medium tracking-wide shule-link">
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link to="/products" className="uppercase text-sm font-medium tracking-wide shule-link">
                Ürünler
              </Link>
            </li>
            <li>
              <Link to="/collections" className="uppercase text-sm font-medium tracking-wide shule-link">
                Koleksiyonlar
              </Link>
            </li>
            <li>
              <Link to="/about" className="uppercase text-sm font-medium tracking-wide shule-link">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link to="/contact" className="uppercase text-sm font-medium tracking-wide shule-link">
                İletişim
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="p-1">
            <Search size={20} />
          </button>
          <Link to="/account" className="p-1 hidden md:block">
            <User size={20} />
          </Link>
          <Link to="/wishlist" className="p-1 hidden md:block">
            <Heart size={20} />
          </Link>
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
      
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMenu}
        />
      )}
    </header>
  );
};

export default Header;
