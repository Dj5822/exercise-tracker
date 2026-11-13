import { Alert, Box, Card, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import DailyLogList from "../components/DailyLogList";
import StatCard from "../components/StatCard";
import { RecordsContext } from "../context/RecordsContextProvider";
import { humanize } from "../utils/records";

const Homepage = () => {
    const { records, isLoading, error } = useContext(RecordsContext);

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
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4">Exercise records</Typography>
                <Typography color="text.secondary">
                    A read-only overview of records.yaml.
                </Typography>
            </Box>

            <Typography variant="h5" sx={{ mb: 2 }}>
                Totals
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {Object.entries(records.total_records).map(([name, value]) => (
                    <Grid item xs={6} sm={4} md={3} key={name}>
                        <StatCard label={humanize(name)} value={value} />
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" sx={{ mb: 2 }}>
                Personal bests
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {Object.entries(records.single_records).map(([name, value]) => (
                    <Grid item xs={6} sm={4} md={3} key={name}>
                        <StatCard label={humanize(name)} value={value} />
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" sx={{ mb: 2 }}>
                Recent activity
            </Typography>
            <Card sx={{ p: 3 }}>
                <DailyLogList logs={records.daily_logs.slice(0, 5)} />
            </Card>
        </Container>
    );
};

export default Homepage;
