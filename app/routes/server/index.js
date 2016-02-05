
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import attachStaticRoutes from './statics';
import { getUrlHashified } from 'lib/cacheBust';

import Root from 'components/Layout/Root';



export function initRoutes(app, express) {
    const html = `<!DOCTYPE html>` + ReactDOMServer.renderToStaticMarkup(
        <Root
            env={process.env}
            getUrlHashified={getUrlHashified}
        />
    );


    /*
    *
    * Statics
    *
    */

    attachStaticRoutes(app, express);


    /*
    *
    * App Routes
    *
    */

    const router = express.Router();

    // router.get('/:langSlug(en|de|es|fr)?', (req, res) => {
    //     res.send(html);
    //     // res.sendFile(process.cwd() + '/public/index.html');
    // });

    router.get('/:langSlug(en|de|es|fr)/:langSlug([a-z-]+)?', (req, res) => {
        res.send(html);
        // res.render('index', {staticCacheBusted});
        // res.sendFile(process.cwd() + '/public/index.html');
    });


    app.use(router);
};
