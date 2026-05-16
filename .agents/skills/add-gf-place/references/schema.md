# Place YAML Schema

Each place is a YAML file in `dane/`. Fields read by `src/lib/data-loader.ts` and typed by `src/api/types.ts`.

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `nazwa` | string | yes | Place name |
| `opis` | string | yes | Description (always `''` in practice) |
| `kategorie` | list | yes | One or more of: `restauracja`, `kawiarnia`, `piekarnia`, `cukiernia`, `sklep`, `hotel`, `inne` |
| `miejscowość` | string | yes | City name |
| `adres` | string | yes | Full address with street and city |
| `www` | string | no | Website URL (can be empty string) |
| `tylko-bezglutenowe` | string | yes | `tak` or `nie` |
| `lat` | number | no | Latitude |
| `lng` | number | no | Longitude |

## Filename rules

- Lowercase, spaces → hyphens, preserve Polish diacritics
- Single-location: `{name-slug}.yaml` (e.g. `placek.yaml`)
- Chain with branch: `{chain}-{city}.yaml` (e.g. `fit-cake-katowice-śródmieście.yaml`)
- Em dashes preserved verbatim in filename (e.g. `wolna-–piekarnia-bezglutenowa-opole.yaml`)

## Examples

### 100% GF restaurant
```yaml
nazwa: Placek
opis: ''
kategorie:
  - restauracja
miejscowość: Katowice
adres: ul. Dworcowa 8, Katowice
www: http://www.placek.katowice.pl/
tylko-bezglutenowe: tak
lat: 50.2572987
lng: 19.022582
```

### 100% GF bakery chain branch
```yaml
nazwa: WOLNA – piekarnia bezglutenowa Katowice
opis: ''
kategorie:
  - piekarnia
miejscowość: Katowice
adres: ul. Plebiscytowa 24, Katowice
www: https://piekarniawolna.pl/
tylko-bezglutenowe: tak
lat: 50.2534065
lng: 19.0205897
```

### Non-GF-exclusive place
```yaml
nazwa: A'Favela
opis: ''
kategorie:
  - restauracja
miejscowość: Bydgoszcz
adres: Plac Wolności 7, Bydgoszcz
www: https://afavela.pl/restaurants/afavela
tylko-bezglutenowe: nie
lat: 53.1273286
lng: 18.0066158
```

## Commit & PR conventions

- Branch: `add/{name-slug}`
- Commit message: `Nowe miejsce: {nazwa}`
- PR title: `Nowe miejsce: {nazwa}`
- PR body: 1-line summary with address, categories, GF-only status
