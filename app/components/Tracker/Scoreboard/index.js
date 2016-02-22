
import React from 'react';
import { connect } from 'react-redux';

import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import World from './World';






/*
*
* Component Definition
*
*/

const mapStateToProps = (state) => ({ worlds: state.matchDetails.get('worlds') });


let Scoreboard = ({
    worlds,
}) =>  {
    return (
        <section className='row' id='scoreboards'>{
            (Immutable.Map.isMap(worlds))
            ? worlds.keySeq().map(
                (color) => (
                    <div className='col-sm-8' key={color}>
                        <World color={color} />
                    </div>
                )
            )
            : null
        }</section>
    );
};
Scoreboard.propTypes = {
    worlds: ImmutablePropTypes.map,
};

Scoreboard = connect(
  mapStateToProps
)(Scoreboard);




/*
*
* private methods
*
*/

function getWorldsProps(stats, worlds) {
    // const worldsProps = Immutable.fromJS({
    //     red: { color: 'red', world: worlds.getIn('red'), stats: getWorldStats(stats, 'red') },
    //     blue: { color: 'blue', world: worlds.getIn('blue'), stats: getWorldStats(stats, 'blue') },
    //     green: { color: 'green', world: worlds.getIn('green'), stats:  getWorldStats(stats, 'green') },
    // });

    const colors = Immutable.Map({
        red: {},
        blue: {},
        green: {},
    });

    if (!Immutable.Map.isMap(worlds)) {
        return colors;
    }

    const worldsProps = colors.map(
        (obj, color) => {
            console.log(obj, color, worlds.getIn([color]));
            return ({
                color,
                worldId: worlds.getIn([color]),
                stats: getWorldStats(stats, color),
            });
        }
    );


    // console.log('worldsProps', worldsProps);
    // console.log('match.worlds', match.worlds);

    // if (worlds) {
    //     worlds.forEach(
    //         (worldId, color) => {
    //             worldsProps.setIn([color, 'id'], worldId);
    //         }
    //     );
    // }

    // console.log('worldsProps', worldsProps);

    return worldsProps;
}


function getWorldStats(stats, color) {
    return Immutable.fromJS({
        deaths: stats.getIn(['deaths', color], 0),
        holdings: stats.getIn(['holdings', color], [0, 0, 0, 0]),
        kills: stats.getIn(['kills', color], 0),
        score: stats.getIn(['scores', color], 0),
        tick: stats.getIn(['ticks', color], 0),
    });
}



/*
*
* export
*
*/

export default Scoreboard;