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
* React Components
*/

const Holdings  = require('./Holdings');



/*
* Component Globals
*/

const loadingHtml = (
    <h1 style={{height: '90px', fontSize: '32pt', lineHeight: '90px'}}>
        <i className='fa fa-spinner fa-spin'></i>
    </h1>
);




/*
*
* Component Definition
*
*/


class World extends React.Component {
    static propTypes = {
        holdings: React.PropTypes.instanceOf(Immutable.List).isRequired,
        score   : React.PropTypes.number.isRequired,
        tick    : React.PropTypes.number.isRequired,
        world   : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newWorld     = !Immutable.is(this.props.world, nextProps.world);
        const newScore     = (this.props.score !== nextProps.score);
        const newTick      = (this.props.tick !== nextProps.tick);
        const newHoldings  = !Immutable.is(this.props.holdings, nextProps.holdings);

        const shouldUpdate = (newWorld || newScore || newTick || newHoldings);

        return shouldUpdate;
    }



    render() {
        const color = this.props.world.get('color');

        return (
            <div className={`scoreboard team-bg team text-center ${color}`}>
                {(this.props.world && Immutable.Map.isMap(this.props.world))
                    ?  <div>
                        <h1><a href={this.props.world.get('link')}>
                            {this.props.world.get('name')}
                        </a></h1>
                        <h2>
                            {numeral(this.props.score).format('0,0')}
                            {' '}
                            {numeral(this.props.tick).format('+0,0')}
                        </h2>

                        <Holdings
                            color    = {color}
                            holdings = {this.props.holdings}
                        />
                    </div>
                    : loadingHtml
                }
            </div>
        );
    }
}




/*
*
* Export Module
*
*/

module.exports = World;
