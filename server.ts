import app from './src/app'
import { config } from './src/config/config'
import connectDB from './src/config/database'

const startServer = async () => {
  await connectDB()

  const port = config.port || 3000

  app.listen(port, () => {
    console.log(`listening on port: ${port}`)
  })
}

startServer()
