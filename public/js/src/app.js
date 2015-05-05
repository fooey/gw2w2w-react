'use strict';

require('babel/polyfill');

/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');
const page      = require('page');

const STATIC    = require('lib/static');



/*
* React Components
*/

const Langs     = require('common/Langs');
const Overview  = require('Overview');
const Tracker   = require('Tracker');





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
        React.render(
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
    componentDidMount() {
        console.log('App Started!');
    }

    render() {
        const langSlug  = this.props.langSlug;
        const worldSlug = this.props.worldSlug;

        const lang      = STATIC.langs.get(langSlug);
        const world     = getWorldFromSlug(langSlug, worldSlug);

        const hasWorld  = (world && Immutable.Map.isMap(world) && !world.isEmpty());

        const Handler   = (hasWorld) ? Tracker : Overview;

        // console.log('Langs::render()', this.props.lang.toJS());

        const navbarHeader = <div className="navbar-header">
            <a className="navbar-brand" href="/">
                <img src="/img/logo/logo-96x36.png" />
            </a>
        </div>;

        return <div>
            <nav className="navbar navbar-default">
                <div className="container">
                    {navbarHeader}
                    <div id="nav-langs" className="pull-right">
                        <Langs lang={lang} world={world} />
                    </div>
                </div>
            </nav>

            <div id="content" className="container">
                <Handler lang={lang} world={world} />
            </div>
        </div>;
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
    return STATIC.worlds
        .find(world => world.getIn([langSlug, 'slug']) === worldSlug);
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
