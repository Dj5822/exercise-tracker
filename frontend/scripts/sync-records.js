/**
 * Copies the repository's records.yaml into public/ so the static frontend
 * can fetch it. The file at the repository root remains the source of truth.
 */
const fs = require("fs");
const path = require("path");

const source = path.resolve(__dirname, "../../records.yaml");
const destination = path.resolve(__dirname, "../public/records.yaml");

if (!fs.existsSync(source)) {
    console.error(`Could not find records file at ${source}`);
    process.exit(1);
}

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.copyFileSync(source, destination);

console.log(`Copied ${path.relative(process.cwd(), source)} to public/records.yaml`);
