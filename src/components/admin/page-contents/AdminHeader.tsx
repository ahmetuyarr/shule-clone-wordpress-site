
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AdminHeaderProps {
  onAddClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-medium">Sayfa İçerikleri Yönetimi</h2>
        <p className="text-muted-foreground mt-1">
          Sitenizdeki tüm sayfaları buradan yönetebilirsiniz.
        </p>
      </div>
      <Button onClick={onAddClick} className="flex items-center gap-1">
        <PlusCircle size={18} /> Yeni Sayfa İçeriği Ekle
      </Button>
    </div>
  );
};

export default AdminHeader;
