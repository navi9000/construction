import {
  CreateJobErrors,
  useAddJobMutation,
  useUpdateJobMutation,
  type JobTableEntry,
} from "@/entities/job"
import { useMemo, useState } from "react"

interface UseJobParams {
  job: JobTableEntry | null
}

const getErrors = (error: unknown): CreateJobErrors | undefined => {
  if (!error || typeof error !== "object" || !("errors" in error)) {
    return undefined
  }

  return error.errors as CreateJobErrors
}

export function useJob({ job }: UseJobParams = { job: null }) {
  const [addJob, { isLoading: isAddingJob, error: addJobError }] =
    useAddJobMutation()

  const [updateJob, { isLoading: isUpdatingJob, error: updateJobError }] =
    useUpdateJobMutation()
  const [name, setName] = useState("")
  const [jobId, setJobId] = useState<number | null>(null)

  if (job && job.id !== jobId) {
    setJobId(job.id)
    setName(job.name)
  }

  if (!job && jobId !== null) {
    setJobId(null)
    setName("")
  }

  const addJobErrors = useMemo(() => {
    return getErrors(addJobError)
  }, [addJobError])

  const updateJobErrors = useMemo(() => {
    return getErrors(updateJobError)
  }, [updateJobError])

  return {
    addJob,
    isAddingJob,
    addJobErrors,
    updateJob,
    isUpdatingJob,
    updateJobErrors,
    name,
    setName,
  }
}
