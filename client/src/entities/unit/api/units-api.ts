import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  SuccessfulApiResponse,
  SuccessfulApiResponseWithMeta,
} from "@/shared/api/model/schema"
import {
  CreateUnitParams,
  GetUnitsResponse,
  UnitServerModel,
} from "../model/schema"

export const unitsApi = createApi({
  reducerPath: "units",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000" + "/units",
  }),
  tagTypes: ["units"],
  endpoints: (builder) => ({
    getUnits: builder.query<GetUnitsResponse, {}>({
      query: () => ({
        url: "",
      }),
      transformResponse: (
        response: SuccessfulApiResponseWithMeta<UnitServerModel[]>,
      ) => ({
        optionList: response.data.map((unit) => ({
          label: unit.name,
          value: unit.id.toString(),
        })),
      }),
      providesTags: ["units"],
    }),
    addUnit: builder.mutation<UnitServerModel, CreateUnitParams>({
      query: ({ name }) => ({
        url: `/`,
        method: "POST",
        body: {
          name,
        },
      }),
      transformResponse: (response: SuccessfulApiResponse<UnitServerModel>) =>
        response.data,
      async onQueryStarted({ name }, { dispatch, queryFulfilled, requestId }) {
        const optimisticValue = `optimistic-${requestId}`
        const patchResult = dispatch(
          unitsApi.util.updateQueryData("getUnits", {}, (draft) => {
            const alreadyExists = draft.optionList.some(
              (unit) => unit.label.toLowerCase() === name.toLowerCase(),
            )

            if (!alreadyExists) {
              draft.optionList.push({
                label: name,
                value: optimisticValue,
              })
            }
          }),
        )

        try {
          const { data } = await queryFulfilled

          dispatch(
            unitsApi.util.updateQueryData("getUnits", {}, (draft) => {
              const optimisticUnit = draft.optionList.find(
                (unit) => unit.value === optimisticValue,
              )

              if (optimisticUnit) {
                optimisticUnit.label = data.name
                optimisticUnit.value = data.id.toString()
                return
              }

              const alreadyExists = draft.optionList.some(
                (unit) => unit.value === data.id.toString(),
              )

              if (!alreadyExists) {
                draft.optionList.push({
                  label: data.name,
                  value: data.id.toString(),
                })
              }
            }),
          )
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ["units"],
    }),
  }),
})

export const { useGetUnitsQuery, useAddUnitMutation } = unitsApi
