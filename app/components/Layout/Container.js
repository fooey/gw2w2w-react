import React from 'react';


import Langs from 'components/Layout/Langs';
import NavbarHeader from 'components/Layout/NavbarHeader';
import Footer from 'components/Layout/Footer';


const Container = ({
    children,
}) => {
    return (
        <div>
            <nav className='navbar navbar-default'>
                <div className='container'>
                    <NavbarHeader />
                    <Langs />
                </div>
            </nav>

            <section id='content' className='container'>
                {children}
            </section>

            <Footer obsfuEmail={{
                chunks: ['gw2w2w', 'schtuph', 'com', '@', '.'],
                pattern: '03142',
            }} />
        </div>
    );
};

Container.propTypes = {
    children: React.PropTypes.node.isRequired,
    world: React.PropTypes.object,
};


export default Container;