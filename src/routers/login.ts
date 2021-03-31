import express from 'express'

import { login } from '../controllers/login'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix

router.post('/', login)

export default router
