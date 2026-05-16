---
name: add-gf-place
description: Add a new gluten-free place to the polskabezglutenu.pl catalogue. Trigger when user asks to add/dodać a new place/lokal/miejsce to the project/catalogue, or mentions a specific place name with city and wants it added. Covers searching for the place online, creating the YAML data file, and opening a GitHub PR.
---

# Add Gluten-Free Place

When the user wants to add a new gluten-free place to the catalogue, follow this workflow.

## Workflow

### 1. Search for the place online

Search for the place on Polish gluten-free resources:

- **menubezglutenu.pl** — official MENU BEZ GLUTENU directory (search: `{name} {city} menubezglutenu`)
- **celiakia.pl** — Polish Coeliac Society news (search: `{name} {city} celiakia`)
- **DuckDuckGo** — general search (search: `{name} {city} bezglutenowa`)
- **Facebook** — business page (search: `{name} {city} Facebook`)

From these sources extract:
- Official name (`nazwa`)
- Address with street and city (`adres`, `miejscowość`)
- Website or Facebook page (`www`)
- Whether it's 100% gluten-free (`tylko-bezglutenowe`: `tak`/`nie`)
- What type of place it is (for `kategorie`)

If a place is in the MENU BEZ GLUTENU program → `tylko-bezglutenowe: tak` is almost certain.

### 2. Determine categories

Pick from the valid set: `restauracja`, `kawiarnia`, `piekarnia`, `cukiernia`, `sklep`, `hotel`, `inne`.

Use only categories clearly supported by the sources. Do not guess. If the place is a bakery that also sells sweets, `piekarnia` alone is fine unless the source explicitly calls it a `cukiernia` too.

### 3. Determine filename

See `references/schema.md` for full naming rules. Quick rules:

- Lowercase the name, replace spaces with hyphens
- Preserve Polish diacritics (`ą`, `ć`, `ś`, `ż`, `ó`, `ł`, `ń`, `ź`)
- For single-location places: `{name-slug}.yaml`
- For chains with branches: include city, e.g. `{chain}-{city}.yaml`

### 4. Geocode the address

Use Nominatim to get lat/lng:
```
https://nominatim.openstreetmap.org/search?q={address}+{city}&format=json&limit=1
```

Round lat/lng to 7 decimal places (matching existing entries).

### 5. Create the YAML file

Write the file to `dane/{filename}.yaml`. See `references/schema.md` for the full schema and examples.

### 6. Create a PR

- Create a branch: `add/{name-slug}`
- Commit with message: `Nowe miejsce: {name}`
- Push and create PR with title: `Nowe miejsce: {name}`
- PR body: brief summary (what, where, GF-only status, MENU BEZ GLUTENU membership if applicable)
