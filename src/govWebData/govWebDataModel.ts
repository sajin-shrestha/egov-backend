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
    },
    image_url: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
)

export default mongoose.model<IGovWebData>('GovWebData', govWebDataSchema)
