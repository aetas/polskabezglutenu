import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitForm } from "@/lib/api";

const CATEGORIES = [
  "restauracja",
  "kawiarnia",
  "piekarnia",
  "cukiernia",
  "sklep",
  "hotel",
  "inne",
];

interface SubmitPlaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitPlaceDialog({ open, onOpenChange }: SubmitPlaceDialogProps) {
  const [nazwa, setNazwa] = useState("");
  const [kategorie, setKategorie] = useState<string[]>([]);
  const [miejscowosc, setMiejscowosc] = useState("");
  const [adres, setAdres] = useState("");
  const [tylkoBezglutenowe, setTylkoBezglutenowe] = useState("");
  const [opis, setOpis] = useState("");
  const [www, setWww] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [komentarz, setKomentarz] = useState("");
  const [hp, setHp] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function toggleCategory(cat: string) {
    setKategorie((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  function resetForm() {
    setNazwa("");
    setKategorie([]);
    setMiejscowosc("");
    setAdres("");
    setTylkoBezglutenowe("");
    setOpis("");
    setWww("");
    setLat("");
    setLng("");
    setKomentarz("");
    setHp("");
    setResult("idle");
    setErrorMsg("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const data: Record<string, string> = {
      nazwa,
      kategorie: kategorie.join(", "),
      miejscowość: miejscowosc,
      adres,
      "tylko-bezglutenowe": tylkoBezglutenowe,
      opis,
      www,
      lat,
      lng,
      komentarz,
      _hp: hp,
    };

    const res = await submitForm("/api/submit-place", data);

    setSubmitting(false);
    if (res.ok) {
      setResult("success");
    } else {
      setResult("error");
      setErrorMsg(res.error || "Wystąpił błąd.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Zgłoś nowe miejsce</DialogTitle>
          <DialogDescription>
            Wypełnij formularz, aby zgłosić nowe miejsce przyjazne osobom na diecie
            bezglutenowej.
          </DialogDescription>
        </DialogHeader>

        {result === "success" ? (
          <div className="py-8 text-center">
            <p className="text-lg font-medium text-green-600">Dziękujemy za zgłoszenie!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Twoje zgłoszenie zostanie zweryfikowane i dodane do mapy.
            </p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>
              Zamknij
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                tabIndex={-1}
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sp-nazwa" className="text-sm font-medium">
                Nazwa <span className="text-destructive">*</span>
              </label>
              <Input
                id="sp-nazwa"
                value={nazwa}
                onChange={(e) => setNazwa(e.target.value)}
                required
                placeholder="np. A'Favela"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Kategorie <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Badge
                    key={cat}
                    variant={kategorie.includes(cat) ? "default" : "outline"}
                    className="cursor-pointer select-none"
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="sp-miejscowosc" className="text-sm font-medium">
                Miejscowość <span className="text-destructive">*</span>
              </label>
              <Input
                id="sp-miejscowosc"
                value={miejscowosc}
                onChange={(e) => setMiejscowosc(e.target.value)}
                required
                placeholder="np. Bydgoszcz"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sp-adres" className="text-sm font-medium">
                Adres <span className="text-destructive">*</span>
              </label>
              <Input
                id="sp-adres"
                value={adres}
                onChange={(e) => setAdres(e.target.value)}
                required
                placeholder="np. Plac Wolności 7, Bydgoszcz"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tylko bezglutenowe <span className="text-destructive">*</span>
              </label>
              <Select value={tylkoBezglutenowe} onValueChange={setTylkoBezglutenowe}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wybierz..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tak">Tak</SelectItem>
                  <SelectItem value="nie">Nie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="sp-opis" className="text-sm font-medium">
                Opis
              </label>
              <textarea
                id="sp-opis"
                value={opis}
                onChange={(e) => setOpis(e.target.value)}
                rows={3}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Krótki opis miejsca..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sp-www" className="text-sm font-medium">
                Strona internetowa
              </label>
              <Input
                id="sp-www"
                value={www}
                onChange={(e) => setWww(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="sp-lat" className="text-sm font-medium">
                  Szerokość geogr.
                </label>
                <Input
                  id="sp-lat"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="np. 53.1273"
                  type="number"
                  step="any"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sp-lng" className="text-sm font-medium">
                  Długość geogr.
                </label>
                <Input
                  id="sp-lng"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="np. 18.0066"
                  type="number"
                  step="any"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="sp-komentarz" className="text-sm font-medium">
                Dodatkowy komentarz
              </label>
              <textarea
                id="sp-komentarz"
                value={komentarz}
                onChange={(e) => setKomentarz(e.target.value)}
                rows={3}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Dodatkowe informacje..."
              />
            </div>

            {result === "error" && errorMsg && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}

            <Button type="submit" className="w-full" disabled={submitting || kategorie.length === 0 || !tylkoBezglutenowe}>
              {submitting ? "Wysyłanie..." : "Wyślij zgłoszenie"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}