'use strict';
const path = require('path');

module.exports = function(express) {
	var app = express();
	
	var isDev = (process.env.NODE_ENV === 'development');
	var isProd = !isDev;

	app.set('env', isDev ? 'development' : 'production');
	app.set('port', process.env.PORT || 3000);


	/*
	*
	*	Views
	*
	*/
	app.set('views', path.normalize(path.join(process.cwd(), 'views')));
	app.set('view engine', 'jade');
	app.set('case sensitive', true);
	app.set('strict routing', true);
	app.engine('jade', require('jade').__express);



	/*
	*
	*	Middleware
	*
	*/

	const morgan = require('morgan');
	const compression = require('compression');


	if (process.env.NODE_ENV === 'development') {
		const errorhandler = require('errorhandler')

		app.use(errorhandler());
		app.use(morgan('dev'));
		app.set('view cache', false);
	}
	else {
		app.use(morgan('combined'));
		app.set('view cache', true);
	}
	app.use(compression());



	/*
	*
	*	Statics
	*
	*/

	const favicon = require('serve-favicon');
	app.use(favicon('./public/img/logo/gw2-dragon-32.png'));


	const serveStatic = require('serve-static');

	var staticOptions = {
		dotfiles: 'deny',
		etag: true,
		// index: false,
		maxAge: '1d',
		// redirect: true,
	};

	app.use(serveStatic('public', staticOptions));
	app.use('/nm', serveStatic(process.cwd() + '/node_modules', staticOptions));
	app.use('/node_modules', serveStatic(process.cwd() + '/node_modules', staticOptions));
	app.use('/routes', serveStatic(process.cwd() + '/routes', staticOptions));
	app.use('/views', serveStatic(process.cwd() + '/views', staticOptions));

	express.static.mime.define({
		'text/plain': ['jade', 'map'],
		'text/css': ['less'],
		'text/jsx': ['jsx'],
	});




	return app;
}



