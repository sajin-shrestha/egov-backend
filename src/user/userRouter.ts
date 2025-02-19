import express from 'express'
import rateLimit from 'express-rate-limit'
import createHttpError from 'http-errors'
import { createUser, getProfile, loginUser } from './userController'
import authMiddleware from '../middlewares/auth'
import { HttpStatusCodes } from '../constants'

const userRouter = express.Router()

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      createHttpError(
        HttpStatusCodes.TO_MANY_REQUESTS,
        'Too many login attempts. Try again in 5 minutes.',
      ),
    )
  },
})

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: 'string'
 *               email:
 *                 type: string
 *                 example: 'string'
 *               password:
 *                 type: string
 *                 example: 'string'
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
userRouter.post('/register', createUser)

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'string'
 *               password:
 *                 type: string
 *                 example: 'string'
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User login successful and a JWT token is returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 */
userRouter.post('/login', loginLimiter, loginUser)

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: string
 *                     username:
 *                       type: string
 *                       example: 'string'
 *                     email:
 *                       type: string
 *                       example: 'string'
 *                     role:
 *                        type: string
 *                        example: string
 *
 *     security:
 *       - bearerAuth: []
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
userRouter.get('/profile', authMiddleware, getProfile)

export default userRouter
