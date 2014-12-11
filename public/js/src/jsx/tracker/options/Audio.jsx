'use strict';


/*
*	Dependencies
*/

var React = require('React');		// browserify shim
var _ = require('lodash');			// browserify shim





/*
*	React Components
*/





/*
*	Component Globals
*/





/*
*	Component Export
*/

module.exports = React.createClass({
	render: render,

	toggleEnabled: toggleEnabled,

	statics: {
		getDefaultOptions: getDefaultOptions,
	}
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/


function render() {
	var component = this;
	var props = component.props;

	var options = props.options;

	console.log('Audio::options', options.enabled);

	return (
		<section id="options-audio">
			{options && options.enabled
				? <label onClick={component.toggleEnabled}> Disable</label>
				: <label onClick={component.toggleEnabled}> Enable</label>
			}
		</section>
	);
}



/*
*	Component Helper Methods
*/

function toggleEnabled() {
	var component = this;
	var props = component.props;

	var options = props.options;
	// var setOptions = props.setOptions;

	options.enabled = !options.enabled;

	console.log('toggleEnabled', options.enabled);

	props.setOptions(options);
}



/*
*	Component Static Methods
*/

function getDefaultOptions() {
	return {
		enabled: false,
		maps: 'all',
		events: 'all',
		color: 'all',
	};
}
