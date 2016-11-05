import React, {Component} from 'react';
import prefixAll from 'inline-style-prefixer/static'

import StopwatchItem from './StopwatchItem';

export  default class StopwatchList extends Component {
    getStyles() {
        return {
            root: {
                height: '100%'
            }
        }
    }

    render(){ //
        let style = prefixAll(this.getStyles());
        return (
            <div className="stopwatch-list">
                {this.props.data.map((item)=>{
                    return (
                        <StopwatchItem 
                            
                        />
                    )
                })}
            </div>
        )
    }
}