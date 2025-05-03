
import React, { useState } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.trim().length < 2) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image, category')
        .ilike('name', `%${searchQuery}%`)
        .limit(8);

      if (error) {
        console.error("Search error:", error);
        throw error;
      }
      
      return data as SearchResult[];
    },
    enabled: searchQuery.trim().length >= 2,
  });

  const handleSelect = (productId: string) => {
    navigate(`/products/${productId}`);
    onOpenChange(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setSearchQuery('');
    }}>
      <DialogContent className="p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Ürün ara... (en az 2 karakter)"
            value={searchQuery}
            onValueChange={setSearchQuery}
            autoFocus
          />
          
          {searchQuery.trim().length < 2 ? (
            <CommandEmpty className="py-6 text-center text-sm">
              <Search className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p>Arama yapmak için en az 2 karakter girin</p>
            </CommandEmpty>
          ) : isLoading ? (
            <CommandEmpty className="py-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Aranıyor...</span>
              </div>
            </CommandEmpty>
          ) : searchResults && searchResults.length === 0 ? (
            <CommandEmpty className="py-6 text-center">
              "{searchQuery}" için sonuç bulunamadı
            </CommandEmpty>
          ) : (
            <CommandGroup heading="Ürünler">
              {searchResults?.map((result) => (
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
                      {result.category} - {result.price.toLocaleString('tr-TR')} ₺
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
