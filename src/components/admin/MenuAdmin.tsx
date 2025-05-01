
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import MenuForm from "./MenuForm";
import MenuItemRow from "./MenuItemRow";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [menuItemToDelete, setMenuItemToDelete] = useState<string | null>(null);

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

  const handleAddMenuItem = () => {
    console.log("Opening add menu item form");
    setCurrentMenuItem(null);
    setIsFormOpen(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    console.log("Opening edit menu item form", item);
    setCurrentMenuItem(item);
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

  const renderMenuItems = () => {
    // Önce ana menüler
    const topLevelItems = menuItems.filter(item => item.parent_id === null);
    
    return topLevelItems.map((item, index) => (
      <React.Fragment key={item.id}>
        <MenuItemRow 
          item={item}
          canMoveUp={index > 0}
          canMoveDown={index < topLevelItems.length - 1}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onEdit={handleEditMenuItem}
          onDelete={handleDeleteClick}
        />
        
        {/* Alt menü öğeleri */}
        {menuItems
          .filter(subItem => subItem.parent_id === item.id)
          .map((subItem, subIndex, subArray) => (
            <MenuItemRow 
              key={subItem.id}
              item={subItem}
              parentName={item.name}
              isSubItem={true}
              canMoveUp={subIndex > 0}
              canMoveDown={subIndex < subArray.length - 1}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onEdit={handleEditMenuItem}
              onDelete={handleDeleteClick}
            />
          ))}
      </React.Fragment>
    ));
  };

  // Ana menü öğelerini al - form için kullanılacak
  const getTopLevelMenuItems = () => {
    return menuItems.filter(item => item.parent_id === null);
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
      <MenuForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        currentMenuItem={currentMenuItem}
        onSuccess={fetchMenuItems}
        parentMenuItems={getTopLevelMenuItems()}
      />

      {/* Silme Onay Dialogu */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Menü Öğesi Silme Onayı"
        description="Bu menü öğesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
};

export default MenuAdmin;
