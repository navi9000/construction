import { useGetEntriesQuery } from "@/entities/entry"

export function useTableData() {
  const { data, isLoading, isError } = useGetEntriesQuery({})

  return {
    pagination: {
      current: data?.meta.page,
      total: data?.meta.total_pages,
    },
    data,
    isLoading,
    isError,
  }
}
