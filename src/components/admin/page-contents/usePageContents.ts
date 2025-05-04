
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PageContent } from "../page-content/types";

export const usePageContents = () => {
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

  const fetchPageContents = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    fetchPageContents();
  }, [fetchPageContents]);

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

  const handleLinkClick = (pageId: string, pageKey: string) => {
    setCurrentLinkPageId(pageId);
    setCustomLink(getPageUrl(pageKey));
    setIsLinkDialogOpen(true);
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

  const handleFormClose = (refreshData = false) => {
    setIsFormOpen(false);
    if (refreshData) {
      fetchPageContents();
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

  return {
    pageContents,
    loading,
    isFormOpen,
    currentPageContent,
    isDeleteDialogOpen,
    isLinkDialogOpen,
    customLink,
    setCustomLink,
    handleAddPageContent,
    handleEditPageContent,
    handleDeleteClick,
    handleDeleteConfirm,
    handleLinkClick,
    handleLinkUpdate,
    handleFormClose,
    setIsDeleteDialogOpen,
    setIsLinkDialogOpen,
  };
};

export default usePageContents;
