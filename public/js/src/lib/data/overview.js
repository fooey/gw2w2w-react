'use strict';

import _ from 'lodash';
import $ from 'jQuery';

// import STATIC from 'lib/static';


const URL_API_MATCHES = `http://state.gw2w2w.com/matches`;


export default class OverviewDataProvider {

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


    /*
    *
    *   Private Methods
    *
    */

    __getData() {
        // console.log('lib::data::overview::__getData()');

        // api.getMatches(this.__onMatchData.bind(this));

        $.ajax({
            url: URL_API_MATCHES,
            success: this.__onMatchData.bind(this),
            complete: this.__setDataTimeout.bind(this),
        });
    }



    __onMatchData(data) {
        // console.log('lib::data::overview::__onMatchData()', textStatus, jqXHR, data);

        if (data && !_.isEmpty(data)) {
            (this.__listeners.onMatchData || _.noop)(data);
        }
    }



    __setDataTimeout() {
        const interval = getInterval();

        // console.log('lib::data::overview::__setDataTimeout()', interval);

        this.__timeouts.matchData = setTimeout(
            this.__getData.bind(this),
            interval
        );

    }
}






function getInterval() {
    return _.random(4000, 8000);
}
