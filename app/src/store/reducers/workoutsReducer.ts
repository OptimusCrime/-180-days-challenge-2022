import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Entry, EntryApiResponse} from "../../types";

// This is so dumb
const createDateObject = (str: string): number => {
  const [date, time] = str.split( ' ');

  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute, second] = time.split(':').map(Number);

  return new Date(year, month - 1, day, hour, minute, second).getTime();
}

const mapEntry = (entry: EntryApiResponse): Entry => ({
  ...entry,
  added: createDateObject(entry.added)
})

interface WorkoutsState {
  loading: boolean;
  error: boolean;
  workouts: Entry[];
}

const initialState: WorkoutsState = {
  loading: true,
  error: false,
  workouts: [],
}

const workoutsReducer = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    workoutsFetchStart(state) {
      state.loading = true;
    },
    workoutsFetchError(state) {
      state.loading = false;
      state.error = true;
    },
    workoutsFetchSuccess(state, action: PayloadAction<EntryApiResponse[]>) {
      state.workouts = action.payload.map(mapEntry);
      state.loading = false;
    },
  },
});

export const { workoutsFetchStart, workoutsFetchError, workoutsFetchSuccess } = workoutsReducer.actions;
export default workoutsReducer.reducer;
