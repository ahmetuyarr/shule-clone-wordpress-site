
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

const About = () => {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("page_contents")
          .select("*")
          .eq("page_key", "about")
          .single();

        if (!error && data) {
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
              <span>Hakkımızda</span>
            </nav>
          </div>
        </div>

        <div className="shule-container py-12">
          <h1 className="text-3xl font-semibold mb-8">
            {pageContent?.title || "Hakkımızda"}
          </h1>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : pageContent ? (
            <div className="shule-paragraph space-y-8">
              {/* Hakkımızda içeriği */}
              {pageContent.content?.intro && (
                <div dangerouslySetInnerHTML={renderHtmlContent(pageContent.content.intro)} />
              )}

              {/* Misyon ve Vizyon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                {pageContent.content?.mission && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Misyonumuz</h2>
                    <div dangerouslySetInnerHTML={renderHtmlContent(pageContent.content.mission)} />
                  </div>
                )}

                {pageContent.content?.vision && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Vizyonumuz</h2>
                    <div dangerouslySetInnerHTML={renderHtmlContent(pageContent.content.vision)} />
                  </div>
                )}
              </div>

              {/* Hikayemiz */}
              {pageContent.content?.story && (
                <div className="py-6">
                  <h2 className="text-2xl font-semibold mb-4">Hikayemiz</h2>
                  <div dangerouslySetInnerHTML={renderHtmlContent(pageContent.content.story)} />
                </div>
              )}

              {/* Ekibimiz */}
              {pageContent.content?.team && (
                <div className="py-6">
                  <h2 className="text-2xl font-semibold mb-4">Ekibimiz</h2>
                  <div dangerouslySetInnerHTML={renderHtmlContent(pageContent.content.team)} />
                </div>
              )}
            </div>
          ) : (
            <p>Hakkımızda içeriği bulunamadı. Lütfen admin panelinden ekleyiniz.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
