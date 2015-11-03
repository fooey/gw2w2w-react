
import React from 'react';
import classnames from 'classnames';

import STATIC from 'lib/static';

import ArrowIcon from 'common/icons/Arrow';
import SpriteIcon from 'common/icons/Sprite';
import ObjectiveIcon from 'common/icons/Objective';



/*
*
* Component Definition
*
*/

export default ({
    guilds,
    lang,
    match,
    now,
}) => {

    if (_.isEmpty(match)) {
        return null;
    }

    // console.log('match', match);

    return (
        <section id='maps'>
            {_.map(
                STATIC.mapsMeta,
                (mm) => {
                    const matchMap = _.find(match.maps, m => m.id == mm.id);

                    return (matchMap)
                        ? <MapTracker
                            key={mm.id}
                            guilds={guilds}
                            lang={lang}
                            mapMeta={mm}
                            matchMap={matchMap}
                            now={now}
                        />
                        : null;
                }
            )}
        </section>
    );
};



const MapTracker = ({
    guilds,
    lang,
    mapMeta,
    matchMap,
    now,
}) => (
    <div className='map'>
        <h2>{mapMeta.name}</h2>
        {/*<pre>{JSON.stringify(matchMap, null, '\t')}</pre>*/}
        <Scoreboard
            scores={matchMap.scores}
            ticks={matchMap.ticks}
            holdings={matchMap.holdings}
            deaths={matchMap.deaths}
            kills={matchMap.kills}
        />
        <MapSections
            guilds={guilds}
            lang={lang}
            mapMeta={mapMeta}
            matchMap={matchMap}
            now={now}
        />
    </div>
);


const Scoreboard = ({
    scores,
    ticks,
    holdings,
    deaths,
    kills,
}) => (
    <ul>
        {/*<li>{JSON.stringify(scores)}</li>*/}
        {/*<li>{JSON.stringify(ticks)}</li>*/}
        {/*<li>{JSON.stringify(holdings)}</li>*/}
        {/*<li>{JSON.stringify(deaths)}</li>*/}
        {/*<li>{JSON.stringify(kills)}</li>*/}
    </ul>
);


const MapSections = ({
    guilds,
    lang,
    matchMap,
    now,
}) => {
    return (
        <div className='map-sections'>
            {_.map(
                getMapObjectivesMeta(matchMap.id),
                (section, ix) =>
                <div className={classnames({
                    'map-section': true,
                    solo: section.length === 1,
                })} key={ix}>
                    {_.map(
                        section,
                        (geo) =>
                        <Objective
                            key={geo.id}
                            id={geo.id}
                            guilds={guilds}
                            lang={lang}
                            direction={geo.direction}
                            matchMap={matchMap}
                            now={now}
                        />
                    )}
                </div>
            )}
        </div>
    );
};


const Objective = ({
    id,
    guilds,
    lang,
    direction,
    matchMap,
    now,
}) => {
    const objectiveId = `${matchMap.id}-${id}`;
    const oMeta = STATIC.objectives[objectiveId];
    const mo = _.find(matchMap.objectives, o => o.id === objectiveId);

    if (!mo) {
        // console.log('matchMap.objectives', matchMap.objectives);
        console.log(matchMap.id, id, objectiveId, mo);
    }


    return (
        <ul className={classnames({
            'list-unstyled': true,
            'track-objective': true,
            'fresh': now.diff(mo.lastFlipped, 'seconds') < 30,
            'expiring': mo.expires.isAfter(now) && mo.expires.diff(now, 'seconds') < 30,
            'expired': now.isAfter(mo.expires),
            'active': now.isBefore(mo.expires),
        })}>
            <li className='left'>
                <span className='track-geo'><ArrowIcon direction={direction} /></span>
                <span className='track-sprite'><ObjectiveIcon color={mo.owner} type={mo.type} /></span>
                <span className='track-name'>{oMeta.name[lang.slug]}</span>
            </li>
            <li className='right'>
                {mo.guild
                    ? <a
                        className='track-guild'
                        href={'#' + mo.guild}
                        title={guilds[mo.guild] ? `${guilds[mo.guild].name} [${guilds[mo.guild].tag}]` : 'Loading...'}
                    >
                        <img src={`https://guilds.gw2w2w.com/${mo.guild}.svg`} className='emblem' />

                    </a>
                    : null
                }
                <span className='track-expire'>
                    {mo.expires.isAfter(now)
                        ? moment(mo.expires.diff(now, 'milliseconds')).format('m:ss')
                        : null
                    }
                </span>
            </li>
        </ul>
    );
};




function getMapObjectivesMeta(mapId) {
    let mapCode = 'bl2';

    if (mapId === 38) {
        mapCode = 'eb';
    }

    return _
        .chain(STATIC.objectivesMeta)
        .cloneDeep()
        .filter(om => om.map === mapCode)
        .groupBy(om => om.group)
        .value();
}


/*


                    <div className='col-md-6'>{<MapDetails mapKey='Center' mapMeta={getMapMeta('Center')} {...this.props} />}</div>

                    <div className='col-md-18'>

                        <div className='row'>
                            <div className='col-md-8'>{<MapDetails mapKey='RedHome' mapMeta={getMapMeta('RedHome')} {...this.props} />}</div>
                            <div className='col-md-8'>{<MapDetails mapKey='BlueHome' mapMeta={getMapMeta('BlueHome')} {...this.props} />}</div>
                            <div className='col-md-8'>{<MapDetails mapKey='GreenHome' mapMeta={getMapMeta('GreenHome')} {...this.props} />}</div>
                        </div>

                    </div>
                 </div>
                 */