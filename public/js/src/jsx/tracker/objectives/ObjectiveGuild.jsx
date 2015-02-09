'use strict';

/*
*
*	Dependencies
*
*/

import React from 'React'; 		// browserify shim

import _ from 'lodash';





/*
*
*	Component Definition
*
*/

class ObjectiveGuild extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		var showName = props.cols.guildName;
		var showTag = props.cols.guildTag;
		var shouldRenderGuild = (props.guildId && (showName || showTag));

		if (shouldRenderGuild) {
			var href = `#${props.guildId}`;

			var title = (props.guild)
				? `${props.guild.guild_name} [${props.guild.tag}]`
				: null;

			var content = (props.guild)
				? <span>
					{showName ? props.guild.guild_Name : null}
					{showTag ? props.guild.tag : null}
				</span>
				: <i className="fa fa-spinner fa-spin"></i>;

			return <a className="guildname" href={href} title={title}>{content}</a>;
		}
		else {
			return null;
		}
	}
}



/*
*	Class Properties
*/

ObjectiveGuild.propTypes = {
	cols: React.PropTypes.object.isRequired,

	guildId: React.PropTypes.string,
	guild: React.PropTypes.object,
};




/*
*
*	Export Module
*
*/

export default ObjectiveGuild;
