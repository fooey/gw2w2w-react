'use strict';

import _ from 'lodash';

import api from 'lib/api';


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

        api.getMatches({
            worldId: this.__worldId,
            success: (data) => this.__onMatchData(data),
            complete: () => this.__rescheduleDataUpdate(),
        });
    }



    __onMatchData(data) {
        // console.log('lib::data::overview::__onMatchData()', textStatus, jqXHR, data);

        if (data && !_.isEmpty(data)) {
            (this.__listeners.onMatchData || _.noop)(data);
        }
    }



    __rescheduleDataUpdate() {
        const interval = getInterval();

        // console.log('lib::data::overview::__rescheduleDataUpdate()', interval);

        this.__timeouts.matchData = setTimeout(
            this.__getData.bind(this),
            interval
        );

    }
}






function getInterval() {
    return _.random(4000, 8000);
}
