import { readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { createMpaPlugin, createPages } from "vite-plugin-virtual-mpa";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = resolve(__dirname, "src/pages");

// Every src/pages/**/index.ejs is a page: src/pages/clamp/index.ejs → dist/clamp/index.html
const findPages = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return findPages(path);
    return entry.name === "index.ejs" ? [path] : [];
  });

const pages = findPages(pagesDir).map((template) => {
  const filename = relative(pagesDir, template).replace(/\.ejs$/, ".html");
  const folder = dirname(filename);
  return {
    name: folder === "." ? "index" : folder,
    filename,
    template: relative(__dirname, template),
  };
});

// Dev server: /clamp and /clamp/ open /clamp/index.html, like a static host does.
const rewrites = pages
  .filter((page) => page.name !== "index")
  .map((page) => ({ from: new RegExp(`^/${page.name}/?$`), to: `/${page.filename}` }));

export default defineConfig({
  root: "src",
  // Relative URLs, so dist/ works from any folder (e.g. GitHub Pages /playgrounds/).
  base: "./",
  plugins: [
    createMpaPlugin({
      htmlMinify: false,
      pages: createPages(pages),
      rewrites: rewrites.concat([{ from: /^\/$/, to: "/index.html" }]),
      // Any template change reloads the page
      watchOptions: {
        handler: ({ type, file, server }) => {
          if (type === "change" && file.endsWith(".ejs")) {
            (server.ws || server.hot).send({ type: "full-reload", path: "*" });
          }
        },
      },
    }),
  ],
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    // Ship the CSS and JS as written: no lowering of nesting, anchor positioning, etc.
    target: "esnext",
    cssTarget: "esnext",
  },
  server: {
    port: 3010,
    open: true,
  },
});
