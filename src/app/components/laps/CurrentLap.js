import React, {Component, PropTypes} from 'react';
import prefixAll from 'inline-style-prefixer/static'

import DateTimeHelper from './../../helpers/DateTimeHelper';

export  default class CurrentLap extends Component {
    static propTypes = {
        id: PropTypes.number,
        title: PropTypes.string,
        time: PropTypes.number,
        enabled: PropTypes.bool,
        startTime: PropTypes.number,

        onStart: PropTypes.func,
        onStop: PropTypes.func,
        onTimeUpdateStopwatch: PropTypes.func,
        onSetStartTimeStopwatch: PropTypes.func,
    };
    static defaultProps = {
        id: -1,
        title: "Без названия",
        time: -1,
        startTime: -1,
        enabled: false,

        onStart: ()=>{},
        onStop: ()=>{},
        onSetStartTimeStopwatch: ()=>{},
        onTimeUpdateStopwatch: ()=>{}
    };
    constructor(props){
        super(props);
        this.interval = null;
        this.test = "TEST";
    }
    componentWillMount(){

    }
    componentWillUnmount(){
        console.log('Unmoung!');
    }
    getStyles() {
        return {
            root: {
                height: '100%'
            }
        }
    }
    handleStartButtonClick(){
        const {
            id,
            time,
            onStart,
            onTimeUpdateStopwatch,
            onSetStartTimeStopwatch,
        } = this.props; //
        onStart(id,time,onTimeUpdateStopwatch);
        /*onSetStartTimeStopwatch(id,time);
        this.test = id;
        this.interval = setInterval(()=>{
            onTimeUpdateStopwatch(id);
        },27);*/
    }
    handleStopButtonClick(){
        const {
            id,
            onStop,
        } = this.props; //
        /*console.log('INTERVAL: ',this.test); ----
        clearInterval(this.interval);*/
        onStop(id);
    }
    handleFixedLapButtonClick(){
        const {
            id,
            onFixedLap,
        } = this.props;
        onFixedLap(id);
    }
    handleResetButtonClick(){
        const {
            id,
            onReset,
        } = this.props;
        onReset(id);
    }
    render(){ //
        const {
            title,
            time,
            enabled,
            lapsListRequestStatus,

            startTime,
            stopStopwatch,
            onTimeUpdateStopwatch,
        } = this.props;
        let style = prefixAll(this.getStyles());
        return (
            <div className="stopwatch-current-root">
                <div className="stopwatch-current-title stopwatch-item-title">
                    {title}
                </div>
                <div className="stopwatch-current-time">
                    {DateTimeHelper.parseTime(time)}
                </div>
                <div className="stopwatch-current-controls">
                    <button
                        className="btn btn_warning btn-delete"
                        onClick={this.handleResetButtonClick.bind(this)}
                        disabled={lapsListRequestStatus != 2}
                    >Сброс</button>
                    <button
                        className="btn btn_primary btn-delete"
                        onClick={this.handleFixedLapButtonClick.bind(this)}
                        disabled={lapsListRequestStatus != 2}
                    >Круг</button>
                    {
                        !enabled ? (
                            <button
                                className="btn btn_success btn-delete"
                                onClick={this.handleStartButtonClick.bind(this)}
                                disabled={lapsListRequestStatus != 2}
                            >Старт</button>
                        ): (
                            <button
                                className="btn btn_warning btn-delete"
                                onClick={this.handleStopButtonClick.bind(this)}
                            >Стоп</button>
                        )
                    }

                </div>
            </div>
        )
    }
}