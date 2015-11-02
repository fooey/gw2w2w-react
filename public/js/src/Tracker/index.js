'use strict';

/*
*
* Dependencies
*
*/

import React from'react';
import _ from'lodash';
import moment from'moment';



/*
 *   libs
 */

import libDate from 'lib/date';
import trackerTimers from 'lib/trackerTimers';



/*
 *   Data
 */

import DAO from 'lib/data/tracker';



/*
 * React Components
 */

import Scoreboard from './Scoreboard';
import Maps from './Maps';
import Log from './Log';
// import Guilds from './Guilds';




/*
* Globals
*/

const updateTimeInterval = 1000;

const LoadingSpinner = () => (
    <h1 id='AppLoading'>
        <i className='fa fa-spinner fa-spin'></i>
    </h1>
);



/*
*
* Component Export
*
*/


export default class Tracker extends React.Component {
    static propTypes={
        lang : React.PropTypes.object.isRequired,
        world: React.PropTypes.object.isRequired,
    }

    /*
    *
    *     React Lifecycle
    *
    */

    constructor(props) {
        super(props);


        this.__mounted = false;
        this.__timeouts = {};
        this.__intervals = {};


        const dataListeners = {
            onMatchDetails: this.onMatchDetails.bind(this),
            onGuildDetails: this.onGuildDetails.bind(this),
        };

        this.dao = new DAO(dataListeners);



        this.state = {
            hasData: false,
            match: {},
            log: [],
            guilds: {},
            now: now(),
        };


        this.__intervals.setDate = setInterval(
            () => this.setState({now: now()}),
            updateTimeInterval
        );
    }



    componentDidMount() {
        // console.log('Tracker::componentDidMount()');
        this.__mounted   = true;

        setPageTitle(this.props.lang, this.props.world);

        this.dao.init(this.props.world);
    }



    componentWillReceiveProps(nextProps) {
        setPageTitle(nextProps.lang, nextProps.world);
        this.dao.setWorld(nextProps.world);
    }



    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.isNewSecond(nextState)
            || this.isNewLang(nextProps)
        );
    }

    isNewSecond(nextState) {
        return !this.state.now.isSame(nextState.now);
    }

    isNewLang(nextProps) {
        return (this.props.lang.name !== nextProps.lang.name);
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
                    ? <LoadingSpinner />
                    : null
                }


                {(this.state.match && !_.isEmpty(this.state.match))
                    ? <Scoreboard
                        lang={this.props.lang}
                        match={this.state.match}
                    />
                    : null
                }

                {(this.state.match && !_.isEmpty(this.state.match))
                    ? <Maps
                        guilds={this.state.guilds}
                        lang={this.props.lang}
                        match={this.state.match}
                        now={this.state.now}
                    />
                    : null
                }

                <div className='row'>
                    <div className='col-md-24'>
                        <Log
                            guilds={this.state.guilds}
                            lang={this.props.lang}
                            log={this.state.log}
                            match={this.state.match}
                            now={this.state.now}
                        />
                    </div>
                </div>

                {/*(this.state.guilds && !this.state.guilds.isEmpty())
                    ? <div className='row'>
                        <div className='col-md-24'>
                            <Guilds
                                claimEvents={this.state.claimEvents}
                                guilds={this.state.guilds}
                                lang={this.props.lang}
                                time={this.state.time}
                            />
                        </div>
                    </div>
                    : null
                */}

            </div>
        );
    }




    /*
    *
    *   Data Listeners
    *
    */

    // updateTimers(cb = _.noop) {
    //     if (this.__mounted) {
    //         trackerTimers.update(this.state.time.offset, cb);
    //         this.__timeouts.updateTimers = setTimeout(this.updateTimers.bind(this), updateTimeInterval);
    //     }
    // }



    onMatchDetails(match) {
        const log = getLog(match);

        this.setState({
            hasData: true,
            match,
            log,
        });


        setImmediate(() => {
            const knownGuilds = _.keys(this.state.guilds);
            const unknownGuilds = getNewClaims(log, knownGuilds);

            this.dao.guilds.lookup(unknownGuilds, this.onGuildDetails.bind(this));
        });
    }

    // onMatchDetails(timeRemote, match, details) {
    //     const lastmod      = match.get('lastmod');
    //     const isModified   = (lastmod !== this.state.match.get('lastmod'));


    //     if (isModified) {
    //         // console.log('onMatchDetails', lastmod);



    //         const matchWorlds = (this.state.matchWorlds && Immutable.Map.isMap(this.state.matchWorlds))
    //             ? this.state.matchWorlds
    //             : this.dao.getMatchWorlds(this.props.lang, match);


    //         this.setState({
    //             hasData: true,
    //             time: this.getTime(timeRemote),
    //             lastmod,

    //             claimEvents,
    //             details,
    //             match,
    //             matchWorlds,
    //         });


    //         setImmediate(() => this.dao.guilds.lookup(
    //             this.state.guilds,
    //             details,
    //             this.onGuildDetails.bind(this)
    //         ));
    //     }
    // }



    onGuildDetails(guild) {
        // console.log('onGuildDetails', guild);

        this.setState(state => {
            state.guilds[guild.id] = guild;

            return {guilds: state.guilds};
        });
    }

}




/*
*
* Private methods
*
*/



function now() {
    return moment(Math.floor(Date.now() / 1000) * 1000);
}



function setPageTitle(lang, world) {
    const langSlug  = lang.slug;
    const worldName = world[langSlug].name;

    const title     = [worldName, 'gw2w2w'];

    if (langSlug !== 'en') {
        title.push(lang.name);
    }

    document.title = title.join(' - ');
}



function getLog(match) {
    return _
        .chain(match.maps)
        .pluck('objectives')
        .flatten()
        .clone()
        .sortBy('lastFlipped')
        .reverse()
        .map(o => {
            o.mapId = _.parseInt(o.id.split('-')[0]);
            o.lastmod = moment(o.lastmod, 'X');
            o.lastFlipped = moment(o.lastFlipped, 'X');
            o.lastClaimed = moment(o.lastClaimed, 'X');
            o.expires = moment(o.lastFlipped).add(5, 'minutes');
            return o;
        })
        .value();
};


function getNewClaims(log, knownGuilds) {
    return  _
        .chain(log)
        .reject(o => _.isEmpty(o.guild))
        .pluck('guild')
        .unique()
        .difference(knownGuilds)
        .value();
}