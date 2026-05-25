import { Router } from "express"
import { UniqueConstraintError } from "sequelize"
import { Unit } from "../db"
import { validate } from "../middlewares/validate"
import { body } from "express-validator"

const router = Router()

router.post(
  "/",
  validate([
    body("name", "Название меры измерения обязательно и должно быть строкой")
      .isString()
      .isLength({ min: 1 })
      .escape(),
  ]),
  async (req, res) => {
    const { name } = req.body

    try {
      const data = await Unit.create({ name })
      return res.status(201).json({
        is_success: true,
        data,
      })
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res.status(409).json({
          is_success: false,
          errors: [["name", "Название меры измерения должно быть уникальным"]],
        })
      }

      console.error("Failed to create unit:", error)
      return res.status(500).json({
        is_success: false,
        errors: [["server", "Не удалось добавить новую меру измерения"]],
      })
    }
  },
)

router.get("/", async (req, res) => {
  try {
    const units = await Unit.findAll({
      order: [["name", "ASC"]],
      attributes: ["id", "name"],
    })
    return res.json({
      is_success: true,
      data: units,
    })
  } catch (error) {
    console.error("Failed to fetch units:", error)
    return res.status(500).json({
      is_success: false,
      errors: [["server", "Не удалось загрузить меры измерения"]],
    })
  }
})

export default router
