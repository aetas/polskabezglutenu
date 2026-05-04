import { useState } from "react";
import { AlertTriangle, MapPin, Mail } from "lucide-react";
import { SubmitPlaceDialog } from "@/components/SubmitPlaceDialog";
import { ReportProblemDialog } from "@/components/ReportProblemDialog";

interface FooterLinksProps {
  variant?: "footer" | "nav";
}

export function FooterLinks({ variant = "footer" }: FooterLinksProps) {
  const [submitPlaceOpen, setSubmitPlaceOpen] = useState(false);
  const [reportProblemOpen, setReportProblemOpen] = useState(false);

  const isNav = variant === "nav";

  return (
    <>
      <div className={isNav ? "flex items-center gap-4" : "flex flex-col md:flex-row gap-4 justify-center"}>
        <button
          onClick={() => setReportProblemOpen(true)}
          className="hover:text-primary hover:underline inline-flex items-center gap-1"
        >
          {isNav && <AlertTriangle size={14} />}
          Zgłoś problem z danymi
        </button>
        <button
          onClick={() => setSubmitPlaceOpen(true)}
          className="hover:text-primary hover:underline inline-flex items-center gap-1"
        >
          {isNav && <MapPin size={14} />}
          Zgłoś nowe miejsce
        </button>
        <a href="mailto:kontakt@polskabezglutenu.pl" className="hover:text-primary hover:underline inline-flex items-center gap-1">
          {isNav && <Mail size={14} />}
          Kontakt
        </a>
      </div>

      <SubmitPlaceDialog open={submitPlaceOpen} onOpenChange={setSubmitPlaceOpen} />
      <ReportProblemDialog open={reportProblemOpen} onOpenChange={setReportProblemOpen} />
    </>
  );
}