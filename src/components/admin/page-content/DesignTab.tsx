
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";

const DesignTab: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center py-8">
          <Palette size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Sayfa Tasarım Seçenekleri</h3>
          <p className="text-muted-foreground">
            Bu sayfanın tasarım ayarlarını yapabilirsiniz. (Yakında eklenecek)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignTab;
