import { useState } from 'react';
import { FilteredPlacesList } from '@/components/FilteredPlacesList';
import { MapComponent } from '@/components/MapComponent';
import type { Place } from '@/api/types.ts';

interface TabViewProps {
  places: Place[];
}

export function TabView({ places }: TabViewProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  return (
    <div>
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'list'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Lista
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'map'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('map')}
        >
          Mapa
        </button>
      </div>

      {activeTab === 'list' ? (
        <FilteredPlacesList places={places} />
      ) : (
        <MapComponent places={places} />
      )}
    </div>
  );
}
