import React from 'react';
import { connect } from 'react-redux';
// import { createSelector } from 'reselect';
import { createImmutableSelector } from 'lib/redux';

// import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';


import Entry from './Entry';



const objectivesSelector = (state) => state.objectives;

const sortedObjectivesSelector = createImmutableSelector(
    objectivesSelector,
    (objectives) => objectives.sortBy(o => -o.get('lastFlipped'))
);

const mapStateToProps = createImmutableSelector(
    sortedObjectivesSelector,
    (sortedObjectives) => ({ objectives: sortedObjectives })
);

// const mapStateToProps = (state, props) => {
//     // const entries = _.chain(props.log)
//     //     .filter(entry => byType(props.typeFilter, entry))
//     //     .filter(entry => byMapId(props.mapFilter, entry))
//     //     .value();

//     const objectives = state.objectives.sortBy(o => -o.get('lastFlipped'));

//     return {
//         objectives,
//     };
// };


class Entries extends React.Component {
    static propTypes = {
        objectives : ImmutablePropTypes.map.isRequired,

        // now : React.PropTypes.instanceOf(moment).isRequired,
        mapFilter : React.PropTypes.string.isRequired,
        typeFilter : React.PropTypes.object.isRequired,
    };



    shouldComponentUpdate(nextProps) {
        const {
            objectives,

            mapFilter,
            typeFilter,
        } = this.props;

        return !objectives.equals(nextProps.objectives);
    }



    render() {
        const {
            objectives,
            mapFilter,
            typeFilter,
        } = this.props;

        return (
            <ol id='log' className='list-unstyled'>
                {objectives.keySeq().map(id => (
                    <Entry key={id} id={id} />
                ))}
            </ol>
        );
    }
};
Entries = connect(
  mapStateToProps
)(Entries);



function getMap(objective) {
    const mapId = objective.id.split('-')[0];
    return _.find(STATIC.mapsMeta, mm => mm.id == mapId);
}



function byType(typeFilter, entry) {
    return typeFilter[entry.type];
}


function byMapId(mapFilter, entry) {
    if (mapFilter) {
        return entry.mapId === mapFilter;
    }
    else {
        return true;
    }
}



export default Entries;