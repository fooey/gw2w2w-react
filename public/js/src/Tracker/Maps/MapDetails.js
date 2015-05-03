'use strict';

/*
*
* Dependencies
*
*/

const React      = require('react');
const Immutable  = require('Immutable');
const $          = require('jQuery');

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

const propTypes = {
    lang       : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    details    : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
    guilds     : React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

class MapDetails extends React.Component {
    shouldComponentUpdate(nextProps) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);

        const newGuilds    = !Immutable.is(this.props.guilds, nextProps.guilds);
        const newDetails   = !Immutable.is(this.props.details, nextProps.details);
        const newWorlds    = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
        const newData      = (newGuilds || newDetails || newWorlds);

        const shouldUpdate = (newLang || newData);

        // console.log('Tracker::Maps::MapDetails::shouldComponentUpdate()', newRemoteNow, nextProps.remoteNow);

        return shouldUpdate;
    }



    render() {
        const mapMeta   = STATIC.objective_map.find(mm => mm.get('key') === this.props.mapKey);
        const mapIndex  = mapMeta.get('mapIndex').toString();
        const mapScores = this.props.details.getIn(['maps', 'scores', mapIndex]);

        // console.log('Tracker::Maps::MapDetails:render()', mapScores.toJS());

        return (
            <div className="map">

                <div className="mapScores">
                    <h2 className={'team ' + mapMeta.get('color')} onClick={onTitleClick}>
                        {mapMeta.get('name')}
                    </h2>
                    <MapScores scores={mapScores} />
                </div>

                <div className="row">
                    {mapMeta.get('sections').map((mapSection, ixSection) => {

                        return (
                            <MapSection
                                component  = "ul"
                                key        = {ixSection}
                                mapSection = {mapSection}
                                mapMeta    = {mapMeta}

                                {...this.props}
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

MapDetails.propTypes = propTypes;
module.exports       = MapDetails;
