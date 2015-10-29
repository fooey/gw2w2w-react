'use strict';

import _ from 'lodash';
import request from'superagent';

import STATIC from 'lib/static';


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

        request
            .get(URL_API_MATCHES)
            .end((err, res) => {
                if (this.__mounted) {
                    this.__setDataTimeout();

                    if (!err) {
                        this.__onMatchData(res);
                    }
                }
            });
    }



    __setDataTimeout() {
        const interval = getInterval();

        // console.log('lib::data::overview::__setDataTimeout()', interval);

        this.__timeouts.matchData = setTimeout(
            this.__getData.bind(this),
            interval
        );

    }



    __onMatchData(res) {
        // console.log('lib::data::overview::__onMatchData()', textStatus, jqXHR, data);

        if (res.body && !_.isEmpty(res.body)) {
            (this.__listeners.onMatchData || _.noop)(res.body);
        }
    }
}






function getInterval() {
    return _.random(4000, 8000);
}
