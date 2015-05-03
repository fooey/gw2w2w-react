'use strict';

const Immutable = require('Immutable');
const _         = require('lodash');

const GuildsDAO = require('./guilds');

const api       = require('lib/api');
const STATIC    = require('lib/static');


class OverviewDataProvider {

    constructor(listeners) {
        // console.log('lib::data::tracker::constructor()');

        this.__langSlug  = null;
        this.__worldSlug = null;

        this.guilds      = new GuildsDAO();


        this.__mounted   = false;
        this.__listeners = listeners;

        this.__timeouts  = {};
        this.__intervals = {};
    }



    init(lang, world) {
        // console.log('lib::data::tracker::init()');

        this.__langSlug  = lang.get('slug');
        this.__worldSlug = world.getIn([this.__langSlug, 'slug']);


        this.__mounted = true;
        this.__getData();
    }



    close() {
        // console.log('lib::data::tracker::close()');

        this.__mounted   = false;

        this.__timeouts  = _.map(this.__timeouts,  t => clearTimeout(t));
        this.__intervals = _.map(this.__intervals, i => clearInterval(i));
    }



    getMatchWorlds(lang, match) {
        return Immutable
            .List(['red', 'blue', 'green'])
            .map(getMatchWorld.bind(null, lang, match));
    }


    /*
    *
    *   Private Methods
    *
    */

    __getData() {
        // console.log('lib::data::tracker::__getData()');

        api.getMatchDetailsByWorld(
            this.__worldSlug,
            this.__onMatchDetails.bind(this)
        );
    }



    __onMatchDetails(err, data) {
        // console.log('lib::data::tracker::__onMatchData()', data);

        if (!this.__mounted) {
            return;
        }


        if (!err && data && data.match && data.details) {
            const timeRemote  = Immutable.fromJS(data.now);
            const matchData   = Immutable.fromJS(data.match);
            const detailsData = Immutable.fromJS(data.details);

            this.__listeners.onMatchDetails(timeRemote, matchData, detailsData);
        }


        this.__rescheduleDataUpdate.call(this);
    }



    __rescheduleDataUpdate() {
        const refreshTime = _.random(1000 * 2, 1000 * 4);

        this.__timeouts.data = setTimeout(this.__getData.bind(this), refreshTime);
    }
}




/*
*   Worlds
*/

function getMatchWorld(lang, match, color) {
    const langSlug    = lang.get('slug');
    const worldKey    = color + 'Id';
    const worldId     = match.getIn([worldKey]).toString();
    const worldByLang = STATIC.worlds.getIn([worldId, langSlug]);

    return worldByLang
        .set('color', color)
        .set('link', getWorldLink(langSlug, worldByLang));
}



function getWorldLink(langSlug, world) {
    return ['', langSlug, world.get('slug')].join('/');
}



module.exports = OverviewDataProvider;
