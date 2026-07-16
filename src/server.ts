import app from "./app"
import config from "./config"
import { prisma } from "./lib/prisma"

const port = config.port || 3000

const main = async () => {

    try {
        await prisma.$connect()

        console.log("FixItNow Database connected successfully")
        app.listen(port, () => {
            console.log(`FixItNow app listening on port ${port}`)
        })
    } catch (error) {
        console.log("Database connection failed", error)
        await prisma.$disconnect()
        process.exit(1)

    }

}

main()
