const statics = require('gw2w2w-static');
const Immutable = require('Immutable');



const immutableStatics = {
    langs           : Immutable.fromJS(statics.langs),
    worlds          : Immutable.fromJS(statics.worlds),
    objective_names : Immutable.fromJS(statics.objective_names),
    objective_types : Immutable.fromJS(statics.objective_types),
    objective_meta  : Immutable.fromJS(statics.objective_meta),
    objective_labels: Immutable.fromJS(statics.objective_labels),
    objective_map   : Immutable.fromJS(statics.objective_map),
};



module.exports = immutableStatics;
