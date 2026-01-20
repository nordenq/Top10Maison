/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_GA_ID?: string;
    readonly PUBLIC_GSC_VERIFICATION?: string;
    readonly OXYLABS_USER?: string;
    readonly OXYLABS_PASS?: string;
    readonly OXYLABS_BASE_URL?: string;
    readonly OXYLABS_GEO?: string;
  }
}
