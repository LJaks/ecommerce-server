import { Request, Response, NextFunction } from 'express'
import { BadRequestError, InternalServerError } from '../helpers/apiError'
import bcrypt from 'bcrypt'

import User from '../models/User'
import authService from '../services/authService'

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
    const token = authService.generateToken(user)

    res.status(200).send({ token })
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}
