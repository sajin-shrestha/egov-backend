import mongoose from 'mongoose'
import { IGovWebData } from './govWebDataTypes'

const govWebDataSchema = new mongoose.Schema<IGovWebData>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    website_url: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/, // url regex
        'Please provide a valid URL',
      ],
    },
    image_url: {
      type: String,
      required: false,
      match: [
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/, // url regex
        'Please provide a valid URL',
      ],
    },
  },
  { timestamps: true },
)

export default mongoose.model<IGovWebData>('GovWebData', govWebDataSchema)
