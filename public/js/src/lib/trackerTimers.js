'use strict';

const _     = require('lodash');
const async = require('async');







function update(now, timeOffset) {
  let $timers     = $('.timer');
  let $countdowns = $timers.filter('.countdown');
  let $relatives  = $timers.filter('.relative');

  async.parallel([
    updateRelativeTimers.bind(null, $relatives, timeOffset),
    updateCountdownTimers.bind(null, $countdowns, now),
  ], _.noop);
}



function updateRelativeTimers(relatives, timeOffset, cb) {
  async.each(
    relatives,
    updateRelativeTimeNode.bind(null, timeOffset),
    cb
  );
}



function updateCountdownTimers(countdowns, now, cb) {
  async.each(
    countdowns,
    updateCountdownTimerNode.bind(null, now),
    cb
  );
}



function updateRelativeTimeNode(timeOffset, el, next) {
  let $el = $(el);

  const timestamp         = _.parseInt($el.attr('data-timestamp'));
  const offsetTimestamp   = timestamp + timeOffset;
  const timestampMoment   = moment(offsetTimestamp * 1000);
  const timestampRelative = timestampMoment.twitterShort();

  $el.text(timestampRelative);

  next();
}



function updateCountdownTimerNode(now, el, next) {
  let $el = $(el);

  const dataExpires  = $el.attr('data-expires');
  const expires      = _.parseInt(dataExpires);
  const secRemaining = (expires - now);
  const secElapsed   = 300 - secRemaining;


  const highliteTime       = 10;
  const isVisible          = expires + highliteTime >= now;
  const isExpired          = expires < now;
  const isActive           = !isExpired;
  const isTimerHighlighted = (secRemaining <= Math.abs(highliteTime));
  const isTimerFresh       = (secElapsed <= highliteTime);


  const timerText = (isActive)
    ? moment(secRemaining * 1000).format('m:ss')
    : '0:00';


  if (isVisible) {
    let $objective        = $el.closest('.objective');
    let hasClassHighlight = $el.hasClass('highlight');
    let hasClassFresh     = $objective.hasClass('fresh');

    if (isTimerHighlighted && !hasClassHighlight) {
      $el.addClass('highlight');
    }
    else if (!isTimerHighlighted && hasClassHighlight) {
      $el.removeClass('highlight');
    }

    if (isTimerFresh && !hasClassFresh) {
      $objective.addClass('fresh');
    }
    else if (!isTimerFresh && hasClassFresh) {
      $objective.removeClass('fresh');
    }

    $el.text(timerText)
      .filter('.inactive')
        .addClass('active')
        .removeClass('inactive')
      .end();

  }
  else {
    $el.filter('.active')
      .addClass('inactive')
      .removeClass('active')
      .removeClass('highlight')
    .end();
  }

  next();
}




module.exports = {update};