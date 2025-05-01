import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  description?: string;
  image: string;
  images?: string[];
  category: string;
  collection?: string;
  category_id?: string;
  collection_id?: string;
  is_new: boolean;
  is_bestseller: boolean;
  is_on_sale: boolean;
  is_featured: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Collection {
  id: string;
  name: string;
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
    images: [],
    category: "",
    collection: "",
    category_id: undefined,
    collection_id: undefined,
    is_new: false,
    is_bestseller: false,
    is_on_sale: false,
    is_featured: false
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [collectionOptions, setCollectionOptions] = useState<Collection[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        description: product.description || "",
        image: product.image,
        images: product.images || [],
        category: product.category,
        collection: product.collection || "",
        category_id: product.category_id || undefined,
        collection_id: product.collection_id || undefined,
        is_new: product.is_new,
        is_bestseller: product.is_bestseller,
        is_on_sale: product.is_on_sale,
        is_featured: product.is_featured
      });
      
      if (product.images && product.images.length > 0) {
        setImageUrls(product.images);
      } else if (product.image) {
        setImageUrls([product.image]);
      }
    }
    
    fetchCategories();
    fetchCategoryOptions();
    fetchCollectionOptions();
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
  
  const fetchCategoryOptions = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategoryOptions(data || []);
    } catch (error) {
      console.error("Kategori seçenekleri yüklenirken hata oluştu:", error);
    }
  };

  const fetchCollectionOptions = async () => {
    try {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("name");

      if (error) throw error;
      setCollectionOptions(data || []);
    } catch (error) {
      console.error("Koleksiyon seçenekleri yüklenirken hata oluştu:", error);
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'category_id' && value) {
      const selectedCategory = categoryOptions.find(cat => cat.id === value);
      if (selectedCategory) {
        setFormData(prev => ({
          ...prev,
          category: selectedCategory.name
        }));
      }
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

  const addImageUrl = () => {
    if (!formData.image.trim()) return;
    
    if (!imageUrls.includes(formData.image)) {
      const newImageUrls = [...imageUrls, formData.image];
      setImageUrls(newImageUrls);
      setFormData(prev => ({
        ...prev,
        images: newImageUrls,
        image: newImageUrls[0]
      }));
    }
    
    // Image ekledikten sonra input'u temizle
    setFormData(prev => ({
      ...prev,
      image: ""
    }));
  };

  const removeImageUrl = (urlToRemove: string) => {
    const newImageUrls = imageUrls.filter(url => url !== urlToRemove);
    setImageUrls(newImageUrls);
    
    setFormData(prev => ({
      ...prev,
      images: newImageUrls,
      image: newImageUrls.length > 0 ? newImageUrls[0] : ""
    }));
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

    if (imageUrls.length === 0) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "En az bir ürün görseli URL'si zorunludur."
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
      // Resimlerle güncellenen formData
      const updatedFormData = {
        ...formData,
        image: imageUrls[0], // İlk resmi ana resim olarak ayarla
        images: imageUrls
      };
      
      if (isEditing && product) {
        // Güncelleme işlemi
        const { error } = await supabase
          .from("products")
          .update(updatedFormData)
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
          .insert([updatedFormData]);

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="category_id">Kategori</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => handleSelectChange('category_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.category_id && (
                <div className="mt-2">
                  <Label htmlFor="category">Veya yeni kategori gir</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Kategori adını giriniz"
                    list="categoryOptions"
                  />
                  <datalist id="categoryOptions">
                    {categories.map((cat, index) => (
                      <option key={index} value={cat} />
                    ))}
                  </datalist>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection_id">Koleksiyon</Label>
              <Select 
                value={formData.collection_id || undefined} 
                onValueChange={(value) => handleSelectChange('collection_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Koleksiyon seçiniz (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Koleksiyon yok</SelectItem>
                  {collectionOptions.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <div className="flex gap-2">
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={addImageUrl}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} /> Ekle
                </Button>
              </div>

              {/* Görsel Önizleme */}
              {imageUrls.length > 0 && (
                <div className="mt-4">
                  <Label>Görsel Galerisi</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group border rounded p-1">
                        <img
                          src={url}
                          alt={`Ürün Görseli ${index + 1}`}
                          className="w-full aspect-square object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageUrl(url)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 right-1 text-center bg-black bg-opacity-50 text-white text-xs py-0.5 px-1 rounded">
                            Ana Görsel
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
