import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { db } from "@/lib/db";
import { logRouteError } from "@/lib/api-error";

export const dynamic = "force-dynamic";

type HealthStatus = "ok" | "missing" | "error";

export async function GET() {
  let binding: HealthStatus = "missing";
  let query: HealthStatus = "error";
  let errorMessage: string | undefined;

  try {
    const context = getCloudflareContext();
    const env = (context.env ?? {}) as { DB?: unknown };
    binding = env.DB ? "ok" : "missing";
  } catch (error) {
    const details = logRouteError("/api/health GET context", error);
    errorMessage = details.message;
  }

  try {
    await db.$queryRaw`SELECT 1`;
    query = "ok";
  } catch (error) {
    const details = logRouteError("/api/health GET query", error);
    query = "error";
    errorMessage ??= details.message;
  }

  const statusCode = binding === "ok" && query === "ok" ? 200 : 500;

  return NextResponse.json(
    errorMessage
      ? { binding, query, error: errorMessage }
      : { binding, query },
    { status: statusCode },
  );
}
