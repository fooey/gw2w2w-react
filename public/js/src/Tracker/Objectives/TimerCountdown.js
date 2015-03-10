'use strict';

/*
*
*	Dependencies
*
*/

const React = require('react');
const Immutable = require('Immutable');





/*
*
*	Component Definition
*
*/

class TimeCountdown extends React.Component {
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
				<i className="fa fa-spinner fa-spin"></i>
			</span>;
		}
	}
}



/*
*	Class Properties
*/

TimeCountdown.propTypes = {
	isEnabled: React.PropTypes.bool.isRequired,
	timestamp: React.PropTypes.number.isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = TimeCountdown;