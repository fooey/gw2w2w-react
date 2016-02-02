
/*
*
* Dependencies
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore } from 'redux';
// import { connect, Provider  } from 'react-redux';

import page from 'page';
import domready from 'domready';

import * as STATIC from 'lib/static';



/*
* React Components
*/

import Langs from 'layout/Langs';
import NavbarHeader from 'layout/NavbarHeader';
import Footer from 'layout/Footer';

import Overview from 'Overview';
import Tracker from 'Tracker';

// let store = createStore(() => {});

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

// const App = ({
//     langSlug,
//     worldSlug,
// }) => {
//     const lang = STATIC.langs[langSlug];
//     const world = getWorldFromSlug(langSlug, worldSlug);

//     const hasWorld = (world && !_.isEmpty(world));
//     const Handler = (hasWorld) ? Tracker : Overview;


//     return (
//         <div>
//             <nav className='navbar navbar-default'>
//                 <div className='container'>
//                     <NavbarHeader />
//                     <Langs lang={lang} world={world} />
//                 </div>
//             </nav>

//             <section id='content' className='container'>
//                 <Handler lang={lang} world={world} />
//             </section>

//             <Footer obsfuEmail={{
//                 chunks: ['gw2w2w', 'schtuph', 'com', '@', '.'],
//                 pattern: '03142',
//             }} />
//         </div>
//     );
// };

let Container = ({
    children,
    lang,
    world,
}) => {
    return (
        <div>
            <nav className='navbar navbar-default'>
                <div className='container'>
                    <NavbarHeader />
                    <Langs lang={lang} world={world} />
                </div>
            </nav>

            <section id='content' className='container'>
                {children}
            </section>

            <Footer obsfuEmail={{
                chunks: ['gw2w2w', 'schtuph', 'com', '@', '.'],
                pattern: '03142',
            }} />
        </div>
    );
};

Container.propTypes = {
    children: React.PropTypes.node.isRequired,
    lang: React.PropTypes.object.isRequired,
    world: React.PropTypes.object,
};

// Container = connect()(Container);



// function renderApp(ctx) {
//     return ReactDOM.render(
//         <App {...ctx.params} />,
//         document.getElementById('react-app')
//     );
// }



function start() {
    console.clear();
    console.log('Starting Application');

    page('/', () => page.redirect('/en'));

    page(
        '/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)',
        ctx => {
            const lang = STATIC.langs[ctx.params.langSlug];
            const world = getWorldFromSlug(ctx.params.langSlug, ctx.params.worldSlug);
            console.log(`route => ${ctx.path}`);

            ReactDOM.render(
                <Container lang={lang} world={world}>
                    <Tracker lang={lang} world={world} />
                </Container>,
                document.getElementById('react-app')
            );
        }
    );

    page(
        '/:langSlug(en|de|es|fr)',
        ctx => {
            const lang = STATIC.langs[ctx.params.langSlug];
            console.log(`route => ${ctx.path}`);

            ReactDOM.render(
                <Container lang={lang}>
                    <Overview lang={lang} />
                </Container>,
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


function getWorldFromSlug(langSlug, worldSlug) {
    return _.find(
        STATIC.worlds,
        world => world[langSlug].slug === worldSlug
    );
}
