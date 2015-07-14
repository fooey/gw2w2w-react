'use strict';

/*
 *
 * Dependencies
 *
 */

const React     = require('react');
const Immutable = require('Immutable');

const STATIC    = require('lib/static');

const LangLink  = require('./LangLink');





/*
 *
 * Exported Component
 *
 */

class Langs extends React.Component {
    static propTypes = {
        lang : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        world: React.PropTypes.instanceOf(Immutable.Map),
    }



    render() {

        // console.log('Langs::render()', this.props.lang.toJS());

        return (
            <ul className = 'nav navbar-nav'>
                {STATIC.langs.map((linkLang, key) =>
                    <LangLink
                        key = {key}

                        lang = {this.props.lang}
                        linkLang = {linkLang}
                        world = {this.props.world}
                    />
                )}
            </ul>
        );
    }
}




/*
 *
 * Export Module
 *
 */

module.exports = Langs;
