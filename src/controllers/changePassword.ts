import { Request, Response, NextFunction } from 'express'
import { BadRequestError, InternalServerError } from '../helpers/apiError'
import bcrypt from 'bcrypt'

import User, { UserDocument } from '../models/User'

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body)
    //searching for user and it's password if they're correct
    const user = await User.findOne({ email: req.body.email })
    const checkPassword =
      user === null
        ? false
        : await bcrypt.compare(req.body.password, user.password)

    if (!user || !checkPassword) {
      return res
        .status(401)
        .json({ error: 'invalid username and/or password! Try again' })
    }

    //handle a new password
    const { newPassword } = req.body
    const email = req.params.userId

    const round = 10
    const hashedPassword = await bcrypt.hash(newPassword, round)

    const newHashedPassword = { password: hashedPassword }

    function update(
      email: string,
      update: Partial<UserDocument>
    ): Promise<UserDocument> {
      return User.findOne({ email: req.body.email })
        .exec()
        .then((user) => {
          if (!user) {
            throw new Error(`User ${email} not found`)
          }

          if (update.password) {
            user.password = update.password
          }
          return user.save()
        })
    }
    const updatePassword = await update(email, newHashedPassword)

    if (updatePassword) {
      res.send('Password updated!')
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}
