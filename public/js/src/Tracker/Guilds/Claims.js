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

const Objective = require('../Objectives');





/*
* Component Globals
*/

const objectiveCols = {
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




/*
*
* Component Definition
*
*/


class GuildClaims extends React.Component {
    static propTypes = {
        guild: React.PropTypes.instanceOf(Immutable.Map).isRequired,
        lang : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);
        const newClaims    = !Immutable.is(this.props.guild.get('claims'), nextProps.guild.get('claims'));

        const shouldUpdate = (newLang || newClaims);

        return shouldUpdate;
    }



    render() {
        const guildId = this.props.guild.get('guild_id');
        const claims  = this.props.guild.get('claims');


        return (
            <ul className='list-unstyled'>
                {claims.map(entry =>
                    <li key={entry.get('id')}>
                        <Objective
                            cols        = {objectiveCols}
                            guild       = {this.props.guild}
                            guildId     = {guildId}
                            lang        = {this.props.lang}
                            objectiveId = {entry.get('objectiveId')}
                            timestamp   = {entry.get('timestamp')}
                            worldColor  = {entry.get('world')}
                        />
                    </li>
                )}
            </ul>
        );
    }
}





/*
*
* Export Module
*
*/

module.exports        = GuildClaims;

