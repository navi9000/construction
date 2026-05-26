import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { jobsApi } from "@/entities/job"
import { unitsApi } from "@/entities/unit"

const reducer = combineReducers({
  [jobsApi.reducerPath]: jobsApi.reducer,
  [unitsApi.reducerPath]: unitsApi.reducer,
})

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jobsApi.middleware, unitsApi.middleware),
})

export default store
