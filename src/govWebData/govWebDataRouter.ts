import express from 'express'
import {
  addGovWebData,
  editGovWebData,
  getAllGovWebData,
  getGovWebDataById,
} from './govWebDataController'
import auth from '../middlewares/auth'

const govWebDataRouter = express.Router()

/**
 * @swagger
 * /api/govt/gov-web-data:
 *   get:
 *     tags:
 *       - Government Data
 *     description: Retrieve all government web data
 *     responses:
 *       200:
 *         description: Successfully retrieved all government web data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       address:
 *                         type: string
 *                       website_url:
 *                         type: string
 *                       image_url:
 *                         type: string
 */
govWebDataRouter.get('/gov-web-data', getAllGovWebData)

/**
 * @swagger
 * /api/govt/gov-web-data/{id}:
 *   get:
 *     tags:
 *       - Government Data
 *     description: Retrieve government web data by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the government web data
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the government web data by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 address:
 *                   type: string
 *                 website_url:
 *                   type: string
 *                 image_url:
 *                   type: string
 */
govWebDataRouter.get('/gov-web-data/:id', getGovWebDataById)

/**
 * @swagger
 * /api/govt/gov-web-data:
 *   post:
 *     tags:
 *       - Government Data
 *     description: Add new government web data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'string'
 *               description:
 *                 type: string
 *                 example: 'string'
 *               address:
 *                 type: string
 *                 example: 'string'
 *               website_url:
 *                 type: string
 *                 example: 'string_url'
 *               image_url:
 *                 type: string
 *                 example: 'string_url'
 *             required:
 *               - name
 *               - description
 *               - address
 *               - website_url
 *     responses:
 *       201:
 *         description: Government data successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'New government data added successfully'
 */
govWebDataRouter.post('/gov-web-data', auth, addGovWebData)

/**
 * @swagger
 * /api/govt/gov-web-data:
 *   patch:
 *     tags:
 *       - Government Data
 *     description: Edit existing government web data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the government web data
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'string'
 *               description:
 *                 type: string
 *                 example: 'string'
 *               address:
 *                 type: string
 *                 example: 'string'
 *               website_url:
 *                 type: string
 *                 example: 'string_url'
 *               image_url:
 *                 type: string
 *                 example: 'string_url'
 *             required:
 *               - _id
 *               - name
 *               - description
 *               - address
 *               - website_url
 *     responses:
 *       200:
 *         description: Government data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Government data updated successfully'
 */
govWebDataRouter.patch('/gov-web-data/:id', auth, editGovWebData)

export default govWebDataRouter
