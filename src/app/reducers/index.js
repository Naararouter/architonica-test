import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import stopwatches from './stopwatches';

const allReducers = combineReducers({
    stopwatches,
    routing: routerReducer
});

export default allReducers;