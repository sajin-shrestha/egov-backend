import { Document } from 'mongoose'

export interface IGovWebData extends Document {
  _id: string
  name: string
  description: string
  address: string
  website_url: string
  image_url: string
}
