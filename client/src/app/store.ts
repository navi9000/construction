import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { jobsApi } from "@/entities/job"
import { unitsApi } from "@/entities/unit"
import { entriesApi } from "@/entities/entry"

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
