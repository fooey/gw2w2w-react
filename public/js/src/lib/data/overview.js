"use strict";

const Immutable = require('Immutable');
const _         = require('lodash');

const api       = require('lib/api');
const STATIC    = require('lib/static');


class OverviewDataProvider {

    constructor(lang, listeners) {
        // console.log('lib::data::overview::constructor()');


        this.timeouts = {};

        this.lang = lang;
        this.listeners = listeners;
    }



    init(lang) {
        // console.log('lib::data::overview::init()');

        this.mounted = true;
        this.getData();
    }



    close() {
        // console.log('lib::data::overview::close()');

        this.mounted = false;
        this.timeouts = _.map(
            this.timeouts,
            (timeout) => clearTimeout(timeout)
        );
    }



    getDefaults() {
        // console.log('lib::data::overview::getDefaults()');

        const regions = Immutable.fromJS({
            '1': {label: 'NA', id: '1'},
            '2': {label: 'EU', id: '2'}
        });

        const matchesByRegion = Immutable.fromJS({'1': {}, '2': {}});
        const worldsByRegion  = getWorldsByRegion(this.lang); //Immutable.fromJS({'1': {}, '2': {}})

        return {
            regions,
            matchesByRegion,
            worldsByRegion
        };
    }



    setLang(lang) {
        // console.log('lib::data::overview::setLang()');

        if (!Immutable.is(lang, this.lang)) {
            this.lang = lang;

            const newWorldsByRegion = getWorldsByRegion(lang);
            (this.listeners.worldsByRegion || _.noop)(newWorldsByRegion);
        }
    }



    getData() {
        // console.log('lib::data::overview::getData()');
        api.getMatches(this.onMatchData.bind(this));
    }



    onMatchData(err, data) {
        // console.log('lib::data::overview::onMatchData()', data);

        if (!this.mounted) {
            return;
        }

        const matchData = Immutable.fromJS(data);

        if (!err && matchData && !matchData.isEmpty()) {
            const newMatchesByRegion = getMatchesByRegion(matchData);

            (this.listeners.matchesByRegion || _.noop)(newMatchesByRegion);
        }

        this.setDataTimeout();
    }



    setDataTimeout() {
        const interval = getInterval();
        // console.log('lib::data::overview::setDataTimeout()', interval);

        this.timeouts.matchData = setTimeout(
            this.getData.bind(this),
            interval
        );
    }
}



/*
* Data - Worlds
*/


function getWorldsByRegion(lang) {
    return Immutable
        .Seq(STATIC.worlds)
        .map(world     => getWorldByLang(lang, world))
        .sortBy(world  => world.get('name'))
        .groupBy(world => world.get('region'));
}



function getWorldByLang(lang, world) {
    const langSlug    = lang.get('slug');
    const worldByLang = world.get(langSlug);

    const region      = world.get('region');
    const link        = getWorldLink(langSlug, worldByLang);

    return worldByLang.merge({link, region});
}




/*
* Data - Matches
*/

function getWorldLink(langSlug, world) {
    return ['', langSlug, world.get('slug')].join('/');
}




function getMatchesByRegion(matchData) {
    return Immutable
        .Seq(matchData)
        .groupBy(match => match.get("region").toString());
}






function getInterval() {
    return _.random(2000, 4000);
}



module.exports = OverviewDataProvider;