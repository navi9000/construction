import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
// import {
//   CreateJobErrorResponse,
//   CreateJobErrors,
//   CreateJobParams,
//   GetJobsResponse,
//   JobServerModel,
//   JobTableEntry,
//   UpdateJobParams,
// } from "../model/schema"
import {
  SuccessfulApiResponseWithMeta,
  UnsuccessfulApiResponse,
} from "@/shared/api/model/schema"
import {
  CreateEntryErrorResponse,
  CreateEntryErrors,
  CreateEntryParams,
  EntryServerModel,
  EntryTableEntry,
  GetEntriesResponse,
  UpdateEntryParams,
} from "../model/schema"

export const entriesApi = createApi({
  reducerPath: "entries",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000" + "/entries",
  }),
  tagTypes: ["entries"],
  endpoints: (builder) => ({
    getEntries: builder.query<GetEntriesResponse, {}>({
      query: () => ({
        url: "",
      }),
      transformResponse: (
        response: SuccessfulApiResponseWithMeta<EntryServerModel[]>,
      ) => ({
        entryList: response.data.map((item) => ({
          ...item,
          key: item.id.toString(),
          jobStringified: item.job.name,
          unitStringified: item.unit.name,
        })),
        meta: response.meta,
      }),
      providesTags: ["entries"],
    }),
    addEntry: builder.mutation<EntryTableEntry, CreateEntryParams>({
      query: (body) => ({
        url: `/`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response): CreateEntryErrorResponse => {
        return {
          errors: (response.data as UnsuccessfulApiResponse).errors.reduce(
            (prev, curr) => ({ ...prev, [curr[0]]: curr[1] }),
            {} as CreateEntryErrors,
          ),
        }
      },
      invalidatesTags: ["entries"],
    }),
    updateEntry: builder.mutation<EntryTableEntry, UpdateEntryParams>({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      transformErrorResponse: (response): CreateEntryErrorResponse => {
        return {
          errors: (response.data as UnsuccessfulApiResponse).errors.reduce(
            (prev, curr) => ({ ...prev, [curr[0]]: curr[1] }),
            {} as CreateEntryErrors,
          ),
        }
      },
      invalidatesTags: ["entries"],
    }),
  }),
})

export const {
  useGetEntriesQuery,
  useAddEntryMutation,
  useUpdateEntryMutation,
} = entriesApi
