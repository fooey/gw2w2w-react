
import fs from 'fs';
import path from 'path';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import attachStaticRoutes from './statics';

import Layout from 'views/Layout';



export function initRoutes(app, express) {
    const html = `<!DOCTYPE html>` + ReactDOMServer.renderToStaticMarkup(
        <Layout
            env={process.env}
            staticCacheBusted={staticCacheBusted}
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

    router.get('/:langSlug(en|de|es|fr)?', (req, res) => {
        res.send(html);
        // res.sendFile(process.cwd() + '/public/index.html');
    });

    router.get('/:langSlug(en|de|es|fr)/:langSlug([a-z-]+)', (req, res) => {
        res.send(html);
        // res.render('index', {staticCacheBusted});
        // res.sendFile(process.cwd() + '/public/index.html');
    });


    app.use(router);
};



export function staticCacheBusted(urlPath, filePath) {
    const fullPath = path.join(process.cwd(), filePath);
    const { dir, name, ext } = path.parse(urlPath);

    const timestamp = fs.statSync(fullPath).mtime.getTime();
    const timeHex = timestamp.toString(36);

    const hashToken = `~${timeHex}~`;
    const hashName = `${name}.${hashToken}${ext}`;
    const hashPath =  `${dir}/${hashName}`;

    return hashPath;
}
