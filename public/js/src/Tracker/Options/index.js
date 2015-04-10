'use strict';


/*
*
* Dependencies
*
*/

let React = require('react');
let _ = require('lodash');





/*
* React Components
*/

let Audio = require('./Audio');





/*
*
* Component Definition
*
*/

class Options extends React.Component {
  shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

  render() {
    let component = this;
    const props = component.props;

    // console.log('Options::render()');
    // console.log('Options::render', 'options.audio.enabled', options.audio.enabled);

    return (
      <section id="options">
        <h2 className="section-header">Options</h2>
        <Audio
          lang={props.lang}
          options={props.options.audio}
          setOptions={this.setAudioOptions.bind(this)}
        />
      </section>
    );
  }



  pushOptions(category, categoryOptions) {
    let component = this;
    const props = component.props;
    // console.log('Options::setOptions()', category, categoryOptions);

    let options = _.assign({}, props.options);
    options[category] = categoryOptions;

    props.setOptions(options);
  }


  setAudioOptions(newOptions) {
    this.pushOptions('audio', newOptions);
  }
}



/*
* Class Properties
*/

Options.propTypes = {
  lang: React.PropTypes.object.isRequired,
  options: React.PropTypes.object.isRequired,
  setOptions: React.PropTypes.func.isRequired,
};




/*
*
* Export Module
*
*/

module.exports = Options;
