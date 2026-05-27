import { Router } from "express"
import { body, param, query } from "express-validator"
import { UniqueConstraintError, type Transaction } from "sequelize"
import { Job, sequelize, Unit } from "../db"
import { validate } from "../middlewares/validate"

const router = Router()

type JobWithUnits = typeof Job.prototype & {
  addUnit: (unit: typeof Unit.prototype) => Promise<void>
  addUnits: (
    units: Array<typeof Unit.prototype>,
    options?: { transaction?: Transaction },
  ) => Promise<void>
  removeUnits: (
    units: Array<typeof Unit.prototype>,
    options?: { transaction?: Transaction },
  ) => Promise<void>
}

const findUnitsByIds = async (unitIds: number[]) => {
  const uniqueUnitIds = [...new Set(unitIds)]
  const units = await Unit.findAll({
    where: {
      id: uniqueUnitIds,
    },
    attributes: ["id", "name"],
  })

  return {
    units,
    missingUnitIds: uniqueUnitIds.filter(
      (unitId) => !units.some((unit) => unit.id === unitId),
    ),
  }
}

router.post(
  "/",
  validate([
    body("name", "Необходимо указать название работ")
      .isString()
      .isLength({ min: 1 })
      .trim()
      .escape(),
    body("unit_ids", "Необходимо добавить хотя бы одну меру измерения").isArray(
      { min: 1 },
    ),
  ]),
  async (req, res) => {
    const { name } = req.body
    const unitIds = req.body.unit_ids.map(Number)

    const transaction = await sequelize.transaction()

    try {
      const { units, missingUnitIds } = await findUnitsByIds(unitIds)

      if (missingUnitIds.length > 0) {
        await transaction.rollback()
        return res.status(404).json({
          is_success: false,
          errors: [
            [
              "unit_ids",
              `Не найдены меры измерения со следующими id: ${missingUnitIds.join(", ")}`,
            ],
          ],
        })
      }

      const job = await Job.create({ name }, { transaction })
      await (job as JobWithUnits).addUnits(units, { transaction })
      await transaction.commit()

      return res.status(201).json({
        is_success: true,
        data: {
          id: job.id,
          name: job.name,
          units,
        },
      })
    } catch (error) {
      await transaction.rollback()
      console.error("Failed to create job:", error)
      if (error instanceof UniqueConstraintError) {
        return res.status(409).json({
          is_success: false,
          errors: [["name", "Название вида работы должно быть уникальным"]],
        })
      }
      return res.status(500).json({
        is_success: false,
        errors: [["server", "Не удалось создать новый вид работ"]],
      })
    }
  },
)

router.get("/", async (req, res) => {
  try {
    const { count, rows } = await Job.findAndCountAll({
      attributes: ["id", "name"],
      distinct: true,
      include: [
        {
          model: Unit,
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
      order: [["name", "ASC"]],
    })

    return res.json({
      is_success: true,
      data: rows,
    })
  } catch (error) {
    console.error("Failed to fetch jobs:", error)
    return res.status(500).json({
      is_success: false,
      errors: [["server", "Не удалось загрузить список видов работ"]],
    })
  }
})

router.put(
  "/:job_id",
  validate([
    param(
      "job_id",
      "Параметр job_id должен быть целым положительным числом",
    ).isInt({ min: 1 }),
    body("name", "Название работы должно быть непустой строкой")
      .optional()
      .isString()
      .isLength({ min: 1 })
      .escape(),
    body(
      "units",
      "Поле units должно содержать объект с опциональными параметрами added и removed",
    )
      .optional()
      .isObject(),
    body(
      "units.added",
      "Массив units.added должен содержать набор целых положительных чисел",
    )
      .optional()
      .isArray(),
    body(
      "units.added.*",
      "Массив units.added должен содержать набор целых положительных чисел",
    )
      .optional()
      .isInt({ min: 1 }),
    body(
      "units.removed",
      "Массив units.removed должен содержать набор целых положительных чисел",
    )
      .optional()
      .isArray(),
    body(
      "units.removed.*",
      "Массив units.removed должен содержать набор целых положительных чисел",
    )
      .optional()
      .isInt({ min: 1 }),
  ]),
  async (req, res) => {
    const jobId = Number(req.params.job_id)
    const addedUnitIds = (req.body.units?.added ?? []).map(Number)
    const removedUnitIds = (req.body.units?.removed ?? []).map(Number)
    const hasName = Object.prototype.hasOwnProperty.call(req.body, "name")
    const hasUnitChanges = addedUnitIds.length > 0 || removedUnitIds.length > 0

    if (!hasName && !hasUnitChanges) {
      return res.status(400).json({
        is_success: false,
        errors: [["body", "Необходимо указать значения для изменения"]],
      })
    }

    const transaction = await sequelize.transaction()

    try {
      const job = await Job.findByPk(jobId, { transaction })

      if (!job) {
        await transaction.rollback()
        return res.status(404).json({
          is_success: false,
          errors: [["job_id", "Вид работ не найден"]],
        })
      }

      const unitIds = [...addedUnitIds, ...removedUnitIds]
      const { units, missingUnitIds } = await findUnitsByIds(unitIds)

      if (missingUnitIds.length > 0) {
        await transaction.rollback()
        return res.status(404).json({
          is_success: false,
          errors: [
            [
              "unit",
              `Не найдены меры измерения со следующими id: ${missingUnitIds.join(", ")}`,
            ],
          ],
        })
      }

      if (hasName) {
        job.name = req.body.name
        await job.save({ transaction })
      }

      const addedUnits = units.filter((unit) => addedUnitIds.includes(unit.id))
      const removedUnits = units.filter((unit) =>
        removedUnitIds.includes(unit.id),
      )

      if (addedUnits.length > 0) {
        await (job as JobWithUnits).addUnits(addedUnits, { transaction })
      }

      if (removedUnits.length > 0) {
        await (job as JobWithUnits).removeUnits(removedUnits, { transaction })
      }

      const updatedJob = await Job.findByPk(jobId, {
        attributes: ["id", "name"],
        include: [
          {
            model: Unit,
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
          },
        ],
        transaction,
      })

      await transaction.commit()

      return res.json({
        is_success: true,
        data: updatedJob,
      })
    } catch (error) {
      await transaction.rollback()
      console.error("Failed to update job:", error)
      if (error instanceof UniqueConstraintError) {
        return res.status(409).json({
          is_success: false,
          errors: [["name", "Название вида работы должно быть уникальным"]],
        })
      }
      return res.status(500).json({
        is_success: false,
        errors: [["server", "Не удалось изменить вид работ"]],
      })
    }
  },
)

export default router
