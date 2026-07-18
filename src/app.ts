import express, { Application } from 'express'
import cors from 'cors'
import config from './config'
import cookieParser from 'cookie-parser'
import { notFound } from './middlewares/notFound'
import { userRoutes } from './modules/user/user.route'
import { globalErrorHandler } from './middlewares/globalErrorHandler'
import { authRoutes } from './modules/auth/auth.route'
import { serviceRoutes } from './modules/service/service.route'
import { categoryRoutes } from './modules/category/category.route'
import { availabilityRoutes } from './modules/availability/availability.route'
import { bookingRoutes } from './modules/booking/booking.route'
import { paymentRoutes } from './modules/payment/payment.route'

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
app.use("/api/auth", authRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/availabilities", availabilityRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/payments", paymentRoutes)

app.use(notFound)

app.use(globalErrorHandler)


export default app