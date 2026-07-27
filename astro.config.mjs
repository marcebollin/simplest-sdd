import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://sd2.marcebollin.com",
  output: "static",
  vite: {
    server: {
      allowedHosts: [".trycloudflare.com"]
    }
  },
  build: {
    format: "directory",
    inlineStylesheets: "never"
  }
});
