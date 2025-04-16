
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cart = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Hasır Büyük Plaj Çantası",
      price: 499.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1590739225497-56c33d413340?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      name: "Örgü Mini Omuz Çantası",
      price: 349.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
  ]);

  const increaseQuantity = (id: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id: number) => {
    setCart(cart.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="shule-container">
          <h1 className="shule-heading mb-8">Alışveriş Sepeti</h1>
          
          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex border-b border-shule-grey py-6">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-shule-brown font-medium mt-1">{item.price.toFixed(2)} ₺</p>
                      <div className="flex items-center mt-3">
                        <button 
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 border border-shule-grey flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => increaseQuantity(item.id)}
                          className="w-8 h-8 border border-shule-grey flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-shule-brown hover:text-shule-darkBrown"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                      <p className="font-medium">{(item.price * item.quantity).toFixed(2)} ₺</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-shule-lightGrey p-6">
                <h3 className="font-playfair text-xl mb-6">Sipariş Özeti</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Ara Toplam</span>
                    <span>{calculateTotal().toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kargo</span>
                    <span>{calculateTotal() > 1000 ? 'Ücretsiz' : '29.99 ₺'}</span>
                  </div>
                  <div className="border-t border-shule-grey pt-3 font-medium flex justify-between">
                    <span>Toplam</span>
                    <span>{(calculateTotal() + (calculateTotal() > 1000 ? 0 : 29.99)).toFixed(2)} ₺</span>
                  </div>
                </div>
                
                <Button className="w-full bg-shule-brown hover:bg-shule-darkBrown text-white">
                  Ödemeye Geç
                </Button>
                
                <div className="mt-6 text-center">
                  <Link to="/products" className="shule-link text-sm">
                    Alışverişe Devam Et
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shopping-bag mx-auto mb-4 text-gray-400">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <h2 className="shule-subheading mb-4">Sepetiniz boş</h2>
              <p className="shule-paragraph mb-6">Henüz sepetinize ürün eklemediniz.</p>
              <Button asChild className="bg-shule-brown hover:bg-shule-darkBrown text-white">
                <Link to="/products">Alışverişe Başla</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
