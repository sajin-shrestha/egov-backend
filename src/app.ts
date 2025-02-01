import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import globalErrorHandler from './middlewares/globalErrorHandler'
import userRouter from './user/userRouter'
import path from 'path'

const app = express()
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
app.use('/api/users', userRouter)

// Global error-handler middleware
app.use(globalErrorHandler)

export default app
