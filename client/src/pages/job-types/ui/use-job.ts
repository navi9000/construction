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
  const [addJob, { error: addJobError }] = useAddJobMutation()
  const [updateJob, { error: updateJobError }] = useUpdateJobMutation()
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

  const jobErrors = useMemo(() => {
    if (addJobError) {
      return getErrors(addJobError)
    }
    if (updateJobError) {
      return getErrors(updateJobError)
    }
  }, [addJobError, updateJobError])

  return {
    addJob,
    updateJob,
    jobErrors,
    name,
    setName,
  }
}
