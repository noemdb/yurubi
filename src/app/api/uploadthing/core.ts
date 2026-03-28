import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Definimos un endpoint exlcusivo para imágenes
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Middleware que verifica que solo el personal autorizado pueda subir ficheros
    .middleware(async ({ req }) => {
      const session = await auth();
      
      // Si el usuario no está validado, no lo dejamos pasar el proxy de subida hacia S3 / AWS
      if (!session || !session.user) throw new Error("Unauthorized access to UploadThing");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      // Devolvemos el serverData esperado (si es necesario por el cliente)
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
