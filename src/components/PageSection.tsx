interface PageSectionProps {
  id?: string;
  sectionRef?: React.RefObject<HTMLElement | null>;
  label: string;
  description?: string;
  children: React.ReactNode;
}

export default function PageSection({ id, sectionRef, label, description, children }: PageSectionProps) {
  return (
    <section id={id} ref={sectionRef} className="space-y-4 scroll-mt-24">
      <div className="border-b border-[var(--border-subtle)] pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-maritime-600 dark:text-maritime-400">
          {label}
        </h2>
        {description && (
          <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
