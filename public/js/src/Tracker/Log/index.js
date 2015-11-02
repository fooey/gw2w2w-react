
import React from'react';


import Entries from './Entries';
import Tabs from './Tabs';


export default class LogContainer extends React.Component {
    static propTypes = {
        lang: React.PropTypes.object.isRequired,
        log: React.PropTypes.array.isRequired,
        guilds: React.PropTypes.object.isRequired,
        match: React.PropTypes.object.isRequired,
    }



    constructor(props) {
        super(props);

        this.state = {
            mapFilter: '',
            typeFilter: {
                castle: true,
                keep: true,
                tower: true,
                camp: true,
            },
        };
    }



    render() {
        return (
            <div id='log-container'>
                <Tabs
                    maps={this.props.match.maps}
                    mapFilter={this.state.mapFilter}
                    typeFilter={this.state.typeFilter}

                    handleMapFilterClick={this.handleMapFilterClick.bind(this)}
                    handleTypeFilterClick={this.handleTypeFilterClick.bind(this)}
                />
                <Entries
                    guilds={this.props.guilds}
                    lang={this.props.lang}
                    log={this.props.log}
                    now={this.props.now}
                    mapFilter={this.state.mapFilter}
                    typeFilter={this.state.typeFilter}
                />
            </div>
        );
    }



    handleMapFilterClick(mapFilter) {
        console.log('set mapFilter', mapFilter);

        this.setState({mapFilter});
    }

    handleTypeFilterClick(toggleType) {
        console.log('toggle typeFilter', toggleType);

        this.setState(state => {
            state.typeFilter[toggleType] = !state.typeFilter[toggleType];
            return state;
        });
    }
}