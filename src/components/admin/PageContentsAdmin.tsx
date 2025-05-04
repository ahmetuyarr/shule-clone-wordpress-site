
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageContentForm from "@/components/admin/PageContentForm";
import usePageContents from "./page-contents/usePageContents";
import PageContentsList from "./page-contents/PageContentsList";
import DeleteDialog from "./page-contents/DeleteDialog";
import LinkDialog from "./page-contents/LinkDialog";
import AdminHeader from "./page-contents/AdminHeader";

const PageContentsAdmin: React.FC = () => {
  const {
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
  } = usePageContents();

  return (
    <div>
      <AdminHeader onAddClick={handleAddPageContent} />

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
            <PageContentsList 
              pageContents={pageContents}
              onEdit={handleEditPageContent}
              onDelete={handleDeleteClick}
              onLinkClick={handleLinkClick}
            />
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

      <DeleteDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <LinkDialog 
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        customLink={customLink}
        onCustomLinkChange={setCustomLink}
        onSave={handleLinkUpdate}
      />
    </div>
  );
};

export default PageContentsAdmin;
