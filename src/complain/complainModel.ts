import mongoose, { Schema } from 'mongoose'
import { IComplain } from './complainTypes'

const ComplainSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  category: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'in-process', 'resolved'],
    default: 'pending',
  },
})

export const Complain = mongoose.model<IComplain>('Complain', ComplainSchema)
