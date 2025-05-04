
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from './Header';
import Footer from './Footer';
import PageBreadcrumb from './PageBreadcrumb';
import PageRenderer from './PageRenderer';
import LoadingSpinner from './LoadingSpinner';

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
          <LoadingSpinner />
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

  return (
    <>
      <Header />
      <div className="pt-24 pb-16">
        {/* Breadcrumb */}
        <PageBreadcrumb title={pageContent.title} />
        
        <div className="shule-container py-12">
          <h1 className="text-3xl font-semibold mb-8">{pageContent.title}</h1>
          
          <div className="shule-paragraph">
            <PageRenderer 
              pageKey={pageContent.page_key}
              content={pageContent.content}
              renderHtmlContent={renderHtmlContent}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DynamicPage;
