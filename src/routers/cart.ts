import express from 'express'
import { tokenVerify } from '../middlewares/tokenVerify'

import {
  createUserCart,
  findUserCartById,
  removeUserCart,
} from '../controllers/cart'

const router = express.Router()

router.put('/:userId', tokenVerify, removeUserCart)
router.put('/:userId', tokenVerify, createUserCart)
router.get('/:userId', findUserCartById)

export default router
