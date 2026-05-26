import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { SuccessfulApiResponseWithMeta } from "@/shared/api/model/schema"
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
          data: {
            name,
          },
        },
      }),
      invalidatesTags: ["units"],
    }),
  }),
})

export const { useGetUnitsQuery, useAddUnitMutation } = unitsApi
