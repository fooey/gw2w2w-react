import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';


import Guild from './Guild';



/*
*
*   Reselect Helpers
*
*/


const guildsSelector = (state) => state.guilds;
const matchDetailsSelector = (state) => state.matchDetails;


const matchGuildIdsSelector = createSelector(
    matchDetailsSelector,
    (matchDetails) => (Immutable.Map.isMap(matchDetails) && matchDetails.has('guildIds'))
        ? matchDetails.get('guildIds')
        : Immutable.List()
);


const matchGuildsSelector = createSelector(
    guildsSelector,
    matchGuildIdsSelector,
    (guilds, guildIds) => guilds.filter(g => guildIds.includes(g.get('id')))
);

const sortedGuildsSelector = createSelector(
    matchGuildsSelector,
    (guildsUnsorted) => {
        const guilds = guildsUnsorted
            .sortBy(g => g.get('id'))
            .sortBy(g => g.get('name'))
            .map(g => g.get('id'));

        return { guilds };
    }
);

// const sortedGuildIdsSelector = createSelector(
//     sortedGuildsSelector,
//     (unsortedGuilds) => {
//         return { guilds: unsortedGuilds.map(g => g.get('id')).toList() };
//     }
// );






const Wrapper = ({ children }) => (
    <div className='row'>
        <div className='col-md-24'>
            {children}
        </div>
    </div>
);


class Guilds extends React.Component {
    static propTypes = {
        guilds : ImmutablePropTypes.map.isRequired,
    };

    shouldComponentUpdate(nextProps) {
        return !this.props.guilds.equals(nextProps.guilds);
    }

    render() {
        const {
            guilds,
        } = this.props;

        // console.log('tracker::guilds::render'/*, guilds.toJS()*/);

        return (
            <Wrapper>
                <ul id='guilds' className='list-unstyled'>
                    {guilds.map(
                        guildId =>
                        <li key={guildId} className='guild'>
                            <Guild guildId={guildId} />
                        </li>
                    )}
                </ul>
            </Wrapper>
        );

    }
};
Guilds = connect(
  sortedGuildsSelector
)(Guilds);


export default Guilds;