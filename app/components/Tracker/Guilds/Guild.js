import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import ImmutablePropTypes  from 'react-immutable-proptypes';

import Emblem from 'components/common/icons/Emblem';



const spinner = <i className='fa fa-spinner fa-spin'></i>;


/*
*
*   Redux Helpers
*
*/
const guildsSelector = (state) => state.guilds;
const guildIdSelector = (state, props) => props.guildId;

const mapStateToProps = createSelector(
    guildsSelector,
    guildIdSelector,
    (guilds, guildId) => ({
        guildId,
        guild: guilds.get(guildId),
    })
);

// const mapStateToProps = (state, props) => {
//     if (props.guildId === 'C41686DD-A201-E411-863C-E4115BDF481D') {
//         console.log(props.guildId, state.guilds[props.guildId]);
//     }

//     return {
//         guild: state.guilds[props.guildId],
//     };
// };



class Guild extends React.Component {
    static propTypes = {
        guildId : React.PropTypes.string.isRequired,
        guild : ImmutablePropTypes.map,
    };

    shouldComponentUpdate(nextProps) {
        return !this.props.guild.equals(nextProps.guild);
    };

    render() {
        const { guild } = this.props;

        // console.log('tracker::guilds::render', guild.toJS());

        return (
            <a href={`https://guilds.gw2w2w.com/${guild.get('id')}`} id={guild.get('id')}>
                <Emblem key={guild.get('id')} guildId={guild.get('id')} />

                <div>{
                    (!guild.get('loading'))
                    ? <span>
                        <span className='guild-name'>{guild.get('name')}</span>
                        <span className='guild-tag'>{guild.get('tag') ? ` [${guild.get('tag')}]` : null}</span>
                    </span>
                    : spinner
                }</div>
            </a>
        );
    }
}


Guild.propTypes = {
    guild : ImmutablePropTypes.map,
};

Guild = connect(
  mapStateToProps
)(Guild);



export default Guild;