import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import bcrypt from 'bcrypt'

import userModel from './userModel'
import { generateToken, verifyToken } from '../utils/token'
import { validateEmail, validatePassword } from '../utils/validation'

// create new user
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return next(createHttpError(400, 'All fields are required'))
  }

  if (!validateEmail(email)) {
    return next(createHttpError(400, 'Invalid email format'))
  }

  if (!validatePassword(password)) {
    return next(
      createHttpError(
        400,
        'Password must be 8-15 characters long, include at least one number and one special character',
      ),
    )
  }

  try {
    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      return next(createHttpError(400, 'User already exists with this email'))
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await userModel.create({
      username,
      email,
      password: hashedPassword,
    })

    res.status(201).json({ message: 'New User Created Successfully' })
  } catch (error) {
    return next(createHttpError(500, 'Error while creating user'))
  }
}

// user login
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(createHttpError(400, 'All fields are required'))
  }

  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return next(createHttpError(400, 'User does not exist'))
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return next(createHttpError(400, 'Incorrect password'))
    }

    const token = generateToken(user._id)
    res.status(200).json({ accessToken: token })
  } catch (error) {
    return next(createHttpError(500, 'Error while signing JWT token'))
  }
}

// get user profile
const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return next(createHttpError(401, 'Authentication token required'))
  }

  try {
    const decoded = verifyToken(token)

    if (!decoded?.sub) {
      return next(createHttpError(401, 'Invalid token or token expired'))
    }

    const user = await userModel.findById(decoded.sub).select('-password')

    if (!user) {
      return next(createHttpError(404, 'User not found'))
    }

    res.status(200).json({ user })
  } catch (error) {
    return next(createHttpError(500, 'Error while fetching user profile'))
  }
}

export { createUser, loginUser, getProfile }
