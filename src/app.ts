import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import globalErrorHandler from './middlewares/globalErrorHandler'
import userRouter from './user/userRouter'

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
// Serve Swagger docs at `/api-docs`
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(express.json())

// Routes
app.get('/', (req, res, next) => {
  res.json({ message: 'Welcome to egovernance - backend' })
})

app.use('/api/users', userRouter)

// Global error-handler middleware
app.use(globalErrorHandler)

export default app
