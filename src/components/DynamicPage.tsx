
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from './Header';
import Footer from './Footer';

interface PageContent {
  id: string;
  title: string;
  page_key: string;
  content: Record<string, any>;
}

const DynamicPage: React.FC = () => {
  const { pageKey } = useParams<{ pageKey: string }>();
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPageContent = async () => {
      setLoading(true);
      try {
        // Sayfa anahtarı ile veya slug ile bul
        const { data, error } = await supabase
          .from('page_contents')
          .select('*')
          .eq('page_key', pageKey)
          .single();

        if (error || !data) {
          navigate('/404');
          return;
        }

        // Ensure content is handled as an object, not a string
        const contentObj = typeof data.content === 'string' 
          ? JSON.parse(data.content) 
          : (data.content || {});
          
        setPageContent({
          id: data.id,
          title: data.title,
          page_key: data.page_key,
          content: contentObj
        });
      } catch (error) {
        console.error('Sayfa içeriği yüklenirken hata oluştu:', error);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    if (pageKey) {
      fetchPageContent();
    }
  }, [pageKey, navigate]);

  // HTML içeriği güvenli bir şekilde render et
  const renderHtmlContent = (html: string) => {
    return { __html: html || '' };
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="shule-container pt-28 pb-16 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!pageContent) {
    return (
      <>
        <Header />
        <div className="shule-container pt-28 pb-16 min-h-screen">
          <h1 className="text-3xl font-semibold mb-6">Sayfa Bulunamadı</h1>
          <p>Aradığınız sayfa bulunamadı veya kaldırılmış olabilir.</p>
        </div>
        <Footer />
      </>
    );
  }

  // Sayfa türüne göre içerik alanlarını belirle
  const renderPageContent = () => {
    const { content } = pageContent;

    switch (pageContent.page_key) {
      case 'about':
        return (
          <div className="space-y-8">
            {content.intro && (
              <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.intro)} />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              {content.mission && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Misyonumuz</h2>
                  <div dangerouslySetInnerHTML={renderHtmlContent(content.mission)} />
                </div>
              )}
              {content.vision && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Vizyonumuz</h2>
                  <div dangerouslySetInnerHTML={renderHtmlContent(content.vision)} />
                </div>
              )}
            </div>
            
            {content.story && (
              <div className="py-6">
                <h2 className="text-2xl font-semibold mb-4">Hikayemiz</h2>
                <div dangerouslySetInnerHTML={renderHtmlContent(content.story)} />
              </div>
            )}
            
            {content.team && (
              <div className="py-6">
                <h2 className="text-2xl font-semibold mb-4">Ekibimiz</h2>
                <div dangerouslySetInnerHTML={renderHtmlContent(content.team)} />
              </div>
            )}
          </div>
        );
        
      case 'contact':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              {content.info && (
                <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.info)} />
              )}
              
              <div className="space-y-4 mb-8">
                {content.address && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Adres</h3>
                    <div dangerouslySetInnerHTML={renderHtmlContent(content.address)} />
                  </div>
                )}
                
                {content.phone && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Telefon</h3>
                    <div dangerouslySetInnerHTML={renderHtmlContent(content.phone)} />
                  </div>
                )}
                
                {content.email && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">E-posta</h3>
                    <div dangerouslySetInnerHTML={renderHtmlContent(content.email)} />
                  </div>
                )}
                
                {content.hours && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Çalışma Saatleri</h3>
                    <div dangerouslySetInnerHTML={renderHtmlContent(content.hours)} />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              {content.map && (
                <div className="mb-8 w-full h-[400px]" dangerouslySetInnerHTML={renderHtmlContent(content.map)} />
              )}
            </div>
          </div>
        );
        
      case 'faq':
        return (
          <div>
            {content.intro && (
              <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.intro)} />
            )}
            
            {content.faqs && (
              <div className="py-6" dangerouslySetInnerHTML={renderHtmlContent(content.faqs)} />
            )}
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-8">
            {content.intro && (
              <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.intro)} />
            )}
            
            {content.policies && (
              <div className="py-6">
                <h2 className="text-2xl font-semibold mb-4">Kargo Politikalarımız</h2>
                <div dangerouslySetInnerHTML={renderHtmlContent(content.policies)} />
              </div>
            )}
            
            {content.timeframes && (
              <div className="py-6">
                <h2 className="text-2xl font-semibold mb-4">Teslimat Süreleri</h2>
                <div dangerouslySetInnerHTML={renderHtmlContent(content.timeframes)} />
              </div>
            )}
            
            {content.costs && (
              <div className="py-6">
                <h2 className="text-2xl font-semibold mb-4">Kargo Ücretleri</h2>
                <div dangerouslySetInnerHTML={renderHtmlContent(content.costs)} />
              </div>
            )}
          </div>
        );
        
      case 'returns':
        return (
          <div className="space-y-8">
            {content.intro && (
              <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.intro)} />
            )}
            
            {content.policies && (
              <div className="py-6">
                <h2 className="text-2xl font-semibold mb-4">İade Politikalarımız</h2>
                <div dangerouslySetInnerHTML={renderHtmlContent(content.policies)} />
              </div>
            )}
            
            {content.process && (
              <div className="py-6">
                <h2 className="text-2xl font-semibold mb-4">İade Süreci</h2>
                <div dangerouslySetInnerHTML={renderHtmlContent(content.process)} />
              </div>
            )}
            
            {content.conditions && (
              <div className="py-6">
                <h2 className="text-2xl font-semibold mb-4">İade Şartları</h2>
                <div dangerouslySetInnerHTML={renderHtmlContent(content.conditions)} />
              </div>
            )}
          </div>
        );
        
      case 'sizing':
        return (
          <div className="space-y-8">
            {content.intro && (
              <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.intro)} />
            )}
            
            {content.measurements && (
              <div className="py-6">
                <h2 className="text-2xl font-semibold mb-4">Ölçü Tablosu</h2>
                <div dangerouslySetInnerHTML={renderHtmlContent(content.measurements)} />
              </div>
            )}
            
            {content.guide && (
              <div className="py-6">
                <h2 className="text-2xl font-semibold mb-4">Ölçü Alma Rehberi</h2>
                <div dangerouslySetInnerHTML={renderHtmlContent(content.guide)} />
              </div>
            )}
            
            {content.tips && (
              <div className="py-6">
                <h2 className="text-2xl font-semibold mb-4">Beden Seçme İpuçları</h2>
                <div dangerouslySetInnerHTML={renderHtmlContent(content.tips)} />
              </div>
            )}
          </div>
        );
        
      case 'privacy':
      case 'terms':
      case 'products':
      case 'collections':
      case 'bestsellers':
      case 'new':
      default:
        // Varsayılan düzen - genel içerik
        return (
          <div>
            {content.content ? (
              <div dangerouslySetInnerHTML={renderHtmlContent(content.content)} />
            ) : (
              Object.entries(content).map(([key, value]) => (
                <div key={key} dangerouslySetInnerHTML={renderHtmlContent(value as string)} />
              ))
            )}
          </div>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="bg-shule-lightGrey py-3">
          <div className="shule-container">
            <nav className="flex items-center flex-wrap">
              <Link to="/" className="shule-link">
                Ana Sayfa
              </Link>
              <span className="mx-1">/</span>
              <span>{pageContent.title}</span>
            </nav>
          </div>
        </div>
        
        <div className="shule-container py-12">
          <h1 className="text-3xl font-semibold mb-8">{pageContent.title}</h1>
          
          <div className="shule-paragraph">
            {renderPageContent()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DynamicPage;
