module.exports = function(express) {
	var router = express.Router();

	router.get('/:langSlug(en|de|es|fr)?', function(req, res) {
		res.render('index', {});
		// res.sendFile(process.cwd() + '/public/index.html');
	});

	router.get('/:langSlug(en|de|es|fr)/:langSlug([a-z-]+)', function(req, res) {
		res.render('index', {});
		// res.sendFile(process.cwd() + '/public/index.html');
	});

	return router;
};
