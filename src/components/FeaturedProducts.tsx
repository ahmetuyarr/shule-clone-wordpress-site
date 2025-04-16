
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  showMoreLink?: string;
  showMoreText?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  subtitle,
  products,
  showMoreLink,
  showMoreText = "Tümünü Görüntüle"
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="shule-container">
        <div className="text-center mb-12">
          <h2 className="shule-heading mb-3">{title}</h2>
          {subtitle && <p className="shule-paragraph max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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
        
        {showMoreLink && (
          <div className="text-center mt-12">
            <Link 
              to={showMoreLink}
              className="shule-button inline-block"
            >
              {showMoreText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
