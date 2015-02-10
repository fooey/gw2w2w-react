import statics from 'gw2w2w-static';

import _ from 'lodash';
import Immutable from 'Immutable'; // browserify shim


var ImmutableStatics = _.mapValues(statics, obj => Immutable.Map(obj));

// console.log(statics, ImmutableStatics);

export default ImmutableStatics;