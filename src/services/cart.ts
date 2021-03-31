/* eslint-disable @typescript-eslint/member-delimiter-style */
import User, { UserDocument } from '../models/User'

type UpdateUser = Partial<UserDocument> & {
  gameId: string
}

function findUserCartById(userId: string): Promise<UserDocument> {
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
function removeUserCart(
  userId: string,
  update: UpdateUser
): Promise<UserDocument> {
  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      if (update.gameId) {
        user.cart = []
      }
      // if (update.gameId) {
      //   user.cart.push(update.gameId)
      // }

      return user.save()
    })
}

function createUserCart(
  userId: string,
  update: UpdateUser
): Promise<UserDocument> {
  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      if (update.gameId) {
        user.cart = [...update.gameId]
      }
      return user.save()
    })
}

export default {
  createUserCart,
  removeUserCart,
  findUserCartById,
}
