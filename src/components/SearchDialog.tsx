
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image, category')
        .ilike('name', `%${searchQuery}%`)
        .limit(5);

      if (error) throw error;
      return data as SearchResult[];
    },
    enabled: searchQuery.length > 0,
  });

  const handleSelect = (productId: string) => {
    navigate(`/products/${productId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Ürün ara..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty className="p-4 text-center">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Aranıyor...</span>
              </div>
            ) : (
              'Sonuç bulunamadı.'
            )}
          </CommandEmpty>
          {searchResults && searchResults.length > 0 && (
            <CommandGroup>
              {searchResults.map((result) => (
                <CommandItem
                  key={result.id}
                  value={result.id}
                  onSelect={() => handleSelect(result.id)}
                  className="flex items-center gap-3 p-2"
                >
                  <img
                    src={result.image}
                    alt={result.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{result.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {result.category} - {result.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
