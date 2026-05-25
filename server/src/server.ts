import express from "express"
import cors from "cors"
import units from "./routes/units"
import jobs from "./routes/jobs"
import entries from "./routes/entries"

const app = express()

app.use(express.json())
app.use(cors())
app.use("/units", units)
app.use("/jobs", jobs)
app.use("/entries", entries)

app.get("/", (req, res) => {
  res.json({
    is_success: true,
    message: "Hello world",
  })
})

export default app
