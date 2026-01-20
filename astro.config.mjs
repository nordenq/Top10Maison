import { defineConfig } from "astro/config";
import critters from "@astrojs/critters";
import image from "@astrojs/image";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://www.top10maison.com",
  trailingSlash: "always",
  integrations: [
    tailwind(),
    critters(),
    image({
      domains: [
        "pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev",
        "m.media-amazon.com",
        "images-na.ssl-images-amazon.com",
        "ws-na.amazon-adsystem.com"
      ]
    })
  ]
});
