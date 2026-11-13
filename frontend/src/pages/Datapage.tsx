import { useContext, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DailyLogList from "../components/DailyLogList";
import { RecordsContext } from "../context/RecordsContextProvider";
import { DailyLog } from "../types/records";
import { activityQuantity, humanize } from "../utils/records";

type DateGroup = "daily" | "monthly" | "yearly";
const CHART_EXERCISES = ["push_ups", "pull_ups"];
const groupLabel: Record<DateGroup, string> = { daily: "day", monthly: "month", yearly: "year" };
const groupKey = (date: string, group: DateGroup): string => group === "monthly" ? date.slice(0, 7) : group === "yearly" ? date.slice(0, 4) : date;

const buildChartData = (logs: DailyLog[], group: DateGroup) => {
    const points = new Map<string, Record<string, string | number>>();
    logs.forEach((log) => {
        const key = groupKey(log.date, group);
        const point = points.get(key) ?? { date: key, ...Object.fromEntries(CHART_EXERCISES.map((exercise) => [exercise, 0])) };
        log.activities.forEach((activity) => {
            if (CHART_EXERCISES.includes(activity.type)) point[activity.type] = (point[activity.type] as number) + activityQuantity(activity);
        });
        points.set(key, point);
    });
    return Array.from(points.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
};

const Datapage = () => {
    const { records, isLoading, error } = useContext(RecordsContext);
    const [dateGroup, setDateGroup] = useState<DateGroup>("monthly");
    const chartData = useMemo(() => buildChartData(records?.daily_logs ?? [], dateGroup), [records, dateGroup]);

    if (isLoading) return <div className="grid min-h-[50vh] place-items-center"><div className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-lime-300" /></div>;
    if (error || !records) return <div role="alert" className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-200">{error ?? "Could not load records.yaml"}</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-lime-300">Data</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Training activity</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">Exercise totals grouped by date, with the complete activity log below.</p></div>
                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1" role="group" aria-label="Chart date grouping">
                    {(["daily", "monthly", "yearly"] as DateGroup[]).map((group) => <button key={group} onClick={() => setDateGroup(group)} aria-pressed={dateGroup === group} className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${dateGroup === group ? "bg-lime-300 text-slate-950" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>{group}</button>)}
                </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                <section className="min-w-0 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div><h2 className="font-semibold">Reps logged</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Push-ups and pull-ups by {groupLabel[dateGroup]}</p></div>
                        <div className="flex gap-4 text-xs text-[var(--text-secondary)]"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--chart-push)" }}/>Push-ups</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--chart-pull)" }}/>Pull-ups</span></div>
                    </div>
                    <div className="h-[320px] w-full sm:h-[390px]">
                        {chartData.length === 0 ? <div className="grid h-full place-items-center text-sm text-[var(--text-muted)]">No chart data available yet.</div> : <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                                <defs><linearGradient id="pushFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-push)" stopOpacity={0.25}/><stop offset="95%" stopColor="var(--chart-push)" stopOpacity={0}/></linearGradient><linearGradient id="pullFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-pull)" stopOpacity={0.2}/><stop offset="95%" stopColor="var(--chart-pull)" stopOpacity={0}/></linearGradient></defs>
                                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 6" vertical={false}/>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 11 }} dy={10}/>
                                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 11 }}/>
                                <Tooltip contentStyle={{ background: "var(--tooltip-bg)", border: "1px solid var(--line)", borderRadius: 12, color: "var(--text-primary)", fontSize: 12 }} labelStyle={{ color: "var(--text-secondary)", marginBottom: 6 }}/>
                                <Legend content={() => null}/>
                                <Area connectNulls type="monotone" dataKey="push_ups" name={humanize("push_ups")} stroke="var(--chart-push)" strokeWidth={2.5} fill="url(#pushFill)" activeDot={{ r: 5, strokeWidth: 0 }}/>
                                <Area connectNulls type="monotone" dataKey="pull_ups" name={humanize("pull_ups")} stroke="var(--chart-pull)" strokeWidth={2.5} fill="url(#pullFill)" activeDot={{ r: 5, strokeWidth: 0 }}/>
                            </AreaChart>
                        </ResponsiveContainer>}
                    </div>
                </section>

                <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[.18em] text-lime-300">Totals</p><h2 className="mb-5 text-lg font-semibold">All-time totals</h2>
                    <div className="space-y-1">
                        {Object.entries(records.total_records).map(([name, value], index) => <div key={name} className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-3 last:border-0"><span className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]"><i className={`h-2 w-2 rounded-full ${index % 3 === 1 ? "bg-sky-300" : index % 3 === 2 ? "bg-orange-300" : "bg-lime-300"}`}/>{humanize(name)}</span><span className="text-sm font-semibold tabular-nums">{value}</span></div>)}
                    </div>
                    <div className="mt-5 rounded-xl bg-lime-300/[.07] p-4"><p className="text-xs font-semibold text-lime-300">Log entries</p><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{records.daily_logs.length} dates with recorded activity.</p></div>
                </section>
            </div>

            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
                <div className="mb-2 flex items-end justify-between gap-4"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[.2em] text-lime-300">History</p><h2 className="text-xl font-semibold">Training log</h2></div><span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--text-muted)]">{records.daily_logs.length} dates</span></div>
                <div className="mt-6 max-h-[65vh] overflow-y-auto pr-1"><DailyLogList logs={records.daily_logs}/></div>
            </section>
        </div>
    );
};

export default Datapage;
