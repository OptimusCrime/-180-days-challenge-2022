import {Dispatch} from "@reduxjs/toolkit";

import {http, httpOk, withAuth} from "./api";
import {EntriesApiResponse} from "./types";
import {workoutsFetchStart, workoutsFetchError, workoutsFetchSuccess  } from "./store/reducers/workoutsReducer";
import {setIsAuthenticated} from "./store/reducers/globalReducer";

export const getEntries = async (dispatch: Dispatch) => {
  dispatch(workoutsFetchStart());

  try {
    const response = await http<EntriesApiResponse>('/entries');
    dispatch(workoutsFetchSuccess(response.data));
  } catch (ex) {
    dispatch(workoutsFetchError());
  }
}

export const checkAuth = async (dispatch: Dispatch) => {
  try {
    const response = await httpOk('/auth', await withAuth());

    if (response) {
      dispatch(setIsAuthenticated());
    }
  }
  catch (ex) {
    // Woops
  }
}
