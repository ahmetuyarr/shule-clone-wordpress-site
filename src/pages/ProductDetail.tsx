
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Minus, Plus, Star, Truck, ShieldCheck, Heart, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import FeaturedProducts from '../components/FeaturedProducts';

// Örnek ürün verileri
const productsData = [
  {
    id: '1',
    name: 'Bali Hasır Çanta',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c3RyYXclMjBiYWd8ZW58MHx8fHwxNzE2MDYxNDM3fDA&ixlib=rb-4.0.3&q=80&w=1080',
    category: 'Hasır Çanta',
    isNew: true,
    description: 'El yapımı Bali hasır çantamız, doğal malzemelerle özenle üretilmiştir. Yaz aylarının vazgeçilmez parçası olan bu çanta, plaj günleri için ideal bir tercih.',
    additionalImages: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c3RyYXclMjBiYWd8ZW58MHx8fHwxNzE2MDYxNDM3fDA&ixlib=rb-4.0.3&q=80&w=1080',
      'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHN0cmF3JTIwYmFnfGVufDB8fHx8MTcxNjA2MTQzN3ww&ixlib=rb-4.0.3&q=80&w=1080',
      'https://images.unsplash.com/photo-1590739225497-56c33d413340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzV8fHdvdmVuJTIwYmFnfGVufDB8fHx8MTcxNjA2MTY3NHww&ixlib=rb-4.0.3&q=80&w=1080'
    ],
    material: 'Doğal Hasır',
    dimensions: '35 x 25 x 15 cm',
    stock: 12,
    ratings: 4.7,
    reviews: 28,
    features: [
      'El yapımı üretim',
      'Doğal malzeme',
      'İpek astar',
      'Deri sap',
      'Mıknatıslı kapama'
    ]
  },
  {
    id: '5',
    name: 'Portofino Hasır Çanta',
    price: 1350,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c3RyYXclMjBiYWd8ZW58MHx8fHwxNzE2MDYxNDM3fDA&ixlib=rb-4.0.3&q=80&w=1080',
    category: 'Hasır Çanta',
    description: 'İtalyan Rivieria\'sından ilham alınarak tasarlanan Portofino hasır çanta, zarif detaylara ve geniş iç hacme sahiptir. Deniz kenarında günlük kullanım için idealdir.',
    additionalImages: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c3RyYXclMjBiYWd8ZW58MHx8fHwxNzE2MDYxNDM3fDA&ixlib=rb-4.0.3&q=80&w=1080',
      'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHN0cmF3JTIwYmFnfGVufDB8fHx8MTcxNjA2MTQzN3ww&ixlib=rb-4.0.3&q=80&w=1080',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fHN0cmF3JTIwYmFnfGVufDB8fHx8MTcxNjA2MTQzN3ww&ixlib=rb-4.0.3&q=80&w=1080'
    ],
    material: 'Premium Hasır',
    dimensions: '40 x 30 x 15 cm',
    stock: 8,
    ratings: 4.9,
    reviews: 32,
    features: [
      'El yapımı üretim',
      'Premium kalite hasır',
      'Pamuk astar',
      'Ayarlanabilir deri sap',
      'İç cep detayları',
      'Fermuarlı kapama'
    ]
  }
];

// İlgili ürünler (aynı kategoriden)
const relatedProducts = [
  {
    id: '3',
    name: 'Marakeş Örgü Tote',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1590739225497-56c33d413340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzV8fHdvdmVuJTIwYmFnfGVufDB8fHx8MTcxNjA2MTY3NHww&ixlib=rb-4.0.3&q=80&w=1080',
    category: 'Örgü Çanta',
  },
  {
    id: '6',
    name: 'Mykonos Mavi Hasır',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHN0cmF3JTIwYmFnfGVufDB8fHx8MTcxNjA2MTQzN3ww&ixlib=rb-4.0.3&q=80&w=1080',
    category: 'Hasır Çanta',
    isNew: true,
  },
  {
    id: '7',
    name: 'Bali Örgü Plaj Çantası',
    price: 1550,
    image: 'https://images.unsplash.com/photo-1590739225497-56c33d413340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzV8fHdvdmVuJTIwYmFnfGVufDB8fHx8MTcxNjA2MTY3NHww&ixlib=rb-4.0.3&q=80&w=1080',
    category: 'Örgü Çanta',
  },
  {
    id: '8',
    name: 'Maldiv Mini Örgü',
    price: 950,
    image: 'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHN0cmF3JTIwYmFnfGVufDB8fHx8MTcxNjA2MTQzN3ww&ixlib=rb-4.0.3&q=80&w=1080',
    category: 'Mini Çanta',
    isBestseller: true,
  },
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Ürün verilerini al
  const product = productsData.find(p => p.id === id) || productsData[1]; // Default olarak Portofino Hasır Çantayı göster
  
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.image);
  
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const addToCart = () => {
    toast({
      title: "Sepete Eklendi",
      description: `${product.name} ürünü sepete eklendi.`,
    });
  };
  
  const addToWishlist = () => {
    toast({
      title: "İstek Listesine Eklendi",
      description: `${product.name} ürünü istek listesine eklendi.`,
    });
  };
  
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="bg-shule-lightGrey py-3">
          <div className="shule-container">
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Ana Sayfa</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Ürünler</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/collections/${product.category.toLowerCase().replace(' ', '-')}`}>{product.category}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <span>{product.name}</span>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
        
        {/* Ürün Detayı */}
        <section className="py-12">
          <div className="shule-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Ürün Görselleri */}
              <div>
                <div className="mb-4 aspect-square overflow-hidden">
                  <img 
                    src={mainImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {product.additionalImages.map((img, index) => (
                    <div 
                      key={index}
                      className={`aspect-square cursor-pointer border-2 ${mainImage === img ? 'border-shule-brown' : 'border-transparent'}`}
                      onClick={() => setMainImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} - ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Ürün Bilgileri */}
              <div>
                <h1 className="shule-heading mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.floor(product.ratings) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm">{product.ratings}/5 ({product.reviews} yorum)</span>
                </div>
                <div className="text-2xl font-medium mb-6">{product.price.toLocaleString('tr-TR')} TL</div>
                
                <p className="shule-paragraph mb-6">{product.description}</p>
                
                <div className="mb-8">
                  <div className="font-medium mb-2">Özellikler:</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-sm">{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-sm font-medium block mb-1">Malzeme</span>
                    <span className="text-sm">{product.material}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium block mb-1">Boyutlar</span>
                    <span className="text-sm">{product.dimensions}</span>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="flex border border-shule-grey mr-4">
                    <button 
                      onClick={decrementQuantity}
                      className="px-3 py-2"
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="text" 
                      value={quantity} 
                      readOnly
                      className="w-12 text-center"
                    />
                    <button 
                      onClick={incrementQuantity}
                      className="px-3 py-2"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-sm">
                    <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                      {product.stock > 0 ? `${product.stock} adet stokta` : "Stokta yok"}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    className="bg-shule-brown hover:bg-shule-darkBrown flex-1"
                    onClick={addToCart}
                  >
                    Sepete Ekle
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-shule-grey hover:bg-shule-grey flex items-center justify-center"
                    onClick={addToWishlist}
                  >
                    <Heart size={18} />
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-shule-grey hover:bg-shule-grey flex items-center justify-center"
                  >
                    <Share2 size={18} />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Truck size={18} className="mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Ücretsiz Kargo</h4>
                      <p className="text-xs text-gray-500">1000 TL üzeri alışverişlerde ücretsiz kargo</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ShieldCheck size={18} className="mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">30 Gün İade Garantisi</h4>
                      <p className="text-xs text-gray-500">Sorunsuz iade ve değişim imkanı</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ürün Detay Sekmeleri */}
            <div className="mt-16">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="details">Ürün Detayları</TabsTrigger>
                  <TabsTrigger value="shipping">Kargo & İade</TabsTrigger>
                  <TabsTrigger value="reviews">Yorumlar ({product.reviews})</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Ürün Özellikleri</h3>
                          <p className="text-sm">
                            {product.name} tamamen doğal hasır malzemeyle el yapımı olarak üretilmiştir. Her bir çanta zanaatkarlarımız tarafından özenle örülür ve benzersiz detaylarla süslenir. Dayanıklı yapısı ve şık tasarımı ile günlük kullanıma uygundur.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Bakım</h3>
                          <p className="text-sm">
                            Hasır çantanızın uzun ömürlü olması için direkt güneş ışığından ve nemden uzak tutun. Lekelendiğinde nemli bir bezle hafifçe silin ve doğal yollarla kurumaya bırakın. Sert kimyasallar kullanmaktan kaçının.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Materyal Bilgisi</h3>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Ana Malzeme: %100 Doğal Hasır</li>
                            <li>İç Astar: %100 Pamuk</li>
                            <li>Sap: Doğal Deri</li>
                            <li>Aksesuarlar: Pirinç</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="shipping">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Kargo Bilgisi</h3>
                          <p className="text-sm">
                            Siparişiniz, ödemenin onaylanmasından sonra 1-2 iş günü içerisinde kargoya verilir. Türkiye genelinde teslimat süresi 2-4 iş günüdür. 1000 TL üzeri alışverişlerde kargo ücretsizdir.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">İade ve Değişim</h3>
                          <p className="text-sm">
                            Ürünü teslim aldığınız tarihten itibaren 30 gün içerisinde iade edebilirsiniz. İade edilecek ürünün kullanılmamış, yıpranmamış ve orijinal ambalajında olması gerekmektedir. İade ve değişim için müşteri hizmetlerimizle iletişime geçebilirsiniz.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="reviews">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        {/* Örnek Yorumlar */}
                        <div className="border-b border-shule-grey pb-6">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h4 className="font-medium">Ayşe Y.</h4>
                              <div className="flex">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={14} 
                                    className={i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">12.04.2023</span>
                          </div>
                          <p className="text-sm">
                            Harika bir çanta! Tam umduğum gibi ve fotoğraftakinden daha güzel. Plaja giderken kullandım, çok kullanışlı ve şık. Kesinlikle tavsiye ediyorum.
                          </p>
                        </div>
                        
                        <div className="border-b border-shule-grey pb-6">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h4 className="font-medium">Mehmet K.</h4>
                              <div className="flex">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={14} 
                                    className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">01.05.2023</span>
                          </div>
                          <p className="text-sm">
                            Eşim için aldım, çok beğendi. Kalitesi güzel, detaylar özenli. Sadece kargo biraz gecikti, onun dışında memnun kaldık.
                          </p>
                        </div>
                        
                        <div className="border-b border-shule-grey pb-6">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h4 className="font-medium">Zeynep A.</h4>
                              <div className="flex">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={14} 
                                    className={i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">22.06.2023</span>
                          </div>
                          <p className="text-sm">
                            İkinci Shule çantam ve yine çok memnunum. El yapımı olduğu belli, her detayı çok güzel düşünülmüş. Yazın vazgeçilmezim oldu.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* İlgili Ürünler */}
        <FeaturedProducts 
          title="Benzer Ürünler"
          products={relatedProducts}
          showMoreLink="/products"
          showMoreText="Tüm Ürünleri Keşfet"
        />
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
