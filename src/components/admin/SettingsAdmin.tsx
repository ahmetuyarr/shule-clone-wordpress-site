
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SiteInfo {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  [key: string]: string;
}

interface Settings {
  id: string;
  value: any;
}

const SettingsAdmin = () => {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    site_name: "",
    site_description: "",
    contact_email: "",
    contact_phone: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", "site_info")
        .single();

      if (error) throw error;
      
      if (data && data.value) {
        setSiteInfo(data.value);
      }
    } catch (error) {
      console.error("Ayarlar yüklenirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ayarlar yüklenirken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiteInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("settings")
        .update({ value: siteInfo })
        .eq("id", "site_info");

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Site ayarları başarıyla güncellendi."
      });
    } catch (error) {
      console.error("Ayarlar kaydedilirken hata oluştu:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Site Ayarları</h2>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Genel Ayarlar</TabsTrigger>
          <TabsTrigger value="contact" disabled>İletişim Bilgileri</TabsTrigger>
          <TabsTrigger value="social" disabled>Sosyal Medya</TabsTrigger>
          <TabsTrigger value="seo" disabled>SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Genel Site Ayarları</CardTitle>
              <CardDescription>
                Sitenin temel bilgilerini ve görünümünü yapılandırın.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Site Adı</Label>
                    <Input 
                      id="site_name" 
                      name="site_name" 
                      value={siteInfo.site_name} 
                      onChange={handleInputChange}
                      placeholder="Site adınızı giriniz"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">İletişim E-posta</Label>
                    <Input 
                      id="contact_email" 
                      name="contact_email" 
                      type="email"
                      value={siteInfo.contact_email} 
                      onChange={handleInputChange}
                      placeholder="ornek@siteadi.com"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="site_description">Site Açıklaması</Label>
                    <Textarea 
                      id="site_description" 
                      name="site_description" 
                      value={siteInfo.site_description} 
                      onChange={handleInputChange}
                      placeholder="Sitenizin kısa açıklamasını giriniz"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">İletişim Telefonu</Label>
                    <Input 
                      id="contact_phone" 
                      name="contact_phone" 
                      value={siteInfo.contact_phone} 
                      onChange={handleInputChange}
                      placeholder="+90 (___) ___ __ __"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Kaydediliyor...
                      </>
                    ) : "Ayarları Kaydet"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsAdmin;
