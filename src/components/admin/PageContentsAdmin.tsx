
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Eye, Link as LinkIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PageContentForm from "@/components/admin/PageContentForm";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PageContent {
  id: string;
  title: string;
  page_key: string;
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const PageContentsAdmin = () => {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPageContent, setCurrentPageContent] = useState<PageContent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageContentToDelete, setPageContentToDelete] = useState<string | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [currentLinkPageId, setCurrentLinkPageId] = useState<string | null>(null);
  const [customLink, setCustomLink] = useState("");

  const { toast } = useToast();

  const fetchPageContents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("page_contents")
        .select("*")
        .order("title");

      if (error) throw error;
      // Parse the JSON content to ensure it's a proper object
      setPageContents(data?.map(item => ({
        ...item,
        content: typeof item.content === 'string' 
          ? JSON.parse(item.content) 
          : (item.content || {})
      })) || []);
    } catch (error) {
      console.error("Sayfa içerikleri yüklenirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sayfa içerikleri yüklenirken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContents();
  }, []);

  const handleAddPageContent = () => {
    setCurrentPageContent(null);
    setIsFormOpen(true);
  };

  const handleEditPageContent = (pageContent: PageContent) => {
    setCurrentPageContent(pageContent);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (pageContentId: string) => {
    setPageContentToDelete(pageContentId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pageContentToDelete) return;

    try {
      const { error } = await supabase
        .from("page_contents")
        .delete()
        .eq("id", pageContentToDelete);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Sayfa içeriği başarıyla silindi."
      });

      fetchPageContents();
    } catch (error) {
      console.error("Sayfa içeriği silinirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sayfa içeriği silinirken bir hata oluştu."
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setPageContentToDelete(null);
    }
  };

  const handleFormClose = (refreshData = false) => {
    setIsFormOpen(false);
    if (refreshData) {
      fetchPageContents();
    }
  };

  const handleLinkClick = (pageId: string, pageKey: string) => {
    setCurrentLinkPageId(pageId);
    setCustomLink(getPageUrl(pageKey));
    setIsLinkDialogOpen(true);
  };

  const handleLinkUpdate = async () => {
    if (!currentLinkPageId || !customLink.trim()) return;
    
    try {
      const pageToUpdate = pageContents.find(p => p.id === currentLinkPageId);
      if (!pageToUpdate) return;
      
      // Update the page_key based on the custom link
      const newPageKey = customLink.trim()
        .replace(/^\/page\//, '')
        .replace(/^\//, '')
        .replace(/\/$/, '')
        .toLowerCase()
        .replace(/\s+/g, '_');
      
      const { error } = await supabase
        .from("page_contents")
        .update({ page_key: newPageKey })
        .eq("id", currentLinkPageId);
        
      if (error) throw error;
      
      toast({
        title: "Başarılı",
        description: "Sayfa linki başarıyla güncellendi."
      });
      
      fetchPageContents();
    } catch (error) {
      console.error("Sayfa linki güncellenirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sayfa linki güncellenirken bir hata oluştu."
      });
    } finally {
      setIsLinkDialogOpen(false);
      setCurrentLinkPageId(null);
    }
  };

  const getPageType = (pageKey: string): string => {
    switch (pageKey) {
      case 'about':
        return 'Hakkımızda';
      case 'contact':
        return 'İletişim';
      case 'terms':
        return 'Kullanım Koşulları';
      case 'privacy':
        return 'Gizlilik Politikası';
      case 'faq':
        return 'Sıkça Sorulan Sorular';
      case 'home':
        return 'Ana Sayfa';
      case 'shipping':
        return 'Kargo Bilgileri';
      case 'returns':
        return 'İade Politikası';
      case 'sizing':
        return 'Beden Rehberi';
      case 'products':
        return 'Ürünler';
      case 'collections':
        return 'Koleksiyonlar';
      case 'bestsellers':
        return 'Çok Satanlar';
      case 'new':
        return 'Yeni Ürünler';
      default:
        return 'Özel Sayfa';
    }
  };

  const getPageUrl = (pageKey: string): string => {
    switch (pageKey) {
      case 'about':
      case 'contact':
      case 'products':
      case 'collections':
      case 'bestsellers':
      case 'new':
        return `/${pageKey}`;
      case 'home':
        return '/';
      default:
        return `/page/${pageKey}`;
    }
  };

  const getPageStatus = (pageKey: string) => {
    const systemPages = ['about', 'contact', 'home', 'products', 'collections', 'bestsellers', 'new'];
    if (systemPages.includes(pageKey)) {
      return <Badge variant="secondary">Sistem Sayfası</Badge>;
    }
    
    const commonPages = ['terms', 'privacy', 'faq', 'shipping', 'returns', 'sizing'];
    if (commonPages.includes(pageKey)) {
      return <Badge variant="outline">Ortak Sayfa</Badge>;
    }
    
    return <Badge variant="default">Özel Sayfa</Badge>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-medium">Sayfa İçerikleri Yönetimi</h2>
          <p className="text-muted-foreground mt-1">
            Sitenizdeki tüm sayfaları buradan yönetebilirsiniz.
          </p>
        </div>
        <Button onClick={handleAddPageContent} className="flex items-center gap-1">
          <PlusCircle size={18} /> Yeni Sayfa İçeriği Ekle
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tüm Sayfalar</CardTitle>
            <CardDescription>
              Sayfalarınızı düzenleyin, görüntüleyin veya silin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sayfa Başlığı</TableHead>
                    <TableHead>Sayfa Türü</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Son Güncelleme</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageContents.length > 0 ? (
                    pageContents.map((pageContent) => (
                      <TableRow key={pageContent.id}>
                        <TableCell className="font-medium">
                          {pageContent.title}
                          <div className="mt-1">
                            {getPageStatus(pageContent.page_key)}
                          </div>
                        </TableCell>
                        <TableCell>{getPageType(pageContent.page_key)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 max-w-[200px] truncate">
                            <span className="truncate">
                              {getPageUrl(pageContent.page_key)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleLinkClick(pageContent.id, pageContent.page_key)}
                            >
                              <LinkIcon size={14} />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(pageContent.updated_at).toLocaleDateString('tr-TR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              asChild
                            >
                              <Link to={getPageUrl(pageContent.page_key)} target="_blank">
                                <Eye size={16} />
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditPageContent(pageContent)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteClick(pageContent.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Henüz sayfa içeriği eklenmemiş
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {isFormOpen && (
        <PageContentForm 
          pageContent={currentPageContent}
          isOpen={isFormOpen}
          onClose={handleFormClose}
        />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sayfa İçeriği Silme Onayı</DialogTitle>
          </DialogHeader>
          <p className="py-4">Bu sayfa içeriğini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>İptal</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Sil</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sayfa Linki Düzenle</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customLink">Sayfa Linki</Label>
              <Input
                id="customLink"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="Örnek: /hakkimizda veya /page/ozel-sayfa"
              />
              <p className="text-xs text-muted-foreground">
                Linkleri doğrudan "/" ile başlayarak yazabilirsiniz. Örn: /hakkimizda veya /page/ozel-sayfa
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>İptal</Button>
            <Button onClick={handleLinkUpdate}>Kaydet</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageContentsAdmin;
