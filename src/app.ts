import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import globalErrorHandler from './middlewares/globalErrorHandler'
import userRouter from './user/userRouter'
import path from 'path'

const app = express()

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'E-Governance API',
      version: '1.0.0',
      description: 'API documentation for the E-Governance backend',
    },
  },
  apis: ['./src/user/userRouter.ts'],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

// Serve Swagger UI with static assets
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: '/swagger.json', // Point to the correct URL of the Swagger JSON
    },
  }),
)

app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to egovernance - backend' })
})

app.use('/api/users', userRouter)

// Global error-handler middleware
app.use(globalErrorHandler)

// Serve static files from swagger-ui-dist
app.use(
  '/swagger-ui',
  express.static(path.join(require.resolve('swagger-ui-dist'), '../dist')),
)

// Export as Vercel serverless function
export default app
