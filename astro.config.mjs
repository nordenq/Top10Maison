import { defineConfig } from "astro/config";
import critters from "astro-critters";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://www.top10maison.com",
  trailingSlash: "always",
  integrations: [tailwind(), critters()]
});
