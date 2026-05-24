import server from "./server"
import { sequelize } from "./db"
import { SERVER_PORT } from "./config/constants"

async function run() {
  try {
    await sequelize.authenticate()
    console.log("Connection has been established successfully.")
    await sequelize.sync({
      force: true,
      alter: true,
      logging: false,
    })
    server.listen(SERVER_PORT, () => {
      console.log(`Server is running at http://localhost:${SERVER_PORT}`)
    })
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

run()
