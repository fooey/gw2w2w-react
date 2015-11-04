'use strict';

// require('babel/polyfill'); //  using 'browser-polyfill.js'
console.clear();

/*
*
* Dependencies
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import page from 'page';

import STATIC from 'lib/static';



/*
* React Components
*/

import Langs from 'layout/Langs';
import NavbarHeader from 'layout/NavbarHeader';
import Footer from 'layout/Footer';

import Overview from 'Overview';
import Tracker from 'Tracker';





const App = ({langSlug, worldSlug}) => {
    const lang      = STATIC.langs[langSlug];
    const world     = getWorldFromSlug(langSlug, worldSlug);

    const hasWorld  = (world && !_.isEmpty(world));
    const Handler   = (hasWorld) ? Tracker : Overview;


    return (
        <div>
            <nav className='navbar navbar-default'>
                <div className='container'>
                    <NavbarHeader />
                    <Langs lang={lang} world={world} />
                </div>
            </nav>

            <section id='content' className='container'>
                <Handler lang={lang} world={world} />
            </section>

            <Footer obsfuEmail={{
                chunks: ['gw2w2w', 'schtuph', 'com', '@', '.'],
                pattern: '03142',
            }} />
        </div>
    );
};





/*
*
* Launch App
*
*/

(function() {
    page('/', () => page.redirect('/en'));

    page(
        '/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)?',
        (ctx) =>
        ReactDOM.render(
            <App {...ctx.params} />,
            document.getElementById('react-app')
        )
    );


    page.start({
        click   : true,
        popstate: true,
        dispatch: true,
        hashbang: false,
        decodeURLComponents: true,
    });
}());





/*
*
* Util
*
*/


function getWorldFromSlug(langSlug, worldSlug) {
    return _.find(
        STATIC.worlds,
        world => world[langSlug].slug === worldSlug
    );
}
