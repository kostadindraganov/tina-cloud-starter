import {
    mediaHandlerConfig,
    createMediaHandler,
  } from 'next-tinacms-cloudinary/dist/handlers'

  import { isAuthorized } from '@tinacms/auth'


export const config = mediaHandlerConfig

export default createMediaHandler({
    cloud_name: 'dknctjjlc',
    api_key: "27775379465381",
    api_secret: "IiGptlMU6hwBGQrFeDGpw1EMlA0",
    authorized: async(req) => {
        try{
            if (process.env.NODE_ENV == 'development') {
                return true
            }
            const user = await isAuthorized(req)

            return Boolean(user && user.verified)
        }catch (e){
            console.log(e)
            return false;
        }
    }
})