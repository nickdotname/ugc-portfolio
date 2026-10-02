type CreditsRow = {
  label: string;
  values: string[];
};

type CreditsListProps = {
  rows: CreditsRow[];
  className?: string;
};

export default function CreditsList({ rows, className = "" }: CreditsListProps) {
  return (
    <dl className={`mono text-[11px] sm:text-[12px] leading-relaxed ${className}`}>
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[auto_1fr] gap-x-6 py-2 border-t border-ink/15">
          <dt className="text-muted">{row.label}</dt>
          <dd>
            {row.values.map((value, i) => (
              <div key={i}>{value}</div>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
