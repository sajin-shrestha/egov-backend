import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { verifyToken } from '../utils/token'
import userModel from '../user/userModel'

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string }
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('Authorization')
  if (!token) return next(createHttpError(401, 'Access denied'))

  try {
    const tokenWithoutBearer = token.replace('Bearer ', '')
    const decoded = verifyToken(tokenWithoutBearer) as { sub: string }

    const user = await userModel.findById(decoded.sub)

    if (!user) return next(createHttpError(401, 'User Not found'))

    req.user = { id: user.id, role: user.role }
    next()
  } catch (error) {
    return next(createHttpError(401, 'Invalid token'))
  }
}

export default authMiddleware
