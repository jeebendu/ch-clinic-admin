
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChipItem {
  id: number;
  name: string;
}

interface ChipSelectorProps {
  label: string;
  availableItems: ChipItem[];
  selectedItems: ChipItem[];
  onSelectionChange: (selected: ChipItem[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

const ChipSelector: React.FC<ChipSelectorProps> = ({
  label,
  availableItems,
  selectedItems,
  onSelectionChange,
  placeholder = "No items selected",
  searchPlaceholder = "Search items...",
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedIds = selectedItems.map(item => item.id);
  const filteredAvailableItems = availableItems.filter(item => 
    !selectedIds.includes(item.id) && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemSelect = (item: ChipItem) => {
    const newSelected = [...selectedItems, item];
    onSelectionChange(newSelected);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleItemRemove = (itemId: number) => {
    const newSelected = selectedItems.filter(item => item.id !== itemId);
    onSelectionChange(newSelected);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* Selected Items Display */}
      <div className="min-h-[60px] p-3 border rounded-md bg-white">
        {selectedItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">{placeholder}</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedItems.map((item) => (
              <Badge
                key={item.id}
                variant="secondary"
                className="flex items-center gap-1 pr-1 bg-primary/10 text-primary border-primary/20"
              >
                <span>{item.name}</span>
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                    onClick={() => handleItemRemove(item.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Search and Add Section */}
      {!disabled && (
        <div className="relative">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Dropdown List */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredAvailableItems.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground text-center">
                  {searchTerm ? 'No items found' : 'All items selected'}
                </div>
              ) : (
                <div className="p-1">
                  {filteredAvailableItems.map((item) => (
                    <Button
                      key={item.id}
                      type="button"
                      variant="ghost"
                      className="w-full justify-start h-auto p-2 text-sm hover:bg-primary/10"
                      onClick={() => handleItemSelect(item)}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ChipSelector;
