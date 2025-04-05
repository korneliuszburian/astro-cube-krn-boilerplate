import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [
    partytown(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss({applyBaseStyles: false})]
  },
});
