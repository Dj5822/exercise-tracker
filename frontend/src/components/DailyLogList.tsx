import { DailyLog } from "../types/records";
import { describeActivity, formatDate, humanize } from "../utils/records";

interface Props {
    logs: DailyLog[];
}

const DailyLogList = ({ logs }: Props) => {
    if (logs.length === 0) {
        return <p className="py-8 text-center text-sm text-[var(--text-muted)]">No activity recorded yet.</p>;
    }

    return (
        <div>
            {logs.map((log) => (
                <article key={log.date} className="flex gap-4 border-b border-[var(--line)] py-5 first:pt-0 last:border-0 last:pb-0">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.45)]" />
                    <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{formatDate(log.date)}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {log.activities.map((activity, index) => {
                            const description = describeActivity(activity);
                            return (
                                <span key={`${activity.type}-${index}`} className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-1.5 text-xs text-[var(--text-secondary)]">
                                    <span className="font-medium text-[var(--text-primary)]">{humanize(activity.type)}</span>
                                    {description && <span className="text-[var(--text-muted)]"> <span aria-hidden="true">·</span> {description}</span>}
                                </span>
                            );
                        })}
                    </div>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default DailyLogList;
