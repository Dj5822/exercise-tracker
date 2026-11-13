import { Card, Typography } from "@mui/material";

interface Props {
    label: string;
    value: number | string;
}

const StatCard = ({ label, value }: Props) => (
    <Card sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="overline" color="text.secondary" noWrap>
            {label}
        </Typography>
        <Typography variant="h4" sx={{ mt: "auto" }}>
            {value}
        </Typography>
    </Card>
);

export default StatCard;
