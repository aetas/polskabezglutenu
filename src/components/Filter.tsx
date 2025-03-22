import {useEffect, useState} from "react";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FilterProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    city: string;
    glutenFree: boolean;
  }) => void;
  categories: string[];
  cities: string[];
}

export function Filter({ onFilterChange, categories, cities }: FilterProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("*");
  const [city, setCity] = useState("*");
  const [glutenFree, setGlutenFree] = useState(false);

  useEffect(() => {
      onFilterChange({
      search,
      category,
      city,
      glutenFree,
    });
  }, [search, category, city, glutenFree, onFilterChange]);

  return (
    <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      <Input
        placeholder="Szukaj..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        value={category}
        onValueChange={(value) => setCategory(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Kategoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="*">Wszystkie kategorie</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={city}
        onValueChange={(value) => setCity(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Miejscowość" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="*">Wszystkie miejscowości</SelectItem>
          {cities.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Toggle
        pressed={glutenFree}
        onPressedChange={(value) => setGlutenFree(value)}
      >
        Tylko bezglutenowe
      </Toggle>
    </div>
  );
}
