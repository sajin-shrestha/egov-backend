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
  apis: ['./src/user/userRouter.ts'], // Adjust if your route files are in a different path
}

// Generate swagger spec
const swaggerSpec = swaggerJSDoc(swaggerOptions)
const CSS_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css'

// Serve Swagger docs at `/api-docs`
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss:
      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL,
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
