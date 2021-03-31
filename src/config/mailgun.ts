import Mailgun from 'mailgun-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const emailConfig = {
  apiKey: process.env.API_KEY as string,
  domain: process.env.DOMAIN as string,
}

const mailgun = Mailgun(emailConfig)

const emailSender = (email: any, token: any) => {
  const data = {
    from: `Excited User <postmaster@${process.env.DOMAIN}>`,
    to: email,
    subject: 'Password reset',
    text: `Seems like you forgot your password. To change your password press here => http://localhost:3000/password-reset/${token}`,
  }

  mailgun.messages().send(data, function (error: any, body: any) {
    if (error) {
      console.log('Something went bad with mailgun...')
    }
    console.log(body)
  })
}

export default emailSender
