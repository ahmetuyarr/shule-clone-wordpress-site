
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneralTabProps {
  title: string;
  pageKey: string;
  customPageKey: string;
  pageTypes: Array<{ value: string; label: string; system: boolean }>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onCustomPageKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
  title,
  pageKey,
  customPageKey,
  pageTypes,
  onInputChange,
  onSelectChange,
  onCustomPageKeyChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Sayfa Başlığı</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={onInputChange}
            placeholder="Sayfa başlığını giriniz"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="page_key">Sayfa Türü</Label>
          <Select
            value={pageTypes.some(pt => pt.value === pageKey) ? pageKey : "custom"}
            onValueChange={(value) => onSelectChange("page_key", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sayfa türünü seçin" />
            </SelectTrigger>
            <SelectContent>
              <div className="pb-1 mb-1 border-b">
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Sistem Sayfaları</p>
              </div>
              {pageTypes.filter(pt => pt.system).map(pageType => (
                <SelectItem key={pageType.value} value={pageType.value}>
                  {pageType.label}
                </SelectItem>
              ))}
              <div className="pt-1 pb-1 mb-1 border-t border-b">
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Genel Sayfalar</p>
              </div>
              {pageTypes.filter(pt => !pt.system && pt.value !== 'custom').map(pageType => (
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

      {pageKey === "custom" && (
        <div className="space-y-2">
          <Label htmlFor="customPageKey">Özel Sayfa Anahtarı</Label>
          <Input
            id="customPageKey"
            name="customPageKey"
            value={customPageKey}
            onChange={onCustomPageKeyChange}
            placeholder="Özel sayfa anahtarını giriniz (ör: hakkimizda, urunler)"
          />
          <p className="text-xs text-muted-foreground">
            URL'de kullanılacak benzersiz bir anahtar girin (örn: 'hakkimizda' sayfası için '/page/hakkimizda')
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneralTab;
