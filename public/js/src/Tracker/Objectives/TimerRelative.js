"use strict";

/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');

const moment    = require('moment');





/*
*
* Component Definition
*
*/

const propTypes = {
    isEnabled: React.PropTypes.bool.isRequired,
    timestamp: React.PropTypes.number.isRequired,
};

class TimerRelative extends React.Component {
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
            return <div className="objective-relative">
                <span className="timer relative" data-timestamp={this.props.timestamp}>
                    {moment(this.props.timestamp * 1000).twitterShort()}
                </span>
            </div>;
        }
    }
}




/*
*
* Export Module
*
*/

TimerRelative.propTypes = propTypes;
module.exports          = TimerRelative;
