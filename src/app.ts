import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import passport from 'passport'
import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './routers/user'
import cartRouter from './routers/cart'
import gameRouter from './routers/game'
import loginRouter from './routers/login'
import googleLoginRouter from './routers/googleLogin'
import passwordsRouter from './routers/passwords'
import apiErrorHandler from './middlewares/apiErrorHandler'
import passportStrategy from './config/passport'

dotenv.config({ path: __dirname + '/.env' })
const app = express()

// Express configuration
app.set('port', process.env.PORT || 3000)

// Use common 3rd-party middlewares
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use(passport.initialize())
app.use(cors())

passport.use(passportStrategy.google)
passport.use(passportStrategy.jwt)

// Use routers
app.use('/api/v1/users', userRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/games', gameRouter)
app.use('/api/v1/login', loginRouter)
app.use('/api/google/login', googleLoginRouter)
app.use('/api/v1', passwordsRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
