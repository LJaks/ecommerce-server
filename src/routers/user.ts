import express from 'express'
import { encryptPassword } from '../middlewares/encryptPassword'
import { isAdmin } from '../middlewares/isAdmin'
import { tokenVerify } from '../middlewares/tokenVerify'

import {
  createUser,
  findById,
  deleteUser,
  findAll,
  updateUser,
} from '../controllers/user'

const router = express.Router()

router.get('/', tokenVerify, isAdmin, findAll)
router.get('/:userId', findById)
router.put('/:userId', tokenVerify, updateUser)
router.delete('/:userId', deleteUser)
router.post('/', encryptPassword, createUser)

export default router
