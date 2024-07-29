import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAuth } from "@clerk/nextjs/server";

const f = createUploadthing();

// Correct implementation of getAuth
const getUserFromRequest = async (req) => {
  const { userId } = getAuth(req);
  if (!userId) throw new UploadThingError("Unauthorized");

  // Fetch user from your database or Clerk API
  // Replace this with actual fetching logic
  return { id: userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      try {
        // Fetch the user from the request
        const user = await getUserFromRequest(req);

        // If the user is not found, throw an error
        if (!user) throw new UploadThingError("Unauthorized");

        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: user.id };
      } catch (error) {
        console.error("Middleware error:", error);
        throw new UploadThingError("Unauthorized");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // !!! Whatever is returned here is sent to the client-side `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
};
