import createMiddleware from "next-intl/middleware";
import { routing } from "./routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",
    // Set a cookie to remember the previous locale for all requests that have a matching locale prefix
    "/(es|en)/:path*",
    // Enable redirects that add missing locales (e.g. `/about` => `/en/about`)
    "/((?!_next|_vercel|favicon.ico|images|fonts|api).*)",
  ],
};
