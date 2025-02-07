import { Document as MongooseDocument } from 'mongoose'

export interface IComplain extends MongooseDocument {
  userId: string
  subject: string
  description: string
  image: string
  category: string
  status: 'pending' | 'in-process' | 'resolved'
}
