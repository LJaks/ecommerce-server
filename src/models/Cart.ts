/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type CartDocument = Document & {
  user: string
  games: string[]
}
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
  ],
})
export default mongoose.model<CartDocument>('Cart', cartSchema)
