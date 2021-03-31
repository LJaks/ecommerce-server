/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  picture: string
  isAdmin: boolean
  isBanned: boolean
  cart: string[]
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      index: true,
      type: String,
      // required: true,
    },
    email: {
      unique: true,
      type: String,
      required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<UserDocument>('User', userSchema)
