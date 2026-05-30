import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  SuccessfulApiResponseWithMeta,
  transformErrorResponse,
} from "@/shared/api"
import {
  CreateEntryParams,
  EntryServerModel,
  EntryTableEntry,
  GetEntriesParams,
  GetEntriesResponse,
  UpdateEntryParams,
} from "../model/schema"

export const entriesApi = createApi({
  reducerPath: "entries",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000" + "/entries",
  }),
  tagTypes: ["entries"],
  keepUnusedDataFor: 1800,
  endpoints: (builder) => ({
    getEntries: builder.query<GetEntriesResponse, GetEntriesParams>({
      query: (params) => ({
        url: "",
        params,
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
      transformErrorResponse,
      invalidatesTags: ["entries"],
    }),
    updateEntry: builder.mutation<EntryTableEntry, UpdateEntryParams>({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      transformErrorResponse,
      invalidatesTags: ["entries"],
    }),
    deleteEntry: builder.mutation<EntryTableEntry, number>({
      query: (id) => ({
        // url: `/${id}`,
        url: "/111",
        method: "DELETE",
      }),
      transformErrorResponse,
      invalidatesTags: ["entries"],
    }),
  }),
})

export const {
  useGetEntriesQuery,
  useAddEntryMutation,
  useUpdateEntryMutation,
  useDeleteEntryMutation,
} = entriesApi
