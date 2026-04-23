import { NextResponse } from "next/server";

export function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
    stack: undefined,
  };
}

export function logRouteError(route: string, error: unknown) {
  const details = getErrorDetails(error);

  console.error("[api] Route handler failed", {
    route,
    message: details.message,
    stack: details.stack,
  });

  return details;
}

export function routeErrorResponse(
  route: string,
  error: unknown,
  options?: {
    status?: number;
    body?: Record<string, unknown>;
  },
) {
  const { message } = logRouteError(route, error);
  const body = options?.body ?? {};

  const payload =
    body.error === undefined
      ? { ...body, error: message }
      : { ...body, message };

  return NextResponse.json(payload, { status: options?.status ?? 500 });
}
