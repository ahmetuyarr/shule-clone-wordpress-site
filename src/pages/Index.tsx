
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import CollectionSection from '../components/CollectionSection';
import FeaturedProducts from '../components/FeaturedProducts';
import InstagramFeed from '../components/InstagramFeed';
import NewsletterSection from '../components/NewsletterSection';

const Index: React.FC = () => {
  // Örnek koleksiyon verileri
  const collections = [
    {
      id: '1',
      title: 'Yaz Koleksiyonu',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjB8fHN0cmF3JTIwYmFnfGVufDB8fHx8MTcxNjA2MTQzN3ww&ixlib=rb-4.0.3&q=80&w=1080',
      link: '/collections/summer'
    },
    {
      id: '2',
      title: 'Hasır Çantalar',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fHN0cmF3JTIwYmFnfGVufDB8fHx8MTcxNjA2MTQzN3ww&ixlib=rb-4.0.3&q=80&w=1080',
      link: '/collections/straw-bags'
    },
    {
      id: '3',
      title: 'Örgü Çantalar',
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mjh8fGNyb2NoZXQlMjBiYWd8ZW58MHx8fHwxNzE2MDYxNTg2fDA&ixlib=rb-4.0.3&q=80&w=1080',
      link: '/collections/crochet-bags'
    }
  ];
  
  // Örnek ürün verileri
  const featuredProducts = [
    {
      id: '1',
      name: 'Bali Hasır Çanta',
      price: 1250,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c3RyYXclMjBiYWd8ZW58MHx8fHwxNzE2MDYxNDM3fDA&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'Hasır Çanta',
      isNew: true,
    },
    {
      id: '2',
      name: 'Tulum Hasır El Çantası',
      price: 980,
      image: 'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHN0cmF3JTIwYmFnfGVufDB8fHx8MTcxNjA2MTQzN3ww&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'El Çantası',
      isBestseller: true,
    },
    {
      id: '3',
      name: 'Marakeş Örgü Tote',
      price: 1450,
      image: 'https://images.unsplash.com/photo-1590739225497-56c33d413340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzV8fHdvdmVuJTIwYmFnfGVufDB8fHx8MTcxNjA2MTY3NHww&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'Örgü Çanta',
    },
    {
      id: '4',
      name: 'Sardunya Mini Hasır',
      price: 850,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c3RyYXclMjBiYWd8ZW58MHx8fHwxNzE2MDYxNDM3fDA&ixlib=rb-4.0.3&q=80&w=1080',
      category: 'Mini Çanta',
    }
  ];
  
  // Örnek Instagram gönderileri
  const instagramPosts = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzZ8fGJlYWNofGVufDB8fHx8MTcxNjA2MTcxOHww&ixlib=rb-4.0.3&q=80&w=1080',
      link: 'https://instagram.com'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mzl8fGJlYWNofGVufDB8fHx8MTcxNjA2MTcxOHww&ixlib=rb-4.0.3&q=80&w=1080',
      link: 'https://instagram.com'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8YmVhY2h8ZW58MHx8fHwxNzE2MDYxNzE4fDA&ixlib=rb-4.0.3&q=80&w=1080',
      link: 'https://instagram.com'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c3RyYXclMjBiYWd8ZW58MHx8fHwxNzE2MDYxNDM3fDA&ixlib=rb-4.0.3&q=80&w=1080',
      link: 'https://instagram.com'
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8c3VtbWVyfGVufDB8fHx8MTcxNjA2MTc2OXww&ixlib=rb-4.0.3&q=80&w=1080',
      link: 'https://instagram.com'
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1590739225497-56c33d413340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzV8fHdvdmVuJTIwYmFnfGVufDB8fHx8MTcxNjA2MTY3NHww&ixlib=rb-4.0.3&q=80&w=1080',
      link: 'https://instagram.com'
    }
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <HeroBanner 
          title="2024 Yaz Koleksiyonu"
          subtitle="Seyahatlerin ve yaz günlerinin vazgeçilmezi hasır ve örgü çantalar şimdi online mağazamızda."
          buttonText="Şimdi Keşfet"
          buttonLink="/collections/summer"
          backgroundImage="https://images.unsplash.com/photo-1506152983158-b4a74a01c721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YmVhY2h8ZW58MHx8fHwxNzE2MDYxNzE4fDA&ixlib=rb-4.0.3&q=80&w=1080"
        />
        
        {/* Koleksiyon Bölümü */}
        <CollectionSection 
          title="Koleksiyonlarımız"
          subtitle="Tarzınıza uygun el yapımı hasır ve örgü çantalarımızı keşfedin."
          collections={collections}
        />
        
        {/* Öne Çıkan Ürünler */}
        <FeaturedProducts 
          title="Öne Çıkan Ürünler"
          subtitle="El yapımı, zarif ve yaz aylarının vazgeçilmezi çantalar."
          products={featuredProducts}
          showMoreLink="/products"
          showMoreText="Tüm Ürünleri Keşfet"
        />
        
        {/* Instagram Akışı */}
        <InstagramFeed posts={instagramPosts} />
        
        {/* E-Bülten Kaydı */}
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
