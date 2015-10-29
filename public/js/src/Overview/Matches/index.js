
import React from 'react';
import _ from 'lodash';

import Match from './Match';


const loadingHtml = <span style={{paddingLeft: '.5em'}}><i className='fa fa-spinner fa-spin' /></span>;



export default ({
    lang,
    matches,
    region,
}) => (
    <div className='RegionMatches'>
        <h2>
            {region.label} Matches
            {_.isEmpty(matches) ? loadingHtml : null}
        </h2>

        {_.chain(matches)
            .sortBy('id')
            .map(
                (match) =>
                <Match
                    key={match.id}
                    lang={lang}
                    match={match}
                />
            )
            .value()
        }
    </div>
);