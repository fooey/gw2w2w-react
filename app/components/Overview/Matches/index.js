
import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import Match from './Match';


const loadingHtml = <span style={{ paddingLeft: '.5em' }}><i className='fa fa-spinner fa-spin' /></span>;



const mapStateToProps = (state, props) => {
    return {
        matchIds: _.filter(
            state.matches.ids,
            id => props.region.id === id.charAt(0)
        ),
    };
};


let Matches = ({
    matchIds,
    region,
}) => (
    <div className='RegionMatches'>
        <h2>
            {region.label} Matches
            {_.isEmpty(matchIds) ? loadingHtml : null}
        </h2>

        {_.map(
            matchIds,
            (matchId) =>
            <Match key={matchId} matchId={matchId} />
        )}
        {/*_.map(matches, (match) => <div key={match.id}>{JSON.stringify(match)}</div>)*/}
    </div>
);
Matches.propTypes = {
    matchIds: React.PropTypes.array.isRequired,
    region: React.PropTypes.object.isRequired,
};
Matches = connect(
    mapStateToProps
)(Matches);

export default Matches;