/* eslint-disable @typescript-eslint/member-delimiter-style */
import User, { UserDocument } from '../models/User'

function createUser(user: UserDocument): Promise<UserDocument> {
  return user.save()
}

function findById(userId: string): Promise<UserDocument> {
  return User.findById(userId)
    .populate('cart')
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      return user
    })
}

function findAll(): Promise<UserDocument[]> {
  return User.find().sort({ username: 1 }).exec()
}

type UpdateUser = Partial<UserDocument> & {
  gameId: string
}

function updateUser(userId: string, update: UpdateUser): Promise<UserDocument> {
  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      if (update.firstName) {
        user.firstName = update.firstName
      }
      if (update.lastName) {
        user.lastName = update.lastName
      }
      if (update.email) {
        user.email = update.email
      }
      if (typeof update.isBanned !== 'undefined') {
        user.isBanned = update.isBanned
      }
      if (update.gameId) {
        user.cart = [...update.gameId]
      }
      return user.save()
    })
}

function deleteUser(userId: string): Promise<UserDocument | null> {
  return User.findByIdAndDelete(userId).exec()
}

export default {
  createUser,
  findById,
  findAll,
  updateUser,
  deleteUser,
}
