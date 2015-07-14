'use strict';

/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');
const _         = require('lodash');



/*
 *   libs
 */

const libDate       = require('lib/date');
const trackerTimers = require('lib/trackerTimers');



/*
 *   Data
 */

const DAO = require('lib/data/tracker');



/*
 * React Components
 */

const Scoreboard = require('./Scoreboard');
const Maps       = require('./Maps');
const Guilds     = require('./Guilds');




/*
* Globals
*/

const updateTimeInterval = 1000;

const loadingHtml = (
    <h1 id='AppLoading'>
        <i className='fa fa-spinner fa-spin'></i>
    </h1>
);



/*
*
* Component Export
*
*/


class Tracker extends React.Component {
    static propTypes = {
        lang : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        world: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    }

    /*
    *
    *     React Lifecycle
    *
    */

    constructor(props) {
        super(props);


        this.__mounted   = false;
        this.__timeouts  = {};
        this.__intervals = {};


        const dataListeners = {
            onMatchDetails: this.onMatchDetails.bind(this),
            onGuildDetails: this.onGuildDetails.bind(this),
        };

        this.dao = new DAO(dataListeners);



        this.state = {
            hasData: false,
            lastmod: 0,

            time: {
                local: libDate.dateNow(),
                remote: 0,
                offset: 0,
            },

            match: Immutable.Map({
                lastmod: 0,
            }),

            claimEvents: Immutable.List(),
            details    : Immutable.Map(),
            guilds     : Immutable.Map(),
            matchWorlds: Immutable.List(),
        };

    }



    componentDidMount() {
        // console.log('Tracker::componentDidMount()');
        this.__mounted   = true;

        setPageTitle(this.props.lang, this.props.world);

        setImmediate(() => this.dao.init(this.props.lang, this.props.world));
        setTimeout(this.updateTimers.bind(this), 1000);
    }



    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps()', newLang);
        setPageTitle(this.props.lang, this.props.world);

        this.setState({
            matchWorlds: this.dao.getMatchWorlds(nextProps.lang, this.state.match),
        });
    }



    shouldComponentUpdate(nextProps, nextState) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);

        const initialData  = !Immutable.is(this.state.hasData, nextState.hasData);
        const newMatchData = !Immutable.is(this.state.lastmod, nextState.lastmod);
        const newGuildData = !Immutable.is(this.state.guilds, nextState.guilds);
        const newData      = (initialData || newMatchData || newGuildData);

        const shouldUpdate = (newLang || newData);

        return shouldUpdate;
    }



    componentWillUnmount() {
        // console.log('Tracker::componentWillUnmount()');

        this.__mounted   = false;
        this.__timeouts  = _.map(this.__timeouts,  t => clearTimeout(t));
        this.__intervals = _.map(this.__intervals, i => clearInterval(i));

        this.dao.close();
    }



    // componentWillUpdate() {
    //  console.log('Tracker::componentWillUpdate()');
    // }



    render() {
        // console.log('Tracker::render()');



        return (
            <div id='tracker'>

                {(!this.state.hasData)
                    ? loadingHtml
                    : null
                }


                {(this.state.details && !this.state.details.isEmpty())
                    ? <Scoreboard
                        match = {this.state.match}
                        matchWorlds = {this.state.matchWorlds}
                    />
                    : null
                }

                {(this.state.details && !this.state.details.isEmpty())
                    ? <Maps
                        details = {this.state.details}
                        guilds = {this.state.guilds}
                        lang = {this.props.lang}
                        matchWorlds = {this.state.matchWorlds}
                        time = {this.state.time}
                    />
                    : null
                }

                {(this.state.guilds && !this.state.guilds.isEmpty())
                    ? <div className='row'>
                        <div className='col-md-24'>
                            <Guilds
                                claimEvents = {this.state.claimEvents}
                                guilds = {this.state.guilds}
                                lang = {this.props.lang}
                                time = {this.state.time}
                            />
                        </div>
                    </div>
                    : null
                }

            </div>
        );
    }




    /*
    *
    *   Data Listeners
    *
    */

    updateTimers(cb=_.noop) {
        if (this.__mounted) {
            trackerTimers.update(this.state.time.offset, cb);
            this.__timeouts.updateTimers = setTimeout(this.updateTimers.bind(this), updateTimeInterval);
        }
    }




    onMatchDetails(timeRemote, match, details) {
        const lastmod      = match.get('lastmod');
        const isModified   = (lastmod !== this.state.match.get('lastmod'));


        if (isModified) {
            // console.log('onMatchDetails', lastmod);


            const claimEvents = this.dao.guilds.getEventsByType(details, 'claim');

            const matchWorlds = (this.state.matchWorlds && Immutable.Map.isMap(this.state.matchWorlds))
                ? this.state.matchWorlds
                : this.dao.getMatchWorlds(this.props.lang, match);


            this.setState({
                hasData: true,
                time: this.getTime(timeRemote),
                lastmod,

                claimEvents,
                details,
                match,
                matchWorlds,
            });


            setImmediate(() => this.dao.guilds.lookup(
                this.state.guilds,
                details,
                this.onGuildDetails.bind(this)
            ));
        }
    }



    getTime(timeRemote) {
        const timeLocal    = Date.now();
        const remoteOffset = timeLocal - timeRemote;
        const timeOffset   = (this.state.time.offset)
                            ? (remoteOffset + this.state.time.offset) / 2 // average with previous offset
                            : remoteOffset;

        return {
            local : timeLocal,
            offset: Math.round(timeOffset),
            remote: timeRemote,
        };
    }



    onGuildDetails(guild, guildId) {
        const _guildId = guildId || guild.get('guild_id');

        if (!this.state.claimEvents.isEmpty()) {
            guild = this.dao.guilds.attachClaims(this.state.claimEvents, guild);
        }

        this.setState(state => ({
            guilds: state.guilds.mergeIn([_guildId], guild),
        }));
    }

}






/*
*
* Match Details
*
*/

function setPageTitle(lang, world) {
    const langSlug  = lang.get('slug');
    const worldName = world.getIn([langSlug, 'name']);

    const title     = [worldName, 'gw2w2w'];

    if (langSlug !== 'en') {
        title.push(lang.get('name'));
    }

    $('title').text(title.join(' - '));
}





/*
*
* Export Module
*
*/

module.exports    = Tracker;
