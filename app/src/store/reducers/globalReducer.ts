import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum Page {
  INFO,
  GRAPH,
  DONATIONS
}

interface GlobalState {
  showAuthModal: boolean;
  showEntryModal: boolean;
  isAuthenticated: boolean;
  authenticationStarted: boolean;
  authenticationFailed: boolean;
  authenticationFinished: boolean;
  page: Page;
}

const initialState: GlobalState = {
  showAuthModal: false,
  showEntryModal: false,
  isAuthenticated: false,
  authenticationStarted: false,
  authenticationFailed: false,
  authenticationFinished: false,
  page: Page.INFO
}

const globalReducer = createSlice({
  name: 'global',
  initialState,
  reducers: {
    toggleShowAuthModal(state) {
      state.showAuthModal = !state.showAuthModal;
    },
    toggleShowEntryModal(state) {
      state.showEntryModal = !state.showEntryModal;
    },
    authenticationStarted(state) {
      state.authenticationStarted = true;
      state.authenticationFailed = false;
      state.authenticationFinished = false;
    },
    authenticationFailed(state) {
      state.authenticationStarted = false;
      state.authenticationFailed = true;
    },
    authenticationFinished(state) {
      state.authenticationStarted = false;
      state.authenticationFinished = true;
      state.isAuthenticated = true;
      state.showAuthModal = false;
    },
    setIsAuthenticated(state) {
      state.isAuthenticated = true;
    },
    setPage(state, action: PayloadAction<Page>) {
      state.page = action.payload;
    }
  },
});

export const {
  toggleShowEntryModal,
  toggleShowAuthModal,
  authenticationStarted,
  authenticationFinished,
  authenticationFailed,
  setIsAuthenticated,
  setPage,
} = globalReducer.actions;
export default globalReducer.reducer;
