'use strict';

const _ = require('lodash');

module.exports = {
    dateNow: dateNow,
    add5   : add5,
};


function dateNow() {
    return Math.floor(_.now() / 1000);
}


function add5(inDate) {
    const _baseDate = inDate || dateNow();

    return (_baseDate + (5 * 60));
}
