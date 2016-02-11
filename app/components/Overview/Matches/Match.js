
import React from 'react';
import { connect } from 'react-redux';

// import moment from 'moment';

import MatchWorld from './MatchWorld';

import { worlds } from 'lib/static';
const WORLD_COLORS = ['red', 'blue', 'green'];



const mapStateToProps = (state, props) => {
    return {
        lang: state.lang,
        match: state.matches.data[props.matchId],
    };
};



class Match extends React.Component {
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
        return (this.props.lang.slug !== nextProps.lang.slug);
    }



    render() {
        const { lang, match } = this.props;

        return (
            <div className='matchContainer'>
                <table className='match'>
                    <tbody>
                        {_.map(WORLD_COLORS, (color) => {
                            const worldId  = match.worlds[color];
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
                        {/*<tr>
                            <td colSpan={2} />
                            <td style={{textAlign: 'center'}}>
                                <small>{moment(match.lastmod * 1000).format('hh:mm:ss')}</small>
                            </td>
                        </tr>*/}
                    </tbody>
                </table>
            </div>
        );
    }
}

Match = connect(
    mapStateToProps,
)(Match);


export default Match;