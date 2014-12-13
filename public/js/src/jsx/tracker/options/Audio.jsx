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
	// componentDidUpdate: componentDidUpdate,

	toggleEnabled: toggleEnabled,
	// toggleMapEnabled: toggleMapEnabled,
	// getMapOption: getMapOption,

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

	// console.log('options::Audio::render()');

	return (
		<section id="options-audio">
			<h3>Audio Options {getAudioIcon(options.enabled)}</h3>
			<div className="checkbox">
				<label htmlFor="audio-enabled">
					<input
						type="checkbox"
						checked={options && options.enabled}
						id="audio-enabled"
						name="audio-enabled"
						value="1"
						onChange={component.toggleEnabled}
					/>
					{' '} Audio Alerts
				</label>
			</div>
		</section>
	);
			// <div className={(options.enabled ? 'enabled' : 'disabled') + ' sub-options'}>
			// 	{_.map(['EBG', 'RedHome', 'BlueHome', 'GreenHome'], function(mapName, mapIndex){
			// 		return (
			// 			component.getMapOption(
			// 				mapIndex,
			// 				mapName
			// 			)
			// 		);
			// 	})}
			// </div>
}




// function componentDidUpdate() {
// 	console.log('options::Audio::componentDidUpdate()');
// }



/*
*	Component Helper Methods
*/

function toggleEnabled() {
	var component = this;
	var props = component.props;

	var toOptions = _.cloneDeep(props.options);
	toOptions.enabled = !(toOptions.enabled);

	props.setOptions(toOptions);
}

// function toggleMapEnabled(mapIndex) {
// 	var component = this;
// 	var props = component.props;
// 	console.log('toggleMapEnabled', mapIndex, props.options.maps[mapIndex]);

// 	var toOptions = _.cloneDeep(props.options);
// 	toOptions.maps[mapIndex] = !(toOptions.maps[mapIndex]);

// 	props.setOptions(toOptions);
// }



/*
*
*	Component Static Methods
*
*/

function getDefaultOptions() {
	return {
		enabled: false,
		// maps: [true, true, true, true],
		// events: 'all',
		// color: 'all',
	};
}



/*
*
*	Private Methods
*
*/

function getAudioIcon(enabled) {
	var className = [
		'fa',
		'fa-stack-2x',
	];

	if (enabled) {
		className.push('fa-circle-o');
		className.push('text-success');
	}
	else {
		className.push('fa-ban');
		className.push('text-danger');
	}

	return (
		<span className="fa-stack">
			<i className="fa fa-volume-up fa-stack-1x"></i>
			<i className={className.join(' ')}></i>
		</span>
	);
}



// function getMapOption(mapIndex, mapName) {
// 	var component = this;
// 	var props = component.props;

// 	var masterEnabled = props.options.enabled;
// 	var enabled = props.options.maps[mapIndex];
// 	var onChange = component.toggleMapEnabled.bind(component, mapIndex);

// 	var key = "audio-enabled-" + mapIndex;

// 	var wrapperClassName = [
// 		'checkbox',
// 		(masterEnabled) ? '' : 'disabled'
// 	];

// 	return (
// 		<div className={wrapperClassName.join(' ')} key={key}>
// 			<label htmlFor={key}>
// 				<input
// 					type="checkbox"
// 					id={key}
// 					name={key}
// 					checked={enabled}
// 					onChange={onChange}
// 					disabled={!masterEnabled}
// 				/>
// 				{' '} {mapName}
// 			</label>
// 		</div>
// 	);
// }
