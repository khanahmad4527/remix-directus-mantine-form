import { authentication, createDirectus, rest } from "@directus/sdk";

const { YOUR_DIRECTUS_BASE_URL } = process.env;

export const directus = createDirectus(YOUR_DIRECTUS_BASE_URL!)
  .with(authentication())
  .with(rest());
