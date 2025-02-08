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
      const publicId = `${file.fieldname}-${Date.now()}` // Generate a unique public id

      return {
        folder: folderName, // Cloudinary folder
        public_id: publicId, // Custom public ID for Cloudinary
        format: fileExtension, // File extension (e.g., jpg, png)
        transformation: [
          { width: 500, height: 500, crop: 'limit' }, // Image transformation (optional)
        ],
      }
    },
  })
}

// File filter function to allow only certain formats
const fileFilter: multer.Options['fileFilter'] = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|bmp|svg|tiff|heif|heic/i;
  const isExtValid: boolean = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  )
  const isMimeValid: boolean = allowedTypes.test(file.mimetype)

  if (isExtValid && isMimeValid) {
    cb(null, true)
  } else {
    cb(new Error('Only .png, .jpg, and .jpeg formats are allowed!'))
  }
}

// Main upload middleware function with dynamic folder support
export function uploadMiddleware(folderName: string) {
  const storage = createStorage(folderName)

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter,
  })
}
