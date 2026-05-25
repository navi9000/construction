import { Router } from "express"
import { body, param, query } from "express-validator"
import { Entry, Job, Unit } from "../db"
import { validate } from "../middlewares/validate"

const router = Router()

router.post(
  "/",
  validate([
    body("date", "Укажите дату").isString().notEmpty().trim().escape(),
    body("amount", "Укажите количество").isNumeric(),
    body("unit_id", "Выберите единицу измерения").isInt({ min: 1 }),
    body("job_id", "Выберите вид работ").isInt({ min: 1 }),
    body("worker_name", "Укажите ФИО исполнителя")
      .isString()
      .notEmpty()
      .trim()
      .escape(),
  ]),
  async (req, res) => {
    const entryData = {
      date: req.body.date,
      amount: Number(req.body.amount),
      unit_id: Number(req.body.unit_id),
      job_id: Number(req.body.job_id),
      worker_name: req.body.worker_name,
    }

    try {
      const [job, unit] = await Promise.all([
        Job.findByPk(entryData.job_id),
        Unit.findByPk(entryData.unit_id),
      ])

      if (!job) {
        return res.status(404).json({
          is_success: false,
          errors: [["job_id", "Вид работ не найден"]],
        })
      }

      if (!unit) {
        return res.status(404).json({
          is_success: false,
          errors: [["unit_id", "Единица измерения не найдена"]],
        })
      }

      const {
        dataValues: { job_id, unit_id, ...data },
      } = await Entry.create(entryData)

      return res.status(201).json({
        is_success: true,
        data: {
          ...data,
          job,
          unit,
        },
      })
    } catch (error) {
      console.error("Failed to create entry:", error)
      return res.status(500).json({
        is_success: false,
        errors: [["server", "Не удалось создать новую запись"]],
      })
    }
  },
)

router.get(
  "/",
  validate([
    query("page", "Параметр page должен быть целым положительным числом")
      .optional()
      .isInt({ min: 1 })
      .escape(),
  ]),
  async (req, res) => {
    const page = Number(req.query.page ?? 1)
    const limit = 10
    const offset = (page - 1) * limit

    try {
      const { count, rows } = await Entry.findAndCountAll({
        attributes: ["id", "date", "amount", "worker_name"],
        include: [
          {
            model: Job,
            attributes: ["id", "name"],
          },
          { model: Unit, attributes: ["id", "name"] },
        ],
        limit,
        offset,
        order: [["id", "DESC"]],
      })

      return res.json({
        is_success: true,
        data: rows,
        meta: {
          page,
          per_page: limit,
          total: count,
          total_pages: Math.ceil(count / limit),
        },
      })
    } catch (error) {
      console.error("Failed to fetch entries:", error)
      return res.status(500).json({
        is_success: false,
        errors: [["server", "Не удалось получить список записей"]],
      })
    }
  },
)

router.put(
  "/:entry_id",
  validate([
    param("entry_id", "Неверный формат параметра entry_id").isInt({ min: 1 }),
    body("date", "Неверный формат даты")
      .optional()
      .isString()
      .isLength({ min: 1 })
      .trim()
      .escape(),
    body("amount", "Укажите количество").optional().isNumeric(),
    body("unit_id", "Выберите единицу измерения").optional().isInt({ min: 1 }),
    body("job_id", "Выберите вид работ").optional().isInt({ min: 1 }),
    body("worker_name", "Укажите ФИО исполнителя")
      .optional()
      .isString()
      .isLength({ min: 1 })
      .trim()
      .escape(),
  ]),
  async (req, res) => {
    const entryId = Number(req.params.entry_id)
    const updateData: Partial<{
      date: string
      amount: number
      unit_id: number
      job_id: number
      worker_name: string
    }> = {}

    ;(["date", "worker_name"] as const).forEach((field) => {
      if (Object.keys(req.body).includes(field)) {
        updateData[field] = req.body[field]
      }
    })
    ;(["amount", "unit_id", "job_id"] as const).forEach((field) => {
      if (Object.keys(req.body).includes(field)) {
        updateData[field] = Number(req.body[field])
      }
    })

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        is_success: false,
        errors: [["body", "Необходимо изменить хотя бы одно значение"]],
      })
    }

    try {
      const entry = await Entry.findByPk(entryId)

      if (!entry) {
        return res.status(404).json({
          is_success: false,
          errors: [["entry_id", "Запись не найдена"]],
        })
      }

      const [job, unit] = await Promise.all([
        updateData?.job_id
          ? Job.findByPk(updateData.job_id)
          : Promise.resolve(true),
        updateData?.unit_id
          ? Unit.findByPk(updateData.unit_id)
          : Promise.resolve(true),
      ])

      if (!job) {
        return res.status(404).json({
          is_success: false,
          errors: [["job_id", "Вид работ не найден"]],
        })
      }

      if (!unit) {
        return res.status(404).json({
          is_success: false,
          errors: [["unit_id", "Единица измерения не найдена"]],
        })
      }

      const {
        dataValues: { job_id, unit_id, ...rest },
      } = await entry.update(updateData)

      const data = {
        ...rest,
        ...(typeof job === "boolean" ? {} : { job }),
        ...(typeof unit === "boolean" ? {} : { unit }),
      }

      return res.json({
        is_success: true,
        data,
      })
    } catch (error) {
      console.error("Failed to update entry:", error)
      return res.status(500).json({
        is_success: false,
        errors: [["server", "Не удалось обновить запись"]],
      })
    }
  },
)

router.delete(
  "/:entry_id",
  validate([
    param("entry_id", "Неверный формат параметра entry_id").isInt({ min: 1 }),
  ]),
  async (req, res) => {
    const entryId = Number(req.params.entry_id)

    try {
      const entry = await Entry.findByPk(entryId)

      if (!entry) {
        return res.status(404).json({
          is_success: false,
          errors: [["entry_id", "Запись не найдена"]],
        })
      }

      await entry.destroy()

      return res.json({
        is_success: true,
        data: {
          id: entryId,
        },
      })
    } catch (error) {
      console.error("Failed to delete entry:", error)
      return res.status(500).json({
        is_success: false,
        errors: [["server", "Не удалось удалить запись"]],
      })
    }
  },
)

export default router
