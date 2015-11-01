'use strict';

import _ from 'lodash';

import GuildsDAO from './guilds';
import api from 'lib/api';

import STATIC from 'lib/static';

const URL_API_MATCHES = `http://state.gw2w2w.com/world`;


export default class OverviewDataProvider {

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



    init(world) {
        // console.log('lib::data::tracker::init()', lang, world);

        this.setWorld(world);

        this.__mounted = true;
        this.__getData();
    }

    setWorld(world) {
        this.__worldId = world.id;
    }



    close() {
        // console.log('lib::data::tracker::close()');

        this.__mounted   = false;

        this.__timeouts  = _.map(this.__timeouts,  t => clearTimeout(t));
        this.__intervals = _.map(this.__intervals, i => clearInterval(i));
    }



    getMatchWorlds(match) {
        return _.map(
            {red: {}, blue: {}, green: {}},
            (j, color) => getMatchWorld(match, color)
        );
    }


    /*
    *
    *   Private Methods
    *
    */

    __getData() {
        // console.log('lib::data::tracker::__getData()');


        // api.getMatchByWorldSlug({
        //     worldSlug: this.__worldSlug,
        //     success: (data) => this.__onMatchDetails(data),
        //     complete: () => this.__rescheduleDataUpdate(),
        // });
        api.getMatchByWorldId({
            worldId: this.__worldId,
            success: (data) => this.__onMatchDetails(data),
            complete: () => this.__rescheduleDataUpdate(),
        });
    }



    __onMatchDetails(data) {
        // console.log('lib::data::tracker::__onMatchData()', data);

        if (!this.__mounted) {
            return;
        }


        if (data && !_.isEmpty(data)) {
            this.__listeners.onMatchDetails(data);
        }
    }



    __rescheduleDataUpdate() {
        const refreshTime = _.random(1000 * 4, 1000 * 8);

        // console.log('data refresh: ', refreshTime);

        this.__timeouts.data = setTimeout(this.__getData.bind(this), refreshTime);
    }
}




/*
*   Worlds
*/

function getMatchWorld(match, color) {
    const worldId = match.worlds[color].toString();

    const world = _.merge(
        {color: color},
        STATIC.worlds[worldId]
    );

    return world;
}
