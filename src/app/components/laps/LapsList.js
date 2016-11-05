import React, {Component} from 'react';
import prefixAll from 'inline-style-prefixer/static'

import LapsItem from './LapsItem';

export  default class LapsList extends Component {
    getStyles() {
        return {
            root: {
                height: '100%'
            }
        }
    }
    render(){ //0---
        let style = prefixAll(this.getStyles());
        
        return (
            <div className="laps-list">
                {this.props.data}
            </div>
        )
    }
}