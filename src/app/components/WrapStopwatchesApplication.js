import React, {Component} from 'react';
import prefixAll from 'inline-style-prefixer/static'

import { connect } from 'react-redux';

import Stopwatches from './stopwatches';
import Laps from './laps';

class WrapStopwatchesApplication extends Component {
    constructor(props){
        super(props);
        this.stopwatchId = -1;
    }
    componentWillMount(){
        console.log(this);
        //this.stopwatchId = ;
    };
    getStyles() {
        return {
            root: {
                height: '100%'
            }
        }
    }
    render(){
        const {
            current
        } =  this.props.stopwatches;
        let style = prefixAll(this.getStyles());
        return ( //-----
            <div className="wrap-stopwatches-application">
                <div className="grid">
                    <div className="column one-of-two-column">
                        <Stopwatches />
                    </div>
                    <div className="column one-of-two-column">
                        <Laps />
                    </div>
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
    }
}
export  default connect(mapStateToProps,mapDispatchToProps)(WrapStopwatchesApplication);