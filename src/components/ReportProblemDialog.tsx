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
import { submitForm } from "@/lib/api";

const PROBLEM_TYPES = [
  "Niepoprawna nazwa",
  "Niepoprawny opis",
  "Niepoprawne kategorie",
  "Niepoprawna miejscowość",
  "Niepoprawny adres",
  "Niepoprawna strona internetowa",
  "Niepoprawna informacja o bezglutenowości",
  "Niepoprawne współrzędne geograficzne",
  "Miejsce już nie istnieje",
  "Miejsce nie oferuje już opcji bezglutenowych",
  "Inne",
];

interface ReportProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportProblemDialog({ open, onOpenChange }: ReportProblemDialogProps) {
  const [nazwa, setNazwa] = useState("");
  const [typProblemu, setTypProblemu] = useState<string[]>([]);
  const [opisProblemu, setOpisProblemu] = useState("");
  const [poprawneDane, setPoprawneDane] = useState("");
  const [zrodlo, setZrodlo] = useState("");
  const [dodatkoweInfo, setDodatkoweInfo] = useState("");
  const [hp, setHp] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function toggleProblemType(type: string) {
    setTypProblemu((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  function resetForm() {
    setNazwa("");
    setTypProblemu([]);
    setOpisProblemu("");
    setPoprawneDane("");
    setZrodlo("");
    setDodatkoweInfo("");
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
      "typ-problemu": typProblemu.join(", "),
      "opis-problemu": opisProblemu,
      "poprawne-dane": poprawneDane,
      źródło: zrodlo,
      "dodatkowe-informacje": dodatkoweInfo,
      _hp: hp,
    };

    const res = await submitForm("/api/report-problem", data);

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
          <DialogTitle>Zgłoś problem z danymi</DialogTitle>
          <DialogDescription>
            Zgłoś niepoprawne dane miejsca bezglutenowego na mapie.
          </DialogDescription>
        </DialogHeader>

        {result === "success" ? (
          <div className="py-8 text-center">
            <p className="text-lg font-medium text-green-600">Dziękujemy za zgłoszenie!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Twoje zgłoszenie zostanie zweryfikowane i dane zostaną zaktualizowane.
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
              <label htmlFor="rp-nazwa" className="text-sm font-medium">
                Nazwa miejsca <span className="text-destructive">*</span>
              </label>
              <Input
                id="rp-nazwa"
                value={nazwa}
                onChange={(e) => setNazwa(e.target.value)}
                required
                placeholder="np. A'Favela"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Typ problemu <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PROBLEM_TYPES.map((type) => (
                  <Badge
                    key={type}
                    variant={typProblemu.includes(type) ? "default" : "outline"}
                    className="cursor-pointer select-none"
                    onClick={() => toggleProblemType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="rp-opis" className="text-sm font-medium">
                Opis problemu <span className="text-destructive">*</span>
              </label>
              <textarea
                id="rp-opis"
                value={opisProblemu}
                onChange={(e) => setOpisProblemu(e.target.value)}
                required
                rows={3}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Opisz dokładnie, na czym polega problem..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rp-poprawne" className="text-sm font-medium">
                Poprawne dane
              </label>
              <textarea
                id="rp-poprawne"
                value={poprawneDane}
                onChange={(e) => setPoprawneDane(e.target.value)}
                rows={2}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Podaj poprawne dane, jeśli je znasz..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rp-zrodlo" className="text-sm font-medium">
                Źródło informacji
              </label>
              <Input
                id="rp-zrodlo"
                value={zrodlo}
                onChange={(e) => setZrodlo(e.target.value)}
                placeholder="np. byłem/am tam osobiście"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rp-dodatkowe" className="text-sm font-medium">
                Dodatkowe informacje
              </label>
              <textarea
                id="rp-dodatkowe"
                value={dodatkoweInfo}
                onChange={(e) => setDodatkoweInfo(e.target.value)}
                rows={2}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Dodatkowe uwagi..."
              />
            </div>

            {result === "error" && errorMsg && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}

            <Button type="submit" className="w-full" disabled={submitting || typProblemu.length === 0}>
              {submitting ? "Wysyłanie..." : "Wyślij zgłoszenie"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}