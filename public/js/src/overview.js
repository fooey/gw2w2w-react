/**
 * @jsx React.DOM
 */


module.exports = function overview(ctx){
	var langSlug = ctx.params.langSlug || 'en';

	var appState = window.app.state;
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
	// console.log(JSON.stringify(window.app.data.static.worlds));


	var Overview = require('./jsx/Overview.jsx')
	React.renderComponent(<Overview />, document.getElementById('content'));
}


// function slugify(inStr) {
// 	return _.str.slugify(inStr.replace('ß', 'ss'));
// }