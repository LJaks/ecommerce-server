import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

export const encryptPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body
  const round = 10

  if (!password) {
    next(new Error('Password not provided!'))
  }

  try {
    req.body.password = await bcrypt.hash(password, round)
    next()
  } catch (e) {
    next(e)
  }
}
