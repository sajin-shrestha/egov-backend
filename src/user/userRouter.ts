import express from 'express'
import { createUser, loginUser } from './userController'

const userRouter = express.Router()

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                  type: string
 *                  example: 'testuser'
 *               email:
 *                 type: string
 *                 example: 'john.doe@example.com'
 *               password:
 *                 type: string
 *                 example: 'password@123!'
 *             required:
 *               - username
 *               - email
 *               - password
 */
userRouter.post('/register', createUser)

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'john.doe@example.com'
 *               password:
 *                 type: string
 *                 example: 'password@123!'
 *             required:
 *               - email
 *               - password
 */
userRouter.post('/login', loginUser)

export default userRouter
