'use strict';

/*
*
* Dependencies
*
*/


const React      = require('react');
const Immutable  = require('Immutable');

const STATIC     = require('lib/static');



/*
* React Components
*/

const MapDetails = require('./MapDetails');
const Log        = require('Tracker/Log');




/*
*
* Component Definition
*
*/

class Maps extends React.Component {
    static propTypes = {
        details    : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        guilds     : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        lang       : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);

        const newGuilds    = !Immutable.is(this.props.guilds, nextProps.guilds);
        const newDetails   = !Immutable.is(this.props.details, nextProps.details);
        const newWorlds    = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);
        const newData      = (newGuilds || newDetails || newWorlds);

        const shouldUpdate = (newLang || newData);

        return shouldUpdate;
    }



    render() {
        const props = this.props;

        if (!props.details.has('initialized') || !props.details.get('initialized')) {
            return null;
        }


        return (
            <section id='maps'>
                <div className='row'>

                    <div className='col-md-6'>{<MapDetails mapKey='Center' mapMeta={getMapMeta('Center')} {...props} />}</div>

                    <div className='col-md-18'>

                        <div className='row'>
                            <div className='col-md-8'>{<MapDetails mapKey='RedHome' mapMeta={getMapMeta('RedHome')} {...props} />}</div>
                            <div className='col-md-8'>{<MapDetails mapKey='BlueHome' mapMeta={getMapMeta('BlueHome')} {...props} />}</div>
                            <div className='col-md-8'>{<MapDetails mapKey='GreenHome' mapMeta={getMapMeta('GreenHome')} {...props} />}</div>
                        </div>

                        <div className='row'>
                            <div className='col-md-24'>
                                <Log {...props} />
                            </div>
                        </div>

                    </div>
                 </div>
            </section>
        );
    }
}


function getMapMeta(key) {
    return STATIC.objective_map.find(mm => mm.get('key') === key);
}




/*
*
* Export Module
*
*/

module.exports = Maps;
