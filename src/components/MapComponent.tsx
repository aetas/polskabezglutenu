import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Place } from '@/api/types.ts';
import { Filter } from '@/components/Filter.tsx';

interface MapComponentProps {
  places: Place[];
}

export function MapComponent({ places }: MapComponentProps) {
  // Create a custom icon for markers
  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  // Extract unique categories and cities for filters
  const categories = new Set(places.flatMap(place => place.categories || []));
  const cities = new Set(places.map(place => place.city));

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isGlutenFree, setIsGlutenFree] = useState(false);

  // Center of Poland as default map center
  const defaultCenter: [number, number] = [52.0693, 19.4803];
  const defaultZoom = 6;

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
  };


  // Filter places based on filter state
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

    return matchesSearch && matchesCategory && matchesCity && matchesGlutenFree;
  });

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

          const filteredCount = filteredPlaces.length;
          const totalPlaces = places.length;

          return filteredCount === totalPlaces
            ? `Znaleziono ${filteredCount} ${getPlaceForm(filteredCount)}`
            : `Wyświetlono ${filteredCount} z ${totalPlaces} ${getPlaceForm(totalPlaces)}`;
        })()}
      </div>
      <div style={{ height: '600px', width: '100%', position: 'relative', zIndex: 0 }}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredPlaces.map(place => {
            if (place.lat && place.lng) {
              return (
                <Marker
                  key={place.id}
                  position={[place.lat, place.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{place.name}</h3>
                      <p>{place.address}, {place.city}</p>
                      {place.categories && place.categories.length > 0 && (
                        <p>Kategorie: {place.categories.join(', ')}</p>
                      )}
                      <p>Tylko bezglutenowe: {place.glutenFreeOnly ? 'tak' : 'nie'}</p>
                      {place.url && (
                        <a
                          href={place.url.startsWith('http') ? place.url : `https://${place.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Strona WWW
                        </a>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
    </div>
  );
}
