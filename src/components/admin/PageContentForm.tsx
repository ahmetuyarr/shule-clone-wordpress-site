
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Layout, FileText } from "lucide-react";

// Import our refactored components
import GeneralTab from "./page-content/GeneralTab";
import ContentSections from "./page-content/ContentSections";
import DesignTab from "./page-content/DesignTab";
import PageSidebar from "./page-content/PageSidebar";
import { PageContent, PAGE_TYPES } from "./page-content/types";

interface PageContentFormProps {
  pageContent: PageContent | null;
  isOpen: boolean;
  onClose: (refreshData?: boolean) => void;
}

const PageContentForm: React.FC<PageContentFormProps> = ({
  pageContent,
  isOpen,
  onClose,
}) => {
  const isEditing = !!pageContent;
  const [formData, setFormData] = useState<Omit<PageContent, "id" | "created_at" | "updated_at">>({
    title: "",
    page_key: "",
    content: {},
  });
  const [customPageKey, setCustomPageKey] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (pageContent) {
      setFormData({
        title: pageContent.title,
        page_key: pageContent.page_key,
        content: pageContent.content || {},
      });
      
      if (!PAGE_TYPES.some(pt => pt.value === pageContent.page_key)) {
        setCustomPageKey(pageContent.page_key);
      }
      
      updatePreviewUrl(pageContent.page_key);
    } else {
      // Set defaults for new page
      setFormData({
        title: "",
        page_key: "custom",
        content: {},
      });
      setCustomPageKey("");
      updatePreviewUrl("custom");
    }
  }, [pageContent]);

  const updatePreviewUrl = (pageKey: string) => {
    let url;
    
    switch (pageKey) {
      case 'about':
      case 'contact':
      case 'products':
      case 'collections':
      case 'bestsellers':
      case 'new':
        url = `/${pageKey}`;
        break;
      case 'home':
        url = '/';
        break;
      case 'custom':
        url = customPageKey ? `/page/${customPageKey}` : '/page/ozel-sayfa';
        break;
      default:
        url = `/page/${pageKey}`;
    }
    
    setPreviewUrl(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "page_key") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      updatePreviewUrl(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCustomPageKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomPageKey(value);
    if (formData.page_key === "custom") {
      updatePreviewUrl("custom");
    }
  };

  const handleContentChange = (sectionKey: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [sectionKey]: value,
      },
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen bir başlık girin.",
      });
      return false;
    }

    let finalPageKey = formData.page_key;
    if (formData.page_key === "custom") {
      if (!customPageKey.trim()) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Özel sayfa anahtarı girmelisiniz.",
        });
        return false;
      }
      finalPageKey = customPageKey.trim().toLowerCase().replace(/\s+/g, "_");
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Handle custom page key
    let finalPageKey = formData.page_key;
    if (formData.page_key === "custom" && customPageKey) {
      finalPageKey = customPageKey.trim().toLowerCase().replace(/\s+/g, "_");
    }

    setLoading(true);

    try {
      if (isEditing && pageContent) {
        // Update existing page content
        const { error } = await supabase
          .from("page_contents")
          .update({
            title: formData.title,
            page_key: finalPageKey,
            content: formData.content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", pageContent.id);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Sayfa içeriği başarıyla güncellendi.",
        });
      } else {
        // Check if page_key already exists
        const { data: existingPage, error: checkError } = await supabase
          .from("page_contents")
          .select("id")
          .eq("page_key", finalPageKey)
          .single();
          
        if (existingPage) {
          toast({
            variant: "destructive",
            title: "Hata",
            description: "Bu sayfa anahtarı zaten kullanılıyor. Lütfen başka bir anahtar seçin.",
          });
          setLoading(false);
          return;
        }

        // Create new page content
        const { error } = await supabase.from("page_contents").insert([
          {
            title: formData.title,
            page_key: finalPageKey,
            content: formData.content,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Sayfa içeriği başarıyla eklendi.",
        });
      }

      onClose(true); // Refresh data
    } catch (error) {
      console.error("Sayfa içeriği kaydedilirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sayfa içeriği kaydedilirken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sayfa İçeriğini Düzenle" : "Yeni Sayfa İçeriği Ekle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="general" className="flex items-center gap-1">
                    <Info size={16} /> Genel Bilgiler
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-1">
                    <FileText size={16} /> İçerik
                  </TabsTrigger>
                  <TabsTrigger value="design" className="flex items-center gap-1">
                    <Layout size={16} /> Sayfa Tasarımı
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <GeneralTab
                    title={formData.title}
                    pageKey={formData.page_key}
                    customPageKey={customPageKey}
                    pageTypes={PAGE_TYPES}
                    onInputChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onCustomPageKeyChange={handleCustomPageKeyChange}
                  />
                </TabsContent>

                <TabsContent value="content">
                  <ContentSections
                    pageKey={formData.page_key}
                    content={formData.content}
                    onContentChange={handleContentChange}
                  />
                </TabsContent>

                <TabsContent value="design">
                  <DesignTab />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <PageSidebar
                previewUrl={previewUrl}
                isEditing={isEditing}
                pageKey={formData.page_key}
                pageTypes={PAGE_TYPES}
                updatedAt={pageContent?.updated_at}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Kaydediliyor...
                </>
              ) : isEditing ? (
                "Güncelle"
              ) : (
                "Ekle"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PageContentForm;
