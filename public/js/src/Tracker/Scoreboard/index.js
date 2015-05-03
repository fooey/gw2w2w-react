'use strict';

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

const World     = require('./World');




/*
*
* Component Definition
*
*/

const propTypes = {
    matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
    match      : React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

class Scoreboard extends React.Component {
    shouldComponentUpdate(nextProps) {
        const newWorlds    = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
        const newScores    = !Immutable.is(this.props.match.get('scores'), nextProps.match.get('scores'));
        const shouldUpdate = (newWorlds || newScores);

        return shouldUpdate;
    }



    render() {
        const scores   = this.props.match.get('scores');
        const ticks    = this.props.match.get('ticks');
        const holdings = this.props.match.get('holdings');

        return (
            <section className="row" id="scoreboards">
                {this.props.matchWorlds.map((world, ixWorld) =>
                    <World
                        key      = {ixWorld}
                        world    = {world}
                        score    = {scores.get(ixWorld) || 0}
                        tick     = {ticks.get(ixWorld) || 0}
                        holdings = {holdings.get(ixWorld)}
                    />
                )}
            </section>
        );
    }
}




/*
*
* Export Module
*
*/

Scoreboard.propTypes = propTypes;
module.exports       = Scoreboard;
