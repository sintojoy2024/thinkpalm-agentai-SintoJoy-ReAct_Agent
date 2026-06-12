interface PipelineColumnProps {
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
}

export default function PipelineColumn({
  number,
  title,
  subtitle,
  children,
  className = "",
  bodyClassName = "",
  footer,
}: PipelineColumnProps) {
  return (
    <div className={`flex flex-col min-h-0 border-[var(--border)] ${className}`}>
      <div className="shrink-0 px-4 py-3 border-b border-[var(--border)] bg-[var(--card-bg)]/80">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-maritime-600/20 text-maritime-600 dark:text-maritime-400 text-xs font-bold">
            {number}
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">{title}</h2>
            {subtitle && <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className={`flex-1 overflow-y-auto scrollbar-thin ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className="shrink-0 border-t border-[var(--border)] bg-[var(--card-bg)]">{footer}</div>
      )}
    </div>
  );
}
