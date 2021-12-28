import "core-js/stable";
import "regenerator-runtime/runtime";
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {CssBaseline} from "@mui/material";

import { store } from "./store";
import {App} from "./containers/App";

import './styling.scss';

ReactDOM.render((
    <Provider store={store}>
      <>
        <CssBaseline />
        <App />
      </>
    </Provider>
  ), document.getElementById('root')
);
