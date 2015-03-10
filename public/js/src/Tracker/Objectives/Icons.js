'use strict';

/*
*
*	Dependencies
*
*/

const React = require('react');
const Immutable = require('Immutable');

const STATIC = require('lib/static');



/*
*	React Components
*/

const Sprite = require('common/Icons/Sprite');
const Arrow = require('common/Icons/Arrow');





/*
*
*	Component Definition
*
*/

class Icons extends React.Component {
	shouldComponentUpdate(nextProps) {
		const newColor = !Immutable.is(this.props.color, nextProps.color);
		const shouldUpdate = (newColor);

		return shouldUpdate;
	}



	render() {
		if (!this.props.showArrow && !this.props.showSprite) {
			return null;
		}
		else {
			const oMeta = STATIC.objective_meta.get(this.props.objectiveId);
			const objectiveTypeId = oMeta.get('type').toString();
			const oType = STATIC.objective_types.get(objectiveTypeId);

			return <div className="objective-icons">
				{(this.props.showArrow) ?
					<Arrow oMeta={oMeta} />
				: null}

				{(this.props.showSprite) ?
					<Sprite
						type={oType.get('name')}
						color={this.props.color}
					/>
				: null}
			</div>;
		}
	}
}



/*
*	Class Properties
*/

Icons.propTypes = {
	showArrow: React.PropTypes.bool.isRequired,
	showSprite: React.PropTypes.bool.isRequired,
	objectiveId: React.PropTypes.string.isRequired,
	color: React.PropTypes.string.isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = Icons;