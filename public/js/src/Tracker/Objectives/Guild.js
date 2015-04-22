"use strict";

/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');

const Emblem    = require('common/Icons/Emblem');





/*
*
* Component Definition
*
*/

const propTypes = {
    showName: React.PropTypes.bool.isRequired,
    showTag : React.PropTypes.bool.isRequired,
    guildId : React.PropTypes.string,
    guild   : React.PropTypes.instanceOf(Immutable.Map),
};

class Guild extends React.Component {
    shouldComponentUpdate(nextProps) {
        const newGuild     = !Immutable.is(this.props.guildId, nextProps.guildId);
        const newGuildData = !Immutable.is(this.props.guild, nextProps.guild);
        const shouldUpdate = (newGuild || newGuildData);

        return shouldUpdate;
    }

    render() {
        const props     = this.props;

        const hasGuild  = !!this.props.guildId;
        const isEnabled = (hasGuild && (this.props.showName || this.props.showTag));

        if (!isEnabled) {
            return null;
        }
        else {
            const hasGuildData = (props.guild && props.guild.get('loaded'));

            const id    = props.guildId;
            const href  = `#${id}`;

            let content = <i className="fa fa-spinner fa-spin"></i>;
            let title   = null;

            if (hasGuildData) {
                const name = props.guild.get('guild_name');
                const tag  = props.guild.get('tag');

                if (props.showName && props.showTag) {
                    content = <span>
                        {`${name} [${tag}] `}
                        <Emblem guildName={name} size={20} />
                    </span>;
                }
                else if (props.showName) {
                    content = `${name}`;
                }
                else {
                    content = `${tag}`;
                }

                title = `${name} [${tag}]`;
            }

            return <a className="guildname" href={href} title={title}>
                {content}
            </a>;
        }
    }
}




/*
*
* Export Module
*
*/

Guild.propTypes = propTypes;
module.exports  = Guild;
