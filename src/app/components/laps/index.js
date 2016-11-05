import React, {Component, PropTypes} from 'react';
import prefixAll from 'inline-style-prefixer/static'

//Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { push, goBack, goForward } from 'react-router-redux'
import { getLapsData, setCurrent, timeUpdateStopwatch, setStartTimeStopwatch,
    stopStopwatch, startStopwatch, fixedLapStopwatch, resetStopwatch } from './../../actions';

import LapsItem from './LapsItem';
import LapsList from './LapsList';
import CurrentLap from './CurrentLap';

class Laps extends Component {
    getStyles(props) {
        const {
            current
        } = this.props.stopwatches;
        return {
            lapsHead: {
                padding: !current ? '1em': null
            }
        }
    }
    componentWillMount(){
        //zxczczxcxzc
    }
    handleBackButton(){
        const {
            goBack,
            updateLocation,
            setCurrent
        } = this.props;
        
        //goBack(); ---
        updateLocation('/stopwatches');
        setCurrent(null);
    }
    render(){
        const {
            startStopwatch,
            stopStopwatch,
            resetStopwatch,
            fixedLapStopwatch,
            setStartTimeStopwatch,
            timeUpdateStopwatch,
        } = this.props;
        const {
            current,
            stopwatchList,
        } = this.props.stopwatches;
        /*const {
            lapsList,

            requestStatus,
        } = this.props.laps;*/
        let style = prefixAll(this.getStyles(this.props));
        let lapsHeadStyles = Object.assign({},style.lapsHead);
        //-Get Current Stopwatch
        let currentObj;
        for(let i = 0; i < stopwatchList.length; i++){
            if(current==stopwatchList[i].id){
                currentObj = stopwatchList[i];
            }
        }
        //-Get Current Stopwatch's laps
        
        let data = [], renderList = (<div className="stopwatch-content-loading">Кругов нет</div>);
        
        if((currentObj)&&(currentObj.lapsList.length > 0)){
            //Calculate total time
            let totalTime = 0;
            for(let i = 0; i < currentObj.lapsList.length; i++){
                totalTime += currentObj.lapsList[i].time;
            }
            
            for(let i = 0; i < currentObj.lapsList.length; i++){
                data.push(
                    <LapsItem
                        key={i}
                        number={i+1}
                        id={currentObj.lapsList[i].id}
                        time={currentObj.lapsList[i].time}
                        totalTime={totalTime}
                    />
                )
            }
            renderList = (
                <div className="laps-list">
                    {data}
                </div>
            );
        }
        
        return ( //---
            <div className="laps">
                <div className="head head-laps">
                    {
                        current ?
                        (<button
                            className="btn btn_transparent btn-head-laps"
                            onClick={this.handleBackButton.bind(this)}
                        >
                            <i className="btn__left-icon fa fa-angle-left"></i>
                            Назад</button>): null }
                    <div className="laps__head-content"
                        style={lapsHeadStyles}
                    >
                        Секундомеры
                    </div>
                </div>
                {
                    current ? (
                        <div style={{ display: 'flex', flexDirection: 'column'}}>
                            <CurrentLap
                                id={currentObj.id}
                                title={currentObj.title}
                                time={currentObj.time}
                                enabled={currentObj.enabled}
                                lastTimeBreakpoint={currentObj.lastTimeBreakpoint}
                                lapsListRequestStatus={currentObj.lapsListRequestStatus}
                                
                                onTimeUpdateStopwatch={timeUpdateStopwatch}
                                onSetStartTimeStopwatch={setStartTimeStopwatch}
                                onStop={stopStopwatch}
                                onStart={startStopwatch}
                                onFixedLap={fixedLapStopwatch}
                                onReset={resetStopwatch}
                            />
                            <div style={{ display: 'flex'}}>
                                <div className="content laps-content">
                                    {
                                        currentObj.lapsListRequestStatus == 2 ? renderList:
                                        (
                                            <div className="stopwatch-content-loading">Загружаем данные...</div>
                                        )
                                    }

                                </div>
                            </div>
                        </div>
                    ):(
                        <div className="laps-content-non-selected">
                            Пожалуйста, выберите секундомер
                        </div>
                    )
                }

            </div>
        )
    }
}
function mapStateToProps (state) {
    return {
        stopwatches: state.stopwatches,
        //laps: state.laps,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //Current Lap
        //-Start Action
        startStopwatch: bindActionCreators(startStopwatch, dispatch),
        setStartTimeStopwatch: bindActionCreators(setStartTimeStopwatch,dispatch), //---
        timeUpdateStopwatch: bindActionCreators(timeUpdateStopwatch, dispatch),
        //-Stop
        stopStopwatch: bindActionCreators(stopStopwatch,dispatch),
        fixedLapStopwatch: bindActionCreators(fixedLapStopwatch, dispatch),
        resetStopwatch: bindActionCreators(resetStopwatch,dispatch),
        //---
        setCurrent: bindActionCreators(setCurrent,dispatch),
        getLapsData: bindActionCreators(getLapsData,dispatch),
        goBack: ()=>{
            dispatch(goBack())
        },
        updateLocation: (route)=>{
            dispatch(push(route))
        }
    }
}
export  default connect(mapStateToProps, mapDispatchToProps)(Laps);