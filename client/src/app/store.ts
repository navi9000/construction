import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { jobsApi } from "@/entities/job/api/jobs-api"
import { unitsApi } from "@/entities/unit/api/units-api"
import { entriesApi } from "@/entities/entry/api/entries-api"

const reducer = combineReducers({
  [jobsApi.reducerPath]: jobsApi.reducer,
  [unitsApi.reducerPath]: unitsApi.reducer,
  [entriesApi.reducerPath]: entriesApi.reducer,
})

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      jobsApi.middleware,
      unitsApi.middleware,
      entriesApi.middleware,
    ),
})

export default store
