import {
    Alert,
    Box,
    Card,
    CircularProgress,
    Container,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DailyLogList from "../components/DailyLogList";
import { RecordsContext } from "../context/RecordsContextProvider";
import { DailyLog } from "../types/records";
import { activityQuantity, humanize } from "../utils/records";

type DateGroup = "daily" | "monthly" | "yearly";

const CHART_EXERCISES = ["push_ups", "pull_ups"];

const groupKey = (date: string, group: DateGroup): string => {
    if (group === "monthly") {
        return date.slice(0, 7);
    }
    if (group === "yearly") {
        return date.slice(0, 4);
    }
    return date;
};

const buildChartData = (logs: DailyLog[], group: DateGroup) => {
    const points = new Map<string, Record<string, string | number>>();

    logs.forEach((log) => {
        const key = groupKey(log.date, group);
        const point = points.get(key) ?? {
            date: key,
            ...Object.fromEntries(CHART_EXERCISES.map((exercise) => [exercise, 0])),
        };

        log.activities.forEach((activity) => {
            if (CHART_EXERCISES.includes(activity.type)) {
                point[activity.type] = (point[activity.type] as number) + activityQuantity(activity);
            }
        });

        points.set(key, point);
    });

    return Array.from(points.values()).sort((a, b) =>
        String(a.date).localeCompare(String(b.date))
    );
};

const Datapage = () => {
    const { records, isLoading, error } = useContext(RecordsContext);
    const [dateGroup, setDateGroup] = useState<DateGroup>("monthly");

    const chartData = useMemo(
        () => buildChartData(records?.daily_logs ?? [], dateGroup),
        [records, dateGroup]
    );

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 16 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !records) {
        return (
            <Container maxWidth="lg" sx={{ mt: 14 }}>
                <Alert severity="error">{error ?? "Could not load records.yaml"}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 14, mb: 4 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                <Card sx={{ flexGrow: 1, p: 2, height: 520 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                        <ToggleButtonGroup
                            exclusive
                            size="small"
                            value={dateGroup}
                            onChange={(_, value: DateGroup | null) => value && setDateGroup(value)}
                            aria-label="Chart date grouping"
                        >
                            <ToggleButton value="daily">Daily</ToggleButton>
                            <ToggleButton value="monthly">Monthly</ToggleButton>
                            <ToggleButton value="yearly">Yearly</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        >
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            {CHART_EXERCISES.map((exercise, index) => (
                                <Area
                                    key={exercise}
                                    connectNulls
                                    type="monotone"
                                    dataKey={exercise}
                                    name={humanize(exercise)}
                                    stroke={index === 0 ? "#8884d8" : "#82ca9d"}
                                    fill={index === 0 ? "#8884d8" : "#82ca9d"}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                <Card sx={{ p: 3, minWidth: 240 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        All-time totals
                    </Typography>
                    {Object.entries(records.total_records).map(([name, value]) => (
                        <Box
                            key={name}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 2,
                                py: 0.75,
                            }}
                        >
                            <Typography color="text.secondary">{humanize(name)}</Typography>
                            <Typography fontWeight={600}>{value}</Typography>
                        </Box>
                    ))}
                </Card>
            </Box>

            <Card sx={{ mt: 2, p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 2 }}>
                    <Typography variant="h6">Daily logs</Typography>
                    <Typography color="text.secondary">
                        ({records.daily_logs.length} entries)
                    </Typography>
                </Box>
                <Box sx={{ maxHeight: "60vh", overflowY: "auto", pr: 1 }}>
                    <DailyLogList logs={records.daily_logs} />
                </Box>
            </Card>
        </Container>
    );
};

export default Datapage;
