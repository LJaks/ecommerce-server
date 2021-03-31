/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type GameDocument = Document & {
  id: string
  name: string
  publishedYear: number
  categories: string[]
  price: number
  rating: number
  imgUrl: string
  owner: string
}

const gameSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    index: true,
    required: true,
  },
  publishedYear: {
    type: Number,
    required: true,
    min: 1900,
  },
  categories: [String],
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  rating: {
    type: Number,
    min: 0,
  },
  imgUrl: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

export default mongoose.model<GameDocument>('Game', gameSchema)
