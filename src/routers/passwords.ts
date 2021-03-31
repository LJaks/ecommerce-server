import express from 'express'
import { emailGenerator, resetPassword } from '../controllers/forgotPassword'
import { changePassword } from '../controllers/changePassword'
import { tokenVerify } from '../middlewares/tokenVerify'

const router = express.Router()

router.put('/changePassword', changePassword)
router.post('/email', emailGenerator)
router.put('/resetPassword', tokenVerify, resetPassword)

export default router
