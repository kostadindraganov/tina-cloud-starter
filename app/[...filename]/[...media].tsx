import {
    mediaHandlerConfig,
    createMediaHandler,
  } from "next-tinacms-cloudinary/dist/handlers";
  import { isAuthorized } from "@tinacms/auth";
  
  export const config = mediaHandlerConfig;
  
  export default createMediaHandler({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    // eslint-disable-next-line no-unused-vars
    authorized: async (req, res) => {
      if (process.env.NEXT_PUBLIC_USE_LOCAL_CLIENT === "1") {
        return true;
      }
      try {
        const user = await isAuthorized(req);
        return Boolean(user && user.verified);
      } catch (e) {
        console.error(e);
        return false;
      }
    },
  });