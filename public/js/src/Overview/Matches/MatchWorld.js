"use strict";


/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');


/*
* React Components
*/

const Score     = require('./Score');
const Pie       = require('common/Icons/Pie');





/*
*
* Component Export
*
*/

const propTypes = {
    world  : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    scores : React.PropTypes.instanceOf(Immutable.List).isRequired,
    color  : React.PropTypes.string.isRequired,
    ixColor: React.PropTypes.number.isRequired,
    showPie: React.PropTypes.bool.isRequired,
};

class MatchWorld extends React.Component {
    shouldComponentUpdate(nextProps) {
        const newScores    = !Immutable.is(this.props.scores, nextProps.scores);
        const newColor     = !Immutable.is(this.props.color, nextProps.color);
        const newWorld     = !Immutable.is(this.props.world, nextProps.world);
        const shouldUpdate = (newScores || newColor || newWorld);

        // console.log('overview::MatchWorlds::shouldComponentUpdate()', shouldUpdate, newScores, newColor, newWorld);

        return shouldUpdate;
    }



    render() {
        const props = this.props;

        // console.log('overview::MatchWorlds::render()');

        return <tr>
            <td className={`team name ${props.color}`}>
                <a href={props.world.get('link')}>
                    {props.world.get('name')}
                </a>
            </td>
            <td className={`team score ${props.color}`}>
                <Score
                    team  = {props.color}
                    score = {props.scores.get(props.ixColor)}
                />
            </td>
            {(props.showPie)
                ? <td rowSpan="3" className="pie">
                    <Pie
                        scores = {props.scores}
                        size   = {60}
                    />
                </td>
                : null
            }
        </tr>;
    }
}




/*
*
* Export Module
*
*/

MatchWorld.propTypes = propTypes;
module.exports       = MatchWorld;
