'use strict';

/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');



const spinner =  <i className="fa fa-spinner fa-spin"></i>;


/*
*
* Component Definition
*
*/

const propTypes = {
  isEnabled: React.PropTypes.bool.isRequired,
  timestamp: React.PropTypes.number.isRequired,
};

class TimerCountdown extends React.Component {
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
      const expires = this.props.timestamp + (5 * 60);

      return <span className='timer countdown inactive' data-expires={expires}>
        {spinner}
      </span>;
    }
  }
}




/*
*
* Export Module
*
*/

TimerCountdown.propTypes = propTypes;
module.exports           = TimerCountdown;
