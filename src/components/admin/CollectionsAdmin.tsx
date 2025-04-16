
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Collection {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

const CollectionsAdmin = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", image: "" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { toast } = useToast();

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("name");

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error("Koleksiyonlar yüklenirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Koleksiyonlar yüklenirken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCollection = () => {
    setCurrentCollection(null);
    setFormData({ name: "", description: "", image: "" });
    setIsFormOpen(true);
  };

  const handleEditCollection = (collection: Collection) => {
    setCurrentCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || "",
      image: collection.image || ""
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (collectionId: string) => {
    setCollectionToDelete(collectionId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!collectionToDelete) return;

    try {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", collectionToDelete);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Koleksiyon başarıyla silindi."
      });

      fetchCollections();
    } catch (error: any) {
      console.error("Koleksiyon silinirken hata oluştu:", error);
      
      let errorMessage = "Koleksiyon silinirken bir hata oluştu.";
      if (error.message && error.message.includes('violates foreign key constraint')) {
        errorMessage = "Bu koleksiyona bağlı ürünler olduğu için silinemez.";
      }
      
      toast({
        variant: "destructive",
        title: "Hata",
        description: errorMessage
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCollectionToDelete(null);
    }
  };

  const handleSubmitCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Koleksiyon adı zorunludur."
      });
      return;
    }

    setFormLoading(true);

    try {
      if (currentCollection) {
        // Güncelleme işlemi
        const { error } = await supabase
          .from("collections")
          .update({
            name: formData.name,
            description: formData.description || null,
            image: formData.image || null
          })
          .eq("id", currentCollection.id);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Koleksiyon başarıyla güncellendi."
        });
      } else {
        // Yeni koleksiyon ekleme
        const { error } = await supabase
          .from("collections")
          .insert([{
            name: formData.name,
            description: formData.description || null,
            image: formData.image || null
          }]);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Yeni koleksiyon başarıyla eklendi."
        });
      }

      setIsFormOpen(false);
      fetchCollections();
    } catch (error) {
      console.error("Koleksiyon kaydedilirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Koleksiyon kaydedilirken bir hata oluştu."
      });
    } finally {
      setFormLoading(false);
    }
  };

  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Koleksiyon Yönetimi</h2>
        <Button onClick={handleAddCollection} className="flex items-center gap-1">
          <PlusCircle size={18} /> Yeni Koleksiyon Ekle
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Koleksiyon ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
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
                <TableHead>Görsel</TableHead>
                <TableHead>Koleksiyon Adı</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections.length > 0 ? (
                filteredCollections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      {collection.image ? (
                        <img 
                          src={collection.image} 
                          alt={collection.name} 
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                          Görsel Yok
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{collection.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {collection.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditCollection(collection)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDeleteClick(collection.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    {search ? 'Arama kriterlerine uygun koleksiyon bulunamadı' : 'Henüz koleksiyon eklenmemiş'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Koleksiyon Ekleme/Düzenleme Formu */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentCollection ? "Koleksiyon Düzenle" : "Yeni Koleksiyon Ekle"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitCollection} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Koleksiyon Adı</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Koleksiyon adını giriniz"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Koleksiyon açıklaması giriniz"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Görsel URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Koleksiyon Görseli"
                    className="max-h-40 rounded border object-contain"
                  />
                </div>
              )}
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
                ) : currentCollection ? "Güncelle" : "Ekle"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Silme Onay Dialogu */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Koleksiyon Silme Onayı</DialogTitle>
          </DialogHeader>
          <p className="py-4">Bu koleksiyonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>İptal</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Sil</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionsAdmin;
