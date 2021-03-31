import { Request, Response, NextFunction } from 'express'
import sanitize from 'mongo-sanitize'

import Game from '../models/Game'
import GameService from '../services/game'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /games
export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { imgUrl, name, publishedYear, categories, price, rating } = req.body

    const game = new Game({
      imgUrl,
      name,
      publishedYear,
      categories,
      price,
      rating,
    })

    await GameService.createGame(game)
    res.json(game)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /games/:gameId
export const updateGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const gameId = req.params.gameId
    const updatedGame = await GameService.updateGame(gameId, update)
    res.json(updatedGame)
  } catch (error) {
    next(new NotFoundError('Game not found', error))
  }
}

// DELETE /games/:gameId
export const deleteGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await GameService.deleteGame(req.params.gameId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Game not found', error))
  }
}

// GET /games/:gameId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await GameService.findById(req.params.gameId))
  } catch (error) {
    next(new NotFoundError('Game not found', error))
  }
}

// GET /games
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = sanitize(req.query)

  try {
    res.json(await GameService.findAll(query))
  } catch (error) {
    next(new NotFoundError('Games not found', error))
  }
}
