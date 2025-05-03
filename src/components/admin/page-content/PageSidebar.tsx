
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, Link as LinkIcon } from "lucide-react";

interface PageSidebarProps {
  previewUrl: string;
  isEditing: boolean;
  pageKey: string;
  pageTypes: Array<{ value: string; label: string; system: boolean }>;
  updatedAt?: string;
}

export const PageSidebar: React.FC<PageSidebarProps> = ({
  previewUrl,
  isEditing,
  pageKey,
  pageTypes,
  updatedAt,
}) => {
  const isSystemPage = (key: string) => {
    return pageTypes.find(pt => pt.value === key)?.system || false;
  };

  return (
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
              <Badge variant={isSystemPage(pageKey) ? "default" : "outline"}>
                {isSystemPage(pageKey) ? "Evet" : "Hayır"}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Son güncelleme:</span>
              <span className="text-muted-foreground">
                {updatedAt 
                  ? new Date(updatedAt).toLocaleDateString('tr-TR') 
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
  );
};

export default PageSidebar;
