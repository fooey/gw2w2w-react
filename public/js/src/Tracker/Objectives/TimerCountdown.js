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


// const spinner   =  <i className='fa fa-spinner fa-spin'></i>;


/*
*
* Component Definition
*
*/


class TimerCountdown extends React.Component {
    static propTypes = {
        isEnabled: React.PropTypes.bool.isRequired,
        timestamp: React.PropTypes.number.isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newIsEnabled = !Immutable.is(this.props.isEnabled, nextProps.isEnabled);
        const newTimestamp = !Immutable.is(this.props.timestamp, nextProps.timestamp);
        const shouldUpdate = (newIsEnabled || newTimestamp);

        return shouldUpdate;
    }



    render() {
        if (!this.props.isEnabled) {
            return null;
        }
        else {
            return (
                <span
                    className='timer countdown inactive'
                    data-timestamp={this.props.timestamp}
                />
            );
        }
    }
}




/*
*
* Export Module
*
*/

module.exports = TimerCountdown;
