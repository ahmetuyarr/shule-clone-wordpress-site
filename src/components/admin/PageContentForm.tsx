
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Info, Layout, Palette, FileText, Link as LinkIcon, Eye } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

const PAGE_TYPES = [
  { value: "about", label: "Hakkımızda", system: true },
  { value: "contact", label: "İletişim", system: true },
  { value: "terms", label: "Kullanım Koşulları", system: false },
  { value: "privacy", label: "Gizlilik Politikası", system: false },
  { value: "faq", label: "Sıkça Sorulan Sorular", system: false },
  { value: "home", label: "Ana Sayfa", system: true },
  { value: "shipping", label: "Kargo Bilgileri", system: false },
  { value: "returns", label: "İade Politikası", system: false },
  { value: "sizing", label: "Beden Rehberi", system: false },
  { value: "products", label: "Ürünler", system: true },
  { value: "collections", label: "Koleksiyonlar", system: true },
  { value: "bestsellers", label: "Çok Satanlar", system: true },
  { value: "new", label: "Yeni Ürünler", system: true },
  { value: "custom", label: "Özel Sayfa", system: false },
];

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
      case "shipping":
        return [
          { key: "intro", label: "Giriş Bilgisi" },
          { key: "policies", label: "Kargo Politikaları" },
          { key: "timeframes", label: "Teslimat Süreleri" },
          { key: "costs", label: "Kargo Ücretleri" },
        ];
      case "returns":
        return [
          { key: "intro", label: "Giriş Bilgisi" },
          { key: "policies", label: "İade Politikaları" },
          { key: "process", label: "İade Süreci" },
          { key: "conditions", label: "İade Şartları" },
        ];
      case "sizing":
        return [
          { key: "intro", label: "Giriş Bilgisi" },
          { key: "measurements", label: "Ölçü Tablosu" },
          { key: "guide", label: "Ölçü Alma Rehberi" },
          { key: "tips", label: "Beden Seçme İpuçları" },
        ];
      case "privacy":
      case "terms":
      case "products":
      case "collections":
      case "bestsellers":
      case "new":
      case "custom":
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

  const isSystemPage = (pageKey: string) => {
    return PAGE_TYPES.find(pt => pt.value === pageKey)?.system || false;
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

                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={PAGE_TYPES.some(pt => pt.value === formData.page_key) 
                          ? formData.page_key 
                          : "custom"}
                        onValueChange={(value) => handleSelectChange("page_key", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sayfa türünü seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="pb-1 mb-1 border-b">
                            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Sistem Sayfaları</p>
                          </div>
                          {PAGE_TYPES.filter(pt => pt.system).map(pageType => (
                            <SelectItem key={pageType.value} value={pageType.value}>
                              {pageType.label}
                            </SelectItem>
                          ))}
                          <div className="pt-1 pb-1 mb-1 border-t border-b">
                            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Genel Sayfalar</p>
                          </div>
                          {PAGE_TYPES.filter(pt => !pt.system && pt.value !== 'custom').map(pageType => (
                            <SelectItem key={pageType.value} value={pageType.value}>
                              {pageType.label}
                            </SelectItem>
                          ))}
                          <div className="pt-1 border-t">
                            <SelectItem value="custom">Özel Sayfa</SelectItem>
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.page_key === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="customPageKey">Özel Sayfa Anahtarı</Label>
                      <Input
                        id="customPageKey"
                        name="customPageKey"
                        value={customPageKey}
                        onChange={handleCustomPageKeyChange}
                        placeholder="Özel sayfa anahtarını giriniz (ör: hakkimizda, urunler)"
                      />
                      <p className="text-xs text-muted-foreground">
                        URL'de kullanılacak benzersiz bir anahtar girin (örn: 'hakkimizda' sayfası için '/page/hakkimizda')
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="content">
                  <div className="space-y-6">
                    {getContentSections().map((section) => (
                      <Card key={section.key} className="overflow-hidden">
                        <CardContent className="p-4">
                          <Label htmlFor={section.key} className="block mb-3">
                            {section.label}
                          </Label>
                          <Editor
                            value={formData.content[section.key] || ""}
                            onChange={(e: any) => 
                              handleContentChange(section.key, e.target.value)
                            }
                            containerProps={{
                              className: "min-h-[250px] border rounded-md overflow-hidden",
                            }}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="design">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center py-8">
                        <Palette size={48} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Sayfa Tasarım Seçenekleri</h3>
                        <p className="text-muted-foreground">
                          Bu sayfanın tasarım ayarlarını yapabilirsiniz. (Yakında eklenecek)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-2">Sayfa Önizleme</h3>
                  <div className="text-muted-foreground text-sm mb-3">
                    Sayfanız şu adreste yayınlanacak:
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="px-2 py-1 text-xs">
                      <code className="text-xs">{previewUrl}</code>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      asChild
                      disabled={!isEditing}
                    >
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} />
                      </a>
                    </Button>
                  </div>

                  {isEditing && (
                    <div className="mt-2">
                      <a 
                        href={previewUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-slate-100 text-sm text-center py-2 rounded flex items-center justify-center gap-1 hover:bg-slate-200 transition-colors"
                      >
                        <Eye size={14} /> Sayfayı Önizle
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-2">Sayfa Durumu</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Sistem sayfası:</span>
                      <Badge variant={isSystemPage(formData.page_key) ? "default" : "outline"}>
                        {isSystemPage(formData.page_key) ? "Evet" : "Hayır"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Son güncelleme:</span>
                      <span className="text-muted-foreground">
                        {pageContent?.updated_at 
                          ? new Date(pageContent.updated_at).toLocaleDateString('tr-TR') 
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">Menü Bağlantısı</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Bu sayfayı site menünüze eklemek için:
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      asChild
                    >
                      <a href="/admin?tab=menu" target="_blank" rel="noopener noreferrer">
                        <LinkIcon size={14} className="mr-1" /> Menü Yönetimine Git
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
