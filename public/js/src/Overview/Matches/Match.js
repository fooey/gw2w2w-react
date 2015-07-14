'use strict';


/*
*
* Dependencies
*
*/

const React      = require('react');
const Immutable  = require('Immutable');


/*
* React Components
*/

const MatchWorld = require('./MatchWorld');





/*
*
* Component Export
*
*/


class Match extends React.Component {
    static propTypes = {
        match : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newScores    = !Immutable.is(this.props.match.get('scores'), nextProps.match.get('scores'));
        const newMatch     = !Immutable.is(this.props.match.get('startTime'), nextProps.match.get('startTime'));
        const newWorlds    = !Immutable.is(this.props.worlds, nextProps.worlds);
        const shouldUpdate = (newScores || newMatch || newWorlds);

        return shouldUpdate;
    }



    render() {
        const props = this.props;

        // console.log('overview::Match::render()', props.match.toJS());

        const worldColors = ['red', 'blue', 'green'];

        return (
            <div className='matchContainer'>
                <table className='match'><tbody>
                    {worldColors.map((color, ixColor) => {
                        const worldKey = color + 'Id';
                        const worldId  = props.match.get(worldKey).toString();
                        const world    = props.worlds.get(worldId);
                        const scores   = props.match.get('scores');

                        return (
                            <MatchWorld
                                component = 'tr'
                                key       = {worldId}

                                color     = {color}
                                ixColor   = {ixColor}
                                scores    = {scores}
                                showPie   = {ixColor === 0}
                                world     = {world}
                            />
                        );
                    })}
                </tbody></table>
            </div>
        );
    }
}





/*
*
* Export Module
*
*/

module.exports  = Match;
