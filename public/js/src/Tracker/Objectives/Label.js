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

class Label extends React.Component {
    static propTypes = {
        isEnabled  : React.PropTypes.bool.isRequired,
        lang       : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        objectiveId: React.PropTypes.string.isRequired,
    }



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

            return (
                <div className='objective-label'>
                    <span>{oLabel.get(langSlug)}</span>
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

module.exports = Label;
