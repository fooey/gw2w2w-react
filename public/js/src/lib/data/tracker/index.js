"use strict";

const Immutable = require('Immutable');
const _         = require('lodash');

const libDate   = require('lib/date');
const api       = require('lib/api');
const STATIC    = require('lib/static');





class TrackerDataProvider {

    constructor(lang, listeners) {
        // console.log('lib::data::tracker::constructor()');

        this.lang = lang;

        this.mounted = false;
        this.listeners = listeners;

        this.timeouts  = {};
        this.intervals = {};
    }



    init() {
        // console.log('lib::data::tracker::init()');

        this.mounted = true;
    }



    close() {
        // console.log('lib::data::tracker::close()');

        this.mounted   = false;

        this.timeouts  = _.map(this.timeouts,  t => clearTimeout(t));
        this.intervals = _.map(this.intervals, i => clearInterval(i));
    }



    getDefaults() {
        // console.log('lib::data::tracker::getDefaults()');

        return {
            hasData    : false,

            dateNow    : libDate.dateNow(),
            lastmod    : 0,
            timeOffset : 0,

            match      : Immutable.Map({lastmod:0}),
            matchWorlds: Immutable.List(),
            details    : Immutable.Map(),
            claimEvents: Immutable.List(),
            guilds     : Immutable.Map(),
        };
    }
}





module.exports = TrackerDataProvider;
