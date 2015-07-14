'use strict';

/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');
const _         = require('lodash');

const STATIC    = require('gw2w2w-static');




/*
* React Components
*/

const Objective = require('../Objectives');





/*
* Component Globals
*/

const captureCols = {
    elapsed  : true,
    timestamp: true,
    mapAbbrev: true,
    arrow    : true,
    sprite   : true,
    name     : true,
    eventType: false,
    guildName: false,
    guildTag : false,
    timer    : false,
};

const claimCols = {
    elapsed  : true,
    timestamp: true,
    mapAbbrev: true,
    arrow    : true,
    sprite   : true,
    name     : true,
    eventType: false,
    guildName: true,
    guildTag : true,
    timer    : false,
};




/*
*
* Component Definition
*
*/


class Entry extends React.Component {
    static propTypes = {
        entry      : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        eventFilter: React.PropTypes.string.isRequired,
        guild      : React.PropTypes.instanceOf(Immutable.Map),
        guildId    : React.PropTypes.string,
        lang       : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        mapFilter  : React.PropTypes.string.isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newLang        = !Immutable.is(this.props.lang, nextProps.lang);

        const newGuild       = !Immutable.is(this.props.guild, nextProps.guild);
        const newEntry       = !Immutable.is(this.props.entry, nextProps.entry);
        const newData        = (newGuild || newEntry);

        const newMapFilter   = !Immutable.is(this.props.mapFilter, nextProps.mapFilter);
        const newEventFilter = !Immutable.is(this.props.eventFilter, nextProps.eventFilter);
        const newFilters     = (newMapFilter || newEventFilter);

        const shouldUpdate   = (newLang || newData || newFilters);

        // console.log('Tracker::Log::Entry::shouldComponentUpdate()', newRemoteNow, nextProps.remoteNow);

        return shouldUpdate;
    }



    render() {
        // console.log('Entry:render()');
        const eventType = this.props.entry.get('type');
        const cols      = (eventType === 'claim') ? claimCols : captureCols;
        const oMeta     = STATIC.objective_meta[this.props.entry.get('objectiveId')];
        const mapColor  = _.find(STATIC.objective_map, map => map.mapIndex === oMeta.map).color;


        const matchesMapFilter   = this.props.mapFilter === 'all' || this.props.mapFilter === mapColor;
        const matchesEventFilter = this.props.eventFilter === 'all' || this.props.eventFilter === eventType;
        const shouldBeVisible    = (matchesMapFilter && matchesEventFilter);
        const className          = shouldBeVisible ? 'show-entry' : 'hide-entry';


        return (
            <li className={className}>
                <Objective
                    cols        = {cols}
                    guild       = {this.props.guild}
                    guildId     = {this.props.guildId}
                    lang        = {this.props.lang}

                    entryId     = {this.props.entry.get('id')}
                    eventType   = {this.props.entry.get('type')}
                    objectiveId = {this.props.entry.get('objectiveId')}
                    timestamp   = {this.props.entry.get('timestamp')}
                    worldColor  = {this.props.entry.get('world')}
                />
            </li>
        );
    }
}




/*
*
* Export Module
*
*/

module.exports  = Entry;
