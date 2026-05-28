import { useGetJobsQuery } from "@/entities/job"

export function useTableData() {
  const { data, isLoading, isError } = useGetJobsQuery()

  return {
    data,
    isLoading,
    isError,
  }
}
