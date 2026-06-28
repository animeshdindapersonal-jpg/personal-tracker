# Personal Tracker

A full-featured personal tracker (habits + tasks + expenses) built with
**[Astryx](https://github.com/facebook/astryx)** — Meta's open-source React +
StyleX design system — and **Vite**. Data is saved in your browser via
`localStorage`, so it works as a static site with no backend.

## Stack

- React 19 + TypeScript + Vite 6
- `@astryxdesign/core` components + `@astryxdesign/theme-neutral`
- StyleX (`xstyle` prop) for component overrides, compiled by
  `@astryxdesign/build/vite`
- Persistence: browser `localStorage`

## Run locally

```bash
npm install
npm run dev
```

## Preview in StackBlitz (no install)

Open this repo in the browser by prefixing the GitHub URL with
`stackblitz.com/github/`:

```
https://stackblitz.com/github/<your-username>/personal-tracker
```

StackBlitz runs `npm install` + `npm run dev` in a WebContainer. The
production `base` path is ignored in dev, so it serves from `/` correctly.

## Deploy to GitHub Pages (automated)

This repo ships a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that builds and deploys on every push to `main`. One-time setup:

1. Create a repo named `personal-tracker` and push this project:

   ```bash
   git init -b main
   git add .
   git commit -m "Personal tracker with Astryx"
   git remote add origin https://github.com/<your-username>/personal-tracker.git
   git push -u origin main
   ```

2. In the repo: **Settings → Pages → Build and deployment → Source =
   "GitHub Actions"**.

3. Done. The Action builds and publishes automatically. Your site:
   `https://<your-username>.github.io/personal-tracker/`

### Using a different repo name

The Vite `base` must match your repo name for assets to load on Pages.
Edit `vite.config.ts` and change:

```ts
const repoName = 'personal-tracker'; // -> your repo name
```

(For a user/org root site at `<user>.github.io`, set `base: '/'`.)

## Notes on Astryx

- Components are imported from per-category subpaths,
  e.g. `@astryxdesign/core/Button`, `/Text`, `/Layout`, `/TextInput`.
- The theme provider is `<Theme theme={neutralTheme}>` from
  `@astryxdesign/core/theme`.
- `xstyle` only works because the StyleX compiler (via
  `astryxStylex()` in `vite.config.ts`) processes your code.
- Astryx is in Beta (v0.1.x). If `npm install` resolves a different version,
  run `npm run astryx -- doctor` and `npm run astryx -- component --list` to
  verify component entrypoints/props.
```
