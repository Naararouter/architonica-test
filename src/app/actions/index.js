import {
    ADD_NEW_OPEN, ADD_NEW_CLOSE, SET_CURRENT,
    ADD_NEW_APPLY_REQUEST, ADD_NEW_APPLY_SUCCESS, ADD_NEW_APPLY_FAIL,
    GET_STOPWATCHED_DATA_REQUEST, GET_STOPWATCHED_DATA_SUCCESS, GET_STOPWATCHED_DATA_FAIL,
    GET_LAPS_DATA_REQUEST, GET_LAPS_DATA_SUCCESS, GET_LAPS_DATA_FAIL,
    TIME_UPDATE_STOPWATCH, SET_START_TIME_STOPWATCH,
    STOP_STOPWATCH, RESET_STOPWATCH, SET_NEW_BREAKPOINT, START_STOPWATCH, ADD_NEW_LAP, FIXED_LAP,
    DELETE_STOPWATCH_REQUEST, DELETE_STOPWATCH_SUCCESS, DELETE_STOPWATCH_FAIL,
    ADD_NEW_TITLE_CHANGE,
    SAVE_ALL_STOPWATCHES_REQUEST, SAVE_ALL_STOPWATCHES_SUCCESS, SAVE_ALL_STOPWATCHES_FAIL,
} from './../constants'; //-----

import config from './../config';

export const openAddNew = () => {
    return {
        type: ADD_NEW_OPEN
    }
};
export const closeAddNew = () => {
    return {
        type: ADD_NEW_CLOSE
    }
};
export const getStopwatchesData = () => {
    const {
        main,
        stopwatches,
    } = config.backend;
    return (dispatch, getState) => {
        dispatch({ type: GET_STOPWATCHED_DATA_REQUEST });
        fetch(main+stopwatches,{ method: 'GET' })
            .then(res => { return res.json()})
            .then(res => {
                console.log(res);
                dispatch({ type: GET_STOPWATCHED_DATA_SUCCESS, data: res });
                //---
                for(let i = 0; i < res.length; i++){
                    dispatch(getLapsData(res[i].id))
                }
                let url = window.location.pathname.split('/');
                dispatch(setCurrent(url[2]));
            })
            .catch(()=>{dispatch({ type: GET_STOPWATCHED_DATA_FAIL })});
    }
};
export const setCurrent = (id) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_CURRENT,
            id
        });
        const state = getState();
        let currentStopwatch;
        for(let i = 0; i < state.stopwatches.stopwatchList.length; i++){
            if(state.stopwatches.stopwatchList[i].id == id){
                currentStopwatch = state.stopwatches.stopwatchList[i];
                break;
            }
        }
        console.log('CURRENT STOPWATCH: ', currentStopwatch);
        if(id && (currentStopwatch.lapsList.length == 0 && !currentStopwatch.resetedFlag)){
            dispatch(getLapsData(id));
        }
    }
};
export const getLapsData = (id) => {
    const {
        main,
        laps,
    } = config.backend;
    return (dispatch) => {
        dispatch({ type: GET_LAPS_DATA_REQUEST, id }); //----
        fetch(main+laps+'?stopwatchId='+id+'&_sort=id&_order=ASC',{ method: 'GET' })
            .then(res => { return res.json()})
            .then(res => {
                console.log(res);
                dispatch({ type: GET_LAPS_DATA_SUCCESS, data: res, id });
            })
            .catch(()=>{dispatch({ type: GET_LAPS_DATA_FAIL, id })});
    }
};
export const timeUpdateStopwatch = (id) => {
    return {
        type: TIME_UPDATE_STOPWATCH,
        id
    }
};
export const setStartTimeStopwatch = (id, time) => {
    return {
        type: SET_START_TIME_STOPWATCH,
        lastTimeBreakpoint: (new Date()).getTime() - time,
        id
    }
};
export const startStopwatch = (id, time, intervalAction) => {
    return {
        type: START_STOPWATCH,
        absoluteStartTime: (new Date()).getTime() - time,
        interval: intervalAction,
        id
    }
};
export const stopStopwatch = (id, allFlag = false) => {
    return {
        type: STOP_STOPWATCH,
        allFlag,
        id
    }
};
export const fixedLapStopwatch = (id) => {
    return {
            type: FIXED_LAP,
            id
    }
};
export const resetStopwatch = (id) => {
    return {
        type: RESET_STOPWATCH,
        id
    }
};
export const addNewStopwatch = () => {
    const {
        main,
        stopwatches,
    } = config.backend;
    return (dispatch, getState) => {
        dispatch({
            type: ADD_NEW_APPLY_REQUEST
        });
        const state = getState();
        let swList = state.stopwatches.stopwatchList;
        let newId = 0;

        let max = 0;
        for(let i = 0; i < swList.length; i++){
            if(swList[i].id > max){
                max = swList[i].id;
            }
        }
        newId = max+1;

        fetch(main+stopwatches,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: newId,
                    title: state.stopwatches.addNewTitle,
                    time: 0
                })
            })
            .then(res => { return res.json()})
            .then(res => {
                console.log(res);
                dispatch({ type: ADD_NEW_APPLY_SUCCESS });
                dispatch(getStopwatchesData());
            })
            .catch(()=>{dispatch({ type: ADD_NEW_APPLY_FAIL })});
    }
};
export const addNewTitleChange = (val) => {
    return {
        type: ADD_NEW_TITLE_CHANGE,
        val
    }
};
export const deleteStopwatch = (id) => {
    const {
        main,
        stopwatches,
    } = config.backend;
    return (dispatch) => {
        dispatch({
            type: DELETE_STOPWATCH_REQUEST,
            id
        })
        fetch(main+stopwatches+'/'+id,
            {
                method: 'DELETE'
            })
            .then(res => { return res.json()})
            .then(res => {
                console.log(res);
                dispatch({ type: DELETE_STOPWATCH_SUCCESS, id });
                dispatch(getStopwatchesData());
            })
            .catch(()=>{dispatch({ type: DELETE_STOPWATCH_FAIL, id })});
    }
};
export const saveAllStopwatches = () => {
    const {
        main,
        laps,
        stopwatches,
    } = config.backend;
    return (dispatch, getState) => {
        dispatch({
            type: SAVE_ALL_STOPWATCHES_REQUEST
        });
        const state = getState();
        const stopwatchList = state.stopwatches.stopwatchList;

        let sendStopwatchesData = [], sendLapsData = [], idCount = 1;

        for(let i = 0; i < stopwatchList.length; i++){
            let tempStopwatchData = {};
            tempStopwatchData.id = stopwatchList[i].id;
            tempStopwatchData.time = stopwatchList[i].time;
            tempStopwatchData.title = stopwatchList[i].title;
            sendStopwatchesData.push(tempStopwatchData);
            //laps
            for(let j = 0; j < stopwatchList[i].lapsList.length; j++){
                console.log(i);
                let tempLapsData = {};
                tempLapsData.id = idCount;
                tempLapsData.stopwatchId = stopwatchList[i].lapsList[j].stopwatchId;
                tempLapsData.time = stopwatchList[i].lapsList[j].time;
                sendLapsData.push(tempLapsData);
                idCount++;
            }
        }

        console.log('SEND STOPWATCHES DATA: ',sendStopwatchesData); //---
        console.log('SEND LAPS DATA: ',sendLapsData); //---

        Promise.all(sendStopwatchesData.map((elem)=>{
            return fetch(main+stopwatches,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(elem)
                })
        })).then(res => {
            console.log('RESULT #1', res);
            return res;
        }) //---
            .then(res => {
                console.log(res);
                //dispatch({ type: SAVE_ALL_STOPWATCHES_SUCCESS});
                //dispatch(getStopwatchesData());
            })
            .catch(()=>{dispatch({ type: SAVE_ALL_STOPWATCHES_FAIL})});

        //TEST--
        fetch(main+laps+'?&_sort=id&_order=ASC',{ method: 'GET' })
            .then(res => { return res.json()})
            .then(res => {
                let deleteUrls = [];
                for(let i = 0; i < res.length; i++){
                    deleteUrls.push(main+laps+'/'+res[i].id);
                }
                console.log('DELETE URLS: ',deleteUrls);
                Promise.all(deleteUrls.map((url)=>{
                    return fetch(url,{method: 'DELETE' })
                }))
                    .then(res => { return res;})
                    .then(res => {
                        Promise.all(sendLapsData.map((elem)=>{ //---
                            return fetch(main+laps,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(elem)
                                })
                        })).then(res => {
                            console.log('RESULT #2', res);
                            return res;
                        }) //---
                            .then(res => {
                                console.log(res);
                                dispatch({ type: SAVE_ALL_STOPWATCHES_SUCCESS});
                                dispatch(getStopwatchesData());
                            })
                            .catch(()=>{dispatch({ type: SAVE_ALL_STOPWATCHES_FAIL})});
                    })
            })
            //.catch(()=>{dispatch({ type: GET_LAPS_DATA_FAIL, id })});
        //----

    }
}