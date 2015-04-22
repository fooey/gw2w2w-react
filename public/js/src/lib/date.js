"use strict";

let _ = require('lodash');

module.exports = {
    dateNow: dateNow,
    add5   : add5,
};


function dateNow() {
    return Math.floor(_.now() / 1000);
}


function add5(inDate) {
    let _baseDate = inDate || dateNow();

    return (_baseDate + (5 * 60));
}
