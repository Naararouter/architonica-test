import { createStore, applyMiddleware } from 'redux'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers';

import logger from 'redux-logger'
import thunk from 'redux-thunk'

export default function configureStore(initialState) {
  const bhMiddleware = routerMiddleware(browserHistory);
  const store = createStore(
      rootReducer,
      initialState,
      applyMiddleware(
          thunk,
          logger(),
          bhMiddleware
      ));
  return store
}

