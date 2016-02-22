import Immutable from 'immutable';


import {
    INITIALIZE_GUILD,
    RECEIVE_GUILD,
    RECEIVE_GUILD_FAILED,
} from 'constants/actionTypes';



const defaultState = Immutable.Map();


const guilds = (state = defaultState, action) => {
    // console.log('reducer::guilds', state, action);

    switch (action.type) {

        case INITIALIZE_GUILD:
            // console.log('reducer::guilds', INITIALIZE_GUILD, state, action);
            return state.set(
                action.guildId,
                Immutable.Map({
                    id: action.guildId,
                    loading: true,
                })
            );

        case RECEIVE_GUILD:
            // console.log('reducer::guilds', RECEIVE_GUILD, state, action);
            return state.set(
                action.guildId,
                Immutable.Map({
                    id: action.guildId,
                    name: action.name,
                    tag: action.tag,
                    loading: false,
                })
            );

        case RECEIVE_GUILD_FAILED:
            // console.log('reducer::guilds', RECEIVE_GUILD_FAILED, state, action);
            return state.setIn([action.guildId, 'error'], action.error);

        default:
            return state;
    }
};




export default guilds;