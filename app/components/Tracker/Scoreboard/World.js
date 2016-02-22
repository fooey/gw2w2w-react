
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import numeral from 'numeral';

import Holdings from './Holdings';


import { worlds as staticWorlds } from 'lib/static';
const STATIC_WORLDS = Immutable.fromJS(staticWorlds);

export const rgbNum = Immutable.Map({ red: 0, blue: 0, green: 0 });

const Loading = ({  }) => (
    <h1 style={{ height: '100px', fontSize: '50px', lineHeight: '100px' }}>
        <i className='fa fa-spinner fa-spin'></i>
    </h1>
);




/*
*
* redux helpers
*
*/

const colorSelector = (state, props) => props.color;

const langSelector = (state) => state.lang;
const matchDetailsSelector = (state) => state.matchDetails;

const worldsSelector = createSelector(
    matchDetailsSelector,
    (matchDetails) => matchDetails.get('worlds')
);

const worldIdSelector = createSelector(
    colorSelector,
    worldsSelector,
    (color, worlds) => worlds.get(color).toString()
);

const worldSelector = createSelector(
    langSelector,
    worldIdSelector,
    (lang, worldId) => STATIC_WORLDS.getIn(
        [worldId, lang.get('slug')],
        Immutable.Map()
    )
);

const statsSelector = createSelector(
    matchDetailsSelector,
    (matchDetails) => matchDetails.get('stats')
);

const worldStatsSelector = createSelector(
    colorSelector,
    statsSelector,
    (color, stats) => Immutable
        .Map({
            deaths: {},
            kills: {},
            holdings: {},
            scores: {},
            ticks: {},
        })
        .map((v, key) => stats.getIn([key, color]))
);

const mapStateToProps = createSelector(
    colorSelector,
    langSelector,
    worldStatsSelector,
    worldSelector,
    worldIdSelector,
    (color, lang, stats, world, worldId) => ({
        color,
        lang,
        stats,
        world,
        worldId,
    })
);

// const mapStateToProps = (state, props) => {
//     const world = Immutable.fromJS(
//         (props.worldId)
//             ? worlds[props.worldId][state.lang.get('slug')]
//             : {}
//     );

//     return {
//         color: props.color,
//         lang: state.lang,
//         worldId: props.worldId,
//         stats: Immutable.Map(),
//         world,
//     };
// };


class World extends React.Component {
    static propTypes = {
        color: React.PropTypes.string.isRequired,
        lang: ImmutablePropTypes.map.isRequired,
        stats: React.PropTypes.object,
        world: React.PropTypes.object,
        worldId: React.PropTypes.string,
    };

    shouldComponentUpdate(nextProps) {
        const {
            lang,
            stats,
            world,
        } = this.props;

        return (
            !lang.equals(nextProps.lang)
            || !stats.equals(nextProps.stats)
            || !world.equals(nextProps.world)
        );
    }

    render() {
        const {
            color,
            lang,
            stats,
            world,
            worldId,
        } = this.props;

        // console.log('color', color);
        // console.log('worldId', worldId);
        // console.log('world', world.toJS());
        // console.log('stats', stats.toJS());

        return (
            <div className={`scoreboard team-bg team text-center ${color}`}>

                <div>
                    <h1>{
                        (world.has('name'))
                            ? <a href={world.get('link')}>{world.get('name')}</a>
                            : <i className='fa fa-spinner fa-spin'></i>
                    }</h1>

                    <h2>
                        <div className='stats'>
                            <span title='Total Score'>{numeral(stats.get('scores')).format('0,0')}</span>
                            {' '}
                            <span title='Total Tick'>{numeral(stats.get('ticks')).format('+0,0')}</span>
                        </div>
                        <div className='sub-stats'>
                            <span title='Total Kills'>{numeral(stats.get('kills')).format('0,0')}k</span>
                            {' '}
                            <span title='Total Deaths'>{numeral(stats.get('deaths')).format('0,0')}d</span>
                        </div>
                    </h2>

                    <Holdings
                        color={color}
                        holdings={stats.get('holdings')}
                    />
                </div>

            </div>
        );
    }
};

World = connect(
  mapStateToProps
)(World);



export default World;