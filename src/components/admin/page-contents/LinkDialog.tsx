
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customLink: string;
  onCustomLinkChange: (value: string) => void;
  onSave: () => void;
}

const LinkDialog: React.FC<LinkDialogProps> = ({
  isOpen,
  onClose,
  customLink,
  onCustomLinkChange,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sayfa Linki Düzenle</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customLink">Sayfa Linki</Label>
            <Input
              id="customLink"
              value={customLink}
              onChange={(e) => onCustomLinkChange(e.target.value)}
              placeholder="Örnek: /hakkimizda veya /page/ozel-sayfa"
            />
            <p className="text-xs text-muted-foreground">
              Linkleri doğrudan "/" ile başlayarak yazabilirsiniz. Örn: /hakkimizda veya /page/ozel-sayfa
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>İptal</Button>
          <Button onClick={onSave}>Kaydet</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog;
