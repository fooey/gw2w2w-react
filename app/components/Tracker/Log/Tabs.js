
import React from'react';
import { connect } from 'react-redux';
// import { createSelector } from 'reselect';
import {
    createImmutableSelector,
    mapImmutableSelectorsToProps,
} from 'lib/reduxHelpers';

import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import classnames from'classnames';
import ObjectiveIcon from 'components/common/icons/Objective';

import * as STATIC from 'lib/static';
import * as logFilterActions from 'actions/logFilters';


const logFiltersSelector = (state) => state.logFilters;

const mapFiltersSelector = createImmutableSelector(
    logFiltersSelector,
    (logFilters) => logFilters.get('maps')
);

const objectiveTypeFiltersSelector = createImmutableSelector(
    logFiltersSelector,
    (logFilters) => logFilters.get('objectiveTypes')
);

// const eventTypeFiltersSelector = createImmutableSelector(
//     logFiltersSelector,
//     (logFilters) => logFilters.get('eventTypes')
// );

const mapStateToProps = mapImmutableSelectorsToProps({
    mapFilters: mapFiltersSelector,
    objectiveTypeFilters: objectiveTypeFiltersSelector,
    // eventTypeFilters: eventTypeFiltersSelector,
});


const mapDispatchToProps = (dispatch) => {
    return {
        toggleMap: (mapId) => dispatch(logFilterActions.toggleMap({ mapId })),
        toggleObjectiveType: (objectiveType) => dispatch(logFilterActions.toggleObjectiveType({ objectiveType })),
        // toggleEventType: (eventType) => dispatch(logFilterActions.toggleEventType({ eventType })),
    };
};

class Tabs extends React.Component {
    static propTypes = {
        mapFilters : ImmutablePropTypes.set.isRequired,
        objectiveTypeFilters : ImmutablePropTypes.set.isRequired,

        toggleMap: React.PropTypes.func.isRequired,
        toggleObjectiveType: React.PropTypes.func.isRequired,
    };

    shouldComponentUpdate(nextProps) {
        const shouldUpdate = (
            !Immutable.is(this.props.mapFilters, nextProps.mapFilters)
            || !Immutable.is(this.props.objectiveTypeFilters, nextProps.objectiveTypeFilters)
        );

        console.log('tracker::logs::tabs::shouldUpdate', shouldUpdate);

        return shouldUpdate;
    }

    render() {
        const {
            mapFilters,
            objectiveTypeFilters,
            // eventTypeFiltersSelector,

            toggleMap,
            toggleObjectiveType,
            // toggleEventType,
        } = this.props;

        console.log('STATIC.mapsMeta', STATIC.mapsMeta);

        return (
            <div id='log-tabs' className='flex-tabs'>

                {_.map(
                    STATIC.mapsMeta,
                    (mapMeta) =>
                    <MapTab
                        key={mapMeta.id}
                        id={mapMeta.abbr}
                        label={mapMeta.abbr}
                        mapFilters={mapFilters}
                        title={mapMeta.name}
                        onClick={toggleMap}
                    />
                )}

                {_.map(
                    ['castle', 'keep', 'tower', 'camp'],
                    t =>
                    <ObjectiveTab
                        key={t}
                        objectiveType={t}
                        objectiveTypeFilters={objectiveTypeFilters}
                        onClick={toggleObjectiveType}
                    />
                )}
            </div>
        );
    }
};
Tabs = connect(
  mapStateToProps,
  mapDispatchToProps
)(Tabs);


const MapTab = ({
    id,
    label,
    mapFilters,
    onClick,
    title,
}) => (
    <a
        title={title}
        className={classnames({ tab: true, active: mapFilters.has(id) })}
        onClick={() => onClick(id)}
    >
        {label}
    </a>
);


const ObjectiveTab = ({
    objectiveType,
    objectiveTypeFilters,
    onClick,
}) => (
    <a
        className={classnames({
            check: true,
            active: objectiveTypeFilters.has(objectiveType),
            first: objectiveType === 'castle',
        })}
        onClick={() => onClick(objectiveType)}
    >

        <ObjectiveIcon type={objectiveType} size={18} />

    </a>
);



export default Tabs;