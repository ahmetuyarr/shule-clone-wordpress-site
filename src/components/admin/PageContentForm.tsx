
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Layout, FileText, Eye } from "lucide-react";

// Import our refactored components
import GeneralTab from "./page-content/GeneralTab";
import ContentSections from "./page-content/ContentSections";
import DesignTab from "./page-content/DesignTab";
import PageSidebar from "./page-content/PageSidebar";
import { PageContent, PAGE_TYPES } from "./page-content/types";
import { usePageContentForm } from "./page-contents/usePageContentForm";

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
  const {
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
  } = usePageContentForm({ pageContent, onClose });

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
