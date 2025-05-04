
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PageContent, PAGE_TYPES } from "../page-content/types";

interface UsePageContentFormProps {
  pageContent: PageContent | null;
  onClose: (refreshData?: boolean) => void;
}

export const usePageContentForm = ({ pageContent, onClose }: UsePageContentFormProps) => {
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

  const handleContentChange = (sectionKey: string, value: any) => {
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

  return {
    formData,
    customPageKey,
    activeTab,
    loading,
    previewUrl,
    isEditing,
    setActiveTab,
    handleInputChange,
    handleSelectChange,
    handleCustomPageKeyChange,
    handleContentChange,
    handleSubmit,
  };
};

export default usePageContentForm;
