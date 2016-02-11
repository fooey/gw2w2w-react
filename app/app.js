
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';


import domready from 'domready';
import page from 'page';




import Container from 'components/Layout/Container';
import Overview from 'components/Overview';
import Tracker from 'components/Tracker';

import appReducers from 'reducers';

import { setRoute } from 'actions/route';
import { setLang } from 'actions/lang';
import { setWorld, clearWorld } from 'actions/world';



/*
*
*   Create Redux Store
*
*/

const store = createStore(
    appReducers,
    applyMiddleware(thunkMiddleware)
);



/*
*
*   Start App
*
*/

domready(() => {
    console.clear();
    console.log('Starting Application');


    attachMiddleware();
    attachRoutes();

    page.start({
        click: true,
        popstate: false,
        dispatch: true,
        hashbang: false,
        decodeURLComponents: true,
    });
});



function render(App) {
    // console.log('render()');

    ReactDOM.render(
        <Provider store={store}>
            <Container>
                {App}
            </Container>
        </Provider>,
        document.getElementById('react-app')
    );
}




function attachMiddleware() {
    page((ctx, next) => {
        console.info(`route => ${ctx.path}`);

        // attach store to the router context
        ctx.store = store;
        ctx.store.dispatch(setRoute(ctx));

        next();
    });


    page('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)?', (ctx, next) => {
        const { langSlug, worldSlug } = ctx.params;

        ctx.store.dispatch(setLang(langSlug));

        if (worldSlug) {
            ctx.store.dispatch(setWorld(langSlug, worldSlug));
        }
        else {
            ctx.store.dispatch(clearWorld());
        }

        next();
    });
}



function attachRoutes() {
    page('/', '/en');

    page(
        '/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)',
        (ctx) => {
            // const { langSlug, worldSlug } = ctx.params;

            // ctx.store.dispatch(setLang(langSlug));
            // ctx.store.dispatch(setWorld(langSlug, worldSlug));

            const { lang, world } = ctx.store.getState();

            render(<Tracker lang={lang} world={world} />);
        }
    );

    page(
        '/:langSlug(en|de|es|fr)',
        (ctx) => {
            // const { langSlug } = ctx.params;

            // ctx.store.dispatch(setLang(langSlug));
            // ctx.store.dispatch(clearWorld());

            render(<Overview />);
        }
    );
}
