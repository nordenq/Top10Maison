/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_GA_MEASUREMENT_ID?: string;
    readonly PUBLIC_GTM_ID?: string;
  }
}
