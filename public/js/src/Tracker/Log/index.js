'use strict';

/*
*
* Dependencies
*
*/

const React        = require('react');
const Immutable    = require('Immutable');

// const STATIC       = require('gw2w2w-static');



/*
* React Components
*/

const MapFilters   = require('./MapFilters');
const EventFilters = require('./EventFilters');
const LogEntries   = require('./LogEntries');




/*
*
* Component Definition
*
*/


class Log extends React.Component {
    static propTypes = {
        details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
        guilds : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        lang   : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    }



    constructor(props) {
        super(props);

        this.state = {
            mapFilter          : 'all',
            eventFilter        : 'all',
            triggerNotification: false,
        };
    }



    shouldComponentUpdate(nextProps, nextState) {
        const newLang        = !Immutable.is(this.props.lang, nextProps.lang);

        const newGuilds      = !Immutable.is(this.props.guilds, nextProps.guilds);
        const newHistory     = !Immutable.is(this.props.details.get('history'), nextProps.details.get('history'));
        const newData        = (newGuilds || newHistory);

        const newMapFilter   = !Immutable.is(this.state.mapFilter, nextState.mapFilter);
        const newEventFilter = !Immutable.is(this.state.eventFilter, nextState.eventFilter);
        const newFilters     = (newMapFilter || newEventFilter);

        const shouldUpdate   = (newLang || newData || newFilters);

        // console.log('Tracker::Logs::shouldComponentUpdate()', shouldUpdate, newData, newFilters);

        return shouldUpdate;
    }



    componentDidMount() {
        this.setState({triggerNotification: true});
    }



    componentDidUpdate() {
        if (!this.state.triggerNotification) {
            this.setState({triggerNotification: true});
        }
    }



    render() {

        const eventHistory = this.props.details.get('history');

        return (
            <div id='log-container'>

                <div className='log-tabs'>
                    <div className='row'>
                        <div className='col-sm-16'>
                            <MapFilters
                                mapFilter = {this.state.mapFilter}
                                setWorld  = {this.__setWorld.bind(this)}
                            />
                        </div>
                        <div className='col-sm-8'>
                            <EventFilters
                                eventFilter = {this.state.eventFilter}
                                setEvent    = {this.__setEvent.bind(this)}
                            />
                        </div>
                    </div>
                </div>

                {(!eventHistory.isEmpty())
                    ? <LogEntries
                        eventFilter         = {this.state.eventFilter}
                        eventHistory        = {eventHistory}
                        guilds              = {this.props.guilds}
                        lang                = {this.props.lang}
                        mapFilter           = {this.state.mapFilter}
                        triggerNotification = {this.state.triggerNotification}
                    />
                    : null
                }

            </div>
        );
    }



    __setWorld(e) {
        const filter = e.target.getAttribute('data-filter');

        this.setState({
            mapFilter: filter,
            triggerNotification: true,
        });
    }



    __setEvent(e) {
        const filter = e.target.getAttribute('data-filter');

        this.setState({
            eventFilter: filter,
            triggerNotification: true,
        });
    }
}





/*
*
* Export Module
*
*/

module.exports = Log;
