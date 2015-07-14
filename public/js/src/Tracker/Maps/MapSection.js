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

const Objective = require('Tracker/Objectives');





/*
*
* Module Globals
*
*/

const objectiveCols = {
    elapsed  : false,
    timestamp: false,
    mapAbbrev: false,
    arrow    : true,
    sprite   : true,
    name     : true,
    eventType: false,
    guildName: false,
    guildTag : true,
    timer    : true,
};





/*
*
* Component Definition
*
*/

class MapSection extends React.Component {
    static propTypes = {
        claimers  : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        guilds    : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        label     : React.PropTypes.string.isRequired,
        lang      : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        mapMeta   : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        objectives: React.PropTypes.instanceOf(Immutable.List).isRequired,
        owners    : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);

        const newGuilds    = !Immutable.is(this.props.guilds, nextProps.guilds);
        const newOwners    = !Immutable.is(this.props.owners, nextProps.owners);
        const newClaimers  = !Immutable.is(this.props.claimers, nextProps.claimers);
        const newData      = (newGuilds || newOwners || newClaimers);

        const shouldUpdate = (newLang || newData);

        // if (shouldUpdate) {
        //     console.log('newLang', newLang);
        //     console.log('newGuilds', newGuilds);
        //     console.log('newOwners', newOwners);
        //     console.log('newClaimers', newClaimers);
        //     console.log('newData', newData);
        // }

        return shouldUpdate;
    }

    render() {
        const objectives   = this.props.objectives;
        const owners       = this.props.owners;
        const claimers     = this.props.claimers;
        const sectionClass = getSectionClass(this.props.mapMeta.get('key'), this.props.label);

        // console.log(typeof objectives, objectives)

        return (
            <ul className={`list-unstyled ${sectionClass}`}>
                {objectives.map(objectiveId => {

                    const idString     = objectiveId.toString();
                    const owner        = owners.get(idString);
                    const claimer      = claimers.get(idString);

                    const guildId      = (claimer) ? claimer.get('guild') : null;
                    const hasClaimer   = !!guildId;

                    const hasGuildData = hasClaimer && this.props.guilds.has(guildId);
                    const guild        = hasGuildData ? this.props.guilds.get(guildId) : null;


                    return (
                        <li key={objectiveId} id={'objective-' + objectiveId}>
                            <Objective
                                cols        = {objectiveCols}
                                guild       = {guild}
                                guildId     = {guildId}
                                lang        = {this.props.lang}
                                objectiveId = {objectiveId}
                                timestamp   = {owner.get('timestamp')}
                                worldColor  = {owner.get('world')}
                            />
                        </li>
                    );

                })}
            </ul>
        );
    }
}





/*
*
* Private Methods
*
*/

function getSectionClass(mapKey, sectionLabel) {
    let sectionClass = [
        'col-md-24',
        'map-section',
    ];

    if (mapKey === 'Center') {
        if (sectionLabel === 'Castle') {
            sectionClass.push('col-sm-24');
        }
        else {
            sectionClass.push('col-sm-8');
        }
    }
    else {
        sectionClass.push('col-sm-8');
    }

    return sectionClass.join(' ');
}





/*
*
* Export Module
*
*/

module.exports       = MapSection;
