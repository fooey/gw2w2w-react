'use strict';

/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');

const numeral   = require('numeral');





/*
*
* Component Definition
*
*/

class MapScores extends React.Component {
    static propTypes = {
        scores: React.PropTypes.instanceOf(Immutable.List).isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newScores    = !Immutable.is(this.props.scores, nextProps.scores);
        const shouldUpdate = (newScores);

        return shouldUpdate;
    }



    render() {
        return (
            <ul className='list-inline'>
                {this.props.scores.map((score, ixScore) => {
                    const formatted = numeral(score).format('0,0');
                    const team      = ['red', 'blue', 'green'][ixScore];

                    return (
                        <li key={team} className={`team ${team}`}>
                            {formatted}
                        </li>
                    );
                })}
            </ul>
        );
    }
}





/*
*
* Export Module
*
*/

module.exports = MapScores;
