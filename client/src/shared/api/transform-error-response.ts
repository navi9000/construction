import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { UnsuccessfulApiResponse } from "./schema"

export const transformErrorResponse = (response: FetchBaseQueryError) => {
  return {
    errors: (response.data as UnsuccessfulApiResponse).errors.reduce(
      (prev, curr) => ({ ...prev, [curr[0]]: curr[1] }),
      {},
    ),
  }
}
