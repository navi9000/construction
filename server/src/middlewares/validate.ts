import { ContextRunner } from "express-validator"
import { Request, Response, NextFunction } from "express"

export const validate = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      const result = await validation.run(req)
      if (!result.isEmpty()) {
        return res.status(400).json({
          is_success: false,
          errors: result
            .array()
            .map((error) => [
              (error as { path: string })?.path ?? "unknown",
              error.msg,
            ]),
        })
      }
    }

    next()
  }
}
