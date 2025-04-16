
import React from 'react';
import { Link } from 'react-router-dom';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  backgroundImage
}) => {
  return (
    <div 
      className="relative h-screen bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="shule-container relative z-10">
        <div className="max-w-xl text-white">
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium mb-4">
            {title}
          </h2>
          <p className="font-montserrat text-lg md:text-xl mb-8">
            {subtitle}
          </p>
          <Link 
            to={buttonLink} 
            className="inline-block bg-white hover:bg-shule-beige text-shule-darkText py-3 px-8 uppercase text-sm tracking-wider font-medium transition-all duration-300"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
