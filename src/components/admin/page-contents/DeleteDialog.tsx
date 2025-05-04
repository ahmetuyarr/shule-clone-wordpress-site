
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sayfa İçeriği Silme Onayı</DialogTitle>
        </DialogHeader>
        <p className="py-4">Bu sayfa içeriğini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>İptal</Button>
          <Button variant="destructive" onClick={onConfirm}>Sil</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
