"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const VERIFICATION_KEY = "axiom-research-verified-v1";

function isUnverified() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(VERIFICATION_KEY) !== "true";
  } catch {
    return true;
  }
}

export function AgeVerificationModal() {
  const [open, setOpen] = React.useState(isUnverified);
  const [ageConfirmed, setAgeConfirmed] = React.useState(false);
  const [researchConfirmed, setResearchConfirmed] = React.useState(false);

  function handleConfirm() {
    if (!ageConfirmed || !researchConfirmed) return;
    try {
      window.localStorage.setItem(VERIFICATION_KEY, "true");
    } catch {
      // Storage may be unavailable (private browsing); proceed regardless.
    }
    setOpen(false);
  }

  const canProceed = ageConfirmed && researchConfirmed;

  return (
    <Dialog open={open}>
      <DialogContent
        hideClose
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="max-w-md"
      >
        <div className="mb-6 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Restricted Access
          </p>
          <h2 className="font-display text-2xl tracking-tight text-ink">
            Before you continue
          </h2>
        </div>

        <p className="mb-6 text-[13px] leading-relaxed text-graphite">
          Axiom Research supplies reference compounds strictly for lawful
          laboratory and research use. Please confirm the following to enter
          the site.
        </p>

        <div className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              checked={ageConfirmed}
              onCheckedChange={(v) => setAgeConfirmed(v === true)}
              className="mt-0.5"
            />
            <span className="text-[13px] leading-relaxed text-ink">
              I confirm that I am 21 years of age or older.
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              checked={researchConfirmed}
              onCheckedChange={(v) => setResearchConfirmed(v === true)}
              className="mt-0.5"
            />
            <span className="text-[13px] leading-relaxed text-ink">
              I confirm these products are intended solely for lawful
              laboratory/research use, and not for human or veterinary use.
            </span>
          </label>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={!canProceed}
          className="mt-7 w-full"
          size="lg"
        >
          Enter Site
        </Button>
      </DialogContent>
    </Dialog>
  );
}
