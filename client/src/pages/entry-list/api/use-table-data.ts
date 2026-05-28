import { useGetEntriesQuery, type GetEntriesParams } from "@/entities/entry"
import { Dayjs } from "dayjs"
import { useSearchParams } from "react-router"

export function useTableData() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = searchParams.get("page")
  const date = searchParams.get("date")
  const order = searchParams.get("order")
  const params: GetEntriesParams = {}
  if (page) {
    params.page = page
  }
  if (date) {
    params.date = date
  }
  if (order) {
    params.order = order
  }
  const { data, isLoading, isError } = useGetEntriesQuery(params)

  const sortButtonLabel =
    order === "ASC"
      ? "Сортировать по убыванию"
      : order === "DESC"
        ? "Сбросить сортировку"
        : "Сортировать по возрастанию"

  const setDate = (date: Dayjs | null) => {
    setSearchParams((prev) => {
      const params: GetEntriesParams = {}
      const order = prev.get("order")
      if (date) {
        params.date = date.format("YYYY-MM-DD")
      }
      if (order) {
        params.order = order
      }
      return params
    })
  }

  const setOrder = () => {
    setSearchParams((prev) => {
      const params: GetEntriesParams = {}
      const date = prev.get("date")
      if (date) {
        params.date = date
      }
      const prevOrder = prev.get("order")
      if (!prevOrder) {
        params.order = "ASC"
      } else if (prevOrder === "ASC") {
        params.order = "DESC"
      }
      return params
    })
  }

  return {
    pagination: {
      current: data?.meta.page,
      total: data?.meta.total_pages,
    },
    data,
    isLoading,
    isError,
    date,
    order,
    setDate,
    setOrder,
    sortButtonLabel,
  }
}
