import googleStrategy from 'passport-google-id-token'
import AuthService from '../services/authService'
import passportJWT from 'passport-jwt'
import User from '../models/User'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const google = new googleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
  },
  async (parsedToken: any, googleId: any, done: any) => {
    const user = await AuthService.findOrCreate(parsedToken.payload)
    const token = AuthService.generateToken(user)
    done(null, { token })
  }
)

const jwt = new passportJWT.Strategy(
  {
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  (payload, cb) => {
    User.findById(payload._id)
      .then((user) => {
        return cb(null, user)
      })
      .catch((err) => {
        return cb(err)
      })
  }
)
export default { google, jwt }
