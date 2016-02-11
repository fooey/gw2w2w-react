
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import attachStaticRoutes from './statics';
import { getUrlHashified } from 'lib/cacheBust';

import Html from 'components/Layout/Html';



export function initRoutes(app, express) {
    const html = `<!DOCTYPE html>` + ReactDOMServer.renderToStaticMarkup(
        <Html
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

    // const router = express.Router();

    // router.get('/:langSlug(en|de|es|fr)?', (req, res) => {
    //     res.send(html);
    //     // res.sendFile(process.cwd() + '/public/index.html');
    // });

    app.use('/$', (req, res) => res.redirect('/en'));

    app.use('/:langSlug(en|de|es|fr)/:langSlug([a-z-]+)?', (req, res) => {
        res.send(html);
    });


    // app.use(router);
};
