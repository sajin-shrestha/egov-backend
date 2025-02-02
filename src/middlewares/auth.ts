import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { JwtPayload } from 'jsonwebtoken'
import { verifyToken } from '../utils/token'
import { IUser } from '../user/userTypes'

interface AuthenticatedRequest extends Request {
  user?: IUser
}

const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return next(createHttpError(401, 'Access Denied'))

  try {
    const verifiedUser = verifyToken(token) as IUser & JwtPayload
    req.user = verifiedUser
    next()
  } catch (error) {
    return next(createHttpError(401, 'Invalid token or token expired'))
  }
}

export default auth
