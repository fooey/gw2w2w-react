
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { connect, Provider  } from 'react-redux';

import page from 'page';
import domready from 'domready';

import * as STATIC from 'lib/static';



/*
* React Components
*/

import Container from 'components/Layout/Container';
import Overview from 'components/Overview';
import Tracker from 'components/Tracker';

import appReducers from 'reducers';

import {setRoute} from 'actions/route';
import {setLang} from 'actions/lang';
import {setWorld} from 'actions/world';

import {getWorldFromSlug} from 'lib/worlds';


/*
*
* Launch App
*
*/

domready(() => start());



/*
*
* container
*
*/


// }



function start() {
    const store = createStore(appReducers);


    console.clear();
    console.log('Starting Application');


    page('/', () => page.redirect('/en'));

    page(
        '/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)',
        ctx => {
            console.log(`route => ${ctx.path}`);

            const lang = STATIC.langs[ctx.params.langSlug];
            const world = getWorldFromSlug(ctx.params.langSlug, ctx.params.worldSlug);

            store.dispatch(setRoute(ctx));
            store.dispatch(setLang(ctx.params.langSlug));
            store.dispatch(setWorld(ctx.params.langSlug, ctx.params.worldSlug));

            ReactDOM.render(
                <Provider store={store}>
                    <Container>
                        <Tracker lang={lang} world={world} />
                    </Container>
                </Provider>,
                document.getElementById('react-app')
            );
        }
    );

    page(
        '/:langSlug(en|de|es|fr)',
        ctx => {
            console.log(`route => ${ctx.path}`);

            store.dispatch(setRoute(ctx));
            store.dispatch(setLang(ctx.params.langSlug));

            ReactDOM.render(
                <Provider store={store}>
                    <Container>
                        <Overview />
                    </Container>
                </Provider>,
                document.getElementById('react-app')
            );
        }
    );


    page.start({
        click: true,
        popstate: true,
        dispatch: true,
        hashbang: false,
        decodeURLComponents: true,
    });
}











/*
*
* Util
*
*/