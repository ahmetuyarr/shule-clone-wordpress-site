
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PageContent {
  id: string;
  title: string;
  page_key: string;
  content: Record<string, any>;
}

const Contact = () => {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("page_contents")
          .select("*")
          .eq("page_key", "contact")
          .single();

        if (!error && data) {
          setPageContent(data);
        }
      } catch (error) {
        console.error("Sayfa içeriği yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  // HTML içeriği güvenli bir şekilde render et
  const renderHtmlContent = (html: string) => {
    return { __html: html || "" };
  };

  return (
    <>
      <Header />
      <div className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="bg-shule-lightGrey py-3">
          <div className="shule-container">
            <nav className="flex items-center flex-wrap">
              <a href="/" className="shule-link">
                Ana Sayfa
              </a>
              <span className="mx-1">/</span>
              <span>İletişim</span>
            </nav>
          </div>
        </div>

        <div className="shule-container py-12">
          <h1 className="text-3xl font-semibold mb-8">
            {pageContent?.title || "İletişim"}
          </h1>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : pageContent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                {/* İletişim Bilgileri */}
                {pageContent.content?.info && (
                  <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(pageContent.content.info)} />
                )}

                <div className="space-y-4 mb-8">
                  {/* Adres */}
                  {pageContent.content?.address && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Adres</h3>
                      <div dangerouslySetInnerHTML={renderHtmlContent(pageContent.content.address)} />
                    </div>
                  )}

                  {/* Telefon */}
                  {pageContent.content?.phone && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Telefon</h3>
                      <div dangerouslySetInnerHTML={renderHtmlContent(pageContent.content.phone)} />
                    </div>
                  )}

                  {/* E-posta */}
                  {pageContent.content?.email && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">E-posta</h3>
                      <div dangerouslySetInnerHTML={renderHtmlContent(pageContent.content.email)} />
                    </div>
                  )}

                  {/* Çalışma Saatleri */}
                  {pageContent.content?.hours && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Çalışma Saatleri</h3>
                      <div dangerouslySetInnerHTML={renderHtmlContent(pageContent.content.hours)} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                {/* Harita */}
                {pageContent.content?.map && (
                  <div 
                    className="mb-8 w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden" 
                    dangerouslySetInnerHTML={renderHtmlContent(pageContent.content.map)} 
                  />
                )}
              </div>
            </div>
          ) : (
            <p>İletişim içeriği bulunamadı. Lütfen admin panelinden ekleyiniz.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
