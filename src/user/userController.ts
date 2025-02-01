import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import bcrypt from 'bcrypt'
import userModel from './userModel'
import { sign } from 'jsonwebtoken'
import { config } from '../config/config'
import { IUser } from './userTypes'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return next(createHttpError(400, 'All fields are required'))
  }

  // Validate email format (simple regex check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return next(createHttpError(400, 'Invalid email format'))
  }

  // Validate password:
  // - Must be 8-15 characters long
  // - Must contain at least one number
  // - Must contain at least one special character
  const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,15}$/
  if (!passwordRegex.test(password)) {
    return next(
      createHttpError(
        400,
        'Password must be 8-15 characters long, include at least one number and one special character',
      ),
    )
  }

  try {
    const user = await userModel.findOne({ email })
    if (user) {
      return next(createHttpError(400, 'user already exists with this email'))
    }
  } catch (error) {
    return next(createHttpError(500, 'error while getting user'))
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  let newUser: IUser
  try {
    newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    })
  } catch (error) {
    return next(createHttpError(500, 'error while creating user'))
  }

  try {
    // token generation (jwt)
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: '7d', // expires in 7 days
      algorithm: 'HS256',
    })

    res.status(201).json({ accessToken: token })
  } catch (error) {
    return next(createHttpError(500, 'error while signing jwt-token'))
  }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(createHttpError(400, 'All fields are required'))
  }

  let user: IUser | null
  try {
    user = await userModel.findOne({ email })
    if (!user) {
      return next(createHttpError(400, 'user doesnot exist'))
    }
  } catch (error) {
    return next(createHttpError(500, 'error while getting user'))
  }

  try {
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return next(createHttpError(400, 'incorrect password'))
    }
  } catch (error) {
    return next(createHttpError(500, 'error while comparing password'))
  }

  try {
    // token generation (jwt)
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: '7d', // expires in 7 days
      algorithm: 'HS256',
    })

    res.status(201).json({ accessToken: token })
  } catch (error) {
    return next(createHttpError(500, 'error while signing jwt-token'))
  }
}

export { createUser, loginUser }
