
import $ from 'jQuery';
import _ from 'lodash';
import async from 'async';

import * as api from 'lib/api';

const URL_API_GUILDS = `https://api.guildwars2.com/v1/guild_details.json`;





/*
 *
 * Module Globals
 *
 */

const NUM_QUEUE_CONCURRENT = 4;




/*
 *
 * Public Methods
 *
 */

export default class LibGuilds {
    constructor() {
        // this.component = component;

        this.__asyncGuildQueue = async.queue(
            getGuildDetailsFromQueue,
            NUM_QUEUE_CONCURRENT
        );
    }


    lookup(guilds, onDataListener) {
        const toQueue = _.map(
            guilds,
            guildId => ({
                guildId,
                onData: onDataListener,
            })
        );


        this.__asyncGuildQueue.push(toQueue);
    }

}







/*
 *
 * Private Methods
 *
 */



function getGuildDetailsFromQueue(cargo, onComplete) {
    // console.log('getGuildDetailsFromQueue', cargo, cargo.guildId);

    api.getGuildById({
        guildId: cargo.guildId,
        success: (data) => onGuildData(data, cargo),
        complete: onComplete,
    });
}



function onGuildData(data, cargo) {
    // console.log('onGuildData', data);

    if (data && !_.isEmpty(data)) {
        cargo.onData({
            id: data.guild_id,
            name: data.guild_name,
            tag: data.tag,
        });
    }
}
