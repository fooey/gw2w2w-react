
import React from 'react';
import classnames from 'classnames';

import STATIC from 'lib/static';

import Sprite from 'common/icons/Sprite';



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

                    // console.log('matchMap', matchMap);

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
}) => (
    <div className='map-sections'>
        {_.map(getMapGeo(matchMap.id),
        (section, ix) =>
            <div className='map-section' key={ix}>
                {_.map(
                    section,
                    (geo, id) =>
                    <Objective
                        key={id}
                        id={id}
                        guilds={guilds}
                        lang={lang}
                        geo={geo}
                        matchMap={matchMap}
                        now={now}
                    />
                )}
            </div>
        )}
    </div>
);


const Objective = ({
    id,
    guilds,
    lang,
    geo,
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
        })}>
            <li className='left'>
                <span className='track-geo'><Arrow direction={geo} /></span>
                <span className='track-sprite'><Sprite color={mo.owner} type={mo.type} /></span>
                <span className='track-name'>{oMeta.name[lang.slug]}</span>
            </li>
            <li className='right'>
                {mo.guild
                    ? <a className='track-guild' href={'#' + mo.guild}>
                        {guilds[mo.guild]
                            ? <img src={`http://guilds.gw2w2w.com/${mo.guild}.svg`} className='emblem' title={`${guilds[mo.guild].name} [${guilds[mo.guild].tag}]`} />
                            : <img src={`http://guilds.gw2w2w.com/${mo.guild}.svg`} className='emblem' title='Loading...' />
                        }

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


const Arrow = ({direction}) => (
    (direction)
        ? <img src={getArrowSrc(direction)} className='arrow' />
        : <span />
);





/*
 *
 * Private Methods
 *
 */

function getArrowSrc(direction) {
    if (!direction) {
        return null;
    }

    let src = ['/img/icons/dist/arrow'];

    if (direction.indexOf('N') >= 0) {
        src.push('north');
    }
    else if (direction.indexOf('S') >= 0) {
        src.push('south');
    }

    if (direction.indexOf('W') >= 0) {
        src.push('west');
    }
    else if (direction.indexOf('E') >= 0) {
        src.push('east');
    }


    return src.join('-') + '.svg';
}


function getMapGeo(mapId) {
    if (mapId === 38) {
        return STATIC.objectivesGeo.eb;
    }
    else {
        return STATIC.objectivesGeo.bl2;
    }
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