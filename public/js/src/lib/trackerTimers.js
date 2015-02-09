'use strict';

var _ = require('lodash');
var async = require('async');

module.exports = {update: update};




function update(now, timeOffset) {
	var $timers = $('.timer');
	var $countdowns = $timers.filter('.countdown');
	var $relatives = $timers.filter('.relative');

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
	var $el = $(el);

	var timestamp = _.parseInt($el.attr('data-timestamp'));
	var offsetTimestamp = timestamp + timeOffset;
	var timestampMoment = moment(offsetTimestamp * 1000);
	var timestampRelative = timestampMoment.twitterShort();

	$el.text(timestampRelative);

	next();
}



function updateCountdownTimerNode(now, el, next) {
	var $el = $(el);

	var dataExpires = $el.attr('data-expires');
	var expires = _.parseInt(dataExpires);
	var secRemaining = (expires - now);
	var secElapsed = 300 - secRemaining;

	var highliteTime = 10;
	var isVisible = expires + highliteTime >= now;
	var isExpired = expires < now;
	var isActive = !isExpired;
	var isTimerHighlighted = (secRemaining <= Math.abs(highliteTime));
	var isTimerFresh = (secElapsed <= highliteTime);


	var timerText = (isActive)
		? moment(secRemaining * 1000).format('m:ss')
		: '0:00';


	if (isVisible) {
		var $objective = $el.closest('.objective');
		var hasClassHighlight = $el.hasClass('highlight');
		var hasClassFresh = $objective.hasClass('fresh');

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
