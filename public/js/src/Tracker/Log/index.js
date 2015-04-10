'use strict';

/*
*
* Dependencies
*
*/

const React        = require('react');
const Immutable    = require('Immutable');

// const STATIC       = require('gw2w2w-static');



/*
* React Components
*/

const MapFilters   = require('./MapFilters');
const EventFilters = require('./EventFilters');
const LogEntries   = require('./LogEntries');




/*
*
* Component Definition
*
*/

const propTypes = {
  lang   : React.PropTypes.instanceOf(Immutable.Map).isRequired,
  details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  guilds : React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

class Log extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapFilter          : 'all',
      eventFilter        : 'all',
      triggerNotification: false,
    };
  }



  shouldComponentUpdate(nextProps, nextState) {
    const newLang        = !Immutable.is(this.props.lang, nextProps.lang);
    const newGuilds      = !Immutable.is(this.props.guilds, nextProps.guilds);
    const newHistory     = !Immutable.is(this.props.details.get('history'), nextProps.details.get('history'));

    const newMapFilter   = !Immutable.is(this.state.mapFilter, nextState.mapFilter);
    const newEventFilter = !Immutable.is(this.state.eventFilter, nextState.eventFilter);

    const shouldUpdate   = (newLang || newGuilds || newHistory || newMapFilter || newEventFilter);

    return shouldUpdate;
  }



  componentDidMount() {
    this.setState({triggerNotification: true});
  }



  componentDidUpdate() {
    if (!this.state.triggerNotification) {
      this.setState({triggerNotification: true});
    }
  }



  render() {

    const eventHistory = this.props.details.get('history');

    return (
      <div id="log-container">

        <div className="log-tabs">
          <div className="row">
            <div className="col-sm-16">
              <MapFilters
                mapFilter = {this.state.mapFilter}
                setWorld  = {setWorld.bind(this)}
              />
            </div>
            <div className="col-sm-8">
              <EventFilters
                eventFilter = {this.state.eventFilter}
                setEvent    = {setEvent.bind(this)}
              />
            </div>
          </div>
        </div>

        {!eventHistory.isEmpty()
          ? <LogEntries
            triggerNotification = {this.state.triggerNotification}
            mapFilter           = {this.state.mapFilter}
            eventFilter         = {this.state.eventFilter}

            lang                = {this.props.lang}
            guilds              = {this.props.guilds}

            eventHistory        = {eventHistory}
          />
          : null
        }

      </div>
    );
  }
}





/*
*
* Private Methods
*
*/

function setWorld(e) {
  let component = this;

  let filter = e.target.getAttribute('data-filter');

  component.setState({mapFilter: filter, triggerNotification: true});
}



function setEvent(e) {
  let component = this;

  let filter = e.target.getAttribute('data-filter');

  component.setState({eventFilter: filter, triggerNotification: true});
}





/*
*
* Export Module
*
*/

Log.propTypes  = propTypes;
module.exports = Log;
