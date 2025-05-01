
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  link: string;
  parent_id: string | null;
  position: number;
  is_active: boolean;
}

interface MenuFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentMenuItem: MenuItem | null;
  onSuccess: () => void;
  parentMenuItems: MenuItem[];
}

const MenuForm: React.FC<MenuFormProps> = ({ 
  isOpen, 
  onClose, 
  currentMenuItem, 
  onSuccess,
  parentMenuItems 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    parent_id: null as string | null,
    is_active: true
  });
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentMenuItem) {
      setFormData({
        name: currentMenuItem.name,
        link: currentMenuItem.link,
        parent_id: currentMenuItem.parent_id,
        is_active: currentMenuItem.is_active
      });
    } else {
      setFormData({
        name: "",
        link: "",
        parent_id: null,
        is_active: true
      });
    }
  }, [currentMenuItem, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: value === "none" ? null : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.link) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Menü adı ve bağlantı zorunludur."
      });
      return;
    }

    setFormLoading(true);

    try {
      if (currentMenuItem) {
        // Güncelleme işlemi
        const { error } = await supabase
          .from("menu_items")
          .update({
            name: formData.name,
            link: formData.link,
            parent_id: formData.parent_id,
            is_active: formData.is_active
          })
          .eq("id", currentMenuItem.id);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Menü öğesi başarıyla güncellendi."
        });
      } else {
        // Yeni öğenin pozisyonunu belirle
        let position = 0;
        const { data: maxPositionData } = await supabase
          .from("menu_items")
          .select("position")
          .order("position", { ascending: false })
          .limit(1);
        
        if (maxPositionData && maxPositionData.length > 0) {
          position = maxPositionData[0].position + 10; // 10'ar artırarak pozisyonlandır
        }

        // Yeni menü öğesi ekleme
        const { error } = await supabase
          .from("menu_items")
          .insert([{
            name: formData.name,
            link: formData.link,
            parent_id: formData.parent_id,
            is_active: formData.is_active,
            position: position
          }]);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Yeni menü öğesi başarıyla eklendi."
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Menü öğesi kaydedilirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Menü öğesi kaydedilirken bir hata oluştu."
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentMenuItem ? "Menü Öğesi Düzenle" : "Yeni Menü Öğesi Ekle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Menü Adı</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Menü adını giriniz"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Bağlantı</Label>
            <Input
              id="link"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="/ornek-sayfa"
              required
            />
            <p className="text-xs text-gray-500">
              Örnek: Ana sayfa için "/", Ürünler sayfası için "/products"
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent_id">Üst Menü (İsteğe Bağlı)</Label>
            <Select
              value={formData.parent_id || undefined}
              onValueChange={(value) => handleSelectChange("parent_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ana menü öğesi olarak ekle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ana menü öğesi olarak ekle</SelectItem>
                {parentMenuItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Alt menü öğesi oluşturmak için bir üst menü seçin
            </p>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="is_active" className="cursor-pointer">Aktif</Label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Kaydediliyor...
                </>
              ) : currentMenuItem ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuForm;
