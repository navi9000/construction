import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  CreateJobParams,
  GetJobsResponse,
  JobServerModel,
  JobTableEntry,
} from "../model/schema"
import { SuccessfulApiResponseWithMeta } from "@/shared/api/model/schema"

export const jobsApi = createApi({
  reducerPath: "jobs",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000" + "/jobs",
  }),
  tagTypes: ["jobs"],
  endpoints: (builder) => ({
    getJobs: builder.query<GetJobsResponse, {}>({
      query: () => ({
        url: "",
      }),
      transformResponse: (
        response: SuccessfulApiResponseWithMeta<JobServerModel[]>,
      ) => ({
        jobList: response.data.map((item) => ({
          ...item,
          units: item.units,
          unitsStringified: item.units.map((unit) => unit.name).join("; "),
          key: item.id.toString(),
        })),
        meta: response.meta,
      }),
      providesTags: ["jobs"],
    }),
    addJob: builder.mutation<JobTableEntry, CreateJobParams>({
      query: ({ name, unit_ids }) => ({
        url: `/`,
        method: "POST",
        body: {
          data: {
            name,
            unit_ids,
          },
        },
      }),
      invalidatesTags: ["jobs"],
    }),
  }),
})

export const { useGetJobsQuery, useAddJobMutation } = jobsApi
