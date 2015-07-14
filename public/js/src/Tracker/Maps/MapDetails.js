'use strict';

/*
*
* Dependencies
*
*/

const React      = require('react');
const Immutable  = require('Immutable');
// const $          = require('jQuery');

const STATIC     = require('lib/static');




/*
* React Components
*/

const MapScores  = require('./MapScores');
const MapSection = require('./MapSection');





/*
*
* Component Definition
*
*/

class MapDetails extends React.Component {
    static propTypes = {
        details    : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        guilds     : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        lang       : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        mapKey     : React.PropTypes.string.isRequired,
        mapMeta    : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
    }



    constructor(props) {
        super(props);

        const mapMeta = STATIC.objective_map.find(mm => mm.get('key') === this.props.mapKey);
        const mapIndex = mapMeta.get('mapIndex').toString();

        this.state = {
            mapIndex,
            mapMeta,
        };
    }



    shouldComponentUpdate(nextProps) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);

        const newGuilds    = !Immutable.is(this.props.guilds, nextProps.guilds);
        const newScores    = !Immutable.is(this.props.details.getIn(['maps', 'scores']), nextProps.details.getIn(['maps', 'scores', this.state.mapIndex]));
        const newOwners    = !Immutable.is(this.props.details.getIn(['objectives', 'owners']), nextProps.details.getIn(['objectives', 'owners']));
        const newClaimers  = !Immutable.is(this.props.details.getIn(['objectives', 'claimers']), nextProps.details.getIn(['objectives', 'claimers']));
        const newWorlds    = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
        const newData      = (newGuilds || newScores || newOwners || newClaimers || newWorlds);

        const shouldUpdate = (newLang || newData);

        // console.log('Tracker::Maps::MapDetails::shouldComponentUpdate()', newRemoteNow, nextProps.remoteNow);

        return shouldUpdate;
    }



    render() {

        const mapScores = this.props.details.getIn(['maps', 'scores', this.state.mapIndex]);
        const owners    = this.props.details.getIn(['objectives', 'owners']);
        const claimers  = this.props.details.getIn(['objectives', 'claimers']);

        // console.log('Tracker::Maps::MapDetails:render()', mapScores.toJS());

        return (
            <div className='map'>

                <div className='mapScores'>
                    <h2 className={'team ' + this.props.mapMeta.get('color')} onClick={onTitleClick}>
                        {this.props.mapMeta.get('name')}
                    </h2>
                    <MapScores scores={mapScores} />
                </div>

                <div className='row'>
                    {this.props.mapMeta.get('sections').map((mapSection, ixSection) => {

                        const sectionObjectives = mapSection.get('objectives');
                        const sectionLabel      = mapSection.get('label');

                        return (
                            <MapSection
                                component  = 'ul'
                                key        = {ixSection}

                                claimers   = {claimers}
                                guilds     = {this.props.guilds}
                                label      = {sectionLabel}
                                lang       = {this.props.lang}
                                mapMeta    = {this.props.mapMeta}
                                objectives = {sectionObjectives}
                                owners     = {owners}
                            />
                        );
                    })}
                </div>


            </div>
        );
    }
}





/*
*
* Private Methods
*
*/

function onTitleClick(e) {
    let $maps    = $('.map');
    let $map     = $(e.target).closest('.map', $maps);

    let hasFocus = $map.hasClass('map-focus');


    if (!hasFocus) {
        $map
            .addClass('map-focus')
            .removeClass('map-blur');

        $maps.not($map)
            .removeClass('map-focus')
            .addClass('map-blur');
    }
    else {
        $maps
            .removeClass('map-focus')
            .removeClass('map-blur');

    }
}





/*
*
* Export Module
*
*/

module.exports = MapDetails;
