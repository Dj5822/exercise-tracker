import { Box, Chip, Stack, Typography } from "@mui/material";
import { DailyLog } from "../types/records";
import { describeActivity, formatDate, humanize } from "../utils/records";

interface Props {
    logs: DailyLog[];
}

const DailyLogList = ({ logs }: Props) => {
    if (logs.length === 0) {
        return <Typography color="text.secondary">No activity recorded.</Typography>;
    }

    return (
        <Box>
            {logs.map((log) => (
                <Box
                    key={log.date}
                    sx={{
                        py: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                        "&:last-of-type": { borderBottom: 0, pb: 0 },
                        "&:first-of-type": { pt: 0 },
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={600}>
                        {formatDate(log.date)}
                    </Typography>
                    <Stack direction="row" sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
                        {log.activities.map((activity, index) => {
                            const description = describeActivity(activity);
                            return (
                                <Chip
                                    key={`${activity.type}-${index}`}
                                    size="small"
                                    variant="outlined"
                                    label={
                                        description
                                            ? `${humanize(activity.type)} — ${description}`
                                            : humanize(activity.type)
                                    }
                                />
                            );
                        })}
                    </Stack>
                </Box>
            ))}
        </Box>
    );
};

export default DailyLogList;
