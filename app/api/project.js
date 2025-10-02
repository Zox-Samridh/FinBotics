"use server";

import arcjet from "@arcjet/next";
import { clerkMiddleware } from "@clerk/nextjs/server";

// Initialize ArcJet
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    {
      type: "shield",
      mode: "LIVE",
    },
    {
      type: "detectBot",
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    },
  ],
});

export async function protectRoute(req) {
  // Run ArcJet protection
  const ajResponse = await aj(req);
  if (ajResponse) return ajResponse;

  // Run Clerk auth
  const clerk = clerkMiddleware(async (auth) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return true;
  });

  try {
    await clerk(req);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
