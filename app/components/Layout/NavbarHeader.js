import React from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';


const mapStateToProps = (state) => ({
    lang: state.lang,
    hasPendingRequests: state.api.pending.length > 0,
});

let NavbarHeader = ({
    lang,
    hasPendingRequests,
}) => (
    <div className='navbar-header'>
        <a className='navbar-brand' href={`/${lang.slug}`}>
            <img src='/img/logo/logo-96x36.png' />
        </a>

        <span className={classnames({
            'navbar-spinner': true,
            'active': hasPendingRequests,
        })}>
            <i className='fa fa-spinner fa-spin' />
        </span>

    </div>
);

NavbarHeader.propTypes = {
    lang: React.PropTypes.object.isRequired,
    hasPendingRequests: React.PropTypes.bool.isRequired,
};

NavbarHeader = connect(
    mapStateToProps
)(NavbarHeader);




export default NavbarHeader;