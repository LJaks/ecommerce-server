import { Request, Response, NextFunction } from 'express'
import { BadRequestError, InternalServerError } from '../helpers/apiError'
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import emailSender from '../config/mailgun'
import User, { UserDocument } from '../models/User'
import authService from '../services/authService'
import { JWT_SECRET } from '../util/secrets'

export const emailGenerator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //searching for user and it's password if they're correct
    await User.findOne({ email: req.body.email })
      .exec()
      .then((user) => {
        if (!user) {
          throw new Error('User not found')
        }
        const token = authService.generateToken(user._id)
        //send email using mailgun
        emailSender(user.email, token)
      })
    res.send('Email sent to user!')
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newPassword } = req.body.data

    const decodedToken = JWT.verify(req.body.userid, JWT_SECRET)
    const { _id } = decodedToken as any

    const round = 10
    const hashedPassword = await bcrypt.hash(newPassword, round)

    const newHashedPassword = { password: hashedPassword }

    function updatePass(
      _id: string,
      update: Partial<UserDocument>
    ): Promise<UserDocument> {
      return User.findById({ _id })
        .exec()
        .then((user) => {
          if (!user) {
            throw new Error(`User ${_id} not found`)
          }

          if (update.password) {
            user.password = update.password
          }
          return user.save()
        })
    }
    const updatePassword = await updatePass(_id, newHashedPassword)

    if (updatePassword) {
      res.send('Password reseted!')
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}
