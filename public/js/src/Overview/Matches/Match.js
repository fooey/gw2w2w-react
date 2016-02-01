
import React from 'react';

import MatchWorld from './MatchWorld';

import {worlds} from 'lib/static';
const WORLD_COLORS = ['red', 'blue', 'green'];


export default class Match extends React.Component {
    static propTypes = {
        lang: React.PropTypes.object.isRequired,
        match: React.PropTypes.object.isRequired,
    };



    shouldComponentUpdate(nextProps) {
        return (
            this.isNewMatchData(nextProps)
            || this.isNewLang(nextProps)
        );
    }

    isNewMatchData(nextProps) {
        return (this.props.match.lastmod !== nextProps.match.lastmod);
    }

    isNewLang(nextProps) {
        return (this.props.lang.name !== nextProps.lang.name);
    }



    render() {
        const {lang, match} = this.props;

        return (
            <div className='matchContainer'>
                <table className='match'><tbody>
                    {_.map(WORLD_COLORS, (color) => {
                        const worldKey = color;
                        const worldId  = match.worlds[worldKey];
                        const world = worlds[worldId][lang.slug];

                        return (
                            <MatchWorld
                                component = 'tr'
                                key = {worldId}

                                color = {color}
                                match = {match}
                                showPie = {color === 'red'}
                                world = {world}
                            />
                        );
                    })}
                </tbody></table>
            </div>
        );
    }
}