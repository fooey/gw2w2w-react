
import React from'react';
import { connect } from 'react-redux';
// import { createSelector } from 'reselect';
import { createImmutableSelector } from 'lib/reduxHelpers';

import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';


import Entries from './Entries';
import Tabs from './Tabs';


const objectivesSelector = (state) => state.objectives;
const mapsSelector = (state) => state.matchDetails.get('maps');

const mapStateToProps = createImmutableSelector(
    mapsSelector,
    objectivesSelector,
    (maps, objectives) => ({ maps, objectives })
);


class LogContainer extends React.Component {
    static propTypes = {
        maps: ImmutablePropTypes.list.isRequired,
        objectives: ImmutablePropTypes.map.isRequired,
    };



    constructor(props) {
        super(props);

        this.state = {
            mapFilter: '',
            typeFilter: {
                castle: true,
                keep: true,
                tower: true,
                camp: true,
            },
        };
    }



    render() {
        const {
            maps,
            objectives,
        } = this.props;

        return (
            <div className='row'>
                <div className='col-md-24'>
                    <div id='log-container'>
                        <Tabs
                            maps={maps}
                            mapFilter={this.state.mapFilter}
                            typeFilter={this.state.typeFilter}

                            handleMapFilterClick={this.handleMapFilterClick.bind(this)}
                            handleTypeFilterClick={this.handleTypeFilterClick.bind(this)}
                        />
                        <Entries
                            mapFilter={this.state.mapFilter}
                            typeFilter={this.state.typeFilter}
                        />
                    </div>
                </div>
            </div>
        );
    }



    handleMapFilterClick(mapFilter) {
        console.log('set mapFilter', mapFilter);

        this.setState({ mapFilter });
    }

    handleTypeFilterClick(toggleType) {
        console.log('toggle typeFilter', toggleType);

        this.setState(state => {
            state.typeFilter[toggleType] = !state.typeFilter[toggleType];
            return state;
        });
    }
}

LogContainer = connect(
  mapStateToProps,
)(LogContainer);


export default LogContainer;
