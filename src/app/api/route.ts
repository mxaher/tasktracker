import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { routeErrorResponse } from "@/lib/api-error";



export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const context = getCloudflareContext();
    const env = context.env as {
      DB?: {
        prepare: (sql: string) => { first: () => Promise<unknown> };
      };
    };
    const database = env.DB;
    const hasDb = Boolean(database);
    let dbProbe: unknown = null;

    if (hasDb && database) {
      const result = await database.prepare("SELECT 1 AS ok").first();
      dbProbe = result;
    }

    return NextResponse.json({
      message: "Hello, world!",
      hasDb,
      dbProbe,
    });
  } catch (error) {
    return routeErrorResponse("/api GET", error, {
      status: 500,
      body: {
        message: "Hello, world!",
      },
    });
  }
}
