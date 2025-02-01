import express from 'express'
import globalErrorHandler from './middlewares/globalErrorHandler'
import userRouter from './user/userRouter'

const app = express()
app.use(express.json())

// routes
app.get('/', (req, res, next) => {
  res.json({ message: 'Welcome to egovernance - backend' })
})

app.use('/api/users', userRouter)

// global error-handler middleware
app.use(globalErrorHandler)

export default app
