
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// Örnek veri
const collectionsData = {
  "summer-2024": {
    name: "Yaz 2024",
    description: "2024 yılının en yeni hasır ve örgü çanta koleksiyonu, sahiller ve yaz tatilleri için ideal tasarımlar.",
    banner: "https://images.unsplash.com/photo-1523381294911-8d3cead13475",
    products: [
      {
        id: "1",
        name: "Büyük Hasır Plaj Çantası",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
        category: "Plaj Çantaları",
        isFeatured: true,
        isOnSale: false,
        isNew: true
      },
      {
        id: "2",
        name: "Örgü Mini Omuz Çantası",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        category: "Mini Çantalar",
        isFeatured: false,
        isOnSale: true,
        salePrice: 279.99,
        isNew: true
      },
      {
        id: "3",
        name: "El Örgüsü Sepet Çanta",
        price: 449.99,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
        category: "Sepet Çantalar",
        isFeatured: true,
        isOnSale: false,
        isNew: false
      },
      {
        id: "4",
        name: "Hasır Clutch Çanta",
        price: 279.99,
        image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a",
        category: "Akşam Çantaları",
        isFeatured: false,
        isOnSale: false,
        isNew: true
      },
      {
        id: "5",
        name: "El Örgüsü Boho Çanta",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1590739225497-56c33d413340",
        category: "Günlük Çantalar",
        isFeatured: true,
        isOnSale: true,
        salePrice: 479.99,
        isNew: false
      },
      {
        id: "6",
        name: "Yuvarlak Formlu Hasır Çanta",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1573346688670-3cde4e0cad64",
        category: "Günlük Çantalar",
        isFeatured: false,
        isOnSale: false,
        isNew: true
      }
    ]
  },
  "beach-bags": {
    name: "Plaj Çantaları",
    description: "Sahil günleriniz için ideal çanta modelleri, geniş ve kullanışlı tasarımlarla yazın tadını çıkarın.",
    banner: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f",
    products: [
      {
        id: "7",
        name: "Büyük Hasır Plaj Çantası",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
        category: "Plaj Çantaları",
        isFeatured: true,
        isOnSale: false,
        isNew: true
      },
      {
        id: "8",
        name: "Püsküllü Plaj Tote Çanta",
        price: 449.99,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
        category: "Plaj Çantaları",
        isFeatured: false,
        isOnSale: true,
        salePrice: 379.99,
        isNew: true
      },
      {
        id: "9",
        name: "XXL Plaj Hasır Çanta",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1528812969535-4bcefc071532",
        category: "Plaj Çantaları",
        isFeatured: true,
        isOnSale: false,
        isNew: false
      },
      {
        id: "10",
        name: "Çizgili Plaj Çantası",
        price: 429.99,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
        category: "Plaj Çantaları",
        isFeatured: false,
        isOnSale: false,
        isNew: false
      }
    ]
  },
  "evening-collection": {
    name: "Akşam Koleksiyonu",
    description: "Özel davatlere uygun zarif hasır ve örgü çantalar, şık tasarımlarla stilinizi tamamlayın.",
    banner: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
    products: [
      {
        id: "11",
        name: "Hasır Clutch Çanta",
        price: 279.99,
        image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a",
        category: "Akşam Çantaları",
        isFeatured: true,
        isOnSale: false,
        isNew: false
      },
      {
        id: "12",
        name: "İnce İplikli Akşam Çantası",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
        category: "Akşam Çantaları",
        isFeatured: false,
        isOnSale: true,
        salePrice: 299.99,
        isNew: true
      },
      {
        id: "13",
        name: "Mini Hasır El Çantası",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1566150902887-9679ecc155ba",
        category: "Akşam Çantaları",
        isFeatured: true,
        isOnSale: false,
        isNew: true
      }
    ]
  },
  "mini-bags": {
    name: "Mini Çantalar",
    description: "Şık ve kullanışlı mini çanta modelleri, günlük kullanım için ideal boyut ve tasarımlar.",
    banner: "https://images.unsplash.com/photo-1563904092230-7ec217b65fe2",
    products: [
      {
        id: "2",
        name: "Örgü Mini Omuz Çantası",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        category: "Mini Çantalar",
        isFeatured: false,
        isOnSale: true,
        salePrice: 279.99,
        isNew: true
      },
      {
        id: "14",
        name: "Yuvarlak Mini Hasır Çanta",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
        category: "Mini Çantalar",
        isFeatured: true,
        isOnSale: false,
        isNew: false
      },
      {
        id: "15",
        name: "Mini Örgü Crossbody Çanta",
        price: 279.99,
        image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6",
        category: "Mini Çantalar",
        isFeatured: false,
        isOnSale: true,
        salePrice: 239.99,
        isNew: true
      }
    ]
  },
  "bestsellers": {
    name: "Çok Satanlar",
    description: "En çok tercih edilen hasır ve örgü çantalar, müşterilerimizin en beğendiği modeller.",
    banner: "https://images.unsplash.com/photo-1591561954557-26941169b49e",
    products: [
      {
        id: "1",
        name: "Büyük Hasır Plaj Çantası",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
        category: "Plaj Çantaları",
        isFeatured: true,
        isOnSale: false,
        isNew: false
      },
      {
        id: "3",
        name: "El Örgüsü Sepet Çanta",
        price: 449.99,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
        category: "Sepet Çantalar",
        isFeatured: true,
        isOnSale: false,
        isNew: false
      },
      {
        id: "5",
        name: "El Örgüsü Boho Çanta",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1590739225497-56c33d413340",
        category: "Günlük Çantalar",
        isFeatured: true,
        isOnSale: true,
        salePrice: 479.99,
        isNew: false
      },
      {
        id: "8",
        name: "Püsküllü Plaj Tote Çanta",
        price: 449.99,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
        category: "Plaj Çantaları",
        isFeatured: false,
        isOnSale: true,
        salePrice: 379.99,
        isNew: false
      }
    ]
  },
  "handcrafted": {
    name: "El Yapımı Özel Seri",
    description: "Yerel zanaatkârlar tarafından üretilen özel seri çantalar, benzersiz tasarımlar ve sınırlı sayıda üretim.",
    banner: "https://images.unsplash.com/photo-1528476625962-40426bc60a5d",
    products: [
      {
        id: "16",
        name: "Özel Tasarım Hasır Çanta",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1590739225497-56c33d413340",
        category: "Özel Seri",
        isFeatured: true,
        isOnSale: false,
        isNew: true
      },
      {
        id: "17",
        name: "El İşçiliği Püsküllü Çanta",
        price: 649.99,
        image: "https://images.unsplash.com/photo-1573346688670-3cde4e0cad64",
        category: "Özel Seri",
        isFeatured: true,
        isOnSale: false,
        isNew: true
      },
      {
        id: "18",
        name: "İmza Seri Hasır Çanta",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1566150902887-9679ecc155ba",
        category: "Özel Seri",
        isFeatured: false,
        isOnSale: true,
        salePrice: 749.99,
        isNew: true
      }
    ]
  }
};

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Gerçek bir API çağrısı simule ediyoruz
    setLoading(true);
    setTimeout(() => {
      if (id && collectionsData[id as keyof typeof collectionsData]) {
        setCollection(collectionsData[id as keyof typeof collectionsData]);
      }
      setLoading(false);
    }, 300);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shule-brown"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="shule-container text-center">
            <h1 className="shule-heading mb-4">Koleksiyon Bulunamadı</h1>
            <p className="shule-paragraph mb-8">Aradığınız koleksiyon bulunamadı veya kaldırılmış olabilir.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        {/* Collection Banner */}
        <div className="relative h-[400px]">
          <img 
            src={collection.banner} 
            alt={collection.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white max-w-3xl px-4">
              <h1 className="shule-heading mb-3">{collection.name}</h1>
              <p className="shule-paragraph">{collection.description}</p>
            </div>
          </div>
        </div>
        
        {/* Products */}
        <div className="shule-container py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collection.products.map((product: any) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                salePrice={product.salePrice}
                isNew={product.isNew}
                isFeatured={product.isFeatured}
                isOnSale={product.isOnSale}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionDetail;
