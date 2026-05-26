export interface UnitServerModel {
  id: number
  name: string
}

export interface UnitOption {
  label: string
  value: string
}

export interface GetUnitsResponse {
  optionList: UnitOption[]
}

export interface CreateUnitParams {
  name: string
}
