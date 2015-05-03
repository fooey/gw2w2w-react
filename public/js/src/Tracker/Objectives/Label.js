'use strict';

/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');
const STATIC    = require('lib/static');





/*
*
* Component Definition
*
*/

const propTypes = {
    lang       : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    isEnabled  : React.PropTypes.bool.isRequired,
    objectiveId: React.PropTypes.string.isRequired,
};

class Label extends React.Component {
    shouldComponentUpdate(nextProps) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);
        const shouldUpdate = (newLang);

        return shouldUpdate;
    }



    render() {
        if (!this.props.isEnabled) {
            return null;
        }
        else {
            const oLabel   = STATIC.objective_labels.get(this.props.objectiveId);
            const langSlug = this.props.lang.get('slug');

            return <div className="objective-label">
                <span>{oLabel.get(langSlug)}</span>
            </div>;
        }
    }
}





/*
*
* Export Module
*
*/

Label.propTypes = propTypes;
module.exports  = Label;
