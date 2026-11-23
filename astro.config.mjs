import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://vanzalabs.tech';

function collectStaticBlogUrls() {
  const blogDir = path.resolve('public/blog');
  if (!fs.existsSync(blogDir)) return [];
  const urls = [`${SITE}/blog/`];
  for (const entry of fs.readdirSync(blogDir, { withFileTypes: true })) {
    if (entry.isDirectory() && fs.existsSync(path.join(blogDir, entry.name, 'index.html'))) {
      urls.push(`${SITE}/blog/${entry.name}/`);
    }
  }
  return urls.sort();
}

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you'),
      customPages: collectStaticBlogUrls(),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          uk: 'uk',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
