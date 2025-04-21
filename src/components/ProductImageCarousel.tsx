
import { useState, useEffect, useCallback } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

const ProductImageCarousel = ({ images, productName }: ProductImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  
  // Tek resim varsa carousel göstermeye gerek yok
  if (images.length <= 1) {
    return (
      <div className="mb-4 aspect-square overflow-hidden">
        <img 
          src={images[0]} 
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  
  return (
    <div className="space-y-4">
      <Carousel 
        className="w-full"
        opts={{
          startIndex: currentIndex
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-square overflow-hidden">
                <img 
                  src={image} 
                  alt={`${productName} - Görsel ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-2 mt-4">
          <CarouselPrevious className="relative inset-auto -left-0 transform-none" />
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {images.length}
          </span>
          <CarouselNext className="relative inset-auto -right-0 transform-none" />
        </div>
      </Carousel>
      
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button 
            key={index} 
            className={`border rounded overflow-hidden aspect-square ${index === currentIndex ? 'ring-2 ring-shule-brown' : ''}`}
            onClick={() => {
              setCurrentIndex(index);
              api?.scrollTo(index);
            }}
          >
            <img 
              src={image} 
              alt={`${productName} - Küçük Görsel ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel;
