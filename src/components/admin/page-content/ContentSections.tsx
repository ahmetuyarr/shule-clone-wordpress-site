
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Editor from "react-simple-wysiwyg";

interface ContentSectionsProps {
  pageKey: string;
  content: Record<string, any>;
  onContentChange: (sectionKey: string, value: string) => void;
}

interface ContentSection {
  key: string;
  label: string;
}

export const ContentSections: React.FC<ContentSectionsProps> = ({
  pageKey,
  content,
  onContentChange,
}) => {
  const getContentSections = (): ContentSection[] => {
    switch (pageKey) {
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

  return (
    <div className="space-y-6">
      {getContentSections().map((section) => (
        <Card key={section.key} className="overflow-hidden">
          <CardContent className="p-4">
            <Label htmlFor={section.key} className="block mb-3">
              {section.label}
            </Label>
            <Editor
              value={content[section.key] || ""}
              onChange={(e: any) => onContentChange(section.key, e.target.value)}
              containerProps={{
                className: "min-h-[250px] border rounded-md overflow-hidden",
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContentSections;
