import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import critters from "astro-critters";

export default defineConfig({
  site: "https://www.top10maison.com",
  trailingSlash: "always",
  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
    domains: [
      "m.media-amazon.com",
      "images-na.ssl-images-amazon.com",
      "pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev",
      "www.top10maison.com"
    ]
  },
  integrations: [tailwind(), critters()]
});
