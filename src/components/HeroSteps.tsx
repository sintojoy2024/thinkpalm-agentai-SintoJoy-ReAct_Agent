"use client";

import { FileText, Bot, Eye, ChevronRight } from "lucide-react";
import type { PipelineStage } from "@/types";

const STEPS = [
  {
    number: 1,
    icon: FileText,
    title: "Paste PRD",
    description: "Drop in a maritime requirements doc or pick a sample template",
  },
  {
    number: 2,
    icon: Bot,
    title: "Agents generate",
    description: "Three AI agents analyze, architect, and write React components",
  },
  {
    number: 3,
    icon: Eye,
    title: "Preview & export",
    description: "Live dashboard preview, component tree, StackBlitz & GitHub export",
  },
];

interface HeroStepsProps {
  stage: PipelineStage;
}

function stepStatus(stepNumber: number, stage: PipelineStage): "idle" | "active" | "done" {
  if (stage === "complete") return "done";
  if (stage === "idle" || stage === "error") {
    return stepNumber === 1 ? "active" : "idle";
  }
  if (stage === "analyzing") return stepNumber === 1 ? "active" : stepNumber < 1 ? "done" : "idle";
  if (stage === "architecting") return stepNumber <= 1 ? "done" : stepNumber === 2 ? "active" : "idle";
  if (stage === "generating") return stepNumber <= 2 ? "done" : stepNumber === 3 ? "active" : "idle";
  return "idle";
}

export default function HeroSteps({ stage }: HeroStepsProps) {
  return (
    <div className="panel p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">How BridgeView AI works</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Transform maritime product specs into production-ready React UI in three steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3">
        {STEPS.map((step, index) => {
          const status = stepStatus(step.number, stage);
          const Icon = step.icon;

          return (
            <div key={step.number} className="relative flex items-start gap-3">
              {index < STEPS.length - 1 && (
                <ChevronRight className="hidden md:block absolute -right-2 top-5 w-4 h-4 text-[var(--border)] z-10" />
              )}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  status === "done"
                    ? "bg-accent-success/10 text-accent-success"
                    : status === "active"
                      ? "bg-maritime-600 text-white shadow-md shadow-maritime-200 dark:shadow-maritime-900/50"
                      : "bg-[var(--card-bg-muted)] text-[var(--text-muted)]"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-xs font-medium text-maritime-600 uppercase tracking-wide">
                  Step {step.number}
                </p>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{step.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
