
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsAdmin from "@/components/admin/ProductsAdmin";
import CategoriesAdmin from "@/components/admin/CategoriesAdmin";
import CollectionsAdmin from "@/components/admin/CollectionsAdmin";
import MenuAdmin from "@/components/admin/MenuAdmin";
import SettingsAdmin from "@/components/admin/SettingsAdmin";
import OrdersAdmin from "@/components/admin/OrdersAdmin";
import { Toaster } from "@/components/ui/toaster";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-16">
        <div className="shule-container">
          <h1 className="text-3xl font-semibold text-center mb-8">Yönetim Paneli</h1>
          
          <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-6 mb-8">
              <TabsTrigger value="products">Ürünler</TabsTrigger>
              <TabsTrigger value="categories">Kategoriler</TabsTrigger>
              <TabsTrigger value="collections">Koleksiyonlar</TabsTrigger>
              <TabsTrigger value="orders">Siparişler</TabsTrigger>
              <TabsTrigger value="menu">Menüler</TabsTrigger>
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
