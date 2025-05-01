
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  link: string;
  parent_id: string | null;
  position: number;
  is_active: boolean;
}

interface MenuItemRowProps {
  item: MenuItem;
  parentName?: string;
  isSubItem?: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: (item: MenuItem) => void;
  onMoveDown: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
}

const MenuItemRow: React.FC<MenuItemRowProps> = ({
  item,
  parentName = "Ana Menü",
  isSubItem = false,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete
}) => {
  return (
    <TableRow className={`${!item.is_active ? "opacity-60" : ""} ${isSubItem ? "bg-gray-50" : ""}`}>
      <TableCell className={`${isSubItem ? "pl-8" : ""} font-medium`}>
        {isSubItem ? `- ${item.name}` : item.name}
      </TableCell>
      <TableCell>{item.link}</TableCell>
      <TableCell>{parentName}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onMoveUp(item)}
            disabled={!canMoveUp}
          >
            <ArrowUp size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onMoveDown(item)}
            disabled={!canMoveDown}
          >
            <ArrowDown size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(item)}
          >
            <Edit size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MenuItemRow;
