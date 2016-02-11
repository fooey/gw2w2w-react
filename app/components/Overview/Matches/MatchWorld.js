
import React from 'react';
import numeral from 'numeral';

import Pie from 'components/common/Icons/Pie';




const MatchWorld = ({
    color,
    match,
    showPie,
    world,
}) => (
    <tr>
        <td className={`team name ${color}`}><a href={world.link}>{world.name}</a></td>
        {/*<td className={`team kills ${color}`}>{match.kills ? numeral(match.kills[color]).format('0,0') : null}</td>*/}
        {/*<td className={`team deaths ${color}`}>{match.deaths ? numeral(match.deaths[color]).format('0,0') : null}</td>*/}
        <td className={`team score ${color}`}>{match.scores ? numeral(match.scores[color]).format('0,0') : null}</td>

        {(showPie && match.scores)
            ? <td className='pie' rowSpan='3'><Pie scores={match.scores} size={60} /></td>
            : null
        }
    </tr>
);
MatchWorld.propTypes = {
    color: React.PropTypes.string.isRequired,
    match: React.PropTypes.object.isRequired,
    showPie: React.PropTypes.bool.isRequired,
    world: React.PropTypes.object.isRequired,
};



export default MatchWorld;