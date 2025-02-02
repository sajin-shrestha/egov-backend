import { JsonWebTokenError, sign, verify } from 'jsonwebtoken'
import { config } from '../config/config'

export const generateToken = (userId: string) => {
  return sign({ sub: userId }, config.jwtSecret as string, {
    expiresIn: '7d', // expires in 7 days
    algorithm: 'HS256',
  })
}

export const verifyToken = (token: string) => {
  try {
    return verify(token, config.jwtSecret as string)
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new Error('Invalid or expired token')
    }
    throw new Error('Error verifying token')
  }
}
