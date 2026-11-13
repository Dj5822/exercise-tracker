# Frontend

This React and TypeScript frontend uses [Vite](https://vite.dev/).

## Available Scripts

### `npm start`

Starts the development server. Open the local URL printed by Vite (usually
[http://localhost:5173](http://localhost:5173)). The page updates as you edit files.

### `npm test`

Runs the test suite once with Vitest.

### `npm run build`

Checks TypeScript types and builds the production app into the `dist` folder.

`npm start` and `npm run build` generate `public/records.yaml` from the repository's
root `records.yaml` before serving or building. The sync script derives all-time
totals and single-activity records from the daily log. Restart the dev server after
changing the source YAML file.
