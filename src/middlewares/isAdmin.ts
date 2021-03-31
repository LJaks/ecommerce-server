import { Request, Response, NextFunction } from 'express'
import { UserDocument } from '../models/User'

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req && req.user && (req.user as UserDocument).isAdmin) {
    next()
  } else {
    next(new Error('Unauthorized!'))
  }
}
