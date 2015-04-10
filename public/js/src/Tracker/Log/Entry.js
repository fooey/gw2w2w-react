'use strict';

/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');

const $         = require('jQuery');
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

const propTypes = {
  lang       : React.PropTypes.instanceOf(Immutable.Map).isRequired,
  entry      : React.PropTypes.instanceOf(Immutable.Map).isRequired,
  guild      : React.PropTypes.instanceOf(Immutable.Map),
  mapFilter  : React.PropTypes.string.isRequired,
  eventFilter: React.PropTypes.string.isRequired,
};

class Entry extends React.Component {
  shouldComponentUpdate(nextProps) {
    const newLang        = !Immutable.is(this.props.lang, nextProps.lang);
    const newGuild       = !Immutable.is(this.props.guild, nextProps.guild);
    const newEntry       = !Immutable.is(this.props.entry, nextProps.entry);
    const newMapFilter   = !Immutable.is(this.props.mapFilter, nextProps.mapFilter);
    const newEventFilter = !Immutable.is(this.props.eventFilter, nextProps.eventFilter);
    const shouldUpdate   = (newLang || newGuild || newEntry || newMapFilter || newEventFilter);

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
          lang        = {this.props.lang}

          cols        = {cols}
          guildId     = {this.props.guildId}
          guild       = {this.props.guild}

          entryId     = {this.props.entry.get('id')}
          objectiveId = {this.props.entry.get('objectiveId')}
          worldColor  = {this.props.entry.get('world')}
          timestamp   = {this.props.entry.get('timestamp')}
          eventType   = {this.props.entry.get('type')}
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

Entry.propTypes = propTypes;
module.exports  = Entry;
