'use strict';

// require('babel/polyfill');
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

import Langs from 'common/Langs';
import NavbarHeader from 'common/layout/NavbarHeader';

import Overview from 'Overview';
import Tracker from 'Tracker';





/*
*
* DOM Ready
*
*/

$(function() {
    attachRoutes();
    setImmediate(eml);
});



/*
*
* Routes
*
*/

function attachRoutes() {

    // Redirect '/' to '/en'
    page('/', redirectPage.bind(null, '/en'));

    page('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)?', function(ctx) {
        ReactDOM.render(
            <App {...ctx.params} />,
            document.getElementById('react-app')
        );
    });


    page.start({
        click   : true,
        popstate: true,
        dispatch: true,
        hashbang: false,
        decodeURLComponents: true,
    });
}





/*
*
* App Container
*
*/



class App extends React.Component {
    static propTypes = {
        langSlug : React.PropTypes.string.isRequired,
        worldSlug : React.PropTypes.string,
    }

    componentDidMount() {
        // console.log('App Started!');
    }

    render() {
        const langSlug  = this.props.langSlug;
        const worldSlug = this.props.worldSlug;

        const lang      = STATIC.langs[langSlug];
        const world     = getWorldFromSlug(langSlug, worldSlug);

        const hasWorld  = (world && !_.isEmpty(world));
        const Handler   = (hasWorld) ? Tracker : Overview;


        return (
            <div>
                <nav className='navbar navbar-default'>
                    <div className='container'>
                        <NavbarHeader />
                        <div id='nav-langs' className='pull-right'>
                            <Langs lang={lang} world={world} />
                        </div>
                    </div>
                </nav>


                <h1 style={{textAlign: 'center'}}>App update for HoT in progress</h1>

                <div id='content' className='container'>
                    <Handler lang={lang} world={world} />
                </div>
            </div>
        );
    }
}



/*
*
* Util
*
*/

function redirectPage(destination) {
    page.redirect(destination);
}



function getWorldFromSlug(langSlug, worldSlug) {
    return _.find(
        STATIC.worlds,
        world => world[langSlug].slug === worldSlug
    );
}



function eml() {
    const chunks = ['gw2w2w', 'schtuph', 'com', '@', '.'];
    const addr   = [chunks[0], chunks[3], chunks[1], chunks[4], chunks[2]].join('');

    $('.nospam-prz').each((i, el) => {
        $(el).replaceWith(
            $('<a>', {href: `mailto:${addr}`, text: addr})
        );
    });
}
