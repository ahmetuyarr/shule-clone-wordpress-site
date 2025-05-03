
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";

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
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onMoveUp: (item: MenuItem) => void;
  onMoveDown: (item: MenuItem) => void;
}

const MenuItemRow: React.FC<MenuItemRowProps> = ({
  item,
  parentName,
  isSubItem = false,
  canMoveUp,
  canMoveDown,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  // Helper to get the full link (external or internal)
  const getFullLink = (link: string) => {
    if (link.startsWith("http")) {
      return link;
    }
    return `/${link.startsWith("/") ? link.substring(1) : link}`;
  };

  return (
    <TableRow>
      <TableCell>
        <div className={`flex items-center ${isSubItem ? "pl-6" : ""}`}>
          {isSubItem && (
            <span className="text-xs text-gray-500 mr-2">└</span>
          )}
          <span className={`font-medium ${!item.is_active ? "text-gray-400" : ""}`}>
            {item.name}
            {!item.is_active && <span className="ml-2 text-xs">(Pasif)</span>}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <a 
          href={getFullLink(item.link)} 
          className="text-blue-600 hover:underline"
          target="_blank" 
          rel="noopener noreferrer"
        >
          <span className="flex items-center">
            {item.link}
            <ExternalLink size={14} className="ml-1" />
          </span>
        </a>
      </TableCell>
      <TableCell>{parentName || "-"}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMoveUp(item)}
            disabled={!canMoveUp}
            className={!canMoveUp ? "opacity-30" : ""}
          >
            <ChevronUp size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMoveDown(item)}
            disabled={!canMoveDown}
            className={!canMoveDown ? "opacity-30" : ""}
          >
            <ChevronDown size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
            <Edit size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDelete(item.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MenuItemRow;
