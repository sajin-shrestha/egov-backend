import express from 'express'
import authMiddleware from '../middlewares/auth'
import {
  fileComplain,
  getComplains,
  updateComplain,
  deleteComplain,
  getComplainById,
  updateComplainStatus,
} from './complainController'
import { uploadMiddleware } from '../middlewares/upload'

const complainRouter = express.Router()

/**
 * @swagger
 * /api/file/complain:
 *   post:
 *     tags:
 *       - Complain
 *     description: File a new complain
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: 'string'
 *               description:
 *                 type: string
 *                 example: 'string'
 *               category:
 *                 type: string
 *                 example: 'string'
 *               image:
 *                 type: string
 *                 format: binary
 *                 example: 'image_file'
 *     responses:
 *       201:
 *         description: Successfully filed a complain
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
complainRouter.post(
  '/complain',
  authMiddleware,
  uploadMiddleware('complains').single('image'),
  fileComplain,
)

/**
 * @swagger
 * /api/file/complain:
 *   get:
 *     tags:
 *       - Complain
 *     description: Retrieve all complains (Users see their own, Admins see all)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all complains
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 complains:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       subject:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *                       status:
 *                         type: string
 *                       image:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 */
complainRouter.get('/complain', authMiddleware, getComplains)

/**
 * @swagger
 * /api/file/complain/{id}:
 *   get:
 *     tags:
 *       - Complain
 *     description: Retrieve a specific complain by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the complain to retrieve
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the complain by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 subject:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 status:
 *                   type: string
 *                 image:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
complainRouter.get('/complain/:id', authMiddleware, getComplainById)

/**
 * @swagger
 * /api/file/complain/{id}:
 *   patch:
 *     tags:
 *       - Complain
 *     description: Update a complain (Only owner can update their complain)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the complain to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: 'string'
 *               description:
 *                 type: string
 *                 example: 'string'
 *               category:
 *                 type: string
 *                 example: 'string'
 *               image:
 *                 type: file
 *                 example: 'file'
 *               status:
 *                 type: string
 *                 example: 'string'
 *                 description: New status of the complain (Only Admins can change status)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully edited a complain
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
complainRouter.patch(
  '/complain/:id',
  authMiddleware,
  uploadMiddleware('complains').single('image'),
  updateComplain,
)

/**
 * @swagger
 * /api/file/complain/{id}:
 *   delete:
 *     tags:
 *       - Complain
 *     description: Delete a complain (Users delete their own, Admins delete any)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the complain to delete
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted the complain
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
complainRouter.delete('/complain/:id', authMiddleware, deleteComplain)

/**
 * @swagger
 * /api/file/complain/status/{id}:
 *   patch:
 *     tags:
 *       - Complain
 *     description: Update status of complain (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the complain to update
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully updated the status of complain
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
complainRouter.patch(
  '/complain/status/:id',
  authMiddleware,
  updateComplainStatus,
)

export default complainRouter
