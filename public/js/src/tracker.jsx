var Tracker = React.createFactory(require('./jsx/Tracker.jsx'));

var langs = require('gw2w2w-static').langs;

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug;
	var worldSlug = ctx.params.worldSlug;

	var appState = window.app.state;
	appState.lang = langs[langSlug];


	React.render(<Tracker worldSlug={worldSlug} />, document.getElementById('content'));
};
