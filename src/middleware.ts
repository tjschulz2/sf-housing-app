import { updateSession } from "@/utils/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

function isAccessibleWithoutAuth(pathname: string) {
  const permittedUnauthenticatedPaths = new Set([
    "/",
    "/auth/callback",
    "/sponsor",
  ]);

  return (
    permittedUnauthenticatedPaths.has(pathname) || pathname.startsWith("/s/")
  );
}

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);

  if (!isAccessibleWithoutAuth(request.nextUrl.pathname) && user.error) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (request.nextUrl.pathname === "/" && !user.error) {
    return NextResponse.redirect(new URL("/searchers", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
