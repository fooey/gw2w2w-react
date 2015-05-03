'use strict';

/*
 *
 * Dependencies
 *
 */

const React = require('react');





/*
 *
 * Component Definition
 *
 */

const propTypes = {
    type : React.PropTypes.string.isRequired,
    color: React.PropTypes.string.isRequired,
};

class Sprite extends React.Component {
    shouldComponentUpdate(nextProps) {
        const newType      = (this.props.type !== nextProps.type);
        const newColor     = (this.props.color !== nextProps.color);
        const shouldUpdate = (newType || newColor);

        return shouldUpdate;
    }



    render() {
        return <span className = {`sprite ${this.props.type} ${this.props.color}`} />;
    }
}




/*
 *
 * Export Module
 *
 */

Sprite.propTypes = propTypes;
module.exports   = Sprite;
