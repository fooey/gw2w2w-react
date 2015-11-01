
import React from'react';

// import MapDetails from './MapDetails';
import Log from 'Tracker/Log';

import STATIC from 'lib/static';

const MapDetails = () => (<div />);



/*
*
* Component Definition
*
*/

export default class Maps extends React.Component {
    static propTypes = {
        match    : React.PropTypes.object.isRequired,
        guilds     : React.PropTypes.object.isRequired,
        lang       : React.PropTypes.object.isRequired,
    }



    // shouldComponentUpdate(nextProps) {
    //     const newLang      = !Immutable.is(this.props.lang, nextProps.lang);

    //     const newGuilds    = !Immutable.is(this.props.guilds, nextProps.guilds);
    //     const newDetails   = !Immutable.is(this.props.details, nextProps.details);
    //     const newData      = (newGuilds || newDetails);

    //     const shouldUpdate = (newLang || newData);

    //     return shouldUpdate;
    // }



    render() {
        const {
            guilds,
            lang,
            log,
            match,
        } = this.props;

        if (_.isEmpty(match)) {
            return null;
        }


        return (
            <section id='maps'>
                <div className='row'>

                    <div className='col-md-6'>{<MapDetails mapKey='Center' mapMeta={getMapMeta('Center')} {...this.props} />}</div>

                    <div className='col-md-18'>

                        <div className='row'>
                            <div className='col-md-8'>{<MapDetails mapKey='RedHome' mapMeta={getMapMeta('RedHome')} {...this.props} />}</div>
                            <div className='col-md-8'>{<MapDetails mapKey='BlueHome' mapMeta={getMapMeta('BlueHome')} {...this.props} />}</div>
                            <div className='col-md-8'>{<MapDetails mapKey='GreenHome' mapMeta={getMapMeta('GreenHome')} {...this.props} />}</div>
                        </div>

                        <div className='row'>
                            <div className='col-md-24'>
                                <Log {...this.props} />
                            </div>
                        </div>

                    </div>
                 </div>
            </section>
        );
    }
}


function getMapMeta(key) {
    // return STATIC.objective_map.find(mm => mm.get('key') === key);
    return null;
}

