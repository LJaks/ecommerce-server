import express from 'express'
import { tokenVerify } from '../middlewares/tokenVerify'
import { isAdmin } from '../middlewares/isAdmin'

import {
  createGame,
  findById,
  deleteGame,
  findAll,
  updateGame,
} from '../controllers/game'

const router = express.Router()

router.get('/', findAll)
router.get('/:gameId', findById)
router.put('/:gameId', tokenVerify, isAdmin, updateGame)
router.delete('/:gameId', tokenVerify, isAdmin, deleteGame)
router.post('/', tokenVerify, isAdmin, createGame)

export default router
