import {
    ADD_NEW_OPEN, ADD_NEW_CLOSE, SET_CURRENT,
    GET_STOPWATCHED_DATA_REQUEST, GET_STOPWATCHED_DATA_SUCCESS, GET_STOPWATCHED_DATA_FAIL,
    GET_LAPS_DATA_REQUEST, GET_LAPS_DATA_SUCCESS, GET_LAPS_DATA_FAIL,
    TIME_UPDATE_STOPWATCH, SET_START_TIME_STOPWATCH,
    RESET_REQUEST_STATUS, ADD_NEW_RESET_REQUEST_STATUS,
    STOP_STOPWATCH, RESET_STOPWATCH, SET_NEW_BREAKPOINT, START_STOPWATCH, FIXED_LAP,
    ADD_NEW_TITLE_CHANGE, ADD_NEW_APPLY_REQUEST, ADD_NEW_APPLY_SUCCESS, ADD_NEW_APPLY_FAIL,
    DELETE_STOPWATCH_REQUEST, DELETE_STOPWATCH_SUCCESS, DELETE_STOPWATCH_FAIL,

} from './../constants';

import stopwatch from './stopwatch';

const initialState = {
    current: null,
    
    addNewOpened: false,
    addNewTitle: "",
    addNewRequestStatus: 0,
    
    stopwatchList: [],

    requestStatus: 0 // 0 - Initial, 1 - Loading, 2 - Success, 3 - Fail
};
//---
import { mapReducerChild } from './../helpers/OtherSupportFucntions';

export default function stopwatches(state = initialState, action) {
    const t = action.type;
    //------------------------------
    //---Stopwatches Data
    //------------------------------
    if(t == "@@router/LOCATION_CHANGE"){
        let id = action.payload.pathname.split('/')[2];
        return {...state, current: id}
    } else if (t == SET_CURRENT){
        return {...state, current: action.id}
    } else if (t == GET_STOPWATCHED_DATA_REQUEST) {
        return {...state, requestStatus: 1}
    }
    else if (t == GET_STOPWATCHED_DATA_SUCCESS) {
        return {...state, requestStatus: 2,
            stopwatchList: mapReducerChild(action.data,stopwatch, action)}
    }
    else if (t == GET_STOPWATCHED_DATA_FAIL) {
        return {...state, requestStatus: 3}
    }
    else if (t == RESET_REQUEST_STATUS) {
        return {...state, requestStatus: 0}
    }
    else if (t == ADD_NEW_OPEN) {
        return {...state, addNewOpened: true}
    }
    else if (t == ADD_NEW_CLOSE) {
        return {...state, addNewOpened: false}
    }
    else if (t == ADD_NEW_TITLE_CHANGE){
        return {...state, addNewTitle: action.val}
    }
    else if (t == ADD_NEW_APPLY_REQUEST) {
        return {...state, addNewRequestStatus: 1}
    }
    else if (t == ADD_NEW_APPLY_SUCCESS) {
        return {...state, addNewRequestStatus: 2, addNewTitle: ""}
    }
    else if (t == ADD_NEW_APPLY_FAIL) {
        return {...state, addNewRequestStatus: 3}
    }
    else if (t == ADD_NEW_RESET_REQUEST_STATUS) {
        return {...state, addNewRequestStatus: 0}
    }
    //------------------------------
    //---Laps Data
    //------------------------------
    else if (t == GET_LAPS_DATA_REQUEST || t == GET_LAPS_DATA_SUCCESS || t == GET_LAPS_DATA_FAIL
        || t == SET_START_TIME_STOPWATCH || t == STOP_STOPWATCH || t == START_STOPWATCH
        || t == FIXED_LAP || t == TIME_UPDATE_STOPWATCH || t == RESET_STOPWATCH
        || t == DELETE_STOPWATCH_FAIL || t == DELETE_STOPWATCH_REQUEST || t == DELETE_STOPWATCH_SUCCESS){
        return {
            ...state,
            stopwatchList: mapReducerChild(state.stopwatchList,stopwatch, action),
        }
    }
    return state;
}