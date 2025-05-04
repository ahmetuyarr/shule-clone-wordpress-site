
import React from "react";
import { Link } from "react-router-dom";
import { Eye, Edit, Trash2, Link as LinkIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContent } from "../page-content/types";

interface PageContentsListProps {
  pageContents: PageContent[];
  onEdit: (pageContent: PageContent) => void;
  onDelete: (pageContentId: string) => void;
  onLinkClick: (pageId: string, pageKey: string) => void;
}

const PageContentsList: React.FC<PageContentsListProps> = ({
  pageContents,
  onEdit,
  onDelete,
  onLinkClick,
}) => {
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
                      onClick={() => onLinkClick(pageContent.id, pageContent.page_key)}
                    >
                      <LinkIcon size={14} />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(pageContent.updated_at || "").toLocaleDateString('tr-TR')}
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
                      onClick={() => onEdit(pageContent)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onDelete(pageContent.id)}
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
  );
};

export default PageContentsList;
