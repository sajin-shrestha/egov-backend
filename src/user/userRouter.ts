import express from 'express'
import { createUser, getProfile, loginUser } from './userController'

const userRouter = express.Router()

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
userRouter.post('/login', loginUser)

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
userRouter.get('/profile', getProfile)

export default userRouter
