
import React, { useState } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images = [],
  productName
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleImageClick = () => {
    setZoomOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Ana Resim */}
        <div className="overflow-hidden border rounded-lg aspect-square">
          {images.length > 0 ? (
            <img
              src={images[currentImageIndex]}
              alt={`${productName} - Görsel ${currentImageIndex + 1}`}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={handleImageClick}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              Resim Bulunamadı
            </div>
          )}
        </div>

        {/* Küçük Resimler (Thumbnail Carousel) */}
        {images.length > 1 && (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {images.map((image, index) => (
                <CarouselItem 
                  key={index} 
                  className="pl-2 md:pl-4 basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div 
                    className={`aspect-square overflow-hidden border-2 rounded cursor-pointer 
                    ${index === currentImageIndex ? 'border-shule-brown' : 'border-transparent hover:border-gray-300'}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={image}
                      alt={`${productName} - Küçük Görsel ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 4 && (
              <>
                <CarouselPrevious className="-left-4 focus:ring-offset-0" />
                <CarouselNext className="-right-4 focus:ring-offset-0" />
              </>
            )}
          </Carousel>
        )}
      </div>

      {/* Yakınlaştırma Dialog */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="sm:max-w-[90vw] h-[90vh] p-0">
          <div className="relative h-full w-full">
            <ScrollArea className="h-full w-full">
              <div className="flex items-center justify-center min-h-[90vh] p-4">
                {images.length > 0 && (
                  <img
                    src={images[currentImageIndex]}
                    alt={`${productName} - Büyütülmüş Görsel`}
                    className="max-w-none max-h-none object-contain"
                    style={{ minWidth: '150%', minHeight: '150%' }}
                  />
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductImageCarousel;
