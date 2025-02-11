'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Category } from "@/types";

interface CategoryInputProps {
  category: Category;
  index: number;
  onChange: (index: number, value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
}

export function CategoryInput({
  category,
  index,
  onChange,
  onKeyDown,
}: CategoryInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`category-${index}`}>{category.name}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-5 w-5 rounded-full p-0 text-sm bg-purple-600 text-white hover:bg-purple-700 border-0"
              >
                ?
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{category.tooltip.score}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input
        id={`category-${index}`}
        type="number"
        min="0"
        max="10"
        step="0.1"
        value={category.score}
        onChange={(e) => onChange(index, e.target.value)}
        onKeyDown={(e) => onKeyDown(e, index)}
        placeholder="0-10"
        required
        className="mt-1"
      />
    </div>
  );
} 