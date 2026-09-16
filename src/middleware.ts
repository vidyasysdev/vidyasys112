import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/app/:path*",
    "/admin/:path*",
    "/auth/:path*",
    "/verify-college",
    "/verify-email",
    "/login",
    "/signup",
  ],
};
