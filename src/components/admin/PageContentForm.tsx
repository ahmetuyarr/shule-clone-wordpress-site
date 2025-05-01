
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "react-simple-wysiwyg";

interface PageContent {
  id: string;
  title: string;
  page_key: string;
  content: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

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
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (pageContent) {
      setFormData({
        title: pageContent.title,
        page_key: pageContent.page_key,
        content: pageContent.content || {},
      });
    }
  }, [pageContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const getContentSections = () => {
    switch (formData.page_key) {
      case "about":
        return [
          { key: "intro", label: "Giriş Metni" },
          { key: "mission", label: "Misyonumuz" },
          { key: "vision", label: "Vizyonumuz" },
          { key: "story", label: "Hikayemiz" },
          { key: "team", label: "Ekibimiz" },
        ];
      case "contact":
        return [
          { key: "info", label: "İletişim Bilgileri" },
          { key: "address", label: "Adres" },
          { key: "phone", label: "Telefon" },
          { key: "email", label: "E-posta" },
          { key: "map", label: "Harita Embed Kodu" },
          { key: "hours", label: "Çalışma Saatleri" },
        ];
      case "home":
        return [
          { key: "welcome", label: "Karşılama Mesajı" },
          { key: "featured", label: "Öne Çıkan İçerik" },
          { key: "promotion", label: "Promosyon Mesajı" },
          { key: "about", label: "Hakkında Kısa Bilgi" },
        ];
      case "faq":
        return [
          { key: "intro", label: "Giriş Metni" },
          { key: "faqs", label: "Sıkça Sorulan Sorular" },
        ];
      case "privacy":
      case "terms":
        return [{ key: "content", label: "İçerik" }];
      default:
        return [{ key: "content", label: "İçerik" }];
    }
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

    if (!formData.page_key) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen bir sayfa türü seçin.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isEditing && pageContent) {
        // Update existing page content
        const { error } = await supabase
          .from("page_contents")
          .update({
            title: formData.title,
            page_key: formData.page_key,
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
        // Create new page content
        const { error } = await supabase.from("page_contents").insert([
          {
            title: formData.title,
            page_key: formData.page_key,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sayfa İçeriğini Düzenle" : "Yeni Sayfa İçeriği Ekle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
              <TabsTrigger value="content">İçerik</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Sayfa Başlığı</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Sayfa başlığını giriniz"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="page_key">Sayfa Türü</Label>
                <Select
                  value={formData.page_key || undefined}
                  onValueChange={(value) => handleSelectChange("page_key", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sayfa türünü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="about">Hakkımızda</SelectItem>
                    <SelectItem value="contact">İletişim</SelectItem>
                    <SelectItem value="terms">Kullanım Koşulları</SelectItem>
                    <SelectItem value="privacy">Gizlilik Politikası</SelectItem>
                    <SelectItem value="faq">Sıkça Sorulan Sorular</SelectItem>
                    <SelectItem value="home">Ana Sayfa</SelectItem>
                    <SelectItem value="custom">Özel Sayfa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="content">
              {getContentSections().map((section) => (
                <div key={section.key} className="mb-6">
                  <Label htmlFor={section.key} className="block mb-2">
                    {section.label}
                  </Label>
                  <Editor
                    value={formData.content[section.key] || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleContentChange(section.key, e.target.value)
                    }
                    containerProps={{
                      className: "min-h-[200px] border rounded-md overflow-hidden",
                    }}
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>

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
