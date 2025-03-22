import type {Place} from "@/api/types.ts";
import {PlaceCard} from "@/components/PlaceCard.tsx";
import {Filter} from "@/components/Filter.tsx";
import {useState} from "react";

interface FilteredPlacesListProps {
    places: Place[];
}

export function FilteredPlacesList({places}: FilteredPlacesListProps) {

    const categories = new Set(places.flatMap(place => place.categories || []));
    const cities = new Set(places.map(place => place.city));

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [isGlutenFree, setIsGlutenFree] = useState(false);

    interface FilterState {
        search: string;
        category: string;
        city: string;
        glutenFree: boolean;
    }

    const handleFilterChange = (filters: FilterState) => {
        setSearchQuery(filters.search.toLowerCase());
        setSelectedCategory(filters.category);
        setSelectedCity(filters.city);
        setIsGlutenFree(filters.glutenFree);
        console.log('[DEBUG_LOG] Filters updated:', {
            searchQuery,
            selectedCategory,
            selectedCity,
            isGlutenFree
        })
    }

    const filteredPlaces = places.filter(place => {
        const matchesSearch = searchQuery === '' ||
            place.name.toLowerCase().includes(searchQuery) ||
            place.description.toLowerCase().includes(searchQuery) ||
            place.city.toLowerCase().includes(searchQuery) ||
            place.address.toLowerCase().includes(searchQuery) ||
            (place.url && place.url.toLowerCase().includes(searchQuery));

        const matchesCategory = selectedCategory === '*' ||
            (place.categories && place.categories.includes(selectedCategory));

        const matchesCity = selectedCity === '*' ||
            place.city === selectedCity;

        const matchesGlutenFree = !isGlutenFree ||
            place.glutenFreeOnly;

        const matches = matchesSearch && matchesCategory && matchesCity && matchesGlutenFree;

        if (!matches) {
            console.log(`[DEBUG_LOG] Place filtered out:`, {
                nazwa: place.name,
                searchMatch: matchesSearch,
                categoryMatch: matchesCategory,
                cityMatch: matchesCity,
                glutenFreeMatch: matchesGlutenFree
            });
        }

        return matches;
    });

    const totalPlaces = places.length;
    const filteredCount = filteredPlaces.length;

    return (
        <div>
            <div className="mb-8">
                <Filter
                    categories={Array.from(categories).sort()}
                    cities={Array.from(cities).sort()}
                    onFilterChange={handleFilterChange}
                />
            </div>
            <div className="mb-6 text-sm text-muted-foreground">
                {(() => {
                    const getPlaceForm = (count: number) => {
                        if (count === 1) return 'miejsce';
                        if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'miejsca';
                        return 'miejsc';
                    };

                    return filteredCount === totalPlaces
                        ? `Znaleziono ${filteredCount} ${getPlaceForm(filteredCount)}`
                        : `Wyświetlono ${filteredCount} z ${totalPlaces} ${getPlaceForm(totalPlaces)}`;
                })()}
            </div>
            {filteredCount > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPlaces.map(place => (
                        <PlaceCard {...place} key={place.id} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    Nie znaleziono miejsc spełniających wybrane kryteria.
                </div>
            )}
        </div>
    )
}
