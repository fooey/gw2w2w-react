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

class Scoreboard extends React.Component {
    static propTypes = {
        match      : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
    };



    shouldComponentUpdate(nextProps) {
        const newWorlds    = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
        const newScores    = !Immutable.is(this.props.match.get('scores'), nextProps.match.get('scores'));
        const newTicks     = !Immutable.is(this.props.match.get('ticks'), nextProps.match.get('ticks'));
        const newHoldings  = !Immutable.is(this.props.match.get('holdings'), nextProps.match.get('holdings'));
        const shouldUpdate = (newWorlds || newScores || newTicks || newHoldings);

        return shouldUpdate;
    }



    render() {
        const scores   = this.props.match.get('scores');
        const ticks    = this.props.match.get('ticks');
        const holdings = this.props.match.get('holdings');

        return (
            <section className='row' id='scoreboards'>
                {this.props.matchWorlds.map((world, ixWorld) =>
                    <div className='col-sm-8' key = {ixWorld}>
                        <World
                            world    = {world}
                            score    = {scores.get(ixWorld) || 0}
                            tick     = {ticks.get(ixWorld) || 0}
                            holdings = {holdings.get(ixWorld)}
                        />
                    </div>
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

module.exports = Scoreboard;
