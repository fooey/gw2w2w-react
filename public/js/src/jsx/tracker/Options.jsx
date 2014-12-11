'use strict';


/*
*	Dependencies
*/

var React = require('React');		// browserify shim
var _ = require('lodash');			// browserify shim

var Audio = require('./options/Audio.jsx');





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
	shouldComponentUpdate: shouldComponentUpdate,

	setOptions: setOptions,
	setAudioOptions: setAudioOptions,

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

	console.log('Options::options', options);

	return (
		<section id="options">
			<h2 className="section-header">Options</h2>
			<Audio
				options={options.audio}
				setOptions={component.setAudioOptions}
			/>
			<pre>{JSON.stringify(options.audio, null, '\t')}</pre>
		</section>
	);
}



function shouldComponentUpdate(nextProps) {
	var component = this;
	var props = component.props;

	return !_.isEqual(props, nextProps);
}



/*
*	Component Helper Methods
*/

function setOptions(category, categoryOptions) {
	var component = this;
	var props = component.props;
	console.log('setOptions', category, categoryOptions);

	var options = props.options;
	options[category] = categoryOptions;

	props.setOptions(options);
}



function setAudioOptions(newOptions) {
	var component = this;
	console.log('setAudioOptions', newOptions);

	component.setOptions('audio', newOptions);
}




/*
*	Component Static Methods
*/

function getDefaultOptions() {
	console.log('Options:getDefaultOptions()', this);
	return {
		audio: Audio.getDefaultOptions(),
	};
}
