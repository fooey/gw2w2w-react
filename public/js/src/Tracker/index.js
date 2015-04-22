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

const DataProvider  = require('lib/data/tracker');
const GuildsLib     = require('lib/tracker/guilds');
const STATIC        = require('lib/static');



/*
* React Components
*/

const Scoreboard    = require('./Scoreboard');
const Maps          = require('./Maps');
const Guilds        = require('./Guilds');





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
    constructor(props) {
        super(props);


        this.mounted   = true;
        this.intervals = {timers: null};
        this.timeouts  = {data: null};

        this.guildLib  = new GuildsLib(this);


        const dataListeners = {};
        this.dataProvider = new DataProvider(props.lang, dataListeners);

        this.state = this.dataProvider.getDefaults();
    }


    shouldComponentUpdate(nextProps, nextState) {
        const initialData  = !Immutable.is(this.state.hasData, nextState.hasData);
        const newMatchData = !Immutable.is(this.state.lastmod, nextState.lastmod);
        const newGuildData = !Immutable.is(this.state.guilds, nextState.guilds);
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);
        const shouldUpdate = (initialData || newMatchData || newGuildData || newLang);

        return shouldUpdate;
    }



    componentDidMount() {
        // console.log('Tracker::componentDidMount()');

        this.intervals.timers = setInterval(updateTimers.bind(this), 1000);

        setImmediate(updateTimers.bind(this));
        setImmediate(getMatchDetails.bind(this));
    }



    componentWillUnmount() {
        // console.log('Tracker::componentWillUnmount()');

        clearTimers.call(this);

        this.mounted = false;
    }



    componentWillReceiveProps(nextProps) {
        const newLang = !Immutable.is(this.props.lang, nextProps.lang);

        // console.log('componentWillReceiveProps()', newLang);

        if (newLang) {
            setMatchWorlds.call(this, nextProps.lang);
        }
    }



    // componentWillUpdate() {
    //  console.log('Tracker::componentWillUpdate()');
    // }



    render() {
        // console.log('Tracker::render()');
        setPageTitle(this.props.lang, this.props.world);


        if (!this.state.hasData) {
            return null;
        }



        return (
            <div id="tracker">

                {<Scoreboard
                    matchWorlds = {this.state.matchWorlds}
                    match       = {this.state.match}
                />}

                {<Maps
                    lang        = {this.props.lang}
                    details     = {this.state.details}
                    matchWorlds = {this.state.matchWorlds}
                    guilds      = {this.state.guilds}
                />}

                {<div className="row">
                    <div className="col-md-24">
                        {(!this.state.guilds.isEmpty())
                            ? <Guilds
                                lang        = {this.props.lang}

                                guilds      = {this.state.guilds}
                                claimEvents = {this.state.claimEvents}
                            />
                            : null
                        }
                    </div>
                </div>}

            </div>
        );

    }

}





/*
*
* Private Methods
*
*/



/*
* Timers
*/

function updateTimers() {
    let component = this;
    const state   = component.state;
    // console.log('updateTimers()');

    const timeOffset = state.timeOffset;
    const now        = libDate.dateNow() - timeOffset;

    trackerTimers.update(now, timeOffset);
}



function clearTimers(){
    // console.log('clearTimers()');
    let component = this;

    _.forEach(component.intervals, clearInterval);
    _.forEach(component.timeouts, clearTimeout);
}



/*
*
* Match Details
*
*/

function getMatchDetails() {
    let component = this;
    const props   = component.props;

    const world     = props.world;
    const langSlug  = props.lang.get('slug');
    const worldSlug = world.getIn([langSlug, 'slug']);

    api.getMatchDetailsByWorld(
        worldSlug,
        onMatchDetails.bind(this)
    );
}



function onMatchDetails(err, data) {
    let component = this;
    const props   = component.props;
    const state   = component.state;


    if (component.mounted) {
        if (!err && data && data.match && data.details) {
            const lastmod    = data.match.lastmod;
            const isModified = (lastmod !== state.match.get('lastmod'));

            // console.log('onMatchDetails', data.match.lastmod, isModified);

            if (isModified) {
                const dateNow     = libDate.dateNow();
                const timeOffset  = Math.floor(dateNow  - (data.now / 1000));

                const matchData   = Immutable.fromJS(data.match);
                const detailsData = Immutable.fromJS(data.details);

                // use transactional setState
                component.setState(state => ({
                    hasData: true,
                    dateNow,
                    timeOffset,
                    lastmod,

                    match : state.match.mergeDeep(matchData),
                    details : state.details.mergeDeep(detailsData),
                }));


                setImmediate(component.guildLib.onMatchData.bind(component.guildLib, detailsData));

                if (state.matchWorlds.isEmpty()) {
                    setImmediate(setMatchWorlds.bind(component, props.lang));
                }
            }
        }


        rescheduleDataUpdate.call(component);
    }
}



function rescheduleDataUpdate() {
    let component     = this;
    const refreshTime = _.random(1000*2, 1000*4);

    component.timeouts.data = setTimeout(getMatchDetails.bind(component), refreshTime);
}



/*
*
* MatchWorlds
*
*/

function setMatchWorlds(lang) {
    let component = this;

    const matchWorlds = Immutable
        .List(['red', 'blue', 'green'])
        .map(getMatchWorld.bind(component, lang));

    component.setState({matchWorlds});
}



function getMatchWorld(lang, color) {
    let component = this;
    const state   = component.state;

    const langSlug    = lang.get('slug');
    const worldKey    = color + 'Id';
    const worldId     = state.match.getIn([worldKey]).toString();
    const worldByLang = STATIC.worlds.getIn([worldId, langSlug]);

    return worldByLang
        .set('color', color)
        .set('link', getWorldLink(langSlug, worldByLang));
}



function getWorldLink(langSlug, world) {
    return ['', langSlug, world.get('slug')].join('/');
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
