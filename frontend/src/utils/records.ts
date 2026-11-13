import { Activity } from "../types/records";

/** Turns an underscore key such as `pull_ups` into `Pull ups`. */
export const humanize = (key: string): string =>
    key.replace(/_/g, " ").replace(/^./, (character) => character.toUpperCase());

/** Formats an ISO date (`YYYY-MM-DD`) without applying a timezone shift. */
export const formatDate = (date: string): string => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/** Returns the number of repetitions recorded for an activity, if any. */
export const activityQuantity = (activity: Activity): number => {
    if (typeof activity.total === "number") {
        return activity.total;
    }
    if (typeof activity.count === "number") {
        return activity.count;
    }
    return 0;
};

/** Builds a human-readable summary from the optional activity fields. */
export const describeActivity = (activity: Activity): string => {
    const parts: string[] = [];

    if (typeof activity.total === "number") {
        parts.push(`${activity.total}`);
    } else if (typeof activity.count === "number") {
        parts.push(`${activity.count}`);
    }

    if (activity.grade) {
        parts.push(activity.grade);
    }
    if (activity.duration) {
        parts.push(activity.duration);
    }
    if (activity.weight !== undefined) {
        parts.push(`${activity.weight}`);
    }
    if (activity.details) {
        parts.push(activity.details);
    }
    if (activity.breakdown) {
        parts.push(`(${activity.breakdown})`);
    }

    return parts.join(" · ");
};
