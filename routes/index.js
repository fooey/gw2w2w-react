"use strict";

module.exports = function(app, express) {

    /*
    *
    * Statics
    *
    */

    require('./statics.js')(app, express);



    function staticCacheBusted(realPath) {
        let pathArray = realPath.split('.');
        let ext       = pathArray.pop();

        pathArray.push(GLOBAL.versionHash);
        pathArray.push(ext);

        return pathArray.join('.');
    }


    /*
    *
    * App Routes
    *
    */

    var router = express.Router();

    router.get('/:langSlug(en|de|es|fr)?', function(req, res) {
        res.render('index', {staticCacheBusted});
        // res.sendFile(process.cwd() + '/public/index.html');
    });

    router.get('/:langSlug(en|de|es|fr)/:langSlug([a-z-]+)', function(req, res) {
        res.render('index', {staticCacheBusted});
        // res.sendFile(process.cwd() + '/public/index.html');
    });


    app.use(router);
};
