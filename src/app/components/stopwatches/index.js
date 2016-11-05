import React, {Component} from 'react';
//Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'

import { getStopwatchesData, openAddNew, closeAddNew, setCurrent, addNewStopwatch,
    addNewTitleChange, deleteStopwatch, saveAllStopwatches, stopStopwatch} from './../../actions';

import prefixAll from 'inline-style-prefixer/static'

import StopwatchItem from './StopwatchItem';
import StopwatchList from './StopwatchList';

class Stopwatches extends Component {
    getStyles() {
        return {
            root: {
                height: '100%'
            }
        }
    } //---
    componentWillMount(){
        this.props.getData();
    }
    handleRootClick(id){
        const {
            setCurrent,
            updateLocation,
        } = this.props;

        updateLocation('/stopwatches/'+id);
        setCurrent(id);
    }
    handleAddNewStopwatch(){
        const {
            addNewStopwatch
        } = this.props;
        addNewStopwatch();
    }
    handleAddNewTitleChange(e){
        const {
            addNewTitleChange
        } = this.props;
        let value = e.target.value;
        addNewTitleChange(value);
    }
    handleSaveAllStopwatches(){
        const {
            stopStopwatch,
            saveAllStopwatches
        } = this.props;
        stopStopwatch(null,true);
        saveAllStopwatches();
    }
    render(){
        const {
            addNewOpened,
            stopwatchList,
            current,
            addNewTitle,
            addNewRequestStatus,

            requestStatus
        } = this.props.stopwatches;

        const {
            addNewOpen,
            addNewClose,
            saveAllStopwatches,
            updateLocation,
            deleteStopwatch,
        } = this.props;

        console.log('CURRENT: ', current ? true: false); //---
        let style = prefixAll(this.getStyles());
        //test
        let data = [], renderList = (<div className="stopwatch-content-loading">Секундомеров нет, создайте новый</div>);
        if(stopwatchList.length > 0){
            for(let i = 0; i < stopwatchList.length; i++){
                data.push(
                    <StopwatchItem
                        key = {i}
                        id = {stopwatchList[i].id}
                        title = {stopwatchList[i].title}
                        time = {stopwatchList[i].time}
                        active = {current == stopwatchList[i].id ? true: false}
                        deleteRequestStatus = {stopwatchList[i].deleteRequestStatus}
                        //Events
                        onRootClick={this.handleRootClick.bind(this,stopwatchList[i].id)}
                        onButtonDeleteClick={deleteStopwatch}
                    />
                )
            }
            renderList = (
                //Stopwatch List
                <div className="stopwatch-list">
                    {data}
                </div>
            );
        }
        return (
            <div className="stopwatches">
                <div className="head">
                    <button
                        className="btn btn_transparent btn-head-stopwatches"
                        onClick={this.handleSaveAllStopwatches.bind(this)}
                    ><i className="btn__right-icon fa fa-floppy-o"></i></button>
                    <div className="stopwatches__head-content">
                        Секундомеры
                    </div>
                </div>
                <div className="content stopwatches-content">
                    {
                        requestStatus == 1 ? 
                            (
                                <div className="stopwatch-content-loading">Загружаем данные...</div>
                            ): renderList
                    }
                </div>
                {
                    addNewOpened ?
                        (<div className="stopwatches-add-new">
                            Наименование таймера:
                            <input
                                value={addNewTitle}
                                onChange={this.handleAddNewTitleChange.bind(this)}
                                maxLength="16"
                            />
                        </div>) : null
                }
                <div className="controls">
                    {
                        addNewOpened ? //---
                            (<div className="wrap-many-controls">
                                <button
                                    onClick={addNewClose}
                                    className="btn btn_warning">Отмена</button>
                                <button
                                    onClick={this.handleAddNewStopwatch.bind(this)}
                                    disabled={addNewRequestStatus == 1}
                                    className="btn btn_success">
                                    {
                                        addNewRequestStatus == 1 ? "Отправка...": "Добавить"
                                    }</button>
                            </div>) : (
                            <button
                                onClick={addNewOpen}
                                className="btn btn_success full-width">Добавить новый</button>
                        )

                    }
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        stopwatches: state.stopwatches
    }
};
function mapDispatchToProps(dispatch) {
    return {
        saveAllStopwatches: bindActionCreators(saveAllStopwatches, dispatch),
        getData: bindActionCreators(getStopwatchesData,dispatch),
        addNewOpen: bindActionCreators(openAddNew,dispatch),
        addNewClose: bindActionCreators(closeAddNew,dispatch),
        addNewStopwatch: bindActionCreators(addNewStopwatch, dispatch),
        addNewTitleChange: bindActionCreators(addNewTitleChange, dispatch),
        deleteStopwatch: bindActionCreators(deleteStopwatch,dispatch),
        setCurrent: bindActionCreators(setCurrent,dispatch),
        stopStopwatch: bindActionCreators(stopStopwatch,dispatch),
        updateLocation: (route)=>{
            dispatch(push(route))
        }
    }
}
export  default connect(mapStateToProps,mapDispatchToProps)(Stopwatches);