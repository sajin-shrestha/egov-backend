import nodemailer from 'nodemailer'
import userModel from '../user/userModel'
import { config } from '../config/config'

// Email Configuration
const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

/**
 * Sends an email notification
 * @param {string} userId - The ID of the user to fetch the email
 * @param {string} subject - The email subject
 * @param {string} message - The email body
 */
export const sendEmail = async (
  userId: string,
  subject: string,
  message: string,
) => {
  try {
    // Fetch user email from DB
    const user = await userModel.findById(userId)
    if (!user || !user.email) {
      console.error('User email not found')
      return
    }

    console.log(user.email)

    // Email options
    const mailOptions = {
      from: config.hostEmail,
      to: user.email,
      subject: subject,
      html: message,
    }

    // Send Email
    await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${user.email}`)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
