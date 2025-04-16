
import React from 'react';
import { Link } from 'react-router-dom';

interface Collection {
  id: string;
  title: string;
  image: string;
  link: string;
}

interface CollectionSectionProps {
  title: string;
  subtitle: string;
  collections: Collection[];
}

const CollectionSection: React.FC<CollectionSectionProps> = ({
  title,
  subtitle,
  collections
}) => {
  return (
    <section className="py-20">
      <div className="shule-container">
        <div className="text-center mb-12">
          <h2 className="shule-heading mb-3">{title}</h2>
          <p className="shule-paragraph max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link 
              to={collection.link}
              key={collection.id}
              className="group relative h-[500px] overflow-hidden"
            >
              <img 
                src={collection.image} 
                alt={collection.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="shule-subheading text-white">{collection.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
