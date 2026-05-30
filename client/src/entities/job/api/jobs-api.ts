import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  CreateJobParams,
  GetJobsResponse,
  JobServerModel,
  JobTableEntry,
  UpdateJobParams,
} from "../model/schema"
import { SuccessfulApiResponse, transformErrorResponse } from "@/shared/api"

export const jobsApi = createApi({
  reducerPath: "jobs",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000" + "/jobs",
  }),
  tagTypes: ["jobs"],
  keepUnusedDataFor: 1800,
  endpoints: (builder) => ({
    getJobs: builder.query<GetJobsResponse, void>({
      query: () => ({
        url: "",
      }),
      transformResponse: (
        response: SuccessfulApiResponse<JobServerModel[]>,
      ) => ({
        jobList: response.data.map((item) => ({
          ...item,
          units: item.units,
          unitsStringified: item.units.map((unit) => unit.name).join("; "),
          key: item.id.toString(),
        })),
      }),
      providesTags: ["jobs"],
    }),
    addJob: builder.mutation<JobTableEntry, CreateJobParams>({
      query: ({ name, unit_ids }) => ({
        url: `/`,
        method: "POST",
        body: {
          name,
          unit_ids,
        },
      }),
      transformErrorResponse,
      invalidatesTags: ["jobs"],
    }),
    updateJob: builder.mutation<JobTableEntry, UpdateJobParams>({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      transformErrorResponse,
      invalidatesTags: ["jobs"],
    }),
  }),
})

export const { useGetJobsQuery, useAddJobMutation, useUpdateJobMutation } =
  jobsApi
