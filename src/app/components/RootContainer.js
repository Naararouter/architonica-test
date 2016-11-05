import React, {Component} from 'react';
import prefixAll from 'inline-style-prefixer/static'

export  default class RootContainer extends Component {
    getStyles() {
        return {
            root: {
                height: '100%'
            }
        }
    }
    render(){
        let style = prefixAll(this.getStyles());
        return (
            <div className="root">
                {this.props.children}
            </div>
        )
    }
}