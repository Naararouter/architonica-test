import React, {Component,PropTypes} from 'react';
import prefixAll from 'inline-style-prefixer/static'

import DateTimeHelper from './../../helpers/DateTimeHelper';

export  default class LapsItem extends Component {
    static propTypes = {
        id: PropTypes.number,
        number: PropTypes.number,
        time: PropTypes.number,
        totalTime: PropTypes.number,
    };
    static defaultProps = {
        id: -1,
        number: -1,
        time: 0,
        totalTime: 0
    };
    getStyles() {
        return {
            root: {
                height: '100%'
            }
        }
    }
    render(){ //---
        const {
            id,
            number,
            time,
            totalTime,
        } = this.props;
        let style = prefixAll(this.getStyles());
        return ( //---
            <div className="laps-item-root">
                <div className="laps-item-text">{number}. {DateTimeHelper.parseTime(time)}</div>
                <div className="laps-item-line-wrap">
                    <div className="laps-item-line"
                        style={{
                            width: ((time/totalTime)*100)+"%"
                        }}
                    ></div>
                </div>
            </div>
        )
    }
}