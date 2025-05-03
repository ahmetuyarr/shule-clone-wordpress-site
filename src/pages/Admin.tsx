
import React, { useState, useEffect } from "react";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsAdmin from "@/components/admin/ProductsAdmin";
import CategoriesAdmin from "@/components/admin/CategoriesAdmin";
import CollectionsAdmin from "@/components/admin/CollectionsAdmin";
import MenuAdmin from "@/components/admin/MenuAdmin";
import SettingsAdmin from "@/components/admin/SettingsAdmin";
import OrdersAdmin from "@/components/admin/OrdersAdmin";
import PageContentsAdmin from "@/components/admin/PageContentsAdmin";
import { Toaster } from "@/components/ui/toaster";
import { useLocation, useNavigate } from "react-router-dom";

const Admin = () => {
  useAdminGuard();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get tab from URL query parameter
  const getTabFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["products", "categories", "collections", "orders", "menu", "pages", "settings"].includes(tab)) {
      return tab;
    }
    return "products";
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  
  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [location.search]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/admin?tab=${tab}`);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-16">
        <div className="shule-container">
          <h1 className="text-3xl font-semibold text-center mb-8">Yönetim Paneli</h1>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-7 mb-8 overflow-x-auto flex-wrap md:flex-nowrap">
              <TabsTrigger value="products">Ürünler</TabsTrigger>
              <TabsTrigger value="categories">Kategoriler</TabsTrigger>
              <TabsTrigger value="collections">Koleksiyonlar</TabsTrigger>
              <TabsTrigger value="orders">Siparişler</TabsTrigger>
              <TabsTrigger value="menu">Menüler</TabsTrigger>
              <TabsTrigger value="pages">Sayfalar</TabsTrigger>
              <TabsTrigger value="settings">Ayarlar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <ProductsAdmin />
            </TabsContent>
            
            <TabsContent value="categories">
              <CategoriesAdmin />
            </TabsContent>
            
            <TabsContent value="collections">
              <CollectionsAdmin />
            </TabsContent>
            
            <TabsContent value="orders">
              <OrdersAdmin />
            </TabsContent>
            
            <TabsContent value="menu">
              <MenuAdmin />
            </TabsContent>
            
            <TabsContent value="pages">
              <PageContentsAdmin />
            </TabsContent>
            
            <TabsContent value="settings">
              <SettingsAdmin />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Admin;
