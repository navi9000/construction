import { JobTableEntry } from "@/entities/job"
import {
  useAddUnitMutation,
  useGetUnitsQuery,
  type UnitOption,
} from "@/entities/unit"
import { useMemo, useState } from "react"

interface UseUnitsParams {
  job: JobTableEntry | null
}

export function useUnits({ job }: UseUnitsParams = { job: null }) {
  const { data } = useGetUnitsQuery()
  const [addUnit, { isLoading: isAddingUnit }] = useAddUnitMutation()

  const [selectedUnits, setSelectedUnits] = useState<UnitOption[]>([])
  const [unitSearch, setUnitSearch] = useState("")
  const [jobId, setJobId] = useState<number | null>(null)

  if (job && job.id !== jobId) {
    setJobId(job.id)
    setSelectedUnits(
      job.units.map((unit) => ({
        label: unit.name,
        value: unit.id.toString(),
      })),
    )
  }

  if (!job && jobId !== null) {
    setJobId(null)
    setSelectedUnits([])
  }

  const newUnitName = unitSearch.trim()

  const canAddUnit = useMemo(() => {
    const hasMatchingUnit = data?.optionList.some(
      (unit) => unit.label.toLowerCase() === newUnitName.toLowerCase(),
    )

    return newUnitName.length > 0 && !hasMatchingUnit
  }, [newUnitName, data])

  const handleAddUnit = async () => {
    if (!canAddUnit) {
      return
    }

    const createdUnit = await addUnit({ name: newUnitName }).unwrap()
    const createdUnitOption = {
      label: createdUnit.name,
      value: createdUnit.id.toString(),
    }

    setSelectedUnits((currentUnits) => {
      const alreadySelected = currentUnits.some(
        (unit) => unit.value === createdUnitOption.value,
      )

      return alreadySelected
        ? currentUnits
        : [...currentUnits, createdUnitOption]
    })
    setUnitSearch("")
  }

  return {
    optionList: data ? data.optionList : [],
    isAddingUnit,
    handleAddUnit,
    canAddUnit,
    newUnitName,
    selectedUnits,
    setSelectedUnits,
    unitSearch,
    setUnitSearch,
  }
}
