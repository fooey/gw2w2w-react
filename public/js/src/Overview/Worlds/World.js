"use strict";


/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');




/*
*
* Component Definition
*
*/

const propTypes = {
    world : React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

class World extends React.Component {
    shouldComponentUpdate(nextProps) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);
        const newWorld     = !Immutable.is(this.props.world, nextProps.world);
        const shouldUpdate = (newLang || newWorld);

        return shouldUpdate;
    }

    render() {
        const props = this.props;

        // console.log('World::render', props.world.toJS());

        return <li>
            <a href={props.world.get('link')}>
                {props.world.get('name')}
            </a>
        </li>;
    }

}





/*
*
* Export Module
*
*/

World.propTypes = propTypes;
module.exports  = World;
