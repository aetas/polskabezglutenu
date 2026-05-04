const FIELD_LABELS: Record<string, string> = {
  nazwa: "Nazwa",
  kategorie: "Kategorie",
  miejscowość: "Miejscowość",
  adres: "Adres",
  opis: "Opis",
  www: "Strona internetowa",
  "tylko-bezglutenowe": "Tylko bezglutenowe",
  lat: "Szerokość geograficzna",
  lng: "Długość geograficzna",
  komentarz: "Komentarz",
  "typ-problemu": "Typ problemu",
  "opis-problemu": "Opis problemu",
  "poprawne-dane": "Poprawne dane",
  źródło: "Źródło informacji",
  "dodatkowe-informacje": "Dodatkowe informacje",
};

type SubmissionType = "new-place" | "data-problem";

const TITLES: Record<SubmissionType, string> = {
  "new-place": "[Nowe miejsce]",
  "data-problem": "[Problem z danymi]",
};

const COLORS: Record<SubmissionType, number> = {
  "new-place": 0x00d26a,
  "data-problem": 0xff8c00,
};

export async function sendToDiscord(
  webhookUrl: string,
  fields: Record<string, string>,
  type: SubmissionType,
): Promise<void> {
  const embedFields = Object.entries(fields)
    .filter(([key]) => key in FIELD_LABELS)
    .filter(([, value]) => value && value.trim() !== "")
    .slice(0, 25)
    .map(([key, value]) => ({
      name: FIELD_LABELS[key].slice(0, 256),
      value: value.length > 1024 ? value.slice(0, 1021) + "..." : value,
      inline: value.length < 50,
    }));

  const totalLength = embedFields.reduce(
    (sum, f) => sum + f.name.length + f.value.length,
    0,
  );
  if (totalLength > 6000) {
    while (embedFields.length > 1) {
      embedFields.pop();
      const newTotal = embedFields.reduce(
        (sum, f) => sum + f.name.length + f.value.length,
        0,
      );
      if (newTotal <= 6000) break;
    }
  }

  const payload = {
    embeds: [
      {
        title: TITLES[type],
        color: COLORS[type],
        fields: embedFields,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Discord webhook failed: ${res.status} ${await res.text()}`);
  }
}