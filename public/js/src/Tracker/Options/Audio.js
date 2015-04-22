"use strict";


/*
*
* Dependencies
*
*/

let React = require('react');
let _ = require('lodash');





/*
*
* Component Definition
*
*/

class AudioOptions extends React.Component {
  shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

  render() {
    const props = this.props;

    return (
      <section id="options-audio">
        <h3>Audio Options {getAudioIcon(props.options.enabled)}</h3>
        <div className="checkbox">
          <label htmlFor="audio-enabled">
            <input
              type="checkbox"
              checked={props.options.enabled}
              id="audio-enabled"
              name="audio-enabled"
              value="1"
              onChange={this.toggleEnabled.bind(this)}
            />
            {' '} Audio Alerts
          </label>
        </div>
      </section>
    );
  }



  toggleEnabled(e) {
    let component = this;
    const props = component.props;

    console.log(e);

    let toOptions = _.assign({}, props.options);
    toOptions.enabled = !toOptions.enabled;
    // console.log('AudioOptions::toggleEnabled()', toOptions);


    props.setOptions(toOptions);
  }
}



/*
* Class Properties
*/

AudioOptions.propTypes = {
  lang: React.PropTypes.object.isRequired,
  options: React.PropTypes.object.isRequired,
  setOptions: React.PropTypes.func.isRequired,
};




/*
*
* Export Module
*
*/

module.exports = AudioOptions;




/*
*
* Private Methods
*
*/

function getAudioIcon(enabled) {
  let className = [
    'fa',
    'fa-stack-2x',
  ];

  if (enabled) {
    className.push('fa-circle-o');
    className.push('text-success');
  }
  else {
    className.push('fa-ban');
    className.push('text-danger');
  }

  return (
    <span className="fa-stack">
      <i className="fa fa-volume-up fa-stack-1x"></i>
      <i className={className.join(' ')}></i>
    </span>
  );
}



// function getMapOption(mapIndex, mapName) {
//  let component = this;
//  let props = component.props;

//  let masterEnabled = props.options.enabled;
//  let enabled = props.options.maps[mapIndex];
//  let onChange = component.toggleMapEnabled.bind(component, mapIndex);

//  let key = "audio-enabled-" + mapIndex;

//  let wrapperClassName = [
//    'checkbox',
//    (masterEnabled) ? '' : 'disabled'
//  ];

//  return (
//    <div className={wrapperClassName.join(' ')} key={key}>
//      <label htmlFor={key}>
//        <input
//          type="checkbox"
//          id={key}
//          name={key}
//          checked={enabled}
//          onChange={onChange}
//          disabled={!masterEnabled}
//        />
//        {' '} {mapName}
//      </label>
//    </div>
//  );
// }
