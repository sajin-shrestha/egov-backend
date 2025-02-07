import mongoose from 'mongoose'
import { IUser } from './userTypes'

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true },
)

export default mongoose.model<IUser>('User', userSchema)
