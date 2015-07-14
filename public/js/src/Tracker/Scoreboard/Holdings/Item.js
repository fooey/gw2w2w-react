'use strict';

/*
*
* Dependencies
*
*/

const React  = require('react');

const STATIC = require('lib/static');


/*
* React Components
*/

const Sprite = require('common/Icons/Sprite');




/*
*
* Component Definition
*
*/


class HoldingsItem extends React.Component {
    static propTypes = {
        color       : React.PropTypes.string.isRequired,
        typeId      : React.PropTypes.string.isRequired,
        typeQuantity: React.PropTypes.number.isRequired,
    }



    constructor(props) {
        super(props);

        this.state = {
            oType: STATIC.objective_types.get(props.typeId),
        };
    }



    shouldComponentUpdate(nextProps) {
        const newQuantity  = (this.props.typeQuantity !== nextProps.typeQuantity);
        const newType      = (this.props.typeId !== nextProps.typeId);
        const newColor     = (this.props.color !== nextProps.color);
        const shouldUpdate = (newQuantity || newType || newColor);

        return shouldUpdate;
    }



    componentWillReceiveProps(nextProps) {
        const newType = (this.props.typeId !== nextProps.typeId);

        if (newType) {
            this.setState({oType: STATIC.objective_types.get(this.props.typeId)});
        }
    }



    render() {
        // console.log('Tracker::Scoreboard::HoldingsItem:render()', this.state.oType.toJS());

        return (
            <li>
                <Sprite
                    type  = {this.state.oType.get('name')}
                    color = {this.props.color}
                />

                {` x${this.props.typeQuantity}`}
            </li>
        );
    }
}




/*
*
* Export Module
*
*/

module.exports = HoldingsItem;
