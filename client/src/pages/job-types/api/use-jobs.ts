import { useGetJobsQuery } from "@/entities/job"

export function useJobs() {
  const { data, isLoading, isError } = useGetJobsQuery()

  return {
    isLoading,
    isError,
    jobList: data?.jobList,
  }
}
