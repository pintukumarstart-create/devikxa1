// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import purgecss from 'astro-purgecss';



import cloudflare from "@astrojs/cloudflare";



// https://astro.build/config
export default defineConfig({
  site: 'https://www.devikxa.com',

  integrations: [
    icon(),
    purgecss(),
    ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare()
});