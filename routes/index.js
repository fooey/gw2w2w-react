"use strict";
const fs = require('fs');
const path = require('path');

module.exports = function(app, express) {

    /*
    *
    * Statics
    *
    */

    require('./statics.js')(app, express);



    function staticCacheBusted(urlPath, filePath) {
        const fullPath = path.join(process.cwd(), filePath);
        const hash     = '~' + fs.statSync(fullPath).mtime.getTime().toString(16) + '~';

        var pathname   = path.dirname(urlPath)
            + '/' + path.basename(urlPath, path.extname(urlPath))
            + '.' + hash + path.extname(urlPath);

        return pathname;
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
