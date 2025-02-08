import multer from 'multer'
import { Request } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import multerStorageCloudinary from 'multer-storage-cloudinary'
import path from 'path'
import { config } from '../config/config'

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
})

function createStorage(folderName: string) {
  return multerStorageCloudinary({
    cloudinary,
    params: (req, file) => {
      const fileExtension = path.extname(file.originalname).substring(1)
      const publicId = `${file.fieldname}-${Date.now()}` // Generate a unique public ID

      return {
        folder: folderName, // Cloudinary folder
        public_id: publicId, // Custom public ID for Cloudinary
        format: fileExtension || undefined, // Use original format or let Cloudinary decide
      }
    },
  })
}

// Allow all file types
const fileFilter: multer.Options['fileFilter'] = (
    _req: Request,
    _file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) => {
  cb(null, true) // accept all files
}

// Main upload middleware function with dynamic folder support
export function uploadMiddleware(folderName: string) {
  const storage = createStorage(folderName)

  return multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // file limit to 15 MB
    fileFilter,
  })
}
