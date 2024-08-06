import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "igt2ili4",
  dataset: "production",
  apiVersion: "2024-03-11",
  // Set to `true` for production environments
  useCdn: process.env.NODE_ENV === "development" ? false : true,
});
