
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import { worlds as STATIC_WORLDS } from 'lib/static';

const WORLDS_IMMUT = Immutable.fromJS(STATIC_WORLDS);




/*
*
*   Redux Helpers
*
*/


const langSelector = (state) => state.lang;
const regionSelector = (state, props) => props.region;
const worldsSelector = () => WORLDS_IMMUT;

const regionWorldsSelector = createSelector(
    langSelector,
    regionSelector,
    worldsSelector,
    (lang, region, worlds) => {

        return worlds
            .filter(world => world.get('region') === region.id)
            .map(world => world.get(lang.get('slug')))
            .sortBy(world => world.get('name'));
    }
);

const mapStateToProps = createSelector(
    langSelector,
    regionSelector,
    regionWorldsSelector,
    (lang, region, regionWorlds) => ({
        lang,
        region,
        regionWorlds,
    })
);

// const mapStateToProps = (state, props) => ({
//     lang: state.lang,
//     region: props.region,
// });





class Worlds extends React.Component {
    static propTypes = {
        lang: ImmutablePropTypes.map.isRequired,
        region: React.PropTypes.object.isRequired,
        regionWorlds: ImmutablePropTypes.map.isRequired,
    };



    shouldComponentUpdate(nextProps) {
        return !this.props.lang.equals(nextProps.lang);
    }



    render() {
        const {
            region,
            regionWorlds,
        } = this.props;

        return (
            <div className='RegionWorlds'>
                <h2>{region.label} Worlds</h2>
                <ul className='list-unstyled'>
                    {regionWorlds.map(
                        world =>
                        <li key={world.get('slug')}><a href={world.get('link')}>{world.get('name')}</a></li>
                    )}
                </ul>
            </div>
        );
    }
};

Worlds = connect(
    mapStateToProps
)(Worlds);


export default Worlds;