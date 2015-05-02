"use strict";


/*
*
* Dependencies
*
*/

const React         = require('react');
const Immutable     = require('Immutable');

const _             = require('lodash');



/*
*   libs
*/

const api           = require('lib/api');
const libDate       = require('lib/date');
const trackerTimers = require('lib/trackerTimers');



/*
*   Data
*/

const DAO           = require('lib/data/tracker');
const GuildsLib     = require('lib/data/tracker/guilds');
const STATIC        = require('lib/static');



/*
* React Components
*/

const Scoreboard    = require('./Scoreboard');
const Maps          = require('./Maps');
const Guilds        = require('./Guilds');




/*
* Globals
*/

const updateTimeInterval = 1000;



/*
*
* Component Export
*
*/

const propTypes = {
    lang : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    world: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

class Tracker extends React.Component {

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
            hasData    : false,
            lastmod    : 0,

            time       : {
                local  : libDate.dateNow(),
                remote : 0,
                offset : 0,
            },

            match      : Immutable.Map({lastmod:0}),
            matchWorlds: Immutable.List(),
            details    : Immutable.Map(),
            claimEvents: Immutable.List(),
            guilds     : Immutable.Map(),
        };
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



    componentDidMount() {
        // console.log('Tracker::componentDidMount()');
        this.__mounted   = true;

        this.dao.init(this.props.lang, this.props.world);

        setPageTitle(this.props.lang, this.props.world);

        // this.updateTimers(() => setInterval(this.updateTimers.bind(this), 1000));
        this.updateTimers.call(this);
    }



    componentWillUnmount() {
        // console.log('Tracker::componentWillUnmount()');

        this.__mounted   = false;
        this.__timeouts  = _.map(this.__timeouts,  t => clearTimeout(t));
        this.__intervals = _.map(this.__intervals, i => clearInterval(i));

        this.dao.close();
    }



    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps()', newLang);
        setPageTitle(this.props.lang, this.props.world);

        this.setState({
            matchWorlds: this.dao.getMatchWorlds(nextProps.lang, this.state.match)
        });
    }



    // componentWillUpdate() {
    //  console.log('Tracker::componentWillUpdate()');
    // }



    render() {
        // console.log('Tracker::render()');


        if (!this.state.hasData) {
            return null;
        }

        return (
            <div id="tracker">

                <Scoreboard
                    matchWorlds = {this.state.matchWorlds}
                    match       = {this.state.match}
                />

                <Maps
                    lang        = {this.props.lang}

                    time        = {this.state.time}
                    details     = {this.state.details}
                    matchWorlds = {this.state.matchWorlds}
                    guilds      = {this.state.guilds}
                />

                <div className="row">
                    <div className="col-md-24">
                        {(!this.state.guilds.isEmpty())
                            ? <Guilds
                                lang        = {this.props.lang}

                                time        = {this.state.time}
                                guilds      = {this.state.guilds}
                                claimEvents = {this.state.claimEvents}
                            />
                            : null
                        }
                    </div>
                </div>

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




    onMatchDetails(timeRemote, matchData, detailsData) {
        const lastmod      = matchData.get('lastmod');
        const isModified   = (lastmod !== this.state.match.get('lastmod'));


        if (isModified) {
            const claimEvents = this.dao.guilds.getEventsByType(detailsData, 'claim');

            const timeLocal    = Date.now();
            const remoteOffset = timeLocal - timeRemote;
            const timeOffset   = (this.state.time.offset)
                                ? (remoteOffset + this.state.time.offset) / 2 // average with previous offset
                                : remoteOffset;

            const time = {
                local : timeLocal,
                offset: Math.round(timeOffset),
                remote: timeRemote,
            };


            // use transactional setState
            this.setState(state => ({
                hasData: true,

                lastmod,
                time,
                claimEvents,

                match  : state.match.mergeDeep(matchData),
                details: state.details.mergeDeep(detailsData),
            }));


            this.dao.guilds.lookup(
                this.state.guilds,
                detailsData,
                this.onGuildDetails.bind(this)
            );



            if (this.state.matchWorlds.isEmpty()) {
                this.setState({
                    matchWorlds: this.dao.getMatchWorlds(this.props.lang, this.state.match)
                });
                // setImmediate(setMatchWorlds.bind(component, props.lang));
            }
        }
    }



    onGuildDetails(guild, guildId) {
        const _guildId = guildId || guild.get('guild_id');
        if (!this.state.claimEvents.isEmpty()) {
            guild = this.dao.guilds.attachClaims(this.state.claimEvents, guild);
        }

        this.setState(state => ({
            guilds: state.guilds.mergeIn([_guildId], guild)
        }));
    }

}






/*
*
* Match Details
*
*/

function setPageTitle(lang, world) {
    let langSlug  = lang.get('slug');
    let worldName = world.getIn([langSlug, 'name']);

    let title     = [worldName, 'gw2w2w'];

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

Tracker.propTypes = propTypes;
module.exports    = Tracker;
