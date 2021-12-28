import { configureStore } from '@reduxjs/toolkit';

import globalReducer from "./reducers/globalReducer";
import workoutsReducer from "./reducers/workoutsReducer";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    workouts: workoutsReducer,
  },
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
