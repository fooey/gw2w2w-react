"use strict";

module.exports = function(app, express) {

	/*
	*
	*	Cache Busting
	*
	*/

	app.use(function(req, res, next) {
		const cacheBustInFilename	= /\.~[A-Za-z0-9_-]{7,14}~\./;	// filename.~asdf~.ext
		const cacheBustDirectory	= /\/~[A-Za-z0-9_-]{7,14}~\//;	// /~asdf~/*

		let urlRewrite;


		if (req.url.match(cacheBustDirectory)) {
			urlRewrite	= req.url.replace(cacheBustDirectory, '/');
			req.url		= urlRewrite;
		}
		else if (req.url.match(cacheBustInFilename)) {
			urlRewrite	= req.url.replace(cacheBustInFilename, '.');
			req.url		= urlRewrite;
		}

		next();
	});





	/*
	*
	*	favicon
	*
	*/

	const favicon = require('serve-favicon');
	app.use(favicon('./public/img/logo/gw2-dragon-32.png'));






	/*
	*
	*	Static Routes
	*
	*/

	const serveStatic = require('serve-static');

	const staticOptions = {
		dotfiles	: 'deny',
		etag		: true,
		maxAge		: '1d',
		// index	: false,
		// redirect	: true,
	};

	app.use(serveStatic('public', staticOptions));
	app.use('/nm', serveStatic(process.cwd() + '/node_modules', staticOptions));
	app.use('/node_modules', serveStatic(process.cwd() + '/node_modules', staticOptions));
	app.use('/routes', serveStatic(process.cwd() + '/routes', staticOptions));
	app.use('/views', serveStatic(process.cwd() + '/views', staticOptions));

	express.static.mime.define({
		'text/plain': ['jade', 'map'],
		'text/css'	: ['less'],
		'text/jsx'	: ['jsx'],
	});

};
