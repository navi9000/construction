import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  CreateJobErrorResponse,
  CreateJobErrors,
  CreateJobParams,
  GetJobsResponse,
  JobServerModel,
  JobTableEntry,
  UpdateJobParams,
} from "../model/schema"
import { SuccessfulApiResponse, UnsuccessfulApiResponse } from "@/shared/api"

export const jobsApi = createApi({
  reducerPath: "jobs",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000" + "/jobs",
  }),
  tagTypes: ["jobs"],
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
      transformErrorResponse: (response): CreateJobErrorResponse => {
        return {
          errors: (response.data as UnsuccessfulApiResponse).errors.reduce(
            (prev, curr) => ({ ...prev, [curr[0]]: curr[1] }),
            {} as CreateJobErrors,
          ),
        }
      },
      invalidatesTags: ["jobs"],
    }),
    updateJob: builder.mutation<JobTableEntry, UpdateJobParams>({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      transformErrorResponse: (response): CreateJobErrorResponse => {
        return {
          errors: (response.data as UnsuccessfulApiResponse).errors.reduce(
            (prev, curr) => ({ ...prev, [curr[0]]: curr[1] }),
            {} as CreateJobErrors,
          ),
        }
      },
      invalidatesTags: ["jobs"],
    }),
  }),
})

export const { useGetJobsQuery, useAddJobMutation, useUpdateJobMutation } =
  jobsApi
