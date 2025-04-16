
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const collectionsData = [
  {
    id: "summer-2024",
    name: "Yaz 2024",
    description: "2024 yılının en yeni hasır ve örgü çanta koleksiyonu",
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475",
    products: 24
  },
  {
    id: "beach-bags",
    name: "Plaj Çantaları",
    description: "Sahil günleriniz için ideal çanta modelleri",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    products: 18
  },
  {
    id: "evening-collection",
    name: "Akşam Koleksiyonu",
    description: "Özel davatlere uygun zarif hasır ve örgü çantalar",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    products: 12
  },
  {
    id: "mini-bags",
    name: "Mini Çantalar",
    description: "Şık ve kullanışlı mini çanta modelleri",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
    products: 15
  },
  {
    id: "bestsellers",
    name: "Çok Satanlar",
    description: "En çok tercih edilen hasır ve örgü çantalar",
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a",
    products: 20
  },
  {
    id: "handcrafted",
    name: "El Yapımı Özel Seri",
    description: "Yerel zanaatkârlar tarafından üretilen özel seri çantalar",
    image: "https://images.unsplash.com/photo-1590739225497-56c33d413340",
    products: 9
  }
];

const Collections = () => {
  const [collections] = useState(collectionsData);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="shule-container">
          <h1 className="shule-heading text-center mb-3">Koleksiyonlar</h1>
          <p className="shule-paragraph text-center max-w-2xl mx-auto mb-12">
            Her mevsim ve her ortam için tasarlanmış hasır ve örgü çanta koleksiyonlarımızı keşfedin.
            El yapımı, özgün ve doğal malzemelerden üretilen çantalarımız her tarza uyum sağlar.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link 
                key={collection.id} 
                to={`/collections/${collection.id}`}
                className="group"
              >
                <div className="relative h-[400px] overflow-hidden">
                  <img 
                    src={collection.image} 
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-6">
                    <h2 className="font-playfair text-2xl mb-2">{collection.name}</h2>
                    <p className="text-center mb-3">{collection.description}</p>
                    <span className="text-sm border border-white px-3 py-1">
                      {collection.products} ÜRÜN
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
