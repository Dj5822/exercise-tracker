import yaml from "js-yaml";
import React, { ReactNode, useEffect, useState } from "react";
import { Records } from "../types/records";

interface Props {
    children?: ReactNode;
}

interface RecordsContextValue {
    records: Records | null;
    isLoading: boolean;
    error: string | null;
}

export const RecordsContext = React.createContext<RecordsContextValue>({
    records: null,
    isLoading: true,
    error: null,
});

export const RecordsProvider = ({ children }: Props) => {
    const [records, setRecords] = useState<Records | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchRecords() {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}records.yaml`);
                if (!response.ok) {
                    throw new Error(`Failed to load records.yaml (${response.status})`);
                }

                const contents = await response.text();
                // JSON_SCHEMA keeps dates as strings instead of parsing them
                // into Date objects, which keeps grouping and formatting simple.
                const parsed = yaml.load(contents, { schema: yaml.JSON_SCHEMA }) as Records;

                if (!parsed) {
                    throw new Error("records.yaml is empty");
                }

                if (!cancelled) {
                    setRecords(parsed);
                    setError(null);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Could not load records.yaml");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchRecords();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <RecordsContext.Provider value={{ records, isLoading, error }}>
            {children}
        </RecordsContext.Provider>
    );
};
