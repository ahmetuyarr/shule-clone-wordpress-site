import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MenuItem {
  id: string;
  name: string;
  link: string;
  parent_id: string | null;
  position: number;
  is_active: boolean;
}

const MenuAdmin = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    parent_id: null as string | null,
    is_active: true
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [menuItemToDelete, setMenuItemToDelete] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { toast } = useToast();

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("position");

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error("Menü öğeleri yüklenirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Menü öğeleri yüklenirken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

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

  const handleAddMenuItem = () => {
    console.log("Opening add menu item form");
    setCurrentMenuItem(null);
    setFormData({
      name: "",
      link: "",
      parent_id: null,
      is_active: true
    });
    setIsFormOpen(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    console.log("Opening edit menu item form", item);
    setCurrentMenuItem(item);
    setFormData({
      name: item.name,
      link: item.link,
      parent_id: item.parent_id,
      is_active: item.is_active
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (itemId: string) => {
    setMenuItemToDelete(itemId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!menuItemToDelete) return;

    try {
      // Önce alt menü öğelerini kontrol et
      const { data: childItems } = await supabase
        .from("menu_items")
        .select("id")
        .eq("parent_id", menuItemToDelete);

      if (childItems && childItems.length > 0) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Bu menü öğesinin alt menüleri var. Önce onları silmelisiniz."
        });
        setIsDeleteDialogOpen(false);
        setMenuItemToDelete(null);
        return;
      }

      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", menuItemToDelete);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Menü öğesi başarıyla silindi."
      });

      fetchMenuItems();
    } catch (error) {
      console.error("Menü öğesi silinirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Menü öğesi silinirken bir hata oluştu."
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setMenuItemToDelete(null);
    }
  };

  const handleMoveUp = async (item: MenuItem) => {
    // Üst öğe varsa sadece aynı seviyedeki öğeler arasında hareket et
    const sameLevel = menuItems.filter(mi => 
      (mi.parent_id === item.parent_id) || 
      (mi.parent_id === null && item.parent_id === null)
    );
    
    const currentIndex = sameLevel.findIndex(mi => mi.id === item.id);
    if (currentIndex <= 0) return; // Zaten en üstte

    const prevItem = sameLevel[currentIndex - 1];
    
    try {
      // Pozisyonları değiştir
      await supabase
        .from("menu_items")
        .update({ position: prevItem.position })
        .eq("id", item.id);
      
      await supabase
        .from("menu_items")
        .update({ position: item.position })
        .eq("id", prevItem.id);
      
      fetchMenuItems();
    } catch (error) {
      console.error("Menü öğesi taşınırken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Menü öğesi taşınırken bir hata oluştu."
      });
    }
  };

  const handleMoveDown = async (item: MenuItem) => {
    // Üst öğe varsa sadece aynı seviyedeki öğeler arasında hareket et
    const sameLevel = menuItems.filter(mi => 
      (mi.parent_id === item.parent_id) || 
      (mi.parent_id === null && item.parent_id === null)
    );
    
    const currentIndex = sameLevel.findIndex(mi => mi.id === item.id);
    if (currentIndex >= sameLevel.length - 1) return; // Zaten en altta
    
    const nextItem = sameLevel[currentIndex + 1];
    
    try {
      // Pozisyonları değiştir
      await supabase
        .from("menu_items")
        .update({ position: nextItem.position })
        .eq("id", item.id);
      
      await supabase
        .from("menu_items")
        .update({ position: item.position })
        .eq("id", nextItem.id);
      
      fetchMenuItems();
    } catch (error) {
      console.error("Menü öğesi taşınırken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Menü öğesi taşınırken bir hata oluştu."
      });
    }
  };

  const handleSubmitMenuItem = async (e: React.FormEvent) => {
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

      setIsFormOpen(false);
      fetchMenuItems();
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

  // Alt menü öğeleri için girinti ekleyerek grupla
  const renderMenuItems = () => {
    // Önce ana menüler
    const topLevelItems = menuItems.filter(item => item.parent_id === null);
    
    return topLevelItems.map(item => (
      <React.Fragment key={item.id}>
        <TableRow className={!item.is_active ? "opacity-60" : ""}>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell>{item.link}</TableCell>
          <TableCell>Ana Menü</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleMoveUp(item)}
                disabled={topLevelItems.indexOf(item) === 0}
              >
                <ArrowUp size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleMoveDown(item)}
                disabled={topLevelItems.indexOf(item) === topLevelItems.length - 1}
              >
                <ArrowDown size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleEditMenuItem(item)}
              >
                <Edit size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleDeleteClick(item.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        
        {/* Alt menü öğeleri */}
        {menuItems
          .filter(subItem => subItem.parent_id === item.id)
          .map(subItem => (
            <TableRow key={subItem.id} className={!subItem.is_active ? "opacity-60 bg-gray-50" : "bg-gray-50"}>
              <TableCell className="pl-8 font-medium">- {subItem.name}</TableCell>
              <TableCell>{subItem.link}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleMoveUp(subItem)}
                  >
                    <ArrowUp size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleMoveDown(subItem)}
                  >
                    <ArrowDown size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleEditMenuItem(subItem)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDeleteClick(subItem.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </React.Fragment>
    ));
  };

  const getTopLevelMenuOptions = () => {
    return menuItems
      .filter(item => item.parent_id === null)
      .map(item => (
        <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
      ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Menü Yönetimi</h2>
        <Button onClick={handleAddMenuItem} className="flex items-center gap-1">
          <PlusCircle size={18} /> Yeni Menü Öğesi Ekle
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
                <TableHead>Menü Adı</TableHead>
                <TableHead>Bağlantı</TableHead>
                <TableHead>Üst Menü</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.length > 0 ? (
                renderMenuItems()
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Henüz menü öğesi eklenmemiş
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Menü Öğesi Ekleme/Düzenleme Formu */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentMenuItem ? "Menü Öğesi Düzenle" : "Yeni Menü Öğesi Ekle"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitMenuItem} className="space-y-4 py-2">
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
                  {getTopLevelMenuOptions()}
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
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
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

      {/* Silme Onay Dialogu */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menü Öğesi Silme Onayı</DialogTitle>
          </DialogHeader>
          <p className="py-4">Bu menü öğesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>İptal</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Sil</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuAdmin;
