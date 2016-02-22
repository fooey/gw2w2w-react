
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import classnames from 'classnames';

import { worlds } from 'lib/static';





/*
*
*   Redux Helpers
*
*/

const activeLangSelector = (state) => state.lang;
const langSelector = (state, props) => props.lang;
const worldSelector = (state) => state.world;
const worldDataSelector = createSelector(
    activeLangSelector,
    langSelector,
    worldSelector,
    (activeLang, lang, world) => ({
        activeLang,
        world: world ? worlds[world.id][lang.slug] : null,
    })
);

// const mapStateToProps = (state, props) => {
//     // console.log('lang', state.lang);
//     return {
//         activeLang: state.lang,
//         // activeWorld: state.world,
//         world: state.world ? worlds[state.world.id][props.lang.slug] : null,
//     };
// };





let Lang = ({
    activeLang,
    // activeWorld,
    lang,
    world,
}) => (
    <li
        className={classnames({
            active: activeLang.get('label') === lang.label,
        })}
        title={lang.name}
    >
        <a href={getLink(lang, world)}>
            {lang.label}
        </a>
    </li>
);
Lang.propTypes = {
    activeLang: ImmutablePropTypes.map.isRequired,
    activeWorld: React.PropTypes.object,
    lang: React.PropTypes.object.isRequired,
};
Lang = connect(
  worldDataSelector,
  // mapDispatchToProps
)(Lang);



function getLink(lang, world) {
    return (world)
        ? world.link
        : lang.link;
}



export default Lang;