import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Exporte rutas para el Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
