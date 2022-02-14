import React, {useEffect} from 'react';
import {MenuContainer} from "./MenuContainer";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {AuthModalContainer} from "./AuthModalContainer";
import {EntryModalContainer} from "./EntryModalContainer";
import {Page} from "../store/reducers/globalReducer";
import {GraphContainer} from "./GraphContainer";
import {InfoContainer} from "./InfoContainer";
import {checkAuth, getEntries} from "../actions";
import {DonationsContainer} from "./DonationsContainer";

export const App = () => {
  const { showAuthModal, showEntryModal, page } = useAppSelector(state => state.global);
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkAuth(dispatch);
    getEntries(dispatch);
  }, []);

  const renderMainContent = (currentPage: Page) => {
    switch (currentPage) {
      case Page.GRAPH:
        return (
          <GraphContainer />
        );
      case Page.DONATIONS:
        return (
          <DonationsContainer />
        );
      case Page.INFO:
      default:
        return (
          <InfoContainer />
        );
    }
  }

  return (
    <div>
      <MenuContainer />
      {showAuthModal && (
        <AuthModalContainer />
      )}
      {showEntryModal && (
        <EntryModalContainer />
      )}
      {renderMainContent(page)}
    </div>
  );
}
