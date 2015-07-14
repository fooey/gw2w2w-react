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

class MapFilters extends React.Component {
    static propTypes = {
        eventFilter: React.PropTypes.oneOf(['all', 'capture', 'claim']).isRequired,
        setEvent   : React.PropTypes.func.isRequired,
    }



    shouldComponentUpdate(nextProps) {
        return (this.props.eventFilter !== nextProps.eventFilter);
    }



    render() {
        const linkClaims   = <a onClick={this.props.setEvent} data-filter='claim'>Claims</a>;
        const linkCaptures = <a onClick={this.props.setEvent} data-filter='capture'>Captures</a>;
        const linkAll      = <a onClick={this.props.setEvent} data-filter='all'>All</a>;

        return (
            <ul id='log-event-filters' className='nav nav-pills'>
                <li className={(this.props.eventFilter === 'claim')   ? 'active' : null}>{linkClaims}</li>
                <li className={(this.props.eventFilter === 'capture') ? 'active' : null}>{linkCaptures}</li>
                <li className={(this.props.eventFilter === 'all')   ? 'active' : null}>{linkAll}</li>
            </ul>
        );
    }
}





/*
*
* Export Module
*
*/

module.exports       = MapFilters;
