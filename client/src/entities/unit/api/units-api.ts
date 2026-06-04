import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  SuccessfulApiResponse,
  SuccessfulApiResponseWithMeta,
} from "@/shared/api"
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
  keepUnusedDataFor: 1800,
  endpoints: (builder) => ({
    getUnits: builder.query<GetUnitsResponse, void>({
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
      invalidatesTags: ["units"],
    }),
  }),
})

export const { useGetUnitsQuery, useAddUnitMutation } = unitsApi
