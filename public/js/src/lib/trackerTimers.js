"use strict";

const _      = require('lodash');
const async  = require('async');
const moment = require('moment');




const buffTime     = 5 * 60 * 1000;
const highliteTime = 10 * 1000;



function update(remoteOffset=0, cb=_.noop) {
    const timeLocal = Date.now();
    const timeRemote = timeLocal - remoteOffset;

    // console.log('update', remoteOffset, timeLocal, timeRemote);

    let $timers     = $('.timer');
    let $countdowns = $timers.filter('.countdown');
    let $relatives  = $timers.filter('.relative');

    async.parallel([
        updateRelativeTimers.bind(null, $relatives, remoteOffset),
        updateCountdownTimers.bind(null, $countdowns, timeRemote),
    ], cb);
}



function updateRelativeTimers(relatives, offset, cb) {
    async.each(
        relatives,
        updateRelativeTimeNode.bind(null, offset),
        cb
    );
}



function updateCountdownTimers(countdowns, timeRemote, cb) {
    async.each(
        countdowns,
        updateCountdownTimerNode.bind(null, timeRemote),
        cb
    );
}



function updateRelativeTimeNode(offset, el, next) {
    const $el = $(el);

    const timestamp         = _.parseInt($el.attr('data-timestamp'));
    const offsetTimestamp   = (timestamp * 1000) + offset;
    const timestampMoment   = moment(offsetTimestamp);
    const timestampRelative = timestampMoment.twitterShort();

    // console.log(offset, $el, timestamp, offsetTimestamp, timestampMoment);

    $el.text(timestampRelative);

    next();
}



function updateCountdownTimerNode(timeRemote, el, next) {
    const $el = $(el);

    const timestamp   = _.parseInt($el.attr('data-timestamp')) * 1000;
    const expires     = timestamp + buffTime;
    const msRemaining = expires - timeRemote;
    const msElapsed   = buffTime - msRemaining;


    const isVisible     = expires + highliteTime >= timeRemote;
    const isExpired     = expires < timeRemote;
    const isActive      = !isExpired;
    const isHighlighted = (msRemaining <= Math.abs(highliteTime));
    const isFresh       = (msElapsed <= highliteTime);




    if (isVisible) {
        const timerText = (isActive) ? moment(msRemaining).format('m:ss') : '0:00';

        const $objective        = $el.closest('.objective');
        const hasClassHighlight = $objective.hasClass('highlight');
        const hasClassFresh     = $objective.hasClass('fresh');

        if (isHighlighted && !hasClassHighlight) {
            $objective.addClass('highlight');
        } else if (!isHighlighted && hasClassHighlight) {
            $objective.removeClass('highlight');
        }

        if (isFresh && !hasClassFresh) {
            $objective.addClass('fresh');
        } else if (!isFresh && hasClassFresh) {
            $objective.removeClass('fresh');
        }

        $el.text(timerText)
            .filter('.inactive')
            .addClass('active')
            .removeClass('inactive')
            .end();

    } else {
        $el.filter('.active')
            .addClass('inactive')
            .removeClass('active')
            .removeClass('highlight')
            .end();
    }

    next();
}




module.exports = {
    update
};
