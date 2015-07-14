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

class Sprite extends React.Component {
    static propTypes = {
        color: React.PropTypes.string.isRequired,
        type : React.PropTypes.string.isRequired,
    }



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

module.exports   = Sprite;
