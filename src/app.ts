import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import path from 'path'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import globalErrorHandler from './middlewares/globalErrorHandler'
import userRouter from './user/userRouter'
import govWebDataRouter from './govWebData/govWebDataRouter'
import logger from './config/logger'
import complainRouter from './complain/complainRouter'
import createHttpError from 'http-errors'
import { HttpStatusCodes } from './constants'

const app = express()

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50,
  legacyHeaders: true,
  standardHeaders: true,
  handler: (req, res, next) => {
    next(
      createHttpError(
        HttpStatusCodes.TO_MANY_REQUESTS,
        'Too many requests, please try again later.',
      ),
    )
  },
})

app.use(apiLimiter)

app.use(
  morgan('tiny', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
)

app.use(cors())
app.use(helmet())
app.use(express.json())

export const __swaggerDistPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'swagger-ui-dist',
)

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'E-Governance API',
      version: '1.0.0',
      description: 'API documentation for the E-Governance backend',
    },
    servers: [{ url: 'https://egov-backend.vercel.app' }],
  },
  apis: [
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '**', '*.js') // For Vercel (compiled JS)
      : path.join(__dirname, '**', '*.ts'), // For Local Development (TS files)
  ],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.get('/docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: '/docs/swagger.json',
    },
  }),
)

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'welcome to egovernance - backend' })
})
app.use('/api/file/', complainRouter)
app.use('/api/users', userRouter)
app.use('/api/govt/', govWebDataRouter)

// Global error-handler middleware
app.use(globalErrorHandler)

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`)
  process.exit(1)
})

export default app
