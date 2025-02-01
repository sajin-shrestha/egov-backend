import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import globalErrorHandler from './middlewares/globalErrorHandler'
import userRouter from './user/userRouter'

const app = express()
app.use(express.json())

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

// Generate swagger spec
const swaggerSpec = swaggerJSDoc(swaggerOptions)

// Serve Swagger docs at `/api-docs`
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: '/api-docs/swagger.json', // Ensure this points to the correct swagger spec
    },
  }),
)

// Routes
app.use('/api/users', userRouter)

// Global error-handler middleware
app.use(globalErrorHandler)

export default app
