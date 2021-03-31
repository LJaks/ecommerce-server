import { Request, Response, NextFunction } from 'express'
import UserService from '../services/user'
import { NotFoundError } from '../helpers/apiError'

// PUT /cart/:userId
export const createUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const userId = req.params.userId
    res.json(await UserService.updateUser(userId, update))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// PUT /cart/:userId
export const removeUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const userId = req.params.userId
    res.json(await UserService.updateUser(userId, update))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// GET /cart/:userId
export const findUserCartById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findById(req.params.userId))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}
