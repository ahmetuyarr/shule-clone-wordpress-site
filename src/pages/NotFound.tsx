
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Oops! Sayfa bulunamadı</p>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Aradığınız sayfa mevcut değil veya başka bir URL'ye taşınmış olabilir.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-shule-brown text-white px-6 py-3 rounded hover:bg-shule-darkBrown transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
