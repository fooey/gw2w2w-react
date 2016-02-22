import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import classnames from 'classnames';




/*
*
*   Redux Helpers
*
*/
;
const langSelector = (state) => state.lang;
const apiSelector = (state) => state.api;
const apiPendingSelector = createSelector(apiSelector, (api) => api.get('pending'));
const hasPendingSelector = createSelector(apiPendingSelector, (pending) => !pending.isEmpty());

const mapStateToProps = createSelector(
    langSelector,
    hasPendingSelector,
    (lang, hasPendingRequests) => ({
        lang,
        hasPendingRequests,
    })
);
// const mapStateToProps = (state) => {
//     return {
//         lang: state.lang,
//         hasPendingRequests: !state.api.get('pending').isEmpty(),
//     };
// };






let NavbarHeader = ({
    lang,
    hasPendingRequests,
}) => (
    <div className='navbar-header'>
        <a className='navbar-brand' href={`/${lang.get('slug')}`}>
            <img src='/img/logo/logo-96x36.png' />
        </a>

        <span className={classnames({
            'navbar-spinner': true,
            active: hasPendingRequests,
        })}>
            <i className='fa fa-spinner fa-spin' />
        </span>

    </div>
);

NavbarHeader.propTypes = {
    lang: ImmutablePropTypes.map.isRequired,
    hasPendingRequests: React.PropTypes.bool.isRequired,
};

NavbarHeader = connect(
    mapStateToProps
)(NavbarHeader);




export default NavbarHeader;