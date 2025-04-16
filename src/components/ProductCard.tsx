
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isOnSale?: boolean;
  salePrice?: number;
  isFeatured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  isNew = false,
  isBestseller = false,
  isOnSale = false,
  salePrice,
  isFeatured = false
}) => {
  return (
    <div className="shule-card group">
      <div className="relative overflow-hidden">
        <Link to={`/products/${id}`}>
          <img 
            src={image} 
            alt={name} 
            className="shule-product-image aspect-[3/4] object-cover w-full"
          />
        </Link>
        
        {/* Product badges */}
        {isNew && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs uppercase tracking-wider py-1 px-2">
            Yeni
          </div>
        )}
        {isBestseller && (
          <div className="absolute top-2 right-2 bg-shule-brown text-white text-xs uppercase tracking-wider py-1 px-2">
            Çok Satan
          </div>
        )}
        {isOnSale && !isBestseller && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs uppercase tracking-wider py-1 px-2">
            İndirim
          </div>
        )}
        {isFeatured && !isBestseller && !isOnSale && (
          <div className="absolute top-2 right-2 bg-shule-brown text-white text-xs uppercase tracking-wider py-1 px-2">
            Öne Çıkan
          </div>
        )}
        
        {/* Quick action buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white hover:bg-shule-beige p-3 rounded-full shadow-md transition-colors duration-300">
            <ShoppingBag size={18} />
          </button>
          <button className="bg-white hover:bg-shule-beige p-3 rounded-full shadow-md transition-colors duration-300">
            <Heart size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-shule-darkText/70 mb-1">{category}</p>
        <Link to={`/products/${id}`} className="block mb-1 hover:text-shule-brown transition-colors">
          <h3 className="font-medium">{name}</h3>
        </Link>
        {isOnSale && salePrice ? (
          <div className="flex items-center space-x-2">
            <p className="font-medium">{salePrice.toLocaleString('tr-TR')} TL</p>
            <p className="text-sm line-through text-gray-500">{price.toLocaleString('tr-TR')} TL</p>
          </div>
        ) : (
          <p className="font-medium">{price.toLocaleString('tr-TR')} TL</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
