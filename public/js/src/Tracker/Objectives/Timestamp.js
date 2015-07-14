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


class Timestamp extends React.Component {
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
                <div className='objective-timestamp'>
                    {moment((this.props.timestamp) * 1000).format('hh:mm:ss')}
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

module.exports = Timestamp;
