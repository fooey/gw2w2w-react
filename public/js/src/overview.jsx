module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug || 'en';

	var appState = window.app.state;
	var langs = require('gw2w2w-static').langs;
	appState.lang = langs[langSlug];

	var Overview = React.createFactory(require('./jsx/Overview.jsx'));
	React.render(<Overview />, document.getElementById('content'));
}
