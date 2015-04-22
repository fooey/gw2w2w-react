"use strict";

/*
*
* Dependencies
*
*/

const React     = require('react');
const Immutable = require('Immutable');



/*
* React Components
*/

const Emblem    = require('common/Icons/Emblem');
const Claims    = require('./Claims');



/*
* Component Globals
*/

const loadingHtml = <h1 style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
    <i className="fa fa-spinner fa-spin" />
    {' Loading...'}
</h1>;



/*
*
* Component Definition
*
*/

const propTypes = {
    lang : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    guild: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

class Guild extends React.Component {
    shouldComponentUpdate(nextProps) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);
        const newGuildData = !Immutable.is(this.props.guild, nextProps.guild);

        const shouldUpdate = (newLang || newGuildData);

        return shouldUpdate;
    }



    render() {
        const dataReady   = this.props.guild.get('loaded');

        const guildId     = this.props.guild.get('guild_id');
        const guildName   = this.props.guild.get('guild_name');
        const guildTag    = this.props.guild.get('tag');
        const guildClaims = this.props.guild.get('claims');

        // console.log('Guild::render()', guildId, guildName);


        return (
            <div className="guild" id={guildId}>
                <div className="row">

                    <div className="col-sm-4">
                        {(dataReady)
                            ? <a href={`http://guilds.gw2w2w.com/guilds/${slugify(guildName)}`} target="_blank">
                                <Emblem guildName={guildName} size={256} />
                            </a>
                            : <Emblem size={256} />
                        }
                    </div>

                    <div className="col-sm-20">
                        {(dataReady)
                            ? <h1><a href={`http://guilds.gw2w2w.com/guilds/${slugify(guildName)}`} target="_blank">
                                {guildName} [{guildTag}]
                            </a></h1>
                            : loadingHtml
                        }

                        {!guildClaims.isEmpty()
                            ? <Claims {...this.props} />
                            : null
                        }
                    </div>

                </div>
            </div>
        );
    }
}





/*
*
* Private Methods
*
*/

function slugify(str) {
    return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
}






/*
*
* Export Module
*
*/

Guild.propTypes = propTypes;
module.exports  = Guild;
