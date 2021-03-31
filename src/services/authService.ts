/* eslint-disable @typescript-eslint/member-delimiter-style */
import jwt from 'jsonwebtoken'
import User, { UserDocument } from '../models/User'

type Payload = {
  given_name: string
  family_name: string
  email: string
  picture: string
}

function findOrCreate(payload: Payload): Promise<UserDocument> {
  return User.findOne({ email: payload.email })
    .exec()
    .then((user) => {
      if (!user) {
        const newUser = new User({
          firstName: payload.given_name,
          lastName: payload.family_name,
          email: payload.email,
          picture: payload.picture,
          isAdmin: payload.email === process.env.EMAIL ? true : false,
        })
        return newUser.save()
      }
      return user
    })
}

const generateToken = (user: UserDocument) => {
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      isBanned: user.isBanned,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET as string
  )
  return token
}

export default {
  findOrCreate,
  generateToken,
}
