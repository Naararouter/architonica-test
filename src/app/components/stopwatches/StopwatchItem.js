import React, {Component, PropTypes} from 'react';
import prefixAll from 'inline-style-prefixer/static'

import DateTimeHelper from './../../helpers/DateTimeHelper';

export  default class StopwatchItem extends Component {
    static propTypes = {
        id: PropTypes.number,
        title: PropTypes.string,
        time: PropTypes.number,
        active: PropTypes.bool,

        onRootClick: PropTypes.func,
        onButtonDeleteClick: PropTypes.func
    };
    static defaultProps = {
        id: null,
        title: "Нет наименования",
        time: 0,
        active: false,
        onRootClick: ()=>{},
        onButtonDeleteClick: ()=>{}
    };
    state = {
        pressedRoot: false,
        hoveredRoot: false,
        hoveredDeleteButton: false,
    };
    getStyles() {
        return {
            root: {
                height: '100%'
            }
        }
    }

    //Handles Root Element
    handleRootMouseDown(e){
        if(e.target.tagName!='BUTTON'){
            this.setState({
                pressedRoot: true
            })
        }
    }
    handleRootMouseUp(e){
        this.setState({
            pressedRoot: false
        });
        if(e.target.tagName!='BUTTON') {
            this.props.onRootClick();
        }
    }
    handleRootMouseEnter(e){
        this.setState({
            hoveredRoot: true
        })
    }
    handleRootMouseLeave(e){
        this.setState({
            hoveredRoot: false
        })
    }
    //Handles Delete Button
    handleDeleteButtonMouseEnter(e){
        this.setState({
            pressedRoot: false,
            hoveredRoot: false,
            hoveredDeleteButton: true
        })
    }
    handleDeleteButtonMouseLeave(e){
        this.setState({
            hoveredRoot: true,
            hoveredDeleteButton: false
        })
    }
    handleDeleteButtonClick(id){
        const {
            onButtonDeleteClick
        } = this.props;
        onButtonDeleteClick(id);
    }
    render(){
        const {
            id,
            title,
            time,
            active,
            deleteRequestStatus,
            //Events
            onRootClick,
            onButtonDeleteClick,
        } = this.props;
        let style = prefixAll(this.getStyles());
        return (
            <div
                className={"stopwatch-item-root "+
                (active ? "stopwatch-item-root__selected ":"")+
                (this.state.hoveredRoot ? "stopwatch-item-root__hovered ":"")+
                (this.state.pressedRoot ? "stopwatch-item-root__pressed ":"")}
                onMouseDown={this.handleRootMouseDown.bind(this)}
                onMouseUp={this.handleRootMouseUp.bind(this)}
                onMouseEnter={this.handleRootMouseEnter.bind(this)}
                onMouseLeave={this.handleRootMouseLeave.bind(this)}
                //onClick={}
            >
                <div className="grid">
                    <div className="column">
                        <div className="stopwatch-item-title">
                            {title}
                        </div>
                        <div className="stopwatch-item-time">
                            {DateTimeHelper.parseTime(time)}
                        </div>
                    </div>
                    <div className="column column-manage one-of-three-column text-align-right">
                        <button
                            className="btn btn-delete btn_warning "
                            onClick={this.handleDeleteButtonClick.bind(this,id)}
                            onMouseEnter={this.handleDeleteButtonMouseEnter.bind(this)}
                            onMouseLeave={this.handleDeleteButtonMouseLeave.bind(this)}
                            disabled={deleteRequestStatus == 1}
                        >{
                            deleteRequestStatus == 1 ? "Удаление...": "Удалить"
                        }</button>
                    </div>
                </div>
            </div>
        )
    }
}