// vite.config.ts
// The 'base' option tells Vite the subfolder the app will be served from.
// GitHub Pages serves from /repo-name/ not /, so we must set this
// otherwise all assets (JS, CSS) will 404 when deployed.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/crypto-tracker/',
})