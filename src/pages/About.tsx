
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Banner */}
        <div className="relative h-[400px]">
          <img 
            src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3" 
            alt="Shule Bags Hikayemiz" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white max-w-3xl px-4">
              <h1 className="shule-heading mb-3">Hikayemiz</h1>
              <p className="shule-paragraph">El yapımı hasır ve örgü çantalarda 20 yıllık tecrübe</p>
            </div>
          </div>
        </div>
        
        {/* Hikayemiz */}
        <section className="py-16">
          <div className="shule-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="shule-heading mb-6">Doğadan İlham Alan Tasarımlar</h2>
                <div className="space-y-4">
                  <p className="shule-paragraph">
                    Shule Bags, 2004 yılında İzmir'in küçük bir sahil kasabasında kuruldu. Kurucumuz Ayşe Demir, 
                    çocukluğundan beri anneannesinden öğrendiği hasır örme sanatını modern tasarımlarla 
                    buluşturarak yola çıktı.
                  </p>
                  <p className="shule-paragraph">
                    Misyonumuz, geleneksel el sanatlarını yaşatmak ve doğal malzemelerden üretilen, uzun ömürlü 
                    ve çevre dostu ürünler sunmak. Her bir çantamız, yerel zanaatkârlar tarafından özenle 
                    üretiliyor ve benzersiz bir tasarım sunuyor.
                  </p>
                  <p className="shule-paragraph">
                    Bugün Shule Bags, Türkiye'nin önde gelen hasır ve örgü çanta markalarından biri olarak 
                    varlığını sürdürüyor. Koleksiyonlarımızı her sezon genişletirken, kaliteden ve özgünlükten 
                    ödün vermiyoruz.
                  </p>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d" 
                  alt="Shule Bags Hikayemiz" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Değerlerimiz */}
        <section className="py-16 bg-shule-beige">
          <div className="shule-container text-center">
            <h2 className="shule-heading mb-3">Değerlerimiz</h2>
            <p className="shule-paragraph max-w-3xl mx-auto mb-12">
              Her bir Shule çantasında öne çıkan değerlerimiz ve ilkelerimiz
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="bg-shule-lightBeige w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-leaf">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                  </svg>
                </div>
                <h3 className="font-playfair text-xl mb-4">Sürdürülebilirlik</h3>
                <p className="shule-paragraph">
                  Çevre dostu ve sürdürülebilir malzemeler kullanarak doğayı korumaya özen gösteriyoruz.
                  Tüm ürünlerimiz doğal ve geri dönüştürülebilir malzemelerden üretiliyor.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="bg-shule-lightBeige w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    <path d="M5 3v4"/>
                    <path d="M19 17v4"/>
                    <path d="M3 5h4"/>
                    <path d="M17 19h4"/>
                  </svg>
                </div>
                <h3 className="font-playfair text-xl mb-4">El İşçiliği</h3>
                <p className="shule-paragraph">
                  Her bir çantamız yerel zanaatkârlarımız tarafından geleneksel yöntemlerle, el işçiliği ile üretiliyor.
                  Böylece her ürünümüz kendine has özellikler taşıyor.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="bg-shule-lightBeige w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-heart-handshake">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.82 2.95 0l1.14-1.14a2.17 2.17 0 0 1 3.08 0v0c.82.82.82 2.13 0 2.95L12 17"/>
                  </svg>
                </div>
                <h3 className="font-playfair text-xl mb-4">Toplumsal Fayda</h3>
                <p className="shule-paragraph">
                  Yerel toplulukları destekleyerek kadın istihdamına katkıda bulunuyoruz. Kâr amacı gütmeyen 
                  organizasyonlarla iş birliği yaparak eğitim projelerine destek oluyoruz.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Ekibimiz */}
        <section className="py-16">
          <div className="shule-container text-center">
            <h2 className="shule-heading mb-3">Ekibimiz</h2>
            <p className="shule-paragraph max-w-3xl mx-auto mb-12">
              Shule Bags'in arkasındaki tutku dolu ekip ile tanışın
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group">
                <div className="relative overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
                    alt="Ayşe Demir" 
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-playfair text-lg mb-1">Ayşe Demir</h3>
                <p className="text-sm text-shule-darkText/70 mb-2">Kurucu ve Kreatif Direktör</p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-shule-darkText hover:text-shule-brown transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-instagram">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                  <a href="#" className="text-shule-darkText hover:text-shule-brown transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-linkedin">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="group">
                <div className="relative overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
                    alt="Mehmet Yılmaz" 
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-playfair text-lg mb-1">Mehmet Yılmaz</h3>
                <p className="text-sm text-shule-darkText/70 mb-2">Operasyon Direktörü</p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-shule-darkText hover:text-shule-brown transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-instagram">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                  <a href="#" className="text-shule-darkText hover:text-shule-brown transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-linkedin">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="group">
                <div className="relative overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e" 
                    alt="Zeynep Kaya" 
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-playfair text-lg mb-1">Zeynep Kaya</h3>
                <p className="text-sm text-shule-darkText/70 mb-2">Tasarım Lideri</p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-shule-darkText hover:text-shule-brown transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-instagram">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                  <a href="#" className="text-shule-darkText hover:text-shule-brown transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-linkedin">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="group">
                <div className="relative overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" 
                    alt="Ali Öztürk" 
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-playfair text-lg mb-1">Ali Öztürk</h3>
                <p className="text-sm text-shule-darkText/70 mb-2">Pazarlama Yöneticisi</p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-shule-darkText hover:text-shule-brown transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-instagram">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                  <a href="#" className="text-shule-darkText hover:text-shule-brown transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-linkedin">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Zanaatkârlarımız */}
        <section className="py-16 bg-shule-lightGrey">
          <div className="shule-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="shule-heading mb-6">Zanaatkârlarımız</h2>
                <div className="space-y-4">
                  <p className="shule-paragraph">
                    Shule Bags olarak, çantalarımızın üretiminde yerel zanaatkârların el emeğine büyük önem veriyoruz. 
                    Türkiye'nin farklı bölgelerinden 50'den fazla zanaatkâr ile çalışıyoruz.
                  </p>
                  <p className="shule-paragraph">
                    Her bir zanaatkârımız, hasır örme ve dokuma konusunda uzmanlaşmış ve bu sanatı nesillerdir 
                    devam ettiren ustalar. Onların bilgi ve tecrübesi, Shule Bags'in kalitesini ve özgünlüğünü 
                    belirliyor.
                  </p>
                  <p className="shule-paragraph">
                    Zanaatkârlarımızın çoğu kadınlardan oluşuyor ve bu sayede yerel ekonomilerde kadın istihdamını 
                    destekliyoruz. Adil ücret politikamız ve sürdürülebilir üretim modelimiz ile hem zanaatkârlarımıza 
                    hem de çevreye karşı sorumluluğumuzu yerine getiriyoruz.
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1595450333814-3ffb285b7bfc" 
                    alt="Zanaatkârlarımız" 
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1516727003284-a96541e51e9c" 
                    alt="Zanaatkârlarımız" 
                    className="w-full h-auto rounded-lg shadow-lg mt-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
