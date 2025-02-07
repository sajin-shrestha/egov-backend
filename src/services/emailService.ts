import nodemailer from 'nodemailer'
import userModel from '../user/userModel'
import { config } from '../config/config'

const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: config.hostEmail,
    pass: config.hostEmailPassword,
  },
})

export const sendEmail = async (
  userId: string,
  subject: string,
  message: string,
) => {
  try {
    const user = await userModel.findById(userId)
    if (!user) {
      console.error('User email not found')
      return
    }

    const mailOptions = {
      from: config.hostEmail,
      to: user.email,
      subject: subject,
      html: message,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
