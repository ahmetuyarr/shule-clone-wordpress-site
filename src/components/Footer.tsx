
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-shule-beige pt-16 pb-8">
      <div className="shule-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-playfair text-xl mb-4">SHULE</h3>
            <p className="shule-paragraph mb-4">
              Yerel zanaatkârlar tarafından el yapımı üretilen hasır ve örgü çantalar.
              Doğal malzemeler, özgün tasarımlar.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="shule-link">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="shule-link">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="shule-link">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="uppercase font-montserrat text-sm font-semibold mb-4">Alışveriş</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="shule-link text-sm">
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link to="/collections/summer" className="shule-link text-sm">
                  Yaz Koleksiyonu
                </Link>
              </li>
              <li>
                <Link to="/collections/bestsellers" className="shule-link text-sm">
                  En Çok Satanlar
                </Link>
              </li>
              <li>
                <Link to="/collections/new" className="shule-link text-sm">
                  Yeni Gelenler
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="uppercase font-montserrat text-sm font-semibold mb-4">Yardım</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="shule-link text-sm">
                  Kargo ve Teslimat
                </Link>
              </li>
              <li>
                <Link to="/returns" className="shule-link text-sm">
                  İade ve Değişim
                </Link>
              </li>
              <li>
                <Link to="/sizing" className="shule-link text-sm">
                  Boyut Rehberi
                </Link>
              </li>
              <li>
                <Link to="/faq" className="shule-link text-sm">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="uppercase font-montserrat text-sm font-semibold mb-4">İletişim</h3>
            <p className="text-sm mb-2">info@shulebags.com</p>
            <p className="text-sm mb-4">+90 (212) 555 1234</p>
            <h4 className="uppercase font-montserrat text-sm font-semibold mb-2">Bülten</h4>
            <p className="text-sm mb-2">Yeni ürünler ve kampanyalar için kaydolun.</p>
            <form className="flex mt-2">
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="shule-input text-sm py-2 px-3"
                required
              />
              <button 
                type="submit" 
                className="bg-shule-brown hover:bg-shule-darkBrown text-white py-2 px-4 text-sm uppercase tracking-wider"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-shule-grey pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-shule-darkText/70 mb-4 md:mb-0">
            © {new Date().getFullYear()} SHULE. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-4">
            <Link to="/privacy" className="text-xs shule-link">
              Gizlilik Politikası
            </Link>
            <Link to="/terms" className="text-xs shule-link">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
