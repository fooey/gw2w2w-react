'use strict';

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

class Timestamp extends React.Component {
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
            return <div className="objective-timestamp">
                {moment((this.props.timestamp) * 1000).format('hh:mm:ss')}
            </div>;
        }
    }
}




/*
*
* Export Module
*
*/

Timestamp.propTypes = propTypes;
module.exports      = Timestamp;
