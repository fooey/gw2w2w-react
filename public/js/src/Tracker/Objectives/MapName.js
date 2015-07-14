'use strict';

/*
*
* Dependencies
*
*/

const React  = require('react');
const STATIC = require('lib/static');





/*
*
* Component Definition
*
*/


class MapName extends React.Component {
    static propTypes = {
        isEnabled  : React.PropTypes.bool.isRequired,
        objectiveId: React.PropTypes.string.isRequired,
    }



    // map name can never change, not localized
    shouldComponentUpdate() {
        return false;
    }



    render() {
        if (!this.props.isEnabled) {
            return null;
        }
        else {
            const oMeta    = STATIC.objective_meta.get(this.props.objectiveId);
            const mapIndex = oMeta.get('map');
            const mapMeta  = STATIC.objective_map.find(mm => mm.get('mapIndex') === mapIndex);

            return (
                <div className='objective-map'>
                    <span title={mapMeta.get('name')}>
                        {mapMeta.get('abbr')}
                    </span>
                </div>
            );
        }
    }
}




/*
*
* Export Module
*
*/

module.exports = MapName;
