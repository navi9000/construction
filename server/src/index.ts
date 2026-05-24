import express from "express"

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.get("/api", (_req, res) => {
  res.json({ message: "Hello from Express!" })
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
