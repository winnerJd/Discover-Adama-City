import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star, X, RotateCcw } from "lucide-react";
import { useServices } from "@/context/ServicesContext";
import { Badge } from "@/components/ui/badge";

export type Filters = {
  q: string;
  category: string | "all";
  minRating: number;
};

const SearchFilters: React.FC<{
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}> = ({ filters, onChange, onReset }) => {
  const { categories } = useServices();
  const hasActiveFilters = filters.q || filters.category !== "all" || filters.minRating > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="h-5 w-5" />
        <span className="text-sm font-medium">Filter Services</span>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="q" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="q"
              placeholder="Name, address, tag..."
              value={filters.q}
              onChange={(e) => onChange({ ...filters, q: e.target.value })}
              className="pl-9 pr-9 h-11"
            />
            {filters.q && (
              <button
                onClick={() => onChange({ ...filters, q: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(v) => onChange({ ...filters, category: v as any })}
          >
            <SelectTrigger id="category" className="h-11">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c._id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            Minimum Rating: {filters.minRating}+
          </Label>
          <div className="px-2">
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[filters.minRating]}
              onValueChange={(v) => onChange({ ...filters, minRating: v[0] ?? 0 })}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
            <span>0</span>
            <span className="font-medium text-foreground">{filters.minRating.toFixed(1)}</span>
            <span>5</span>
          </div>
        </div>

        <Button 
          variant={hasActiveFilters ? "default" : "outline"} 
          onClick={onReset}
          className="h-11 w-full"
          disabled={!hasActiveFilters}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.q && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.q}"
              <button
                onClick={() => onChange({ ...filters, q: "" })}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.category !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {filters.category}
              <button
                onClick={() => onChange({ ...filters, category: "all" })}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.minRating > 0 && (
            <Badge variant="secondary" className="gap-1">
              Rating: {filters.minRating}+
              <button
                onClick={() => onChange({ ...filters, minRating: 0 })}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
