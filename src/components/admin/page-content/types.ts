
export interface PageContent {
  id: string;
  title: string;
  page_key: string;
  content: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export const PAGE_TYPES = [
  { value: "about", label: "Hakkımızda", system: true },
  { value: "contact", label: "İletişim", system: true },
  { value: "terms", label: "Kullanım Koşulları", system: false },
  { value: "privacy", label: "Gizlilik Politikası", system: false },
  { value: "faq", label: "Sıkça Sorulan Sorular", system: false },
  { value: "home", label: "Ana Sayfa", system: true },
  { value: "shipping", label: "Kargo Bilgileri", system: false },
  { value: "returns", label: "İade Politikası", system: false },
  { value: "sizing", label: "Beden Rehberi", system: false },
  { value: "products", label: "Ürünler", system: true },
  { value: "collections", label: "Koleksiyonlar", system: true },
  { value: "bestsellers", label: "Çok Satanlar", system: true },
  { value: "new", label: "Yeni Ürünler", system: true },
  { value: "custom", label: "Özel Sayfa", system: false },
];
