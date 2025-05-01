import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PageContentForm from "@/components/admin/PageContentForm";

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
      default:
        return pageKey;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Sayfa İçerikleri Yönetimi</h2>
        <Button onClick={handleAddPageContent} className="flex items-center gap-1">
          <PlusCircle size={18} /> Yeni Sayfa İçeriği Ekle
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sayfa Başlığı</TableHead>
                <TableHead>Sayfa Türü</TableHead>
                <TableHead>Son Güncelleme</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageContents.length > 0 ? (
                pageContents.map((pageContent) => (
                  <TableRow key={pageContent.id}>
                    <TableCell className="font-medium">{pageContent.title}</TableCell>
                    <TableCell>{getPageType(pageContent.page_key)}</TableCell>
                    <TableCell>
                      {new Date(pageContent.updated_at).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                  <TableCell colSpan={4} className="text-center py-4">
                    Henüz sayfa içeriği eklenmemiş
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
    </div>
  );
};

export default PageContentsAdmin;
