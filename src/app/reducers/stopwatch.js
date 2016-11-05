import {
    ADD_NEW_OPEN, ADD_NEW_CLOSE, SET_CURRENT,
    GET_STOPWATCHED_DATA_REQUEST, GET_STOPWATCHED_DATA_SUCCESS, GET_STOPWATCHED_DATA_FAIL,
    GET_LAPS_DATA_REQUEST, GET_LAPS_DATA_SUCCESS, GET_LAPS_DATA_FAIL,
    TIME_UPDATE_STOPWATCH, SET_START_TIME_STOPWATCH,
    RESET_REQUEST_STATUS,
    STOP_STOPWATCH, RESET_STOPWATCH, SET_NEW_BREAKPOINT, START_STOPWATCH, FIXED_LAP,
    DELETE_STOPWATCH_REQUEST, DELETE_STOPWATCH_SUCCESS, DELETE_STOPWATCH_FAIL,
} from './../constants';

const initialState = {
    //system fields
    id: -1,
    time: 0,
    title: "Без названия",
    //custom fields
    deleteRequestStatus: 0,
    lapsList: [],
    beforeResetLapsListCount: null,
    lapsListRequestStatus: 0,
    
    absoluteStartTime: -1,
    relativeTimeLastBreakpoint: -1,
    enabled: false,
    resetedFlag: false,
    interval: null,
};
//---
import { mapReducerChild } from './../helpers/OtherSupportFucntions';
import lap from './lap';

export default function stopwatch(state = initialState, action) {
    switch (action.type) {
        //Stopwatch
        case GET_STOPWATCHED_DATA_SUCCESS:
        {
            return {...initialState,...state};
        }
        case FIXED_LAP:
        {
            if(state.id!=action.id){
                return state;
            }
            let lapsList = state.lapsList;
            let timeBreakpoint = state.relativeTimeLastBreakpoint;

            console.log('DEBUG #2: ',timeBreakpoint, state.time, state.lapsList.length);
            /*if(timeBreakpoint == -1 && state.time > 0 && lapsList.length > 0){
                timeBreakpoint = state.time;
            }*/
            if(timeBreakpoint == -1 && lapsList.length > 0){
                let temp = 0;
                for(let i = 0; i < lapsList.length; i++){
                    temp += lapsList[i].time;
                }
                console.log('LAPS LENGTH: ', temp);
                timeBreakpoint = temp;
            }

            let newId, maxId = 0;
            for(let i = 0; i < lapsList.length; i++){
                if(lapsList[i].id > maxId){
                    maxId = lapsList[i].id
                }
            }
            if(timeBreakpoint == -1)
                timeBreakpoint = 0;

            let newLap = lap(null,{
                id: maxId+1,
                type: action.type,
                stopwatchId: state.id,
                time: (state.time - timeBreakpoint) < 0 ? 0: (state.time - timeBreakpoint)
            });

            lapsList.push(newLap);

            return {
                ...state,
                relativeTimeLastBreakpoint: state.time,
                lapsList:  lapsList
            }
        }
        case RESET_STOPWATCH:
        {
            if(state.id!=action.id){
                return state;
            }
            let beforeResetLapsListCount = state.beforeResetLapsListCount;
            if(state.lapsList.length > 0){
                beforeResetLapsListCount = state.lapsList.length;
            }
            return {
                ...state,
                time: 0,
                lapsList: [],
                absoluteStartTime: (new Date()).getTime(),
                relativeTimeLastBreakpoint: 0,
                resetedFlag: true,
            }
        }
        case STOP_STOPWATCH:
        {
            if(!action.allFlag){
                if(state.id!=action.id){
                    return state;
                }
            }
            clearInterval(state.interval);
            return {
                ...state,
                //absoluteStartTime: -1,
                enabled: false,
                interval: null
            }
        }
        case START_STOPWATCH:
        {
            if(state.id!=action.id){
                return state;
            }
            let timeBreakpoint = state.relativeTimeLastBreakpoint;

            console.log('DEBUG #0: ',timeBreakpoint, state.time, state.lapsList.length);
            if(timeBreakpoint == -1 && state.time > 0 && state.lapsList.length > 0){
                console.log('DEBUG #1: ',timeBreakpoint, state.time, state.lapsList.length);
                timeBreakpoint = state.time;
            }
            return {
                ...state,
                enabled: true,
                absoluteStartTime: action.absoluteStartTime,
                //relativeStartTime: 0,
                relativeTimeLastBreakpoint: timeBreakpoint,
                interval: setInterval(action.interval.bind(this,state.id),27)
            }
        }
        case TIME_UPDATE_STOPWATCH:
        {
            if(state.id!=action.id){
                return state;
            }
            return {
                ...state,
                time: (new Date()).getTime() - state.absoluteStartTime
            }
        }
        case DELETE_STOPWATCH_REQUEST:
        {
            if(state.id!=action.id){
                return state;
            }
            return {
                ...state,
                deleteRequestStatus: 1
            }
        }
        case DELETE_STOPWATCH_SUCCESS:
        {
            if(state.id!=action.id){
                return state;
            }
            return {
                ...state,
                deleteRequestStatus: 2
            }
        }
        case DELETE_STOPWATCH_FAIL:
        {
            if(state.id!=action.id){
                return state;
            }
            return {
                ...state,
                deleteRequestStatus: 3
            }
        }
        //Laps
        case GET_LAPS_DATA_REQUEST:
        {
            if(state.id!=action.id){
                return state;
            }
            return {...state, lapsListRequestStatus: 1}
        }
        case GET_LAPS_DATA_SUCCESS:
        {
            if(state.id!=action.id){
                return state;
            }
            return {...state, lapsListRequestStatus: 2, lapsList: mapReducerChild(action.data, lap, action)}
        }
        case GET_LAPS_DATA_FAIL:
        {
            if(state.id!=action.id){
                return state;
            }
            return {...state, lapsListRequestStatus: 3}
        }
        case RESET_REQUEST_STATUS:
        {
            if(state.id!=action.id){
                return state;
            }
            return {...state, lapsListRequestStatus: 0}
        }
    }
    return state;
}