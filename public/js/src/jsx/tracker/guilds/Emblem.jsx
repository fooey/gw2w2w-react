'use strict';

/*
*	Dependencies
*/

var React = require('React');	// browserify shim

var PureRenderMixin = React.addons.PureRenderMixin;





/*
*	Component Export
*/

module.exports = React.createClass({
	mixins: [PureRenderMixin],

	render: render,
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

	var guildName = slugify(props.guildName);
	var size = props.size;

	var src = 'http://guilds.gw2w2w.com/guilds/' + guildName + '/256.svg';


	return (
		<img className="emblem" src={src} width={size} height={size} />
	);
}






/*
*
*	Private Methods
*
*/

function slugify(str) {
	return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
}