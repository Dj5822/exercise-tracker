export interface Activity {
    type: string;
    count?: number;
    total?: number;
    breakdown?: string;
    duration?: string;
    grade?: string;
    details?: string;
    weight?: number | string;
    [key: string]: unknown;
}

export interface DailyLog {
    date: string;
    activities: Activity[];
}

export interface Records {
    total_records: Record<string, number | string>;
    single_records: Record<string, number | string>;
    daily_logs: DailyLog[];
}
