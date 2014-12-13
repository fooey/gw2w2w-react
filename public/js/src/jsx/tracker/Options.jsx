'use strict';


/*
*	Dependencies
*/

var React = require('React');		// browserify shim
var _ = require('lodash');			// browserify shim





/*
*	React Components
*/

var Audio = require('./options/Audio.jsx');





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

	var lang = props.lang;
	var options = props.options;

	// console.log('Options::render()');
	// console.log('Options::render', 'options.audio.enabled', options.audio.enabled);

	return (
		<section id="options">
			<h2 className="section-header">Options</h2>
			<Audio
				lang={lang}
				options={options.audio}
				setOptions={component.setAudioOptions}
			/>
		</section>
	);
}



function shouldComponentUpdate(nextProps) {
	var component = this;
	var props = component.props;

	var optionsChanged = !(_.isEqual(props.options, nextProps.options));

	// console.log('Options::shouldComponentUpdate()', optionsChanged, props.options.audio.enabled, nextProps.options.audio.enabled);

	return !!(optionsChanged);
}



/*
*	Component Helper Methods
*/

function setOptions(category, categoryOptions) {
	var component = this;
	var props = component.props;
	// console.log('Options::setOptions()', category, categoryOptions);

	var options = _.cloneDeep(props.options);
	options[category] = categoryOptions;

	props.setOptions(options);
}



function setAudioOptions(newOptions) {
	var component = this;
	// console.log('Options::setAudioOptions()', newOptions);

	component.setOptions('audio', newOptions);
}




/*
*	Component Static Methods
*/

function getDefaultOptions() {
	// console.log('Options:getDefaultOptions()', this);
	return {
		audio: Audio.getDefaultOptions(),
	};
}
