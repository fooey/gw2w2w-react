
import React from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';


const mapStateToProps = (state) => {
    // console.log('lang', state.lang);
    return {
        activeLang: state.lang,
        activeWorld: state.world,
    };
};


let Lang = ({
    activeLang,
    activeWorld,
    lang,
}) =>  (
    <li
        className={classnames({
            active: activeLang.label === lang.label,
        })}
        title={lang.name}
    >
        <a href={getLink(lang, activeWorld)}>
            {lang.label}
        </a>
    </li>
);
Lang.propTypes = {
    activeLang: React.PropTypes.object.isRequired,
    activeWorld: React.PropTypes.object,
    lang: React.PropTypes.object.isRequired,
};
Lang = connect(
  mapStateToProps,
  // mapDispatchToProps
)(Lang);



function getLink(lang, world) {
    return (world)
        ? world.link
        : lang.link;
}



export default Lang;