
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  description?: string;
  image: string;
  category: string;
  is_new: boolean;
  is_bestseller: boolean;
  is_on_sale: boolean;
  is_featured: boolean;
}

interface ProductFormProps {
  product: Product | null;
  isOpen: boolean;
  onClose: (refreshData?: boolean) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, isOpen, onClose }) => {
  const isEditing = !!product;
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: "",
    price: 0,
    sale_price: undefined,
    description: "",
    image: "",
    category: "",
    is_new: false,
    is_bestseller: false,
    is_on_sale: false,
    is_featured: false
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        description: product.description || "",
        image: product.image,
        category: product.category,
        is_new: product.is_new,
        is_bestseller: product.is_bestseller,
        is_on_sale: product.is_on_sale,
        is_featured: product.is_featured
      });
    }
    
    fetchCategories();
  }, [product]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("category")
        .order("category");

      if (error) throw error;

      // Benzersiz kategorileri al
      const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata oluştu:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));

    // İndirimli fiyat kontrolü
    if (name === 'is_on_sale' && !checked) {
      setFormData(prev => ({
        ...prev,
        sale_price: undefined
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name || formData.name.trim() === "") {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ürün adı zorunludur."
      });
      return false;
    }

    if (!formData.price || formData.price <= 0) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Geçerli bir fiyat giriniz."
      });
      return false;
    }

    if (formData.is_on_sale && (!formData.sale_price || formData.sale_price <= 0)) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "İndirimli ürünler için indirimli fiyat girilmelidir."
      });
      return false;
    }

    if (!formData.image || formData.image.trim() === "") {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ürün görseli URL'si zorunludur."
      });
      return false;
    }

    if (!formData.category || formData.category.trim() === "") {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kategori seçimi zorunludur."
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isEditing && product) {
        // Güncelleme işlemi
        const { error } = await supabase
          .from("products")
          .update(formData)
          .eq("id", product.id);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Ürün başarıyla güncellendi."
        });
      } else {
        // Yeni ürün ekleme işlemi
        const { error } = await supabase
          .from("products")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Yeni ürün başarıyla eklendi."
        });
      }

      onClose(true); // Veriyi yeniden yükle
    } catch (error) {
      console.error("Ürün kaydedilirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ürün kaydedilirken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ürün Adı</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ürün adını giriniz"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <div className="flex gap-2">
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Kategori adını giriniz"
                  list="categoryOptions"
                  required
                />
                <datalist id="categoryOptions">
                  {categories.map((cat, index) => (
                    <option key={index} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Fiyat (₺)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale_price">İndirimli Fiyat (₺)</Label>
              <Input
                id="sale_price"
                name="sale_price"
                type="number"
                value={formData.sale_price || ""}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={!formData.is_on_sale}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="image">Görsel URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Ürün Önizleme"
                    className="max-h-40 rounded border object-contain"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Ürün açıklamasını giriniz"
                rows={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_new"
                checked={formData.is_new}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("is_new", checked === true)
                }
              />
              <Label htmlFor="is_new" className="cursor-pointer">Yeni Ürün</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_bestseller"
                checked={formData.is_bestseller}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("is_bestseller", checked === true)
                }
              />
              <Label htmlFor="is_bestseller" className="cursor-pointer">Çok Satan</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_on_sale"
                checked={formData.is_on_sale}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("is_on_sale", checked === true)
                }
              />
              <Label htmlFor="is_on_sale" className="cursor-pointer">İndirimli</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("is_featured", checked === true)
                }
              />
              <Label htmlFor="is_featured" className="cursor-pointer">Öne Çıkan</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Kaydediliyor...
                </>
              ) : isEditing ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
