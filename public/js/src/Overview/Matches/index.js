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

const Match = require('./Match');



/*
* Component Globals
*/

const loadingHtml = <span style={{paddingLeft: '.5em'}}><i className='fa fa-spinner fa-spin' /></span>;




/*
*
* Component Definition
*
*/

class Matches extends React.Component {
    static propTypes = {
        matches: React.PropTypes.instanceOf(Immutable.Map).isRequired,
        region : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        worlds : React.PropTypes.instanceOf(Immutable.Seq).isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newRegion    = !Immutable.is(this.props.region, nextProps.region);
        const newMatches   = !Immutable.is(this.props.matches, nextProps.matches);
        const newWorlds    = !Immutable.is(this.props.worlds, nextProps.worlds);
        const shouldUpdate = (newRegion || newMatches || newWorlds);

        // console.log('overview::Matches::shouldComponentUpdate()', {shouldUpdate, newRegion, newMatches, newWorlds});

        return shouldUpdate;
    }



    render() {
        const props = this.props;

        // console.log('overview::Matches::render()');
        // console.log('overview::Matches::render()', 'region', props.region.toJS());
        // console.log('overview::Matches::render()', 'matches', props.matches.toJS());
        // console.log('overview::Matches::render()', 'worlds', props.worlds);

        return (
            <div className='RegionMatches'>
                <h2>
                    {props.region.get('label')} Matches
                    {!props.matches.size ? loadingHtml : null}
                </h2>

                {props.matches.map(match =>
                    <Match
                        key       = {match.get('id')}
                        className = 'match'

                        match     = {match}
                        worlds    = {props.worlds}
                    />
                )}
            </div>
        );
    }
}





/*
*
* Export Module
*
*/

module.exports = Matches;
