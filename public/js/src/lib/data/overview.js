"use strict";

const Immutable = require('Immutable');
const _         = require('lodash');

const api       = require('lib/api');
const STATIC    = require('lib/static');


class OverviewDataProvider {

    constructor(listeners) {
        // console.log('lib::data::overview::constructor()');

        this.__mounted   = false;
        this.__listeners = listeners;

        this.__timeouts  = {};
        this.__intervals = {};
    }



    init() {
        // console.log('lib::data::overview::init()');

        this.__mounted = true;
        this.__getData();
    }



    close() {
        // console.log('lib::data::overview::close()');

        this.__mounted   = false;

        this.__timeouts  = _.map(this.__timeouts,  t => clearTimeout(t));
        this.__intervals = _.map(this.__intervals, i => clearInterval(i));
    }



    getWorldsByRegion(lang) {
        return Immutable
            .Seq(STATIC.worlds)
            .map(world     => getWorldByLang(lang, world))
            .sortBy(world  => world.get('name'))
            .groupBy(world => world.get('region'));
    }



    getMatchesByRegion(matchData) {
        return Immutable
            .Seq(matchData)
            .groupBy(match => match.get("region").toString());
    }


    /*
    *
    *   Private Methods
    *
    */

    __getData() {
        // console.log('lib::data::overview::__getData()');
        api.getMatches(this.__onMatchData.bind(this));
    }



    __setDataTimeout() {
        const interval = getInterval();
        // console.log('lib::data::overview::__setDataTimeout()', interval);

        this.__timeouts.matchData = setTimeout(
            this.__getData.bind(this),
            interval
        );
    }



    __onMatchData(err, data) {
        // console.log('lib::data::overview::__onMatchData()', data);

        if (!this.__mounted) {
            return;
        }

        const matchData = Immutable.fromJS(data);

        if (!err && matchData && !matchData.isEmpty()) {
            (this.__listeners.onMatchData || _.noop)(matchData);
        }

        this.__setDataTimeout();
    }
}



/*
 * Data - Worlds
 */

function getWorldByLang(lang, world) {
    const langSlug    = lang.get('slug');
    const worldByLang = world.get(langSlug);

    const region      = world.get('region');
    const link        = getWorldLink(langSlug, worldByLang);

    return worldByLang.merge({
        link, region
    });
}

function getWorldLink(langSlug, world) {
    return ['', langSlug, world.get('slug')].join('/');
}






function getInterval() {
    return _.random(2000, 4000);
}



module.exports = OverviewDataProvider;
