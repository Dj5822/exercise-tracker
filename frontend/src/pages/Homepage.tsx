import { useContext } from "react";
import { Link } from "react-router-dom";
import DailyLogList from "../components/DailyLogList";
import StatCard from "../components/StatCard";
import { RecordsContext } from "../context/RecordsContextProvider";
import { humanize } from "../utils/records";

const SectionHeading = ({ eyebrow, title, detail }: { eyebrow: string; title: string; detail?: string }) => (
    <div className="mb-5 flex items-end justify-between gap-4">
        <div><p className="mb-1 text-[10px] font-bold uppercase tracking-[.2em] text-lime-300">{eyebrow}</p><h2 className="text-xl font-semibold tracking-tight">{title}</h2></div>
        {detail && <p className="text-xs text-[var(--text-muted)]">{detail}</p>}
    </div>
);

const Homepage = () => {
    const { records, isLoading, error } = useContext(RecordsContext);

    if (isLoading) return <div className="grid min-h-[50vh] place-items-center"><div className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-lime-300" /></div>;
    if (error || !records) return <div role="alert" className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-200">{error ?? "Could not load records.yaml"}</div>;

    const latestDate = records.daily_logs[0]?.date;
    const activityCount = records.daily_logs.reduce((sum, log) => sum + log.activities.length, 0);

    return (
        <div className="space-y-12">
            <section className="home-hero relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(ellipse_at_82%_30%,rgba(190,242,100,.12),transparent_38%),linear-gradient(120deg,var(--surface),var(--app-bg))] px-6 py-8 sm:px-10 sm:py-10">
                <div className="relative z-[1] max-w-2xl">
                    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/[.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-lime-300"><span className="h-1.5 w-1.5 rounded-full bg-lime-300"/>Overview</p>
                    <h1 className="text-4xl font-semibold leading-[1.1] tracking-[-.04em] sm:text-5xl">Exercise records</h1>
                    <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--text-secondary)] sm:text-base">A summary of recorded training activity.</p>
                    <Link to="/data" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-lime-200">View data <span aria-hidden="true">↗</span></Link>
                </div>
                <div className="absolute -right-12 -top-14 hidden h-80 w-80 rounded-full border border-lime-200/[.08] sm:block" />
                <div className="absolute -right-2 top-2 hidden h-64 w-64 rounded-full border border-lime-200/[.08] sm:block" />
                <div className="absolute right-16 top-16 hidden h-36 w-36 rounded-full bg-lime-300/[.06] blur-2xl sm:block" />
            </section>

            <section>
                <SectionHeading eyebrow="Totals" title="All-time totals" detail={`${activityCount} recorded activities`} />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 xl:gap-4">
                    {Object.entries(records.total_records).map(([name, value], index) => <StatCard key={name} label={humanize(name)} value={value} accent={index % 3 === 1 ? "bg-sky-300" : index % 3 === 2 ? "bg-orange-300" : "bg-lime-300"} />)}
                </div>
            </section>

            <section>
                <SectionHeading eyebrow="Records" title="Personal bests" detail="Best single efforts" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 xl:gap-4">
                    {Object.entries(records.single_records).map(([name, value], index) => <StatCard key={name} label={humanize(name)} value={value} accent={index % 3 === 1 ? "bg-violet-300" : index % 3 === 2 ? "bg-orange-300" : "bg-lime-300"} />)}
                </div>
            </section>

            <section>
                <SectionHeading eyebrow="Activity log" title="Recent entries" detail={latestDate ? `Latest entry · ${latestDate}` : "Most recent entries"} />
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7"><DailyLogList logs={records.daily_logs.slice(0, 5)} /></div>
            </section>
        </div>
    );
};

export default Homepage;
