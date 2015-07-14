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

const Entry     = require('./Entry');




/*
*
* Component Definition
*
*/

class LogEntries extends React.Component {
    static defaultProps = {
        guilds: {},
    }



    static propTypes = {
        eventFilter        : React.PropTypes.string.isRequired,
        eventHistory       : React.PropTypes.instanceOf(Immutable.List).isRequired,
        guilds             : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        lang               : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        mapFilter          : React.PropTypes.string.isRequired,
        triggerNotification: React.PropTypes.bool.isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newLang         = !Immutable.is(this.props.lang, nextProps.lang);

        const newGuilds       = !Immutable.is(this.props.guilds, nextProps.guilds);
        const newEvents       = !Immutable.is(this.props.eventHistory, nextProps.eventHistory);
        const newData         = (newGuilds || newEvents);

        const newTriggerState = !Immutable.is(this.props.triggerNotification, nextProps.triggerNotification);
        const newFilterState  = !Immutable.is(this.props.mapFilter, nextProps.mapFilter) || !Immutable.is(this.props.eventFilter, nextProps.eventFilter);
        const newOptions      = (newTriggerState || newFilterState);

        const shouldUpdate    = (newLang || newData || newOptions);

        // console.log('Tracker::LogEntries::shouldComponentUpdate()', shouldUpdate, newData, newOptions);

        return shouldUpdate;
    }



    render() {
        const props = this.props;

        // console.log('LogEntries::render()', props.mapFilter, props.eventFilter, props.triggerNotification);

        return (
            <ul id='log'>
                {props.eventHistory.map(entry => {
                    const eventType = entry.get('type');
                    const entryId   = entry.get('id');

                    let guildId, guild;

                    if (eventType === 'claim') {
                        guildId = entry.get('guild');
                        guild   = (props.guilds.has(guildId))
                                                ? props.guilds.get(guildId)
                                                : null;
                    }


                    return (
                        <Entry
                            component           = 'li'
                            key                 = {entryId}

                            entry               = {entry}
                            eventFilter         = {props.eventFilter}
                            guild               = {guild}
                            guildId             = {guildId}
                            lang                = {props.lang}
                            mapFilter           = {props.mapFilter}
                            triggerNotification = {props.triggerNotification}
                        />
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

module.exports = LogEntries;
