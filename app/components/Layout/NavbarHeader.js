import React from 'react';
import { connect } from 'react-redux';


const mapStateToProps = (state) => ({ lang: state.lang });

let NavbarHeader = ({ lang }) => (
    <div className='navbar-header'>
        <a className='navbar-brand' href={`/${lang.slug}`}>
            <img src='/img/logo/logo-96x36.png' />
        </a>
    </div>
);

NavbarHeader.propTypes = {
    lang: React.PropTypes.object.isRequired,
};

NavbarHeader = connect(
    mapStateToProps
)(NavbarHeader);




export default NavbarHeader;