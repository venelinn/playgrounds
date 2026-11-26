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
    // The plugin wants names without "/": brands/westjet → brands-westjet
    name: folder === "." ? "index" : folder.replaceAll("/", "-"),
    filename,
    template: relative(__dirname, template),
  };
});

// Dev server: /clamp, /clamp/ and /clamp/index.html open that page, like a static host does.
// (Listed in full so the plugin's own rule, which matches a page name anywhere in the URL,
// doesn't send /brands/westjet/index.html to the home page.)
const rewrites = pages
  .filter((page) => page.name !== "index")
  .map((page) => ({ from: new RegExp(`^/${dirname(page.filename)}(/|/index\\.html)?$`), to: `/${page.filename}` }));

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
