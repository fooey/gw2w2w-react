module.exports = function(express) {
	var router = express.Router();

	router.get('/:langSlug(en|de|es|fr)?', function(req, res) {
		res.render('overview', {
			metaTitle: 'gw2w2w',
			metaDescription: '',
			langSlug: req.params.langSlug || 'en',
		});
	});

	router.get('/:langSlug(en|de|es|fr)/:langSlug([a-z-]+)', function(req, res) {
		res.render('tracker', {
			metaTitle: 'gw2w2w',
			metaDescription: '',
			langSlug: req.params.langSlug,
			worldSlug: req.params.worldSlug,
		});
	});

	return router;
};
