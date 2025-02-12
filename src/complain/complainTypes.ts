import { Document } from 'mongoose'

export interface IComplain extends Document {
  userId: string
  subject: string
  description: string
  image: string
  category: string
  status: 'pending' | 'in-process' | 'resolved'
}
