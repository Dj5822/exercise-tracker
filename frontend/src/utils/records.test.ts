import { activityQuantity, describeActivity, formatDate, humanize } from "./records";

test("humanizes underscore keys", () => {
    expect(humanize("handstand_push_ups")).toBe("Handstand push ups");
});

test("reads quantities from total or count", () => {
    expect(activityQuantity({ type: "push_ups", total: 100 })).toBe(100);
    expect(activityQuantity({ type: "pull_ups", count: 8 })).toBe(8);
    expect(activityQuantity({ type: "dead_hang" })).toBe(0);
});

test("describes activity details", () => {
    expect(
        describeActivity({ type: "push_ups", total: 100, breakdown: "20 * 5" })
    ).toBe("100 · (20 * 5)");
    expect(
        describeActivity({ type: "bouldering", grade: "V5", count: 1 })
    ).toBe("1 · V5");
});

test("formats ISO dates without a timezone shift", () => {
    expect(formatDate("2026-08-23")).toBe(
        new Date(2026, 7, 23).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    );
});
