import express, { Application } from 'express'
import cors from 'cors'
import config from './config'
import cookieParser from 'cookie-parser'
import { notFound } from './middlewares/notFound'
import { userRoutes } from './modules/user/user.route'
import { globalErrorHandler } from './middlewares/globalErrorHandler'

const app: Application = express()

app.use(cors({
    origin: config.app_url,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello FixItNow!')
})

app.use("/api/users", userRoutes)

app.use(notFound)

app.use(globalErrorHandler)


export default app