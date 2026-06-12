"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import { ONBOARDING_STEPS, ONBOARDING_STORAGE_KEY } from "@/data/onboarding-steps";

interface OnboardingWalkthroughProps {
  open: boolean;
  onClose: () => void;
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getSpotlightRect(selector: string): SpotlightRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const pad = 8;
  return {
    top: rect.top - pad,
    left: rect.left - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };
}

function getDialogPosition(
  spot: SpotlightRect,
  placement: string,
  dialogW: number,
  dialogH: number
): { top: number; left: number } {
  const margin = 16;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top = spot.top + spot.height / 2 - dialogH / 2;
  let left = spot.left + spot.width / 2 - dialogW / 2;

  if (placement === "right") {
    left = spot.left + spot.width + margin;
    top = spot.top + spot.height / 2 - dialogH / 2;
  } else if (placement === "left") {
    left = spot.left - dialogW - margin;
    top = spot.top + spot.height / 2 - dialogH / 2;
  } else if (placement === "bottom") {
    top = spot.top + spot.height + margin;
    left = spot.left + spot.width / 2 - dialogW / 2;
  } else if (placement === "top") {
    top = spot.top - dialogH - margin;
    left = spot.left + spot.width / 2 - dialogW / 2;
  }

  left = Math.max(margin, Math.min(left, vw - dialogW - margin));
  top = Math.max(margin, Math.min(top, vh - dialogH - margin));

  return { top, left };
}

export default function OnboardingWalkthrough({ open, onClose }: OnboardingWalkthroughProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [dialogPos, setDialogPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  const step = ONBOARDING_STEPS[stepIndex];
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;
  const isFirst = stepIndex === 0;

  const updatePositions = useCallback(() => {
    if (!step) return;
    const spot = getSpotlightRect(step.target);
    setSpotlight(spot);
    if (spot) {
      setDialogPos(getDialogPosition(spot, step.placement, 340, 240));
      document.querySelector(step.target)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [step]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setStepIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(updatePositions, 100);
    window.addEventListener("resize", updatePositions);
    window.addEventListener("scroll", updatePositions, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("scroll", updatePositions, true);
    };
  }, [open, stepIndex, updatePositions]);

  const finish = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    onClose();
  };

  if (!mounted || !open || !step) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="absolute inset-0" onClick={finish} aria-hidden />

      {spotlight && (
        <div
          className="absolute rounded-xl pointer-events-none transition-all duration-300 ease-out border-2 border-[var(--brand)]"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.78)",
          }}
        />
      )}

      <div
        className="absolute w-[min(340px,calc(100vw-32px))] rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl p-5 transition-all duration-300 z-10"
        style={{ top: dialogPos.top, left: dialogPos.left }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--brand-muted)]">
              <Sparkles className="w-4 h-4 text-[var(--brand)]" />
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
            </span>
          </div>
          <button
            type="button"
            onClick={finish}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Close tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2 id="tour-title" className="text-base font-display font-bold text-[var(--text-primary)] mb-2">
          {step.title}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{step.description}</p>

        <div className="flex gap-1.5 mb-4">
          {ONBOARDING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === stepIndex ? "w-6 bg-[var(--brand)]" : i < stepIndex ? "w-1.5 bg-[var(--brand)]/50" : "w-1.5 bg-[var(--border)]"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={finish} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1">
            Skip tour
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={() => setStepIndex((i) => i - 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--card-bg-muted)]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? finish() : setStepIndex((i) => i + 1))}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold rounded-lg btn-brand"
            >
              {isLast ? "Get started" : "Next"}
              {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function restartOnboarding() {
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
}
