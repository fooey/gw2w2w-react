/**
 * @jsx React.DOM
 */

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug;
	var worldSlug = ctx.params.worldSlug;

	var appState = window.app.state;
	appState.start = Math.floor(Date.now() / 1000);

	var staticData = require('./staticData');

	appState.lang = staticData.langs[langSlug];

	_.map(staticData.worlds, function(world) {
		// world.de.slug = slugify(world.de.name);
		// world.en.slug = slugify(world.en.name);
		// world.es.slug = slugify(world.es.name);
		// world.fr.slug = slugify(world.fr.name);
		world.name = world[appState.lang.slug].name;
		world.slug = world[appState.lang.slug].slug;
		world.link = '/' + appState.lang.slug + '/' + world.slug;
		return world;
	});

	appState.world = _.find(staticData.worlds, {slug: worldSlug});


 	var api = require('./api');
	api.getMatches(
		getMatchesSuccess,
		getMatchesError,
		_.noop
	);

};

function getMatchesSuccess(data) {
	var appState = window.app.state;

	var match = _.find(data.wvw_matches, function(m) {
		return (
			appState.world.id == m.blue_world_id
			|| appState.world.id == m.green_world_id
			|| appState.world.id == m.red_world_id
		);
	});

	var Tracker = require('./jsx/Tracker.jsx');
	React.renderComponent(<Tracker data={match} />, document.getElementById('content'));
};

function getMatchesError(xhr, status, err) {
	console.log('Overview::getMatches:data error', status, err.toString()); 
};
