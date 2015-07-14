'use strict';

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

const loadingHtml = (
    <h1 style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
        <i className='fa fa-spinner fa-spin' />
        {' Loading...'}
    </h1>
);



/*
*
* Component Definition
*
*/


class Guild extends React.Component {
    static propTypes = {
        guild: React.PropTypes.instanceOf(Immutable.Map).isRequired,
        lang : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    }



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

        const guildLink   = (guildName)
            ? `http://guilds.gw2w2w.com/guilds/${slugify(guildName)}`
            : `http://guilds.gw2w2w.com/${guildId}`;

        // console.log('Guild::render()', guildId, guildName);


        return (
            <div className='guild' id={guildId}>
                <div className='row'>

                    <div className='col-sm-4'>
                        <a href={guildLink} target='_blank'>
                            <Emblem key={guildId} guildName={guildName} size={256} />
                        </a>
                    </div>

                    <div className='col-sm-20'>
                        {(dataReady)
                            ? <h1><a href={guildLink} target='_blank'>
                                {guildName} [{guildTag}]
                            </a></h1>
                            : <div>{loadingHtml}<br />{guildId}</div>
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

module.exports  = Guild;
