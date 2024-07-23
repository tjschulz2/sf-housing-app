"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const publicPosthogKey = "phc_EmruXxMeZcpgZcATCciKEyAMqKWJO3k8bJ5atiGyTJU";
const publicPosthogHost = "https://us.i.posthog.com";

if (typeof window !== "undefined") {
  posthog.init(publicPosthogKey, {
    api_host: publicPosthogHost,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}
export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
