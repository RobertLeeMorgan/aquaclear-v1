import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import {site} from "./src/config/site"

// https://astro.build/config
export default defineConfig({
  site: site.url,
  integrations: [
    sitemap(),
  ],
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
