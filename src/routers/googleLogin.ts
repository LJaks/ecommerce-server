import express from 'express'
import passport from 'passport'
import { Request, Response } from 'express'

const router = express.Router()

router.post(
  '/',
  passport.authenticate('google-id-token', { session: false }),
  (req: Request, res: Response) => {
    res.send(req.user)
  }
)

export default router
