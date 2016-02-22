// import _ from 'lodash';

import {
    INITIALIZE_GUILD,
    RECEIVE_GUILD,
    RECEIVE_GUILD_FAILED,
} from 'constants/actionTypes';



export const initializeGuild = ({ guildId }) => {
    // console.log('action::receiveGuild', guildId);

    return {
        type: INITIALIZE_GUILD,
        guildId,
    };
};



export const receiveGuild = ({ guildId, data }) => {
    // console.log('action::receiveGuild', guildId, data);
//
    return {
        type: RECEIVE_GUILD,
        guildId,
        name: data.guild_name,
        tag: data.tag,
    };
};



export const receiveGuildFailed = ({ guildId, err }) => {
    // console.log('action::receiveGuildFailed', guildId, err);

    return {
        type: RECEIVE_GUILD_FAILED,
        guildId,
        err,
    };
};