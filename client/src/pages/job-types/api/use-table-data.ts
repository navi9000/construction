import { useGetJobsQuery } from "@/entities/job"

export function useTableData() {
  const { data, isLoading, isError } = useGetJobsQuery({})

  console.log({ data, isLoading, isError })

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
