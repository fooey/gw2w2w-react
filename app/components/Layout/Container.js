import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import _ from 'lodash';


import Langs from 'components/Layout/Langs';
import NavbarHeader from 'components/Layout/NavbarHeader';
import Footer from 'components/Layout/Footer';


const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        world: state.world,
    };
};




function isEqualByPick(currentProps, nextProps, keys) {
    return _.isEqual(
        _.pick(currentProps, keys),
        _.pick(nextProps, keys),
    );

    // return _.reduce(keys, (a, key) => {
    //     return a || !_.isEqual(currentProps[key], nextProps[key]);
    // }, false);
}


class Container extends React.Component {
    static propTypes = {
        children: React.PropTypes.node.isRequired,
        lang: ImmutablePropTypes.map.isRequired,
        world: React.PropTypes.object,
    };

    shouldComponentUpdate(nextProps) {
        const shouldUpdate = (
            !isEqualByPick(this.props, nextProps, ['world', 'children'])
            || !this.props.lang.equals(nextProps.lang)
        );
        // console.log(`Container::componentShouldUpdate()`, shouldUpdate);

        // console.log('lang', _.isEqual(this.props.lang, nextProps.lang), nextProps.lang);
        // console.log('world', _.isEqual(this.props.world, nextProps.world), nextProps.world);


        return shouldUpdate;
    };

    // componentWillMount() {
    //     console.log(`Container::componentWillMount()`);
    // };

    // componentDidUpdate() {
    //     console.log(`Container::componentDidUpdate()`);
    // };

    // componentWillUnmount() {
    //     console.log(`Container::componentWillUnmount()`);
    // };

    render() {
        const { children } = this.props;

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
    }
}

Container = connect(
    mapStateToProps
)(Container);



export default Container;