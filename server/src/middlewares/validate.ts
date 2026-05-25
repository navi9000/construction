import { ContextRunner } from "express-validator"
import { Request, Response, NextFunction } from "express"

export const validate = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors = []

    for (const validation of validations) {
      const result = await validation.run(req)
      if (!result.isEmpty()) {
        errors.push(
          ...result
            .array()
            .map((error) => [
              (error as { path: string })?.path ?? "unknown",
              error.msg,
            ]),
        )
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        is_success: false,
        errors,
      })
    }

    next()
  }
}
