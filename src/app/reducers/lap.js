import {
    GET_LAPS_DATA_REQUEST, GET_LAPS_DATA_SUCCESS, GET_LAPS_DATA_FAIL,
    FIXED_LAP, RESET_STOPWATCH,
    RESET_REQUEST_STATUS,
} from './../constants';

const initialState = {
    //system field
    id: -1,
    time: 0,
    stopwatchId: -1,
    //custom fields
};
//---
export default function lap(state = initialState, action) {
    switch (action.type) {
        case GET_LAPS_DATA_SUCCESS:
        {
            return {...initialState,...state}
        }
        case FIXED_LAP:
        {
            return {
                ...state,
                id: action.id,
                time: action.time,
                stopwatchId: action.stopwatchId
            }
        }
        case RESET_STOPWATCH:
        {
            return {
                ...state,
                time: action.time,
                stopwatchId: action.stopwatchId
            }
        }
        case RESET_REQUEST_STATUS:
        {
            return {...state, requestStatus: 0}
        }
    }
    return state;
}