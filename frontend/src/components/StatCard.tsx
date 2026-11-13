interface Props {
    label: string;
    value: number | string;
    accent?: string;
}

const StatCard = ({ label, value, accent = "bg-lime-300" }: Props) => (
    <article className="group relative min-h-36 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition duration-200 hover:-translate-y-1 hover:border-lime-300/40 hover:bg-[var(--surface-raised)]">
        <span className={`mb-8 block h-1 w-8 rounded-full ${accent}`} />
        <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{value}</p>
        <span className="pointer-events-none absolute -bottom-10 -right-5 h-28 w-28 rounded-full bg-lime-300/[0.035] blur-2xl transition group-hover:bg-lime-300/[0.09]" />
    </article>
);

export default StatCard;
