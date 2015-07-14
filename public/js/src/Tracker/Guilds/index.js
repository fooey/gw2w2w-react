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

const Guild     = require('./Guild');




/*
*
* Component Definition
*
*/


class Guilds extends React.Component {
    static propTypes = {
        guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired,
        lang  : React.PropTypes.instanceOf(Immutable.Map).isRequired,
    }



    shouldComponentUpdate(nextProps) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);
        const newGuildData = !Immutable.is(this.props.guilds, nextProps.guilds);

        const shouldUpdate = (newLang || newGuildData);

        return shouldUpdate;
    }



    render() {
        const props = this.props;

        // console.log('Guilds::render()');
        // console.log('props.guilds', props.guilds.toObject());

        const sortedGuilds = props.guilds.toSeq()
            .sortBy(guild => guild.get('guild_name'))
            .sortBy(guild => -guild.get('lastClaim'));

        return (
            <section id='guilds'>
                <h2 className='section-header'>Guild Claims</h2>
                {sortedGuilds.map(guild =>
                    <Guild
                        key   = {guild.get('guild_id')}

                        guild = {guild}
                        lang  = {props.lang}
                    />
                )}
            </section>
        );
    }
}




/*
*
* Export Module
*
*/

module.exports = Guilds;
