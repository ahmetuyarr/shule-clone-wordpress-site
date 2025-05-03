
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Silme Onayı",
  description = "Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
}) => {
  // Onayı işlemek için bir işleyici ekleyin ve yükleme durumunu takip edin
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Silme işlemi sırasında hata:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="py-4">{description}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            İptal
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm} 
            disabled={isLoading}
          >
            {isLoading ? "Siliniyor..." : "Sil"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
