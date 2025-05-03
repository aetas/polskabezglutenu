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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Button} from "@/components/ui/button.tsx";
import {Check, ChevronDown} from "lucide-react";
import {cn} from "@/lib/utils.ts";

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
  const [openCity, setOpenCity] = useState(false);

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
      <Popover open={openCity} onOpenChange={setOpenCity}>
          <PopoverTrigger asChild>
              <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCity}
                  className="w-[230px] justify-between"
                  value={city}

              >
                  {city != "*"
                      ? cities.find((cities1) => cities1 === city)
                      : "Wszystkie miejscowości"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[230px] p-0">
              <Command>
                  <CommandInput placeholder="Znajdź miejscowość..." />
                  <CommandList>
                      <CommandEmpty>Nie znaleziono</CommandEmpty>
                      <CommandGroup>
                          <CommandItem
                              key="*"
                              value="*"
                              onSelect={() => {
                                  setCity("*")
                                  setOpenCity(false)
                              }}
                          >
                              <Check
                                  className={cn(
                                      "mr-2 h-4 w-4",
                                      "*" === city ? "opacity-100" : "opacity-0"
                                  )}
                              />
                              Wszystkie miejscowości
                          </CommandItem>
                          {cities.map((value) => (
                              <CommandItem
                                  key={value}
                                  value={value}
                                  onSelect={(currentValue) => {
                                      setCity(currentValue)
                                      setOpenCity(false)
                                  }}
                              >
                                  <Check
                                      className={cn(
                                          "mr-2 h-4 w-4",
                                          value === city ? "opacity-100" : "opacity-0"
                                      )}
                                  />
                                  {value}
                              </CommandItem>
                          ))}
                      </CommandGroup>
                  </CommandList>
              </Command>
          </PopoverContent>
      </Popover>
      <Toggle
        pressed={glutenFree}
        onPressedChange={(value) => setGlutenFree(value)}
      >
        Tylko bezglutenowe
      </Toggle>
    </div>
  );
}
