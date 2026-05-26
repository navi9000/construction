export interface ApiMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export type ApiErrorMessage = [key: string, message: string]

export interface SuccessfulApiResponse<T> {
  is_success: true
  data: T
}

export interface SuccessfulApiResponseWithMeta<T> {
  is_success: true
  data: T
  meta: ApiMeta
}

export interface UnsuccessfulApiResponse {
  is_success: false
  errors: ApiErrorMessage[]
}

export type ApiResponse<T> = SuccessfulApiResponse<T> | UnsuccessfulApiResponse

export type ApiResponseWithMeta<T> =
  | SuccessfulApiResponseWithMeta<T>
  | UnsuccessfulApiResponse
