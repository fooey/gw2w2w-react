'use strict';


/*
*
* Dependencies
*
*/

const React   = require('react');
const numeral = require('numeral');





/*
*
* Component Definition
*
*/


class Score extends React.Component {
    static propTypes = {
        score: React.PropTypes.number.isRequired,
    }



    static defaultProps = {
        score: 0,
    }



    constructor(props) {
        super(props);
        this.state = {
            diff: 0,
            $diffNode: null,
        };
    }



    shouldComponentUpdate(nextProps) {
        return (this.props.score !== nextProps.score);
    }



    componentWillReceiveProps(nextProps) {
        const props = this.props;

        this.setState({diff: nextProps.score - props.score});
    }



    componentDidUpdate() {
        const state = this.state;

        if (state.diff !== 0) {
            animateScoreDiff(this.state.$diffNode);
        }
    }



    componentDidMount() {
        // cache jQuery object to state
        this.setState({
            $diffNode: $('.diff', React.findDOMNode(this)),
        });
    }



    render() {
        return (
            <div>
                <span className='diff' ref='diff'>{getDiffText(this.state.diff)}</span>
                <span className='value'>{getScoreText(this.props.score)}</span>
            </div>
        );
    }
}






/*
*
* Private Methods
*
*/

function animateScoreDiff($el) {
    $el
        .velocity('stop')
        .velocity({opacity: 0}, {duration: 0})
        .velocity({opacity: 1}, {duration: 200})
        .velocity({opacity: 0}, {duration: 800, delay: 1000});
}


function getDiffText(diff) {
    return (diff)
        ? numeral(diff).format('+0,0')
        : null;
}


function getScoreText(score) {
    return (score)
        ? numeral(score).format('0,0')
        : null;
}



/*
*
* Export Module
*
*/

module.exports = Score;
