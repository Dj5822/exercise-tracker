/**
 * Builds the frontend's records file from the repository's daily log. Totals
 * and best single efforts are derived here so they don't need to be maintained
 * separately in the source YAML.
 */
const fs = require("fs");
const path = require("path");
const { dump, JSON_SCHEMA, load } = require("js-yaml");

const source = path.resolve(__dirname, "../../records.yaml");
const destination = path.resolve(__dirname, "../public/records.yaml");

if (!fs.existsSync(source)) {
    console.error(`Could not find records file at ${source}`);
    process.exit(1);
}

const sourceRecords = load(fs.readFileSync(source, "utf8"), { schema: JSON_SCHEMA });

if (!sourceRecords || !Array.isArray(sourceRecords.daily_logs)) {
    console.error("The records file must contain a daily_logs list");
    process.exit(1);
}

const totals = new Map();
const bests = new Map();
const highestGrades = new Map();
const bestDays = new Map();
const totalsByDate = new Map();
const personalBestTypes = new Set(["push_ups", "pull_ups", "bouldering"]);

function quantity(activity) {
    if (typeof activity.total === "number") return activity.total;
    if (typeof activity.count === "number") return activity.count;
    return null;
}

function bestSet(activity) {
    if (typeof activity.breakdown === "string") {
        const setCounts = activity.breakdown.split("+").map((set) => {
            const reps = Number(set.trim().split("*")[0].trim());
            return Number.isFinite(reps) ? reps : null;
        }).filter((reps) => reps !== null);

        if (setCounts.length > 0) return Math.max(...setCounts);
    }

    // A count or total can describe a whole session, so it is not enough to
    // identify the best single set without a set-by-set breakdown.
    return null;
}

function gradeScore(grade) {
    const match = /^V(\d+)([+-])?$/i.exec(grade);
    if (!match) return null;
    const modifier = match[2] === "+" ? 0.25 : match[2] === "-" ? -0.25 : 0;
    return Number(match[1]) + modifier;
}

for (const log of sourceRecords.daily_logs) {
    const dayTotals = totalsByDate.get(log.date) ?? new Map();
    totalsByDate.set(log.date, dayTotals);

    for (const activity of log.activities ?? []) {
        const value = quantity(activity);
        if (value !== null) {
            totals.set(activity.type, (totals.get(activity.type) ?? 0) + value);

            if (personalBestTypes.has(activity.type)) {
                dayTotals.set(activity.type, (dayTotals.get(activity.type) ?? 0) + value);
            }
        }

        if (personalBestTypes.has(activity.type)) {
            const best = bestSet(activity);
            if (best !== null) {
                bests.set(activity.type, Math.max(bests.get(activity.type) ?? -Infinity, best));
            }
        }

        if (personalBestTypes.has(activity.type) && typeof activity.grade === "string") {
            const previous = highestGrades.get(activity.type);
            const currentScore = gradeScore(activity.grade);
            const previousScore = previous ? gradeScore(previous) : null;
            if (!previous || (currentScore !== null && (previousScore === null || currentScore > previousScore))) {
                highestGrades.set(activity.type, activity.grade);
            }
        }
    }
}

for (const dayTotals of totalsByDate.values()) {
    for (const [type, value] of dayTotals) {
        bestDays.set(type, Math.max(bestDays.get(type) ?? -Infinity, value));
    }
}

const sortEntries = (map) => Object.fromEntries([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
const records = {
    total_records: sortEntries(totals),
    daily_records: sortEntries(bestDays),
    single_records: {
        ...sortEntries(bests),
        ...sortEntries(highestGrades),
    },
    daily_logs: sourceRecords.daily_logs,
};

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, dump(records, { lineWidth: -1 }));

console.log(`Generated ${path.relative(process.cwd(), destination)} from ${path.relative(process.cwd(), source)}`);
