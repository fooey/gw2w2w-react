'use strict';

/*
*
*   THE CONTENT OF COMPONENT IS MANAGED EXTERNALLY
*   lib.trackerTimers IS INITIALIZED IN Tracker.componentDidMount();
*
*/



/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');


const spinner   =  <i className='fa fa-spinner fa-spin'></i>;



/*
*
* Component Definition
*
*/


class TimerRelative extends React.Component {
    static propTypes = {
        isEnabled: React.PropTypes.bool.isRequired,
        timestamp: React.PropTypes.number.isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
        const shouldUpdate = (newTimestamp);

        return shouldUpdate;
    }



    render() {
        if (!this.props.isEnabled) {
            return null;
        }
        else {
            return (
                <div className='objective-relative'>
                    <span
                        className='timer relative'
                        data-timestamp={this.props.timestamp}
                    >
                        {spinner}
                    </span>
                </div>
            );
        }
    }
}




/*
*
* Export Module
*
*/

module.exports = TimerRelative;
