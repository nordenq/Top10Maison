/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_GA_ID?: string;
    readonly PUBLIC_GSC_VERIFICATION?: string;
  }
}
