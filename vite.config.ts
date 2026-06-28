import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { astryxStylex } from '@astryxdesign/build/vite';

// IMPORTANT (GitHub Pages):
// For a project page served at https://<user>.github.io/<repo>/ the `base`
// must be '/<repo>/'. Change `repoName` below to your actual repository name.
// In dev (StackBlitz / `vite dev`) Vite ignores `base` and serves from '/'.
const repoName = 'personal-tracker';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${repoName}/` : '/',
  plugins: [
    // astryxStylex() returns an ARRAY of plugins -> spread it.
    // It wraps @stylexjs/unplugin so your own stylex.create()/xstyle compiles.
    ...astryxStylex(),
    react(),
  ],
}));
