import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useServices } from "@/context/ServicesContext";
// we may use getCategory from serviceContext

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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
      <div className="space-y-2">
        <Label htmlFor="q">Search</Label>
        <Input
          id="q"
          placeholder="Name, address, tag..."
          value={filters.q}
          onChange={(e) => onChange({ ...filters, q: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={filters.category}
          onValueChange={(v) => onChange({ ...filters, category: v as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c._id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Minimum rating: {filters.minRating}+</Label>
        <Slider
          min={0}
          max={5}
          step={1}
          value={[filters.minRating]}
          onValueChange={(v) => onChange({ ...filters, minRating: v[0] ?? 0 })}
        />
      </div>
      <div className="flex gap-2">
        <Button className="w-full" variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
