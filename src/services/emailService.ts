import nodemailer from 'nodemailer'
import userModel from '../user/userModel'

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use SMTP settings for production
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email app password
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

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject,
      text: message,
    }

    // Send Email
    await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${user.email}`)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
