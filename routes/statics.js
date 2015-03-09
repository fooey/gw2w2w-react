module.exports = function(app, express) {

	/*
	*
	*	Cache Busting
	*
	*/

	app.use(function(req, res, next) {
		// filename.~asdf~.ext
		var cacheBustInFilename = /\.~[A-Za-z0-9_-]{7,14}~\./;

		// /~asdf~/*
		var cacheBustDirectory = /\/~[A-Za-z0-9_-]{7,14}~\//;


		if (req.url.match(cacheBustDirectory)) {
			var urlRewrite = req.url.replace(cacheBustDirectory, '/');
			req.url = urlRewrite;
		}
		else if (req.url.match(cacheBustInFilename)) {
			var urlRewrite = req.url.replace(cacheBustInFilename, '.');
			req.url = urlRewrite;
		}

		next();
	});





	/*
	*
	*	favicon
	*
	*/

	var favicon = require('serve-favicon');
	app.use(favicon('./public/img/logo/gw2-dragon-32.png'));






	/*
	*
	*	Static Routes
	*
	*/

	var serveStatic = require('serve-static');

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

};
