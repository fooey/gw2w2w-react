(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
'use strict';


/*
*
*	Routing
*
*/


var page = require('page');
page('/:langSlug(en|de|es|fr)?', require('./overview.jsx'));
page('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)', require('./tracker.jsx'));

$(function() {
	page.start({
		click: true,
		popstate: false,
		dispatch: true,
	});
});

},{"./overview.jsx":40,"./tracker.jsx":41,"page":16}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],5:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":3,"./encode":4}],6:[function(require,module,exports){
/*
*	Browserify uses this instead of getData.js
*	configured in package.json
*/

"use strict";


module.exports = function requestJson(requestUrl, fnCallback) {
	requestClient(requestUrl, fnCallback);
};


function requestClient(requestUrl, fnCallback) {
	if (!window || !window.jQuery) {
		throw ('gw2api requires jQuery when used in the browser');
	}
	window.jQuery.getJSON(requestUrl)
		.done(function(data, textStatus, jqXHR) {
			fnCallback(null, data);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			fnCallback({
				jqXHR: jqXHR,
				textStatus: textStatus,
				errorThrown: errorThrown
			});
		});
}

},{}],7:[function(require,module,exports){
'use strict';

/*
*
*	https://github.com/fooey/node-gw2
*   http://wiki.guildwars2.com/wiki/API:Main
*
*/




/*
*
*   DEFINE EXPORT
*
*/

module.exports = {
	getMatches: getMatches,
	getMatchesState: getMatchesState,
	getObjectiveNames: getObjectiveNames,
	getMatchDetails: getMatchDetails,
	getMatchDetailsState: getMatchDetailsState,

	getItems: getItems,
	getItemDetails: getItemDetails,
	getRecipes: getRecipes,
	getRecipeDetails: getRecipeDetails,

	getWorldNames: getWorldNames,
	getGuildDetails: getGuildDetails,

	getMapNames: getMapNames,
	getContinents: getContinents,
	getMaps: getMaps,
	getMapFloor: getMapFloor,

	getBuild: getBuild,
	getColors: getColors,

	getFiles: getFiles,
	getFile: getFile,
	getFileRenderUrl: getFileRenderUrl,
};




/*
*
*   PRIVATE PROPERTIES
*
*/

var endPoints = {
	worldNames: 'https://api.guildwars2.com/v2/worlds',							// https://api.guildwars2.com/v2/worlds?page=0
	colors: 'https://api.guildwars2.com/v1/colors.json',						// http://wiki.guildwars2.com/wiki/API:1/colors
	guildDetails: 'https://api.guildwars2.com/v1/guild_details.json',			// http://wiki.guildwars2.com/wiki/API:1/guild_details

	items: 'https://api.guildwars2.com/v1/items.json',							// http://wiki.guildwars2.com/wiki/API:1/items
	itemDetails: 'https://api.guildwars2.comv1/item_details.json',				// http://wiki.guildwars2.com/wiki/API:1/item_details
	recipes: 'https://api.guildwars2.com/v1/recipes.json',						// http://wiki.guildwars2.com/wiki/API:1/recipes
	recipeDetails: 'https://api.guildwars2.com/v1/recipe_details.json',			// http://wiki.guildwars2.com/wiki/API:1/recipe_details

	mapNames: 'https://api.guildwars2.com/v1/map_names.json',					// http://wiki.guildwars2.com/wiki/API:1/map_names
	continents: 'https://api.guildwars2.com/v1/continents.json',				// http://wiki.guildwars2.com/wiki/API:1/continents
	maps: 'https://api.guildwars2.com/v1/maps.json',							// http://wiki.guildwars2.com/wiki/API:1/maps
	mapFloor: 'https://api.guildwars2.com/v1/map_floor.json',					// http://wiki.guildwars2.com/wiki/API:1/map_floor

	objectiveNames: 'https://api.guildwars2.com/v1/wvw/objective_names.json',	// http://wiki.guildwars2.com/wiki/API:1/wvw/matches
	matches: 'https://api.guildwars2.com/v1/wvw/matches.json',					// http://wiki.guildwars2.com/wiki/API:1/wvw/match_details
	matchDetails: 'https://api.guildwars2.com/v1/wvw/match_details.json',		// http://wiki.guildwars2.com/wiki/API:1/wvw/objective_names

	matchesState: 'http://state.gw2w2w.com/matches',
	matchDetailsState: 'http://state.gw2w2w.com/',
};



/*
*
*   PUBLIC METHODS
*
*/



/*
*	WORLD vs WORLD
*/

// OPTIONAL: lang
function getObjectiveNames(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}
	get('objectiveNames', params, callback);
}



// NO PARAMS
function getMatches(callback) {
	get('matches', {}, function(err, data) {
		var wvw_matches = (data && data.wvw_matches) ? data.wvw_matches : [];
		callback(err, wvw_matches);
	});
}



// REQUIRED: match_id
function getMatchDetails(params, callback) {
	if (!params.match_id) {
		throw ('match_id is a required parameter');
	}
	get('matchDetails', params, callback);
}





// OPTIONAL: match_id
function getMatchesState(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}

	var requestUrl = endPoints['matchesState'];

	if (params.match_id) {
		requestUrl += '' + match_id;
	}

	get(requestUrl, {}, callback);
}


// REQUIRED: match_id || world_slug
function getMatchDetailsState(params, callback) {
	var requestUrl = endPoints['matchDetailsState'];

	if (!params.match_id && !params.world_slug) {
		throw ('Either match_id or world_slug must be passed');
	}
	else if (params.match_id) {
		requestUrl += params.match_id;
	}
	else if (params.world_slug) {
		requestUrl += 'world/' + params.world_slug;
	}
	get(requestUrl, {}, callback);
}



/*
*	GENERAL
*/


// OPTIONAL: lang, ids
function getWorldNames(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}

	if (!params.ids) {
		params.page = 0;
	}
	else if (Array.isArray(params.ids)) {
		params.ids = params.ids.join(',');
	}
	get('worldNames', params, callback);
}



// REQUIRED: guild_id || guild_name (id takes priority)
function getGuildDetails(params, callback) {
	if (!params.guild_id && !params.guild_name) {
		throw ('Either guild_id or guild_name must be passed');
	}

	get('guildDetails', params, callback);
}



/*
*	ITEMS
*/

// NO PARAMS
function getItems(callback) {
	get('items', {}, callback);
}


// REQUIRED: item_id
// OPTIONAL: lang
function getItemDetails(params, callback) {
	if (!params.item_id) {
		throw ('item_id is a required parameter');
	}
	get('itemDetails', params, callback);
}


// NO PARAMS
function getRecipes(callback) {
	get('recipes', {}, callback);
}

// REQUIRED: recipe_id
// OPTIONAL: lang
function getRecipeDetails(params, callback) {
	if (!params.recipe_id) {
		throw ('recipe_id is a required parameter');
	}
	get('recipeDetails', params, callback);
}



/*
*	MAP INFORMATION
*/

// OPTIONAL: lang
function getMapNames(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}
	get('mapNames', params, callback);
}

// NO PARAMS
function getContinents(callback) {
	get('continents', {}, callback);
}


// OPTIONAL: map_id, lang
function getMaps(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}
	get('maps', params, callback);
}


// REQUIRED: continent_id, floor
// OPTIONAL: lang
function getMapFloor(params, callback) {
	if (!params.continent_id) {
		throw ('continent_id is a required parameter');
	}
	else if (!params.floor) {
		throw ('floor is a required parameter');
	}
	get('mapFloor', {}, callback);
}



/*
*	Miscellaneous
*/

// NO PARAMS
function getBuild(callback) {
	get('build', {}, callback);
}


// OPTIONAL: lang
function getColors(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}
	get('colors', params, callback);
}


// NO PARAMS
// to get files: https://render.guildwars2.com/file/{signature}/{file_id}.{format}
function getFiles(callback) {
	get('files', {}, callback);
}



/*
*
*   UTILITY METHODS
*
*/


// SPECIAL CASE
// REQUIRED: signature, file_id, format
function getFile(params, callback) {
	if (!params.signature) {
		throw ('signature is a required parameter');
	}
	else if (!params.file_id) {
		throw ('file_id is a required parameter');
	}
	else if (!params.format) {
		throw ('format is a required parameter');
	}

	requestJson(getFileRenderUrl(params), callback);
}


// REQUIRED: signature, file_id, format
function getFileRenderUrl(params, callback) {
	if (!params.signature) {
		throw ('signature is a required parameter');
	}
	else if (!params.file_id) {
		throw ('file_id is a required parameter');
	}
	else if (!params.format) {
		throw ('format is a required parameter');
	}

	var renderUrl = (
		'https://render.guildwars2.com/file/'
		+ params.signature
		+ '/'
		+ params.file_id
		+ '.'
		+ params.format
	);
	return renderUrl;
}





/*
*
*   PRIVATE METHODS
*
*/

function get(key, params, callback) {
	params = params || {};

	var apiUrl = getApiUrl(key, params);
	var getData = require('./lib/getData.js');

	getData(apiUrl, callback);
}



function getApiUrl(requestUrl, params) {
	var qs = require('querystring');

	var requestUrl = (endPoints[requestUrl])
		? endPoints[requestUrl]
		: requestUrl;

	var query = qs.stringify(params);

	if (query.length) {
		requestUrl += '?' + query;
	}

	return requestUrl;
}


},{"./lib/getData.js":6,"querystring":5}],8:[function(require,module,exports){
module.exports = {
	"en": {
		"sort": 1,
		"slug": "en",
		"label": "EN",
		"link": "/en",
		"name": "English"
	},
	"de": {
		"sort": 2,
		"slug": "de",
		"label": "DE",
		"link": "/de",
		"name": "Deutsch"
	},
	"es": {
		"sort": 3,
		"slug": "es",
		"label": "ES",
		"link": "/es",
		"name": "Español"
	},
	"fr": {
		"sort": 4,
		"slug": "fr",
		"label": "FR",
		"link": "/fr",
		"name": "Français"
	}
};

},{}],9:[function(require,module,exports){
module.exports = {
	"1": {"id": "1", "en": "Overlook", "fr": "Belvédère", "es": "Mirador", "de": "Aussichtspunkt"},
	"2": {"id": "2", "en": "Valley", "fr": "Vallée", "es": "Valle", "de": "Tal"},
	"3": {"id": "3", "en": "Lowlands", "fr": "Basses terres", "es": "Vega", "de": "Tiefland"},
	"4": {"id": "4", "en": "Golanta Clearing", "fr": "Clairière de Golanta", "es": "Claro Golanta", "de": "Golanta-Lichtung"},
	"5": {"id": "5", "en": "Pangloss Rise", "fr": "Montée de Pangloss", "es": "Colina Pangloss", "de": "Pangloss-Anhöhe"},
	"6": {"id": "6", "en": "Speldan Clearcut", "fr": "Forêt rasée de Speldan", "es": "Claro Espeldia", "de": "Speldan Kahlschlag"},
	"7": {"id": "7", "en": "Danelon Passage", "fr": "Passage Danelon", "es": "Pasaje Danelon", "de": "Danelon-Passage"},
	"8": {"id": "8", "en": "Umberglade Woods", "fr": "Bois d'Ombreclair", "es": "Bosques Clarosombra", "de": "Umberlichtung-Forst"},
	"9": {"id": "9", "en": "Stonemist Castle", "fr": "Château Brumepierre", "es": "Castillo Piedraniebla", "de": "Schloss Steinnebel"},
	"10": {"id": "10", "en": "Rogue's Quarry", "fr": "Carrière des voleurs", "es": "Cantera del Pícaro", "de": "Schurkenbruch"},
	"11": {"id": "11", "en": "Aldon's Ledge", "fr": "Corniche d'Aldon", "es": "Cornisa de Aldon", "de": "Aldons Vorsprung"},
	"12": {"id": "12", "en": "Wildcreek Run", "fr": "Piste du Ruisseau sauvage", "es": "Pista Arroyosalvaje", "de": "Wildbachstrecke"},
	"13": {"id": "13", "en": "Jerrifer's Slough", "fr": "Bourbier de Jerrifer", "es": "Cenagal de Jerrifer", "de": "Jerrifers Sumpfloch"},
	"14": {"id": "14", "en": "Klovan Gully", "fr": "Petit ravin de Klovan", "es": "Barranco Klovan", "de": "Klovan-Senke"},
	"15": {"id": "15", "en": "Langor Gulch", "fr": "Ravin de Langor", "es": "Barranco Langor", "de": "Langor - Schlucht"},
	"16": {"id": "16", "en": "Quentin Lake", "fr": "Lac Quentin", "es": "Lago Quentin", "de": "Quentinsee"},
	"17": {"id": "17", "en": "Mendon's Gap", "fr": "Faille de Mendon", "es": "Zanja de Mendon", "de": "Mendons Spalt"},
	"18": {"id": "18", "en": "Anzalias Pass", "fr": "Col d'Anzalias", "es": "Paso Anzalias", "de": "Anzalias-Pass"},
	"19": {"id": "19", "en": "Ogrewatch Cut", "fr": "Percée de Gardogre", "es": "Tajo de la Guardia del Ogro", "de": "Ogerwacht-Kanal"},
	"20": {"id": "20", "en": "Veloka Slope", "fr": "Flanc de Veloka", "es": "Pendiente Veloka", "de": "Veloka-Hang"},
	"21": {"id": "21", "en": "Durios Gulch", "fr": "Ravin de Durios", "es": "Barranco Durios", "de": "Durios-Schlucht"},
	"22": {"id": "22", "en": "Bravost Escarpment", "fr": "Falaise de Bravost", "es": "Escarpadura Bravost", "de": "Bravost-Abhang"},
	"23": {"id": "23", "en": "Garrison", "fr": "Garnison", "es": "Fuerte", "de": "Festung"},
	"24": {"id": "24", "en": "Champion's Demense", "fr": "Fief du champion", "es": "Dominio del Campeón", "de": "Landgut des Champions"},
	"25": {"id": "25", "en": "Redbriar", "fr": "Bruyerouge", "es": "Zarzarroja", "de": "Rotdornstrauch"},
	"26": {"id": "26", "en": "Greenlake", "fr": "Lac Vert", "es": "Lagoverde", "de": "Grünsee"},
	"27": {"id": "27", "en": "Ascension Bay", "fr": "Baie de l'Ascension", "es": "Bahía de la Ascensión", "de": "Bucht des Aufstiegs"},
	"28": {"id": "28", "en": "Dawn's Eyrie", "fr": "Promontoire de l'aube", "es": "Aguilera del Alba", "de": "Horst der Morgendammerung"},
	"29": {"id": "29", "en": "The Spiritholme", "fr": "L'antre des esprits", "es": "La Isleta Espiritual", "de": "Der Geisterholm"},
	"30": {"id": "30", "en": "Woodhaven", "fr": "Gentesylve", "es": "Refugio Forestal", "de": "Wald - Freistatt"},
	"31": {"id": "31", "en": "Askalion Hills", "fr": "Collines d'Askalion", "es": "Colinas Askalion", "de": "Askalion - Hügel"},
	"32": {"id": "32", "en": "Etheron Hills", "fr": "Collines d'Etheron", "es": "Colinas Etheron", "de": "Etheron - Hügel"},
	"33": {"id": "33", "en": "Dreaming Bay", "fr": "Baie des rêves", "es": "Bahía Onírica", "de": "Traumbucht"},
	"34": {"id": "34", "en": "Victor's Lodge", "fr": "Pavillon du vainqueur", "es": "Albergue del Vencedor", "de": "Sieger - Hütte"},
	"35": {"id": "35", "en": "Greenbriar", "fr": "Vertebranche", "es": "Zarzaverde", "de": "Grünstrauch"},
	"36": {"id": "36", "en": "Bluelake", "fr": "Lac bleu", "es": "Lagoazul", "de": "Blausee"},
	"37": {"id": "37", "en": "Garrison", "fr": "Garnison", "es": "Fuerte", "de": "Festung"},
	"38": {"id": "38", "en": "Longview", "fr": "Longuevue", "es": "Vistaluenga", "de": "Weitsicht"},
	"39": {"id": "39", "en": "The Godsword", "fr": "L'Epée divine", "es": "La Hoja Divina", "de": "Das Gottschwert"},
	"40": {"id": "40", "en": "Cliffside", "fr": "Flanc de falaise", "es": "Despeñadero", "de": "Felswand"},
	"41": {"id": "41", "en": "Shadaran Hills", "fr": "Collines de Shadaran", "es": "Colinas Shadaran", "de": "Shadaran Hügel"},
	"42": {"id": "42", "en": "Redlake", "fr": "Rougelac", "es": "Lagorrojo", "de": "Rotsee"},
	"43": {"id": "43", "en": "Hero's Lodge", "fr": "Pavillon du Héros", "es": "Albergue del Héroe", "de": "Hütte des Helden"},
	"44": {"id": "44", "en": "Dreadfall Bay", "fr": "Baie du Noir déclin", "es": "Bahía Salto Aciago", "de": "Schreckensfall - Bucht"},
	"45": {"id": "45", "en": "Bluebriar", "fr": "Bruyazur", "es": "Zarzazul", "de": "Blaudornstrauch"},
	"46": {"id": "46", "en": "Garrison", "fr": "Garnison", "es": "Fuerte", "de": "Festung"},
	"47": {"id": "47", "en": "Sunnyhill", "fr": "Colline ensoleillée", "es": "Colina Soleada", "de": "Sonnenlichthügel"},
	"48": {"id": "48", "en": "Faithleap", "fr": "Ferveur", "es": "Salto de Fe", "de": "Glaubenssprung"},
	"49": {"id": "49", "en": "Bluevale Refuge", "fr": "Refuge de bleuval", "es": "Refugio Valleazul", "de": "Blautal - Zuflucht"},
	"50": {"id": "50", "en": "Bluewater Lowlands", "fr": "Basses terres d'Eau-Azur", "es": "Tierras Bajas de Aguazul", "de": "Blauwasser - Tiefland"},
	"51": {"id": "51", "en": "Astralholme", "fr": "Astralholme", "es": "Isleta Astral", "de": "Astralholm"},
	"52": {"id": "52", "en": "Arah's Hope", "fr": "Espoir d'Arah", "es": "Esperanza de Arah", "de": "Arahs Hoffnung"},
	"53": {"id": "53", "en": "Greenvale Refuge", "fr": "Refuge de Valvert", "es": "Refugio de Valleverde", "de": "Grüntal - Zuflucht"},
	"54": {"id": "54", "en": "Foghaven", "fr": "Havre gris", "es": "Refugio Neblinoso", "de": "Nebel - Freistatt"},
	"55": {"id": "55", "en": "Redwater Lowlands", "fr": "Basses terres de Rubicon", "es": "Tierras Bajas de Aguarroja", "de": "Rotwasser - Tiefland"},
	"56": {"id": "56", "en": "The Titanpaw", "fr": "Bras du titan", "es": "La Garra del Titán", "de": "Die Titanenpranke"},
	"57": {"id": "57", "en": "Cragtop", "fr": "Sommet de l'escarpement", "es": "Cumbrepeñasco", "de": "Felsenspitze"},
	"58": {"id": "58", "en": "Godslore", "fr": "Divination", "es": "Sabiduría de los Dioses", "de": "Götterkunde"},
	"59": {"id": "59", "en": "Redvale Refuge", "fr": "Refuge de Valrouge", "es": "Refugio Vallerojo", "de": "Rottal - Zuflucht"},
	"60": {"id": "60", "en": "Stargrove", "fr": "Bosquet stellaire", "es": "Arboleda de las Estrellas", "de": "Sternenhain"},
	"61": {"id": "61", "en": "Greenwater Lowlands", "fr": "Basses terres d'Eau-Verdoyante", "es": "Tierras Bajas de Aguaverde", "de": "Grünwasser - Tiefland"},
	"62": {"id": "62", "en": "Temple of Lost Prayers", "fr": "Temple des prières perdues", "es": "Templo de las Pelgarias", "de": "Tempel der Verlorenen Gebete"},
	"63": {"id": "63", "en": "Battle's Hollow", "fr": "Vallon de bataille", "es": "Hondonada de la Battalla", "de": "Schlachten-Senke"},
	"64": {"id": "64", "en": "Bauer's Estate", "fr": "Domaine de Bauer", "es": "Hacienda de Bauer", "de": "Bauers Anwesen"},
	"65": {"id": "65", "en": "Orchard Overlook", "fr": "Belvédère du Verger", "es": "Mirador del Huerto", "de": "Obstgarten Aussichtspunkt"},
	"66": {"id": "66", "en": "Carver's Ascent", "fr": "Côte du couteau", "es": "Ascenso del Trinchador", "de": "Aufstieg des Schnitzers"},
	"67": {"id": "67", "en": "Carver's Ascent", "fr": "Côte du couteau", "es": "Ascenso del Trinchador", "de": "Aufstieg des Schnitzers"},
	"68": {"id": "68", "en": "Orchard Overlook", "fr": "Belvédère du Verger", "es": "Mirador del Huerto", "de": "Obstgarten Aussichtspunkt"},
	"69": {"id": "69", "en": "Bauer's Estate", "fr": "Domaine de Bauer", "es": "Hacienda de Bauer", "de": "Bauers Anwesen"},
	"70": {"id": "70", "en": "Battle's Hollow", "fr": "Vallon de bataille", "es": "Hondonada de la Battalla", "de": "Schlachten-Senke"},
	"71": {"id": "71", "en": "Temple of Lost Prayers", "fr": "Temple des prières perdues", "es": "Templo de las Pelgarias", "de": "Tempel der Verlorenen Gebete"},
	"72": {"id": "72", "en": "Carver's Ascent", "fr": "Côte du couteau", "es": "Ascenso del Trinchador", "de": "Aufstieg des Schnitzers"},
	"73": {"id": "73", "en": "Orchard Overlook", "fr": "Belvédère du Verger", "es": "Mirador del Huerto", "de": "Obstgarten Aussichtspunkt"},
	"74": {"id": "74", "en": "Bauer's Estate", "fr": "Domaine de Bauer", "es": "Hacienda de Bauer", "de": "Bauers Anwesen"},
	"75": {"id": "75", "en": "Battle's Hollow", "fr": "Vallon de bataille", "es": "Hondonada de la Battalla", "de": "Schlachten-Senke"},
	"76": {"id": "76", "en": "Temple of Lost Prayers", "fr": "Temple des prières perdues", "es": "Templo de las Pelgarias", "de": "Tempel der Verlorenen Gebete"},
};

},{}],10:[function(require,module,exports){
module.exports = [
	{
		"key": "Center",
		"name": "Eternal Battlegrounds",
		"abbr": "EBG",
		"mapIndex": 3,
		"color": "neutral",
		"sections": [{
				"label": "Castle",
				"groupType": "neutral",
				"objectives": [9], 								// sm
			}, {
				"label": "Red Corner",
				"groupType": "red",
				"objectives": [1, 17, 20, 18, 19, 6, 5],		// overlook, mendons, veloka, anz, ogre, speldan, pang
			}, {
				"label": "Blue Corner",
				"groupType": "blue",
				"objectives": [2, 15, 22, 16, 21, 7, 8]			// valley, langor, bravost, quentin, durios, dane, umber
			}, {
				"label": "Green Corner",
				"groupType": "green",
				"objectives": [3, 11, 13, 12, 14, 10, 4] 		// lowlands, aldons, jerrifer, wildcreek, klovan, rogues, golanta
			},],
	}, {
		"key": "RedHome",
		"name": "RedHome",
		"abbr": "Red",
		"mapIndex": 0,
		"color": "red",
		"sections": [{
				"label": "Keeps",
				"groupType": "red",
				"objectives": [37, 33, 32] 						// keep, bay, hills, longview, cliffside, godsword, hopes, astral
			}, {
				"label": "North",
				"groupType": "red",
				"objectives": [38, 40, 39, 52, 51] 				// keep, bay, hills, longview, cliffside, godsword, hopes, astral
			}, {
				"label": "South",
				"groupType": "neutral",
				"objectives": [35, 36, 34, 53, 50] 				// briar, lake, lodge, vale, water
			// }, {
			// 	"label": "Ruins",
			// 	"groupType": "ruins",
			// 	"objectives": [62, 63, 64, 65, 66] 				// temple, hollow, estate, orchard, ascent
			},],
	}, {
		"key": "BlueHome",
		"name": "BlueHome",
		"abbr": "Blu",
		"mapIndex": 2,
		"color": "blue",
		"sections": [{
				"label": "Keeps",
				"groupType": "blue",
				"objectives": [23, 27, 31] 						// keep, bay, hills, woodhaven, dawns, spirit, gods, star
			}, {
				"label": "North",
				"groupType": "blue",
				"objectives": [30, 28, 29, 58, 60] 				// keep, bay, hills, woodhaven, dawns, spirit, gods, star
			}, {
				"label": "South",
				"groupType": "neutral",
				"objectives": [25, 26, 24, 59, 61] 				// briar, lake, champ, vale, water
			// }, {
			// 	"label": "Ruins",
			// 	"groupType": "ruins",
			// 	"objectives": [71, 70, 69, 68, 67] 				// temple, hollow, estate, orchard, ascent
			},],
	}, {
		"key": "GreenHome",
		"name": "GreenHome",
		"abbr": "Grn",
		"mapIndex": 1,
		"color": "green",
		"sections": [{
				"label": "Keeps",
				"groupType": "green",
				"objectives": [46, 44, 41] 						// keep, bay, hills, sunny, crag, titan, faith, fog
			}, {
				"label": "North",
				"groupType": "green",
				"objectives": [47, 57, 56, 48, 54] 				// keep, bay, hills, sunny, crag, titan, faith, fog
			}, {
				"label": "South",
				"groupType": "neutral",
				"objectives": [45, 42, 43, 49, 55] 				// briar, lake, lodge, vale, water
			// }, {
			// 	"label": "Ruins",
			// 	"groupType": "ruins",
			// 	"objectives": [76 , 75 , 74 , 73 , 72 ] 		// temple, hollow, estate, orchard, ascent
			},]
	},
];

},{}],11:[function(require,module,exports){
module.exports = {
	//	EBG
	"9":	{"type": 1, "timer": 1, "map": 3, "d": 0, "n": 0, "s": 0, "w": 0, "e": 0},	// Stonemist Castle

	//	Red Corner
	"1":	{"type": 2, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Red Keep - Overlook
	"17":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// Red Tower - Mendon's Gap
	"20":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// Red Tower - Veloka Slope
	"18":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// Red Tower - Anzalias Pass
	"19":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Red Tower - Ogrewatch Cut
	"6":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Red Camp - Mill - Speldan
	"5":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Red Camp - Mine - Pangloss

	//	Blue Corner
	"2":	{"type": 2, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Blue Keep - Valley
	"15":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// Blue Tower - Langor Gulch
	"22":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Blue Tower - Bravost Escarpment
	"16":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// Blue Tower - Quentin Lake
	"21":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// Blue Tower - Durios Gulch
	"7":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// Blue Camp - Mine - Danelon
	"8":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Blue Camp - Mill - Umberglade

	//	Green Corner
	"3":	{"type": 2, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Green Keep - Lowlands
	"11":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// Green Tower - Aldons
	"13":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Green Tower - Jerrifer's Slough
	"12":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// Green Tower - Wildcreek
	"14":	{"type": 3, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// Green Tower - Klovan Gully
	"10":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Green Camp - Mine - Rogues Quarry
	"4":	{"type": 4, "timer": 1, "map": 3, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Green Camp - Mill - Golanta


	//	RedHome
	"37":	{"type": 2, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Garrison
	"33":	{"type": 2, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Bay - Dreaming Bay
	"32":	{"type": 2, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Hills - Etheron Hills
	"38":	{"type": 3, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Tower - Longview
	"40":	{"type": 3, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Tower - Cliffside
	"39":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// North Camp - Crossroads - The Godsword
	"52":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Camp - Mine - Arah's Hope
	"51":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Camp - Mill - Astralholme

	"35":	{"type": 3, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Tower - Greenbriar
	"36":	{"type": 3, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Tower - Bluelake
	"34":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// South Camp - Orchard - Victor's Lodge
	"53":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Camp - Workshop - Greenvale Refuge
	"50":	{"type": 4, "timer": 1, "map": 0, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Camp - Fishing Village - Bluewater Lowlands


	//	GreenHome
	"46":	{"type": 2, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Garrison
	"44":	{"type": 2, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Bay - Dreadfall Bay
	"41":	{"type": 2, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Hills - Shadaran Hills
	"47":	{"type": 3, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Tower - Sunnyhill
	"57":	{"type": 3, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Tower - Cragtop
	"56":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// North Camp - Crossroads - The Titanpaw
	"48":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Camp - Mine - Faithleap
	"54":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Camp - Mill - Foghaven

	"45":	{"type": 3, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Tower - Bluebriar
	"42":	{"type": 3, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Tower - Redlake
	"43":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// South Camp - Orchard - Hero's Lodge
	"49":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Camp - Workshop - Bluevale Refuge
	"55":	{"type": 4, "timer": 1, "map": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Camp - Fishing Village - Redwater Lowlands


	//	BlueHome
	"23":	{"type": 2, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Garrison
	"27":	{"type": 2, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Bay - Ascension Bay
	"31":	{"type": 2, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Hills - Askalion Hills
	"30":	{"type": 3, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Tower - Woodhaven
	"28":	{"type": 3, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Tower - Dawn's Eyrie
	"29":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// North Camp - Crossroads - The Spiritholme
	"58":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Camp - Mine - Godslore
	"60":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Camp - Mill - Stargrove

	"25":	{"type": 3, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Tower - Redbriar
	"26":	{"type": 3, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Tower - Greenlake
	"24":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// South Camp - Orchard - Champion's Demense
	"59":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Camp - Workshop - Redvale Refuge
	"61":	{"type": 4, "timer": 1, "map": 2, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Camp - Fishing Village - Greenwater Lowlands
};

},{}],12:[function(require,module,exports){
module.exports = {
	"1": {"id": 1, "name": "Keep"},
	"2": {"id": 2, "name": "Keep"},
	"3": {"id": 3, "name": "Keep"},
	"4": {"id": 4, "name": "Green Mill"},
	"5": {"id": 5, "name": "Red Mine"},
	"6": {"id": 6, "name": "Red Mill"},
	"7": {"id": 7, "name": "Blue Mine"},
	"8": {"id": 8, "name": "Blue Mill"},
	"9": {"id": 9, "name": "Castle"},
	"10": {"id": 10, "name": "Green Mine"},
	"11": {"id": 11, "name": "Tower"},
	"12": {"id": 12, "name": "Tower"},
	"13": {"id": 13, "name": "Tower"},
	"14": {"id": 14, "name": "Tower"},
	"15": {"id": 15, "name": "Tower"},
	"16": {"id": 16, "name": "Tower"},
	"17": {"id": 17, "name": "Tower"},
	"18": {"id": 18, "name": "Tower"},
	"19": {"id": 19, "name": "Tower"},
	"20": {"id": 20, "name": "Tower"},
	"21": {"id": 21, "name": "Tower"},
	"22": {"id": 22, "name": "Tower"},
	"23": {"id": 23, "name": "Keep"},
	"25": {"id": 25, "name": "Tower"},
	"24": {"id": 24, "name": "Orchard"},
	"26": {"id": 26, "name": "Tower"},
	"27": {"id": 27, "name": "Keep"},
	"28": {"id": 28, "name": "Tower"},
	"29": {"id": 29, "name": "Crossroads"},
	"30": {"id": 30, "name": "Tower"},
	"31": {"id": 31, "name": "Keep"},
	"32": {"id": 32, "name": "Keep"},
	"33": {"id": 33, "name": "Keep"},
	"34": {"id": 34, "name": "Orchard"},
	"35": {"id": 35, "name": "Tower"},
	"36": {"id": 36, "name": "Tower"},
	"37": {"id": 37, "name": "Keep"},
	"38": {"id": 38, "name": "Tower"},
	"39": {"id": 39, "name": "Crossroads"},
	"40": {"id": 40, "name": "Tower"},
	"41": {"id": 41, "name": "Keep"},
	"42": {"id": 42, "name": "Tower"},
	"43": {"id": 43, "name": "Orchard"},
	"44": {"id": 44, "name": "Keep"},
	"45": {"id": 45, "name": "Tower"},
	"46": {"id": 46, "name": "Keep"},
	"47": {"id": 47, "name": "Tower"},
	"48": {"id": 48, "name": "Quarry"},
	"49": {"id": 49, "name": "Workshop"},
	"50": {"id": 50, "name": "Fishing Village"},
	"51": {"id": 51, "name": "Lumber Mill"},
	"52": {"id": 52, "name": "Quarry"},
	"53": {"id": 53, "name": "Workshop"},
	"54": {"id": 54, "name": "Lumber Mill"},
	"55": {"id": 55, "name": "Fishing Village"},
	"56": {"id": 56, "name": "Crossroads"},
	"57": {"id": 57, "name": "Tower"},
	"58": {"id": 58, "name": "Quarry"},
	"59": {"id": 59, "name": "Workshop"},
	"60": {"id": 60, "name": "Lumber Mill"},
	"61": {"id": 61, "name": "Fishing Village"},
	"62": {"id": 62, "name": "((Temple of Lost Prayers))"},
	"63": {"id": 63, "name": "((Battle's Hollow))"},
	"64": {"id": 64, "name": "((Bauer's Estate))"},
	"65": {"id": 65, "name": "((Orchard Overlook))"},
	"66": {"id": 66, "name": "((Carver's Ascent))"},
	"67": {"id": 67, "name": "((Carver's Ascent))"},
	"68": {"id": 68, "name": "((Orchard Overlook))"},
	"69": {"id": 69, "name": "((Bauer's Estate))"},
	"70": {"id": 70, "name": "((Battle's Hollow))"},
	"71": {"id": 71, "name": "((Temple of Lost Prayers))"},
	"72": {"id": 72, "name": "((Carver's Ascent))"},
	"73": {"id": 73, "name": "((Orchard Overlook))"},
	"74": {"id": 74, "name": "((Bauer's Estate))"},
	"75": {"id": 75, "name": "((Battle's Hollow))"},
	"76": {"id": 76, "name": "((Temple of Lost Prayers))"}
};

},{}],13:[function(require,module,exports){
module.exports = {
	"1": {"id": 1, "timer": 1, "value": 35, "name": "castle"},
	"2": {"id": 2, "timer": 1, "value": 25, "name": "keep"},
	"3": {"id": 3, "timer": 1, "value": 10, "name": "tower"},
	"4": {"id": 4, "timer": 1, "value": 5, "name": "camp"},
	"5": {"id": 5, "timer": 0, "value": 0, "name": "temple"},
	"6": {"id": 6, "timer": 0, "value": 0, "name": "hollow"},
	"7": {"id": 7, "timer": 0, "value": 0, "name": "estate"},
	"8": {"id": 8, "timer": 0, "value": 0, "name": "overlook"},
	"9": {"id": 9, "timer": 0, "value": 0, "name": "ascent"}
};

},{}],14:[function(require,module,exports){
module.exports = {
	"1001": {
		"id": "1001",
		"region": "1",
		"de": {
			"name": "Ambossfels",
			"slug": "ambossfels"
		},
		"en": {
			"name": "Anvil Rock",
			"slug": "anvil-rock"
		},
		"es": {
			"name": "Roca del Yunque",
			"slug": "roca-del-yunque"
		},
		"fr": {
			"name": "Rocher de l'enclume",
			"slug": "rocher-de-lenclume"
		}
	},
	"1002": {
		"id": "1002",
		"region": "1",
		"de": {
			"name": "Borlis-Pass",
			"slug": "borlis-pass"
		},
		"en": {
			"name": "Borlis Pass",
			"slug": "borlis-pass"
		},
		"es": {
			"name": "Paso de Borlis",
			"slug": "paso-de-borlis"
		},
		"fr": {
			"name": "Passage de Borlis",
			"slug": "passage-de-borlis"
		}
	},
	"1003": {
		"id": "1003",
		"region": "1",
		"de": {
			"name": "Jakbiegung",
			"slug": "jakbiegung"
		},
		"en": {
			"name": "Yak's Bend",
			"slug": "yaks-bend"
		},
		"es": {
			"name": "Declive del Yak",
			"slug": "declive-del-yak"
		},
		"fr": {
			"name": "Courbe du Yak",
			"slug": "courbe-du-yak"
		}
	},
	"1004": {
		"id": "1004",
		"region": "1",
		"de": {
			"name": "Denravis Erdwerk",
			"slug": "denravis-erdwerk"
		},
		"en": {
			"name": "Henge of Denravi",
			"slug": "henge-of-denravi"
		},
		"es": {
			"name": "Círculo de Denravi",
			"slug": "circulo-de-denravi"
		},
		"fr": {
			"name": "Cromlech de Denravi",
			"slug": "cromlech-de-denravi"
		}
	},
	"1005": {
		"id": "1005",
		"region": "1",
		"de": {
			"name": "Maguuma",
			"slug": "maguuma"
		},
		"en": {
			"name": "Maguuma",
			"slug": "maguuma"
		},
		"es": {
			"name": "Maguuma",
			"slug": "maguuma"
		},
		"fr": {
			"name": "Maguuma",
			"slug": "maguuma"
		}
	},
	"1006": {
		"id": "1006",
		"region": "1",
		"de": {
			"name": "Hochofen der Betrübnis",
			"slug": "hochofen-der-betrubnis"
		},
		"en": {
			"name": "Sorrow's Furnace",
			"slug": "sorrows-furnace"
		},
		"es": {
			"name": "Fragua del Pesar",
			"slug": "fragua-del-pesar"
		},
		"fr": {
			"name": "Fournaise des lamentations",
			"slug": "fournaise-des-lamentations"
		}
	},
	"1007": {
		"id": "1007",
		"region": "1",
		"de": {
			"name": "Tor des Irrsinns",
			"slug": "tor-des-irrsinns"
		},
		"en": {
			"name": "Gate of Madness",
			"slug": "gate-of-madness"
		},
		"es": {
			"name": "Puerta de la Locura",
			"slug": "puerta-de-la-locura"
		},
		"fr": {
			"name": "Porte de la folie",
			"slug": "porte-de-la-folie"
		}
	},
	"1008": {
		"id": "1008",
		"region": "1",
		"de": {
			"name": "Jade-Steinbruch",
			"slug": "jade-steinbruch"
		},
		"en": {
			"name": "Jade Quarry",
			"slug": "jade-quarry"
		},
		"es": {
			"name": "Cantera de Jade",
			"slug": "cantera-de-jade"
		},
		"fr": {
			"name": "Carrière de jade",
			"slug": "carriere-de-jade"
		}
	},
	"1009": {
		"id": "1009",
		"region": "1",
		"de": {
			"name": "Fort Espenwald",
			"slug": "fort-espenwald"
		},
		"en": {
			"name": "Fort Aspenwood",
			"slug": "fort-aspenwood"
		},
		"es": {
			"name": "Fuerte Aspenwood",
			"slug": "fuerte-aspenwood"
		},
		"fr": {
			"name": "Fort Trembleforêt",
			"slug": "fort-trembleforet"
		}
	},
	"1010": {
		"id": "1010",
		"region": "1",
		"de": {
			"name": "Ehmry-Bucht",
			"slug": "ehmry-bucht"
		},
		"en": {
			"name": "Ehmry Bay",
			"slug": "ehmry-bay"
		},
		"es": {
			"name": "Bahía de Ehmry",
			"slug": "bahia-de-ehmry"
		},
		"fr": {
			"name": "Baie d'Ehmry",
			"slug": "baie-dehmry"
		}
	},
	"1011": {
		"id": "1011",
		"region": "1",
		"de": {
			"name": "Sturmklippen-Insel",
			"slug": "sturmklippen-insel"
		},
		"en": {
			"name": "Stormbluff Isle",
			"slug": "stormbluff-isle"
		},
		"es": {
			"name": "Isla Cimatormenta",
			"slug": "isla-cimatormenta"
		},
		"fr": {
			"name": "Ile de la Falaise tumultueuse",
			"slug": "ile-de-la-falaise-tumultueuse"
		}
	},
	"1012": {
		"id": "1012",
		"region": "1",
		"de": {
			"name": "Finsterfreistatt",
			"slug": "finsterfreistatt"
		},
		"en": {
			"name": "Darkhaven",
			"slug": "darkhaven"
		},
		"es": {
			"name": "Refugio Oscuro",
			"slug": "refugio-oscuro"
		},
		"fr": {
			"name": "Refuge noir",
			"slug": "refuge-noir"
		}
	},
	"1013": {
		"id": "1013",
		"region": "1",
		"de": {
			"name": "Heilige Halle von Rall",
			"slug": "heilige-halle-von-rall"
		},
		"en": {
			"name": "Sanctum of Rall",
			"slug": "sanctum-of-rall"
		},
		"es": {
			"name": "Sagrario de Rall",
			"slug": "sagrario-de-rall"
		},
		"fr": {
			"name": "Sanctuaire de Rall",
			"slug": "sanctuaire-de-rall"
		}
	},
	"1014": {
		"id": "1014",
		"region": "1",
		"de": {
			"name": "Kristallwüste",
			"slug": "kristallwuste"
		},
		"en": {
			"name": "Crystal Desert",
			"slug": "crystal-desert"
		},
		"es": {
			"name": "Desierto de Cristal",
			"slug": "desierto-de-cristal"
		},
		"fr": {
			"name": "Désert de cristal",
			"slug": "desert-de-cristal"
		}
	},
	"1015": {
		"id": "1015",
		"region": "1",
		"de": {
			"name": "Janthir-Insel",
			"slug": "janthir-insel"
		},
		"en": {
			"name": "Isle of Janthir",
			"slug": "isle-of-janthir"
		},
		"es": {
			"name": "Isla de Janthir",
			"slug": "isla-de-janthir"
		},
		"fr": {
			"name": "Ile de Janthir",
			"slug": "ile-de-janthir"
		}
	},
	"1016": {
		"id": "1016",
		"region": "1",
		"de": {
			"name": "Meer des Leids",
			"slug": "meer-des-leids"
		},
		"en": {
			"name": "Sea of Sorrows",
			"slug": "sea-of-sorrows"
		},
		"es": {
			"name": "El Mar de los Pesares",
			"slug": "el-mar-de-los-pesares"
		},
		"fr": {
			"name": "Mer des lamentations",
			"slug": "mer-des-lamentations"
		}
	},
	"1017": {
		"id": "1017",
		"region": "1",
		"de": {
			"name": "Befleckte Küste",
			"slug": "befleckte-kuste"
		},
		"en": {
			"name": "Tarnished Coast",
			"slug": "tarnished-coast"
		},
		"es": {
			"name": "Costa de Bronce",
			"slug": "costa-de-bronce"
		},
		"fr": {
			"name": "Côte ternie",
			"slug": "cote-ternie"
		}
	},
	"1018": {
		"id": "1018",
		"region": "1",
		"de": {
			"name": "Nördliche Zittergipfel",
			"slug": "nordliche-zittergipfel"
		},
		"en": {
			"name": "Northern Shiverpeaks",
			"slug": "northern-shiverpeaks"
		},
		"es": {
			"name": "Picosescalofriantes del Norte",
			"slug": "picosescalofriantes-del-norte"
		},
		"fr": {
			"name": "Cimefroides nordiques",
			"slug": "cimefroides-nordiques"
		}
	},
	"1019": {
		"id": "1019",
		"region": "1",
		"de": {
			"name": "Schwarztor",
			"slug": "schwarztor"
		},
		"en": {
			"name": "Blackgate",
			"slug": "blackgate"
		},
		"es": {
			"name": "Puertanegra",
			"slug": "puertanegra"
		},
		"fr": {
			"name": "Portenoire",
			"slug": "portenoire"
		}
	},
	"1020": {
		"id": "1020",
		"region": "1",
		"de": {
			"name": "Fergusons Kreuzung",
			"slug": "fergusons-kreuzung"
		},
		"en": {
			"name": "Ferguson's Crossing",
			"slug": "fergusons-crossing"
		},
		"es": {
			"name": "Encrucijada de Ferguson",
			"slug": "encrucijada-de-ferguson"
		},
		"fr": {
			"name": "Croisée de Ferguson",
			"slug": "croisee-de-ferguson"
		}
	},
	"1021": {
		"id": "1021",
		"region": "1",
		"de": {
			"name": "Drachenbrand",
			"slug": "drachenbrand"
		},
		"en": {
			"name": "Dragonbrand",
			"slug": "dragonbrand"
		},
		"es": {
			"name": "Marca del Dragón",
			"slug": "marca-del-dragon"
		},
		"fr": {
			"name": "Stigmate du dragon",
			"slug": "stigmate-du-dragon"
		}
	},
	"1022": {
		"id": "1022",
		"region": "1",
		"de": {
			"name": "Kaineng",
			"slug": "kaineng"
		},
		"en": {
			"name": "Kaineng",
			"slug": "kaineng"
		},
		"es": {
			"name": "Kaineng",
			"slug": "kaineng"
		},
		"fr": {
			"name": "Kaineng",
			"slug": "kaineng"
		}
	},
	"1023": {
		"id": "1023",
		"region": "1",
		"de": {
			"name": "Devonas Rast",
			"slug": "devonas-rast"
		},
		"en": {
			"name": "Devona's Rest",
			"slug": "devonas-rest"
		},
		"es": {
			"name": "Descanso de Devona",
			"slug": "descanso-de-devona"
		},
		"fr": {
			"name": "Repos de Devona",
			"slug": "repos-de-devona"
		}
	},
	"1024": {
		"id": "1024",
		"region": "1",
		"de": {
			"name": "Eredon-Terrasse",
			"slug": "eredon-terrasse"
		},
		"en": {
			"name": "Eredon Terrace",
			"slug": "eredon-terrace"
		},
		"es": {
			"name": "Terraza de Eredon",
			"slug": "terraza-de-eredon"
		},
		"fr": {
			"name": "Plateau d'Eredon",
			"slug": "plateau-deredon"
		}
	},
	"2001": {
		"id": "2001",
		"region": "2",
		"de": {
			"name": "Klagenriss",
			"slug": "klagenriss"
		},
		"en": {
			"name": "Fissure of Woe",
			"slug": "fissure-of-woe"
		},
		"es": {
			"name": "Fisura de la Aflicción",
			"slug": "fisura-de-la-afliccion"
		},
		"fr": {
			"name": "Fissure du malheur",
			"slug": "fissure-du-malheur"
		}
	},
	"2002": {
		"id": "2002",
		"region": "2",
		"de": {
			"name": "Ödnis",
			"slug": "odnis"
		},
		"en": {
			"name": "Desolation",
			"slug": "desolation"
		},
		"es": {
			"name": "Desolación",
			"slug": "desolacion"
		},
		"fr": {
			"name": "Désolation",
			"slug": "desolation"
		}
	},
	"2003": {
		"id": "2003",
		"region": "2",
		"de": {
			"name": "Gandara",
			"slug": "gandara"
		},
		"en": {
			"name": "Gandara",
			"slug": "gandara"
		},
		"es": {
			"name": "Gandara",
			"slug": "gandara"
		},
		"fr": {
			"name": "Gandara",
			"slug": "gandara"
		}
	},
	"2004": {
		"id": "2004",
		"region": "2",
		"de": {
			"name": "Schwarzflut",
			"slug": "schwarzflut"
		},
		"en": {
			"name": "Blacktide",
			"slug": "blacktide"
		},
		"es": {
			"name": "Marea Negra",
			"slug": "marea-negra"
		},
		"fr": {
			"name": "Noirflot",
			"slug": "noirflot"
		}
	},
	"2005": {
		"id": "2005",
		"region": "2",
		"de": {
			"name": "Feuerring",
			"slug": "feuerring"
		},
		"en": {
			"name": "Ring of Fire",
			"slug": "ring-of-fire"
		},
		"es": {
			"name": "Anillo de Fuego",
			"slug": "anillo-de-fuego"
		},
		"fr": {
			"name": "Cercle de feu",
			"slug": "cercle-de-feu"
		}
	},
	"2006": {
		"id": "2006",
		"region": "2",
		"de": {
			"name": "Unterwelt",
			"slug": "unterwelt"
		},
		"en": {
			"name": "Underworld",
			"slug": "underworld"
		},
		"es": {
			"name": "Inframundo",
			"slug": "inframundo"
		},
		"fr": {
			"name": "Outre-monde",
			"slug": "outre-monde"
		}
	},
	"2007": {
		"id": "2007",
		"region": "2",
		"de": {
			"name": "Ferne Zittergipfel",
			"slug": "ferne-zittergipfel"
		},
		"en": {
			"name": "Far Shiverpeaks",
			"slug": "far-shiverpeaks"
		},
		"es": {
			"name": "Lejanas Picosescalofriantes",
			"slug": "lejanas-picosescalofriantes"
		},
		"fr": {
			"name": "Lointaines Cimefroides",
			"slug": "lointaines-cimefroides"
		}
	},
	"2008": {
		"id": "2008",
		"region": "2",
		"de": {
			"name": "Weißflankgrat",
			"slug": "weissflankgrat"
		},
		"en": {
			"name": "Whiteside Ridge",
			"slug": "whiteside-ridge"
		},
		"es": {
			"name": "Cadena Laderablanca",
			"slug": "cadena-laderablanca"
		},
		"fr": {
			"name": "Crête de Verseblanc",
			"slug": "crete-de-verseblanc"
		}
	},
	"2009": {
		"id": "2009",
		"region": "2",
		"de": {
			"name": "Ruinen von Surmia",
			"slug": "ruinen-von-surmia"
		},
		"en": {
			"name": "Ruins of Surmia",
			"slug": "ruins-of-surmia"
		},
		"es": {
			"name": "Ruinas de Surmia",
			"slug": "ruinas-de-surmia"
		},
		"fr": {
			"name": "Ruines de Surmia",
			"slug": "ruines-de-surmia"
		}
	},
	"2010": {
		"id": "2010",
		"region": "2",
		"de": {
			"name": "Seemannsrast",
			"slug": "seemannsrast"
		},
		"en": {
			"name": "Seafarer's Rest",
			"slug": "seafarers-rest"
		},
		"es": {
			"name": "Refugio del Viajante",
			"slug": "refugio-del-viajante"
		},
		"fr": {
			"name": "Repos du Marin",
			"slug": "repos-du-marin"
		}
	},
	"2011": {
		"id": "2011",
		"region": "2",
		"de": {
			"name": "Vabbi",
			"slug": "vabbi"
		},
		"en": {
			"name": "Vabbi",
			"slug": "vabbi"
		},
		"es": {
			"name": "Vabbi",
			"slug": "vabbi"
		},
		"fr": {
			"name": "Vabbi",
			"slug": "vabbi"
		}
	},
	"2012": {
		"id": "2012",
		"region": "2",
		"de": {
			"name": "Piken-Platz",
			"slug": "piken-platz"
		},
		"en": {
			"name": "Piken Square",
			"slug": "piken-square"
		},
		"es": {
			"name": "Plaza de Piken",
			"slug": "plaza-de-piken"
		},
		"fr": {
			"name": "Place Piken",
			"slug": "place-piken"
		}
	},
	"2013": {
		"id": "2013",
		"region": "2",
		"de": {
			"name": "Lichtung der Morgenröte",
			"slug": "lichtung-der-morgenrote"
		},
		"en": {
			"name": "Aurora Glade",
			"slug": "aurora-glade"
		},
		"es": {
			"name": "Claro de la Aurora",
			"slug": "claro-de-la-aurora"
		},
		"fr": {
			"name": "Clairière de l'aurore",
			"slug": "clairiere-de-laurore"
		}
	},
	"2014": {
		"id": "2014",
		"region": "2",
		"de": {
			"name": "Gunnars Feste",
			"slug": "gunnars-feste"
		},
		"en": {
			"name": "Gunnar's Hold",
			"slug": "gunnars-hold"
		},
		"es": {
			"name": "Fuerte de Gunnar",
			"slug": "fuerte-de-gunnar"
		},
		"fr": {
			"name": "Campement de Gunnar",
			"slug": "campement-de-gunnar"
		}
	},
	"2101": {
		"id": "2101",
		"region": "2",
		"de": {
			"name": "Jademeer [FR]",
			"slug": "jademeer-fr"
		},
		"en": {
			"name": "Jade Sea [FR]",
			"slug": "jade-sea-fr"
		},
		"es": {
			"name": "Mar de Jade [FR]",
			"slug": "mar-de-jade-fr"
		},
		"fr": {
			"name": "Mer de Jade [FR]",
			"slug": "mer-de-jade-fr"
		}
	},
	"2102": {
		"id": "2102",
		"region": "2",
		"de": {
			"name": "Fort Ranik [FR]",
			"slug": "fort-ranik-fr"
		},
		"en": {
			"name": "Fort Ranik [FR]",
			"slug": "fort-ranik-fr"
		},
		"es": {
			"name": "Fuerte Ranik [FR]",
			"slug": "fuerte-ranik-fr"
		},
		"fr": {
			"name": "Fort Ranik [FR]",
			"slug": "fort-ranik-fr"
		}
	},
	"2103": {
		"id": "2103",
		"region": "2",
		"de": {
			"name": "Augurenstein [FR]",
			"slug": "augurenstein-fr"
		},
		"en": {
			"name": "Augury Rock [FR]",
			"slug": "augury-rock-fr"
		},
		"es": {
			"name": "Roca del Augurio [FR]",
			"slug": "roca-del-augurio-fr"
		},
		"fr": {
			"name": "Roche de l'Augure [FR]",
			"slug": "roche-de-laugure-fr"
		}
	},
	"2104": {
		"id": "2104",
		"region": "2",
		"de": {
			"name": "Vizunah-Platz [FR]",
			"slug": "vizunah-platz-fr"
		},
		"en": {
			"name": "Vizunah Square [FR]",
			"slug": "vizunah-square-fr"
		},
		"es": {
			"name": "Plaza de Vizunah [FR]",
			"slug": "plaza-de-vizunah-fr"
		},
		"fr": {
			"name": "Place de Vizunah [FR]",
			"slug": "place-de-vizunah-fr"
		}
	},
	"2105": {
		"id": "2105",
		"region": "2",
		"de": {
			"name": "Laubenstein [FR]",
			"slug": "laubenstein-fr"
		},
		"en": {
			"name": "Arborstone [FR]",
			"slug": "arborstone-fr"
		},
		"es": {
			"name": "Piedra Arbórea [FR]",
			"slug": "piedra-arborea-fr"
		},
		"fr": {
			"name": "Pierre Arborea [FR]",
			"slug": "pierre-arborea-fr"
		}
	},
	"2201": {
		"id": "2201",
		"region": "2",
		"de": {
			"name": "Kodasch [DE]",
			"slug": "kodasch-de"
		},
		"en": {
			"name": "Kodash [DE]",
			"slug": "kodash-de"
		},
		"es": {
			"name": "Kodash [DE]",
			"slug": "kodash-de"
		},
		"fr": {
			"name": "Kodash [DE]",
			"slug": "kodash-de"
		}
	},
	"2202": {
		"id": "2202",
		"region": "2",
		"de": {
			"name": "Flussufer [DE]",
			"slug": "flussufer-de"
		},
		"en": {
			"name": "Riverside [DE]",
			"slug": "riverside-de"
		},
		"es": {
			"name": "Ribera [DE]",
			"slug": "ribera-de"
		},
		"fr": {
			"name": "Provinces fluviales [DE]",
			"slug": "provinces-fluviales-de"
		}
	},
	"2203": {
		"id": "2203",
		"region": "2",
		"de": {
			"name": "Elonafels [DE]",
			"slug": "elonafels-de"
		},
		"en": {
			"name": "Elona Reach [DE]",
			"slug": "elona-reach-de"
		},
		"es": {
			"name": "Cañón de Elona [DE]",
			"slug": "canon-de-elona-de"
		},
		"fr": {
			"name": "Bief d'Elona [DE]",
			"slug": "bief-delona-de"
		}
	},
	"2204": {
		"id": "2204",
		"region": "2",
		"de": {
			"name": "Abaddons Mund [DE]",
			"slug": "abaddons-mund-de"
		},
		"en": {
			"name": "Abaddon's Mouth [DE]",
			"slug": "abaddons-mouth-de"
		},
		"es": {
			"name": "Boca de Abaddon [DE]",
			"slug": "boca-de-abaddon-de"
		},
		"fr": {
			"name": "Bouche d'Abaddon [DE]",
			"slug": "bouche-dabaddon-de"
		}
	},
	"2205": {
		"id": "2205",
		"region": "2",
		"de": {
			"name": "Drakkar-See [DE]",
			"slug": "drakkar-see-de"
		},
		"en": {
			"name": "Drakkar Lake [DE]",
			"slug": "drakkar-lake-de"
		},
		"es": {
			"name": "Lago Drakkar [DE]",
			"slug": "lago-drakkar-de"
		},
		"fr": {
			"name": "Lac Drakkar [DE]",
			"slug": "lac-drakkar-de"
		}
	},
	"2206": {
		"id": "2206",
		"region": "2",
		"de": {
			"name": "Millersund [DE]",
			"slug": "millersund-de"
		},
		"en": {
			"name": "Miller's Sound [DE]",
			"slug": "millers-sound-de"
		},
		"es": {
			"name": "Estrecho de Miller [DE]",
			"slug": "estrecho-de-miller-de"
		},
		"fr": {
			"name": "Détroit de Miller [DE]",
			"slug": "detroit-de-miller-de"
		}
	},
	"2207": {
		"id": "2207",
		"region": "2",
		"de": {
			"name": "Dzagonur [DE]",
			"slug": "dzagonur-de"
		},
		"en": {
			"name": "Dzagonur [DE]",
			"slug": "dzagonur-de"
		},
		"es": {
			"name": "Dzagonur [DE]",
			"slug": "dzagonur-de"
		},
		"fr": {
			"name": "Dzagonur [DE]",
			"slug": "dzagonur-de"
		}
	},
	"2301": {
		"id": "2301",
		"region": "2",
		"de": {
			"name": "Baruch-Bucht [SP]",
			"slug": "baruch-bucht-sp"
		},
		"en": {
			"name": "Baruch Bay [SP]",
			"slug": "baruch-bay-sp"
		},
		"es": {
			"name": "Bahía de Baruch [ES]",
			"slug": "bahia-de-baruch-es"
		},
		"fr": {
			"name": "Baie de Baruch [SP]",
			"slug": "baie-de-baruch-sp"
		}
	},
};

},{}],15:[function(require,module,exports){
module.exports = {
	langs: require('./data/langs'),
	worlds: require('./data/world_names'),
	objective_names: require('./data/objective_names'),
	objective_types: require('./data/objective_types'),
	objective_meta: require('./data/objective_meta'),
	objective_labels: require('./data/objective_labels'),
	objective_map: require('./data/objective_map'),
};

},{"./data/langs":8,"./data/objective_labels":9,"./data/objective_map":10,"./data/objective_meta":11,"./data/objective_names":12,"./data/objective_types":13,"./data/world_names":14}],16:[function(require,module,exports){
  /* globals require, module */

/**
   * Module dependencies.
   */

  var pathtoRegexp = require('path-to-regexp');

  /**
   * Module exports.
   */

  module.exports = page;

  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var location = window.history.location || window.location;

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
  * HashBang option
  */

  var hashbang = false;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page();
   *
   * @param {String|Function} path
   * @param {Function} fn...
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' === typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
    // show <path> with [state]
    } else if ('string' == typeof path) {
      'string' === typeof fn
        ? page.redirect(path, fn)
        : page.show(path, fn);
    // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];

  /**
   * Get or set basepath to `path`.
   *
   * @param {String} path
   * @api public
   */

  page.base = function(path){
    if (0 === arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options){
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) window.addEventListener('click', onclick, false);
    if (true === options.hashbang) hashbang = true;
    if (!dispatch) return;
    var url = (hashbang && ~location.hash.indexOf('#!'))
      ? location.hash.substr(2) + location.search
      : location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function(){
    if (!running) return;
    running = false;
    window.removeEventListener('click', onclick, false);
    window.removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @param {Boolean} dispatch
   * @return {Context}
   * @api public
   */

  page.show = function(path, state, dispatch){
    var ctx = new Context(path, state);
    if (false !== dispatch) page.dispatch(ctx);
    if (false !== ctx.handled) ctx.pushState();
    return ctx;
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} from
   * @param {String} to
   * @api public
   */
  page.redirect = function(from, to) {
    page(from, function (e) {
      setTimeout(function() {
        page.replace(to);
      });
    });
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @return {Context}
   * @api public
   */

  page.replace = function(path, state, init, dispatch){
    var ctx = new Context(path, state);
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect
    if (false !== dispatch) page.dispatch(ctx);
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Object} ctx
   * @api private
   */

  page.dispatch = function(ctx){
    var i = 0;

    function next() {
      var fn = page.callbacks[i++];
      if (!fn) return unhandled(ctx);
      fn(ctx, next);
    }

    next();
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */

  function unhandled(ctx) {
    if (ctx.handled) return;
    var current;

    if (hashbang) {
      current = base + location.hash.replace('#!','');
    } else {
      current = location.pathname + location.search;
    }

    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    location.href = ctx.canonicalPath;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  function Context(path, state) {
    if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i
      ? path.slice(i + 1)
      : '';
    this.pathname = ~i
      ? path.slice(0, i)
      : path;
    this.params = [];

    // fragment
    this.hash = '';
    if (!~this.path.indexOf('#')) return;
    var parts = this.path.split('#');
    this.path = parts[0];
    this.hash = parts[1] || '';
    this.querystring = this.querystring.split('#')[0];
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function(){
    history.pushState(this.state
      , this.title
      , hashbang && this.path !== '/'
        ? '#!' + this.path
        : this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function(){
    history.replaceState(this.state
      , this.title
      , hashbang && this.path !== '/'
        ? '#!' + this.path
        : this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(this.path,
      this.keys = [],
      options.sensitive,
      options.strict);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn){
    var self = this;
    return function(ctx, next){
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Array} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params){
    var keys = this.keys,
        qsIndex = path.indexOf('?'),
        pathname = ~qsIndex
          ? path.slice(0, qsIndex)
          : path,
        m = this.regexp.exec(decodeURIComponent(pathname));

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = 'string' === typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];

      if (key) {
        params[key.name] = undefined !== params[key.name]
          ? params[key.name]
          : val;
      } else {
        params.push(val);
      }
    }

    return true;
  };

  /**
   * Handle "populate" events.
   */

  function onpopstate(e) {
    if (e.state) {
      var path = e.state.path;
      page.replace(path, e.state);
    }
  }

  /**
   * Handle "click" events.
   */

  function onclick(e) {
    if (1 != which(e)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;

    // ensure link
    var el = e.target;
    while (el && 'A' != el.nodeName) el = el.parentNode;
    if (!el || 'A' != el.nodeName) return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (el.pathname === location.pathname && (el.hash || '#' === link)) return;

    // Check for mailto: in the href
    if (link && link.indexOf("mailto:") > -1) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;

    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // same page
    var orig = path;

    path = path.replace(base, '');

    if (base && orig === path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null === e.which
      ? e.button
      : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return (href && (0 === href.indexOf(origin)));
  }

  page.sameOrigin = sameOrigin;

},{"path-to-regexp":17}],17:[function(require,module,exports){
/**
 * Expose `pathtoRegexp`.
 */
module.exports = pathtoRegexp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match already escaped characters that would otherwise incorrectly appear
  // in future matches. This allows the user to escape special characters that
  // shouldn't be transformed.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
  // Match regexp special characters that should always be escaped.
  '([.+*?=^!:${}()[\\]|\\/])'
].join('|'), 'g');

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
var attachKeys = function (re, keys) {
  re.keys = keys;

  return re;
};

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array should be passed in, which will contain the placeholder key
 * names. For example `/user/:id` will then contain `["id"]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 keys
 * @param  {Object}                options
 * @return {RegExp}
 */
function pathtoRegexp (path, keys, options) {
  if (keys && !Array.isArray(keys)) {
    options = keys;
    keys = null;
  }

  keys = keys || [];
  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var flags = options.sensitive ? '' : 'i';
  var index = 0;

  if (path instanceof RegExp) {
    // Match all capturing groups of a regexp.
    var groups = path.source.match(/\((?!\?)/g) || [];

    // Map all the matches to their numeric keys and push into the keys.
    keys.push.apply(keys, groups.map(function (match, index) {
      return {
        name:      index,
        delimiter: null,
        optional:  false,
        repeat:    false
      };
    }));

    // Return the source back to the user.
    return attachKeys(path, keys);
  }

  if (Array.isArray(path)) {
    // Map array parts into regexps and return their source. We also pass
    // the same keys and options instance into every generation to get
    // consistent matching groups before we join the sources together.
    path = path.map(function (value) {
      return pathtoRegexp(value, keys, options).source;
    });

    // Generate a new regexp instance by joining all the parts together.
    return attachKeys(new RegExp('(?:' + path.join('|') + ')', flags), keys);
  }

  // Alter the path string into a usable regexp.
  path = path.replace(PATH_REGEXP, function (match, escaped, prefix, key, capture, group, suffix, escape) {
    // Avoiding re-escaping escaped characters.
    if (escaped) {
      return escaped;
    }

    // Escape regexp special characters.
    if (escape) {
      return '\\' + escape;
    }

    var repeat   = suffix === '+' || suffix === '*';
    var optional = suffix === '?' || suffix === '*';

    keys.push({
      name:      key || index++,
      delimiter: prefix || '/',
      optional:  optional,
      repeat:    repeat
    });

    // Escape the prefix character.
    prefix = prefix ? '\\' + prefix : '';

    // Match using the custom capturing group, or fallback to capturing
    // everything up to the next slash (or next period if the param was
    // prefixed with a period).
    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');

    // Allow parameters to be repeated more than once.
    if (repeat) {
      capture = capture + '(?:' + prefix + capture + ')*';
    }

    // Allow a parameter to be optional.
    if (optional) {
      return '(?:' + prefix + '(' + capture + '))?';
    }

    // Basic parameter support.
    return prefix + '(' + capture + ')';
  });

  // Check whether the path ends in a slash as it alters some match behaviour.
  var endsWithSlash = path[path.length - 1] === '/';

  // In non-strict mode we allow an optional trailing slash in the match. If
  // the path to match already ended with a slash, we need to remove it for
  // consistency. The slash is only valid at the very end of a path match, not
  // anywhere in the middle. This is important for non-ending mode, otherwise
  // "/test/" will match "/test//route".
  if (!strict) {
    path = (endsWithSlash ? path.slice(0, -2) : path) + '(?:\\/(?=$))?';
  }

  // In non-ending mode, we need prompt the capturing groups to match as much
  // as possible by using a positive lookahead for the end or next path segment.
  if (!end) {
    path += strict && endsWithSlash ? '' : '(?=\\/|$)';
  }

  return attachKeys(new RegExp('^' + path + (end ? '$' : ''), flags), keys);
};

},{}],18:[function(require,module,exports){
'use strict';

var gw2api = require('gw2api');


module.exports = {
	getGuildDetails: getGuildDetails,
	getMatches: getMatches,
	// getMatchDetails: getMatchDetails,
	getMatchDetailsByWorld: getMatchDetailsByWorld,
};



function getMatches(callback) {
	gw2api.getMatchesState(callback);
}



function getGuildDetails(guildId, callback) {
	gw2api.getGuildDetails({guild_id: guildId}, callback);
}



function getMatchDetails(matchId, callback) {
	gw2api.getMatchDetailsState({match_id: matchId}, callback);
}



function getMatchDetailsByWorld(worldSlug, callback) {
	// setTimeout(
	// 	gw2api.getMatchDetailsState.bind(null, {world_slug: worldSlug}, callback),
	// 	3000
	// );
	gw2api.getMatchDetailsState({world_slug: worldSlug}, callback);
}

},{"gw2api":7}],19:[function(require,module,exports){
(function (global){
'use strict';


/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim

var PureRenderMixin = React.addons.PureRenderMixin;





/*
*	Component Globals
*/

var langs = require('gw2w2w-static').langs;
var worlds = require('gw2w2w-static').worlds;





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	mixins: [PureRenderMixin],

	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var lang = props.lang;
	var world = props.world;

	langs = _.map(langs, function(lang){
		lang.link = '/' + lang.slug;

		if (world) {
			lang.link = lang.link + '/' + world[lang.slug].slug;
		}

		return lang;
	});


	return (
		React.createElement("ul", {className: "nav navbar-nav"}, 
			_.map(langs, function(l) {
				return (
					React.createElement("li", {key: l.slug, className: (l.slug === lang.slug) ? 'active' : '', title: l.name}, 
						React.createElement("a", {'data-slug': l.slug, href: l.link}, l.label)
					)
				);
			})
		)
	);
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"gw2w2w-static":15}],20:[function(require,module,exports){
(function (global){
'use strict';


/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);		// browserify shim

var api = require('../api');





/*
*	React Components
*/

var RegionMatches = require('./overview/RegionMatches.jsx');
var RegionWorlds = require('./overview/RegionWorlds.jsx');





/*
*	Component Globals
*/

var worldsStatic = require('gw2w2w-static').worlds;





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	getInitialState: getInitialState,
	// componentWillMount: componentWillMount,
	componentDidMount: componentDidMount,
	componentWillUnmount: componentWillUnmount,
	render: render,

	getMatches: getMatches,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function getInitialState() {
	return {matches: {}};
}



function componentDidMount() {
	var component = this;

	component.updateTimer = null;
	component.getMatches();
}



function componentWillUnmount() {
	var component = this;

	clearTimeout(component.updateTimer);
}



function render() {
	var component = this;
	var props = component.props;
	var state = component.state;

	var lang = props.lang;

	var worlds = _.mapValues(worldsStatic, function(world) {
		world[lang.slug].id = world.id;
		world[lang.slug].region = world.region;
		world[lang.slug].link = '/' + lang.slug + '/' + world.slug;
		return world[lang.slug];
	});

	var matches = state.matches;

	var regions = [
		{
			"label": "NA",
			"id": "1",
			"matches": _.filter(matches, function(m) {return m.region == 1;}),
		}, {
			"label": "EU",
			"id": "2",
			"matches": _.filter(matches, function(m) {return m.region == 2;}),
		},
	];


	setPageTitle(lang);


	return (
		React.createElement("div", {id: "overview"}, 
			React.createElement("div", {className: "row"}, 
				_.map(regions, function(region){
					return (
						React.createElement("div", {className: "col-sm-12", key: region.label}, 
							React.createElement(RegionMatches, {region: region, lang: lang})
						)
					);
				})
			), 

			React.createElement("hr", null), 

			React.createElement("div", {className: "row"}, 
				_.map(regions, function(region){
					return (
						React.createElement("div", {className: "col-sm-12", key: region.label}, 
							React.createElement(RegionWorlds, {region: region, lang: lang})
						)
					);
				})
			)
		)
	);
}




/*
*	Component Helper Methods
*/

function getMatches() {
	var component = this;

	api.getMatches(function(err, data) {
		if (!err && data && _.isPlainObject(data)) {
			component.setState({matches: data});
		}

		var interval = _.random(2000, 4000);
		component.updateTimer = window.setTimeout(component.getMatches, interval);
	});

}





/*
*
*	Private Methods
*
*/

function setPageTitle(lang) {
	var title = ['gw2w2w'];

	if (lang) {
		if (lang.slug !== 'en') {
			title.push(lang.name);
		}
	}

	$('title').text(title.join(' - '));
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../api":18,"./overview/RegionMatches.jsx":24,"./overview/RegionWorlds.jsx":25,"gw2w2w-static":15}],21:[function(require,module,exports){
(function (process,global){
'use strict';


/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim
var async = (typeof window !== "undefined" ? window.async : typeof global !== "undefined" ? global.async : null);	// browserify shim

var api = require('../api');





/*
*	React Components
*/

var Scoreboard = require('./tracker/Scoreboard.jsx');
var Maps = require('./tracker/Maps.jsx');
var Guilds = require('./tracker/guilds/Guilds.jsx');





/*
*	Component Globals
*/

var libDate = require('../lib/date.js');
var staticData = require('gw2w2w-static');
var worldsStatic = staticData.worlds;





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	getInitialState: getInitialState,
	componentWillMount: componentWillMount,
	componentDidMount: componentDidMount,
	shouldComponentUpdate: shouldComponentUpdate,
	componentWillUnmount: componentWillUnmount,
	render: render,


	tick: tick,

	getMatchDetails: getMatchDetails,
	onMatchDetails: onMatchDetails,

	queueGuildLookups: queueGuildLookups,
	getGuildDetails: getGuildDetails,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function getInitialState() {
	var component = this;

	return {
		hasData: false,

		dateNow: libDate.dateNow(),
		lastmod: 0,
		timeOffset: 0,

		match: [],
		details: [],
		guilds: {},
	};
}



function componentWillMount() {
	var component = this;
}



function componentDidMount() {
	var component = this;

	component.interval = window.setInterval(component.tick, 1000);

	component.updateTimer = null;
	process.nextTick(component.getMatchDetails);
}



function shouldComponentUpdate(nextProps, nextState) {
	var component = this;
	var props = component.props;
	var state = component.state;

	// don't update more often than once per second
	// helps greatly during initialization while guilds are loading

	var isNewTick = (state.dateNow !== nextState.dateNow);
	var langChange = (props.lang !== nextProps.lang);
	var shouldUpdate = (isNewTick || langChange);

	// console.log(shouldUpdate, isFirstUpdate, isNewNow);

	return shouldUpdate;
}



function componentWillUnmount() {
	var component = this;

	clearTimeout(component.updateTimer);
	clearInterval(component.interval);
}



function render() {
	var component = this;
	var props = component.props;
	var state = component.state;

	var lang = props.lang;
	var world = props.world;

	var details = state.details;


	if (false && !state.hasData) {
		return null;
	}
	else {
		setPageTitle(lang, world);


		var dateNow = state.dateNow;
		var timeOffset = state.timeOffset;
		var match = state.match;
		var guilds = state.guilds;

		var eventHistory = details.history;
		var scores = match.scores || [0,0,0];
		var ticks = match.ticks || [0,0,0];
		var holdings = match.holdings || [0,0,0];

		var matchWorlds = {
			"red": {
				"world": worldsStatic[match.redId],
				"score": scores[0],
				"tick": ticks[0],
				"holding": holdings[0],
			},
			"blue": {
				"world": worldsStatic[match.blueId],
				"score": scores[1],
				"tick": ticks[1],
				"holding": holdings[1],
			},
			"green": {
				"world": worldsStatic[match.greenId],
				"score": scores[2],
				"tick": ticks[2],
				"holding": holdings[2],
			},
		};



		return (
			React.createElement("div", {id: "tracker"}, 

				React.createElement(Scoreboard, {
					lang: lang, 

					matchWorlds: matchWorlds}
				), 

				React.createElement(Maps, {
					lang: lang, 
					timeOffset: timeOffset, 
					dateNow: dateNow, 

					details: details, 
					matchWorlds: matchWorlds, 
					guilds: guilds}
				), 

				React.createElement(Guilds, {
					lang: lang, 
					timeOffset: timeOffset, 
					dateNow: dateNow, 

					guilds: guilds, 
					eventHistory: eventHistory}
				)

			)
		);
	}

}




/*
*	Component Helper Methods
*/

function tick() {
	var component = this;

	if(component.isMounted()) {
		component.setState({dateNow: libDate.dateNow()});
	}
}



function getMatchDetails() {
	var component = this;
	var props = component.props;

	var world = props.world;
	var lang = props.lang;
	var worldSlug = world[lang.slug].slug;

	api.getMatchDetailsByWorld(
		worldSlug,
		component.onMatchDetails
	);
}



function onMatchDetails(err, data) {
	var component = this;
	var props = component.props;
	var state = component.state;


	if(component.isMounted()) {
		if (!err && data && data.match && data.details) {

			var isModified = (data.match.lastmod !== state.match.lastmod);

			if (isModified) {
				var msOffset = Date.now() - data.now;
				var secOffset = Math.floor(msOffset / 1000);

				component.setState({
					hasData: true,
					lastmod: data.now,
					timeOffset: secOffset,
					match: data.match,
					details: data.details,
				});

				var claimCurrent = _.pluck(data.details.objectives.claimers, 'guild');
				var claimHistory = _.chain(data.details.history)
					.filter({type: 'claim'})
					.pluck('guild')
					.value();

				var guilds = claimCurrent.concat(claimHistory);

				if(guilds.length) {
					process.nextTick(component.queueGuildLookups.bind(null, guilds));
				}
			}

		}
	}
	else {
		component.setState({
			hasData: false,
		});
	}

	var refreshTime = _.random(1000*2, 1000*4);
	component.updateTimer = window.setTimeout(component.getMatchDetails, refreshTime);

}




function queueGuildLookups(guilds){
	var component = this;
	var state = component.state;

	var knownGuilds = _.keys(state.guilds);

	var newGuilds = _
		.chain(guilds)
		.uniq()
		.without(undefined, null)
		.difference(knownGuilds)
		.value();


	if(component.isMounted()) {
		async.eachLimit(
			newGuilds,
			4,
			component.getGuildDetails
		);
	}
}



function getGuildDetails(guildId, onComplete) {
	var component = this;
	var state = component.state;

	api.getGuildDetails(
		guildId,
		function(err, data) {
			if(!err) {
				state.guilds[guildId] = data;

				if(component.isMounted()) {
					component.setState({guilds: state.guilds});
				}
			}
			onComplete();
		}
	);
}





/*
*
*	Private Methods
*
*/

function setPageTitle(lang, world) {
	var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
	var title = [world[lang.slug].name, 'gw2w2w'];

	if (lang.slug !== 'en') {
		title.push(lang.name);
	}

	$('title').text(title.join(' - '));
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../api":18,"../lib/date.js":39,"./tracker/Maps.jsx":27,"./tracker/Scoreboard.jsx":28,"./tracker/guilds/Guilds.jsx":31,"_process":2,"gw2w2w-static":15}],22:[function(require,module,exports){
(function (global){
'use strict';


/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var PureRenderMixin = React.addons.PureRenderMixin;





/*
*	React Components
*/

var Score = require('./Score.jsx');
var Pie = require('./Pie.jsx');





/*
*	Component Globals
*/

var worldsStatic = require('gw2w2w-static').worlds;





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	// mixins: [PureRenderMixin],

	render: render,
	shouldComponentUpdate: shouldComponentUpdate,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var match = props.match;
	var lang = props.lang;

	var matchId = match.id;
	var scores = match.scores;

	var redWorld = worldsStatic[match.redId][lang.slug];
	var blueWorld = worldsStatic[match.blueId][lang.slug];
	var greenWorld = worldsStatic[match.greenId][lang.slug];

	var matchWorlds = {
		"red": {"world": redWorld, "score": scores[0]},
		"blue": {"world": blueWorld, "score": scores[1]},
		"green": {"world": greenWorld, "score": scores[2]},
	};

	return (
		React.createElement("div", {className: "matchContainer", key: matchId}, 
			React.createElement("table", {className: "match"}, 
				_.map(matchWorlds, function(mw, color) {
					var world = mw.world;
					var score = mw.score;

					var href = ['', lang.slug, world.slug].join('/');
					var label = world.name;

					return (
						React.createElement("tr", {key: color}, 
							React.createElement("td", {className: "team name " + color}, 
								React.createElement("a", {href: href}, label)
							), 
							React.createElement("td", {className: "team score " + color}, 
								React.createElement(Score, {
									key: matchId, 
									matchId: matchId, 
									team: color, 
									score: score}
								)
							), 
							(color === 'red') ?
								React.createElement("td", {rowSpan: "3", className: "pie"}, React.createElement(Pie, {scores: scores, size: "60", matchId: matchId})) :
								null
							
						)
					);
				})
			)
		)
	);
}



function shouldComponentUpdate(nextProps) {
	var component = this;
	var props = component.props;

	var newScore = !_.isEqual(props.match.scores, nextProps.match.scores);
	var newMatch = (props.match.startTime !== nextProps.match.startTime);

	return (newScore || newMatch);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Pie.jsx":23,"./Score.jsx":26,"gw2w2w-static":15}],23:[function(require,module,exports){
(function (global){
'use strict';


/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);		// browserify shim





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var scores = props.scores;

	return React.createElement("img", {width: "60", height: "60", src: getImageSource(scores)});
}




/*
*
*	Private Methods
*
*/

function getImageSource(scores) {
	var pieSize = 60;
	var pieStroke = 2;

	return 'http://www.piely.net/' + pieSize + '/' + scores.join(',') + '?strokeWidth=' + pieStroke;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
(function (global){
'use strict';


/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim





/*
*	React Components
*/

var Match = require('./Match.jsx');




/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var region = props.region;
	var lang = props.lang;

	var matches = _.sortBy(region.matches, 'id');

	return (
		React.createElement("div", {className: "RegionMatches"}, 
			React.createElement("h2", null, region.label), 
			_.map(matches, function(match){
				return (
					React.createElement(Match, {
						key: match.id, 
						className: "match", 
						match: match, 
						lang: lang}
					)
				);
			})
		)
	);
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Match.jsx":22}],25:[function(require,module,exports){
(function (global){
'use strict';


/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim

var PureRenderMixin = React.addons.PureRenderMixin;





/*
*	Component Globals
*/

var worldsStatic = require('gw2w2w-static').worlds;





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	mixins: [PureRenderMixin],

	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/


function render() {
	var component = this;
	var props = component.props;

	var lang = props.lang;
	var region = props.region;

	var label = region.label + ' Worlds';
	var regionId = region.id;


	var worlds = _.chain(worldsStatic)
		.filter(function(w){return w.region == regionId;})
		.sortBy(function(w){return w[lang.slug].name;})
		.value();


	return (
		React.createElement("div", {className: "RegionWorlds"}, 
			React.createElement("h2", null, label), 
			React.createElement("ul", {className: "list-unstyled"}, 
				_.map(worlds, function(world){
					var href = ['', lang.slug, world[lang.slug].slug].join('/');
					var label = world[lang.slug].name;

					return (
						React.createElement("li", {key: world.id}, 
							React.createElement("a", {href: href}, label)
						)
					);
				})
			)
		)
	);
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"gw2w2w-static":15}],26:[function(require,module,exports){
(function (global){
'use strict';


/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);		// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);			// browserify shim
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);			// browserify shim
var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);	// browserify shim





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	getInitialState: getInitialState,
	render: render,
	componentWillReceiveProps: componentWillReceiveProps,
	shouldComponentUpdate: shouldComponentUpdate,
	componentDidUpdate: componentDidUpdate,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function getInitialState() {
	return {diff: 0};
}



function componentWillReceiveProps(nextProps){
	var component = this;
	var props = component.props;

	// console.log('Score::componentWillReceiveProps', nextProps.score, props.score);
	component.setState({diff: nextProps.score - props.score});
}



function render() {
	var component = this;
	var props = component.props;
	var state = component.state;

	var matchId = props.matchId;
	var team = props.team;
	var score = props.score || 0;

	return (
		React.createElement("div", null, 
			React.createElement("span", {className: "diff"}, 
				(state.diff) ?
					'+' + numeral(state.diff).format('0,0') :
					null
			), 
			React.createElement("span", {className: "value"}, numeral(score).format('0,0'))
		)
	);
}



function shouldComponentUpdate(nextProps) {
	var component = this;
	var props = component.props;

	var newScore = (props.score !== nextProps.score);

	return newScore;
}




function componentDidUpdate() {
	var component = this;
	var state = component.state;

	if(state.diff) {
		var $diff = $('.diff', component.getDOMNode());

		$diff
			.velocity('fadeOut', {duration: 0})
			.velocity('fadeIn', {duration: 200})
			.velocity('fadeOut', {duration: 1200, delay: 400});
	}
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],27:[function(require,module,exports){
(function (global){
'use strict';


/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim





/*
*	React Components
*/

var MapDetails = require('./maps/MapDetails.jsx');
var Log = require('./log/Log.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var mapsConfig = staticData.objective_map;





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	if (!props.details.initialized) {
		return null;
	}

	var dateNow = props.dateNow;
	var timeOffset = props.timeOffset;

	var lang = props.lang;
	var details = props.details;
	var matchWorlds = props.matchWorlds;
	var guilds = props.guilds;

	var eventHistory = details.history;



	function getMapDetails(mapKey) {
		return (
			React.createElement(MapDetails, {
				mapKey: mapKey, 
				lang: lang, 
				dateNow: dateNow, 
				timeOffset: timeOffset, 

				details: details, 
				guilds: guilds, 
				matchWorlds: matchWorlds}
			));
	}



	return (
		React.createElement("div", {id: "maps"}, 
			React.createElement("h1", null, "Maps"), 
			React.createElement("div", {className: "row"}, 

				React.createElement("div", {className: "col-md-6"}, getMapDetails('Center')), 

				React.createElement("div", {className: "col-md-18"}, 

					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-md-8"}, getMapDetails('RedHome')), 
						React.createElement("div", {className: "col-md-8"}, getMapDetails('BlueHome')), 
						React.createElement("div", {className: "col-md-8"}, getMapDetails('GreenHome'))
					), 

					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-md-24"}, 
							React.createElement(Log, {
								lang: lang, 
								dateNow: dateNow, 
								timeOffset: timeOffset, 

								eventHistory: eventHistory, 
								guilds: guilds, 
								matchWorlds: matchWorlds}
							)
						)
					)

				)
			 )
		)
	);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./log/Log.jsx":33,"./maps/MapDetails.jsx":34,"gw2w2w-static":15}],28:[function(require,module,exports){
(function (global){
'use strict';


/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);		// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);			// browserify shim
var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);	// browserify shim





/*
*	React Components
*/

var Sprite = require('./objectives/Sprite.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var objectiveTypes = staticData.objective_types;





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/


function render() {
	var component = this;
	var props = component.props;

	var lang = props.lang;
	var matchWorlds = props.matchWorlds;

	return (
		React.createElement("div", {className: "row", id: "scoreboards"}, 
			_.map(matchWorlds, function(mw, color) {
				var worldName = (mw.world) ? mw.world[lang.slug].name : color;
				var score = mw.score;
				var tick = mw.tick;
				var holdings = mw.holding;

				var scoreboardClass = [
					'scoreboard',
					'team-bg',
					'team',
					'text-center',
					color
				].join(' ');

				return (
					React.createElement("div", {className: "col-sm-8", key: color}, 
						React.createElement("div", {className: scoreboardClass}, 

							(mw.world) ?(
								React.createElement("div", null, 
									React.createElement("h1", null, worldName), 
									React.createElement("h2", null, numeral(score).format('0,0'), " +", tick), 

									React.createElement("ul", {className: "list-inline"}, 
										_.map(holdings, function(holding, ixHolding) {
											var oType = objectiveTypes[ixHolding + 1];

											return (
												React.createElement("li", {key: ixHolding}, 
													React.createElement(Sprite, {type: oType.name, color: color}), 
													' x' + holding
												)
											);
										})
									)
								)
							) : (
								React.createElement("h1", {style: {height: '90px', fontSize: '32pt', lineHeight: '90px'}}, 
									React.createElement("i", {className: "fa fa-spinner fa-spin"})
								)
							)


						)
					)
				);
			})
		)
	);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./objectives/Sprite.jsx":38,"gw2w2w-static":15}],29:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim

var PureRenderMixin = React.addons.PureRenderMixin;





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	mixins: [PureRenderMixin],

	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var guildName = slugify(props.guildName);
	var size = props.size;

	var src = 'http://guilds.gw2w2w.com/guilds/' + guildName + '/256.svg';


	return (
		React.createElement("img", {className: "emblem", src: src, width: size, height: size})
	);
}






/*
*
*	Private Methods
*
*/

function slugify(str) {
	return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],30:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim





/*
*	React Components
*/

var Emblem = require('./Emblem.jsx');
var Objective = require('../objectives/Objective.jsx');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;





/*
*	Component Globals
*/

var objectiveCols = {
	elapsed: true,
	timestamp: true,
	mapAbbrev: true,
	arrow: true,
	sprite: true,
	name: true,
	eventType: false,
	guildName: false,
	guildTag: false,
	timer: false,
};





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	render: render,
	componentDidMount: componentDidMount,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var guild = props.guild;
	var timeOffset = props.timeOffset;
	var dateNow = props.dateNow;
	var lang = props.lang;


	return (
		React.createElement("div", {className: "guild", id: guild.guild_id}, 
			React.createElement("div", {className: "row"}, 

				React.createElement("div", {className: "col-sm-4"}, 
					React.createElement(Emblem, {guildName: guild.guild_name})
				), 

				React.createElement("div", {className: "col-sm-20"}, 
					React.createElement("h1", null, guild.guild_name, " [", guild.tag, "]"), 

					React.createElement("ul", {className: "list-unstyled"}, 
						_.map(guild.claims, function(entry, ixEntry) {
							return (
								React.createElement("li", {key: entry.id}, 
									React.createElement(Objective, {
										lang: lang, 
										dateNow: dateNow, 
										timeOffset: timeOffset, 
										cols: objectiveCols, 

										objectiveId: entry.objectiveId, 
										worldColor: entry.world, 
										timestamp: entry.timestamp, 
										guildId: guild.guild_id, 
										eventType: entry.type}
									)
								)
							);
						})
					)

				)

			)
		)
	);
}




function componentDidMount() {
	var component = this;
	var props = component.props;

	if (props.animateEntry) {
		var $node = $(component.getDOMNode());

		$node
			.velocity('slideUp', {duration: 0})
			.velocity('slideDown', {duration: 800});
	}
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../objectives/Objective.jsx":37,"./Emblem.jsx":29}],31:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim





/*
*	React Components
*/

var Guild = require('./Guild.jsx');





/*
*	Component Globals
*/

var objectiveCols = {
	elapsed: true,
	timestamp: true,
	mapAbbrev: true,
	arrow: true,
	sprite: true,
	name: true,
	eventType: false,
	guildName: false,
	guildTag: false,
	timer: false,
};





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	getInitialState: getInitialState,
	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function getInitialState() {
	return {
		animateEntry: false,
	};
}



function render() {
	var component = this;
	var props = component.props;
	var state = component.state;

	var timeOffset = props.timeOffset;
	var dateNow = props.dateNow;
	var lang = props.lang;
	var eventHistory = props.eventHistory;

	var guilds = _
		.chain(props.guilds)
		.map(function(guild){
			guild.claims = _.chain(eventHistory)
				.filter(function(entry){
					return (entry.type === 'claim' && entry.guild === guild.guild_id);
				})
				.sortBy('timestamp')
				.reverse()
				.value();

			guild.lastClaim = (guild.claims && guild.claims.length) ? guild.claims[0].timestamp : 0;
			return guild;
		})
		.sortBy('guild_name')
		.sortBy(function(guild){
			return -guild.lastClaim;
		})
		.value();


	return (
		React.createElement("div", {id: "guilds"}, 
			(guilds && guilds.length) ? React.createElement("hr", null) : null, 

			_.map(guilds, function(guild, ixGuild) {
				var key = guild.guild_id + '@' + guild.lastClaim;

				return (
					React.createElement(Guild, {
						key: key, 
						dateNow: dateNow, 
						timeOffset: timeOffset, 
						lang: lang, 

						animateEntry: state.animateEntry, 
						guild: guild}
					)
				);
			})
		)
	);
}




function componentDidMount() {
	var component = this;

	component.setState({animateEntry: true});
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Guild.jsx":30}],32:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);		// browserify shim





/*
*	React Components
*/

var Objective = require('../objectives/Objective.jsx');





/*
*	Component Globals
*/

var objectiveCols = {
	elapsed: true,
	timestamp: true,
	mapAbbrev: true,
	arrow: true,
	sprite: true,
	name: true,
	eventType: false,
	guildName: true,
	guildTag: true,
	timer: false,
};





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	render: render,
	componentDidMount: componentDidMount,
});






/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var lang = props.lang;
	var dateNow = props.dateNow;
	var timeOffset = props.timeOffset;
	var cols = props.objectiveCols;

	var animateEntry = props.animateEntry;
	var entryId = props.entryId;
	var objectiveId = props.objectiveId;
	var worldColor = props.worldColor;
	var timestamp = props.timestamp;
	var guildId = props.guildId;
	var eventType = props.eventType;
	var guilds = props.guilds;

	return (
		React.createElement("li", null, 
			React.createElement(Objective, {
				lang: lang, 
				dateNow: dateNow, 
				timeOffset: timeOffset, 
				cols: objectiveCols, 

				objectiveId: objectiveId, 
				worldColor: worldColor, 
				timestamp: timestamp, 
				guildId: guildId, 
				eventType: eventType, 
				guilds: guilds}
			)
		)
	);
}




function componentDidMount() {
	var component = this;
	var props = component.props;

	if (props.animateEntry) {
		var $node = $(component.getDOMNode());

		$node
			.velocity('slideUp', {duration: 0})
			.velocity('slideDown', {duration: 800});
	}
}


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../objectives/Objective.jsx":37}],33:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);		// browserify shim





/*
*	React Components
*/

var Entry = require('./Entry.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var mapsStatic = staticData.objective_map;
var objectivesMeta = staticData.objective_meta;





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	getInitialState: getInitialState,
	render: render,
	componentDidMount: componentDidMount,
	componentDidUpdate: componentDidUpdate,

	setWorld: setWorld,
	setEvent: setEvent,
});






/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function getInitialState() {
	return {
		mapFilter: 'all',
		eventFilter: 'all',
		animateEntry: false,
	};
}



function render() {
	var component = this;
	var props = component.props;
	var state = component.state;

	var dateNow = props.dateNow;
	var timeOffset = props.timeOffset;
	var lang = props.lang;
	var guilds = props.guilds;
	var matchWorlds = props.matchWorlds;

	var eventFilter = state.eventFilter;
	var mapFilter = state.mapFilter;


	var eventHistory = _.chain(props.eventHistory)
		.filter(function(entry) {
			return (eventFilter == 'all' || entry.type == eventFilter);
		})
		.filter(function(entry) {
			var oMeta = objectivesMeta[entry.objectiveId];
			return (mapFilter == 'all' || oMeta.map == mapFilter);
		})
		.sortBy('timestamp')
		.reverse()
		.map(function(entry, ixEntry) {
			var guildId = (entry.guild) ? entry.guild : null;

			return (
				React.createElement(Entry, {
					key: entry.id, 
					lang: lang, 
					dateNow: dateNow, 
					timeOffset: timeOffset, 

					animateEntry: state.animateEntry, 
					entryId: entry.id, 
					objectiveId: entry.objectiveId, 
					worldColor: entry.world, 
					timestamp: entry.timestamp, 
					guildId: guildId, 
					eventType: entry.type, 
					guilds: guilds}
				)
			);
		})
		.value();


	return (
		React.createElement("div", {id: "log-container"}, 

			React.createElement("div", {className: "log-tabs"}, 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-sm-16"}, 
						React.createElement("ul", {id: "log-map-filters", className: "nav nav-pills"}, 

							React.createElement("li", {className: (mapFilter == 'all') ? 'active': 'null'}, 
								React.createElement("a", {onClick: component.setWorld, 'data-filter': "all"}, "All")
							), 

							_.map(mapsStatic, function(mapMeta, ixMap) {
								return (
									React.createElement("li", {key: mapMeta.mapIndex, className: (mapFilter === mapMeta.mapIndex) ? 'active': 'null'}, 
										React.createElement("a", {onClick: component.setWorld, 'data-filter': mapMeta.mapIndex}, mapMeta.abbr)
									)
								);
							})

						)
					), 
					React.createElement("div", {className: "col-sm-8"}, 
						React.createElement("ul", {id: "log-event-filters", className: "nav nav-pills"}, 
							React.createElement("li", {className: (eventFilter === 'claim') ? 'active': 'null'}, 
								React.createElement("a", {onClick: component.setEvent, 'data-filter': "claim"}, "Claims")
							), 
							React.createElement("li", {className: (eventFilter === 'capture') ? 'active': 'null'}, 
								React.createElement("a", {onClick: component.setEvent, 'data-filter': "capture"}, "Captures")
							), 
							React.createElement("li", {className: (eventFilter === 'all') ? 'active': 'null'}, 
								React.createElement("a", {onClick: component.setEvent, 'data-filter': "all"}, "All")
							)
						)
					)
				)
			), 

			React.createElement("ul", {className: "list-unstyled", id: "log"}, 
				eventHistory
			)

		)
	);
}




function componentDidMount() {
	var component = this;

	component.setState({animateEntry: true});
}




function componentDidUpdate() {
	var component = this;
	var state = component.state;

	if (!state.animateEntry) {
		component.setState({animateEntry: true});
	}
}






/*
*	Component Helper Methods
*/

function setWorld(e) {
	var component = this;

	var filter = e.target.getAttribute('data-filter');

	component.setState({mapFilter: filter, animateEntry: false});
}



function setEvent(e) {
	var component = this;

	var filter = e.target.getAttribute('data-filter');

	component.setState({eventFilter: filter, animateEntry: false});
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Entry.jsx":32,"gw2w2w-static":15}],34:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);		// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);			// browserify shim
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);			// browserify shim
var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);	// browserify shim





/*
*	React Components
*/

var MapSection = require('./MapSection.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var mapsStatic = staticData.objective_map;





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	render: render,

	onTitleClick: onTitleClick,
});






/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var dateNow = props.dateNow;
	var timeOffset = props.timeOffset;
	var lang = props.lang;
	var details = props.details;
	var guilds = props.guilds;
	var matchWorlds = props.matchWorlds;
	var mapsMeta = props.mapsMeta;
	var mapKey = props.mapKey;

	var owners = details.objectives.owners;
	var claimers = details.objectives.claimers;


	var mapMeta = _.find(mapsStatic, {key: mapKey});
	var scores = _.map(details.maps.scores[mapMeta.mapIndex], function(score) {return numeral(score).format('0,0');});
	// var ticks = details.maps.ticks[mapMeta.mapIndex];
	// var holdings = details.maps.holdings[mapMeta.mapIndex];


	return (
		React.createElement("div", {className: "map"}, 

			React.createElement("div", {className: "mapScores"}, 
				React.createElement("h2", {className: 'team ' + mapMeta.colo, onClick: component.onTitleClick}, 
					mapMeta.name
				), 
				React.createElement("ul", {className: "list-inline"}, 
					_.map(scores, function(score, ixScore) {
						return (
							React.createElement("li", {key: ixScore, className: getScoreClass(ixScore)}, 
								score
							)
						);
					})
				)
			), 

			React.createElement("div", {className: "row"}, 
				_.map(mapMeta.sections, function(mapSection, ixSection) {

					var sectionClass = getSectionClass(mapMeta.key, mapSection.label);

					return (
						React.createElement("div", {className: sectionClass, key: ixSection}, 
							React.createElement(MapSection, {
								lang: lang, 
								dateNow: dateNow, 
								timeOffset: timeOffset, 

								mapSection: mapSection, 
								owners: owners, 
								claimers: claimers, 
								guilds: guilds, 
								mapMeta: mapMeta}
							)
						)
					);
				})
			)


		)
	);
}





/*
*	Component Helper Methods
*/

function onTitleClick(e) {
	var component = this;

	var $maps = $('.map');
	var $map = $(e.target).closest('.map', $maps);

	var hasFocus = $map.hasClass('map-focus');


	if(!hasFocus) {
		$map
			.addClass('map-focus')
			.removeClass('map-blur');

		$maps.not($map)
			.removeClass('map-focus')
			.addClass('map-blur');
	}
	else {
		$maps
			.removeClass('map-focus')
			.removeClass('map-blur');

	}
}





/*
*
*	Private Methods
*
*/

var colorMap = ['red', 'green', 'blue'];
function getScoreClass(ixScore) {
	return ['team', colorMap[ixScore]].join(' ');
}



function getSectionClass(mapKey, sectionLabel) {
	var sectionClass = [
		'col-md-24',
		'map-section',
	];

	if (mapKey === 'Center') {
		if (sectionLabel === 'Castle') {
			sectionClass.push('col-sm-24');
		}
		else {
			sectionClass.push('col-sm-8');
		}
	}
	else {
		sectionClass.push('col-sm-8');
	}

	return sectionClass.join(' ');
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./MapSection.jsx":35,"gw2w2w-static":15}],35:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim





/*
*	React Components
*/

var Objective = require('../objectives/Objective.jsx');





/*
*	Component Globals
*/

var objectiveCols = {
	elapsed: false,
	timestamp: false,
	mapAbbrev: false,
	arrow: true,
	sprite: true,
	name: true,
	eventType: false,
	guildName: false,
	guildTag: true,
	timer: true,
};





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	render: render,
});






/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var dateNow = props.dateNow;
	var timeOffset = props.timeOffset;
	var lang = props.lang;
	var mapSection = props.mapSection;
	var owners = props.owners;
	var claimers = props.claimers;
	var guilds = props.guilds;
	var mapMeta = props.mapMeta;

	return (
		React.createElement("ul", {className: "list-unstyled"}, 
			_.map(mapSection.objectives, function(objectiveId) {

				var owner = owners[objectiveId];
				var claimer = claimers[objectiveId];
				var guildId = (claimer) ? claimer.guild : null;

				return (
					React.createElement("li", {key: objectiveId, id: 'objective-' + objectiveId}, 
						React.createElement(Objective, {
							lang: lang, 
							dateNow: dateNow, 
							timeOffset: timeOffset, 
							cols: objectiveCols, 

							objectiveId: objectiveId, 
							worldColor: owner.world, 
							timestamp: owner.timestamp, 
							guildId: guildId, 
							guilds: guilds}
						)
					)
				);

			})
		)
	);
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../objectives/Objective.jsx":37}],36:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim

var PureRenderMixin = React.addons.PureRenderMixin;



/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	mixins: [PureRenderMixin],

	render: render,
});






/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var src = getArrowSrc(props.oMeta);


	return (
		React.createElement("span", {className: "direction"}, 
			src ? React.createElement("img", {src: src}) : null
		)
	);
}






/*
*
*	Static Methods
*
*/

function getArrowSrc(meta) {
	if (!meta.d) {
		return null;
	}

	var src = ['/img/icons/dist/arrow'];

	if (meta.n) {src.push('north'); }
	else if (meta.s) {src.push('south'); }

	if (meta.w) {src.push('west'); }
	else if (meta.e) {src.push('east'); }

	return src.join('-') + '.svg';
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],37:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);		// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);			// browserify shim
var moment = (typeof window !== "undefined" ? window.moment : typeof global !== "undefined" ? global.moment : null);		// browserify shim





/*
*	React Components
*/

var Sprite = require('./Sprite.jsx');
var Arrow = require('./Arrow.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var mapsStatic = staticData.objective_map;
var objectivesNames = staticData.objective_names;
var objectivesTypes = staticData.objective_types;
var objectivesMeta = staticData.objective_meta;
var objectivesLabels = staticData.objective_labels;

var colDefaults = {
	elapsed: false,
	timestamp: false,
	mapAbbrev: false,
	arrow: false,
	sprite: false,
	name: false,
	eventType: false,
	guildName: false,
	guildTag: false,
	timer: false,
};





/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	render: render,
});






/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var objectiveId = props.objectiveId;

	// short circuit
	if (!_.has(objectivesMeta, objectiveId)) {
		return null;
	}

	var lang = props.lang;
	var dateNow = props.dateNow;
	var timeOffset = props.timeOffset;
	var guilds = props.guilds;

	var worldColor = props.worldColor;
	var timestamp = props.timestamp;
	var guildId = props.guildId;
	var eventType = props.eventType || null;

	var cols = _.defaults(props.cols, colDefaults);


	var offsetTimestamp = timestamp + timeOffset;
	var expires = offsetTimestamp + (5 * 60);
	var secondsRemaining = expires - dateNow;

	var isTimerFresh = (dateNow - offsetTimestamp < 10);
	var isTimerActive = (expires >= dateNow);
	var isTimerVisible = (expires + 10 >= dateNow); // show for 10 seconds after expiring


	var oMeta = objectivesMeta[objectiveId];
	var oName = objectivesNames[objectiveId];
	var oLabel = objectivesLabels[objectiveId];
	var oType = objectivesTypes[oMeta.type];

	var guild = (guilds && guildId && guilds[guildId]) ? guilds[guildId] : null;

	var mapMeta = _.find(mapsStatic, {mapIndex: oMeta.map});



	var className = [
		'objective',
		'team',
		worldColor,
		(isTimerFresh) ? 'fresh' : '',
	].join(' ');

	var timerClass = [
		'timer',
		(isTimerVisible) ? 'active' : 'inactive',
		(isTimerActive) ? '' : 'expired',
	].join(' ');




	var expiration = moment(secondsRemaining * 1000);
	var timestampMoment = moment((timestamp + timeOffset) * 1000);

	var timestampRelative = timestampMoment.twitterShort();
	var timestampHtml = timestampMoment.format('hh:mm:ss');
	var timerHtml = (isTimerActive) ? expiration.format('m:ss') : '0:00';



	return (
		React.createElement("div", {className: className}, 
			(cols.elapsed) ?
				React.createElement("div", {className: "objective-relative"}, 
					React.createElement("span", null, timestampRelative)
				)
			: null, 
			(cols.timestamp) ?
				React.createElement("div", {className: "objective-timestamp"}, 
					timestampHtml
				)
			: null, 
			(cols.mapAbbrev) ?
				React.createElement("div", {className: "objective-map"}, 
					React.createElement("span", {title: mapMeta.name}, mapMeta.abbr)
				)
			: null, 
			(cols.arrow || cols.sprite) ?
				React.createElement("div", {className: "objective-icons"}, 
					(cols.arrow) ?
						React.createElement(Arrow, {oMeta: oMeta})
					: null, 
					(cols.sprite) ?
 						React.createElement(Sprite, {type: oType.name, color: worldColor})
					: null
				)
			: null, 
			(cols.name) ?
				React.createElement("div", {className: "objective-label"}, 
					React.createElement("span", null, oLabel[lang.slug])
				)
			: null, 
			/*(cols.eventType && eventType) ?
				<div className="objective-event">
					<span>{(eventType === 'claim') ? 'Claimed by ' : 'Captured by ' + worldColor}</span>
				</div>
			: null*/
			(guildId || cols.timer) ?
				React.createElement("div", {className: "objective-state"}, 
					(guildId && (cols.guildName || cols.guildTag)) ?
						renderGuild(guildId, guild, cols)
					: null, 
					(cols.timer) ?
						React.createElement("span", {className: timerClass}, timerHtml)
					: null
				)
			: null
		)
	);
}





/*
*
*	Private Methods
*
*/

function renderGuild(guildId, guild, cols){
	var guildLabel = '';

	if(!guild) {
		guildLabel = React.createElement("i", {className: "fa fa-spinner fa-spin"});
	}
	else {
		if (cols.guildName) {
			guildLabel += guild.guild_name;
		}
		if (cols.guildTag) {
			if (cols.guildName) {
				guildLabel += ('[' + guild.tag + ']');
			}
			else {
				guildLabel += guild.tag;
			}
		}
	}

	return (
		React.createElement("span", null, 
			React.createElement("a", {	className: "guildname", 
				href: '#' + guildId, 
				title: guild ? guild.guild_name + ' [' + guild.tag + ']' : null}, 

				guildLabel

			)
		)
	);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Arrow.jsx":36,"./Sprite.jsx":38,"gw2w2w-static":15}],38:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim

var PureRenderMixin = React.addons.PureRenderMixin;




/*
*	Component Export
*/

module.exports = React.createClass({displayName: 'exports',
	mixins: [PureRenderMixin],

	render: render,
});






/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var type = props.type;
	var color = props.color;

	return (
		React.createElement("span", {className: ['sprite', type, color].join(' ')})
	);
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],39:[function(require,module,exports){
'use strict';

module.exports = {
	dateNow: dateNow,
	add5: add5,
};


function dateNow() {
	return Math.floor(_.now() / 1000);
}


function add5(inDate) {
	var _baseDate = inDate || dateNow();

	return (_baseDate + (5 * 60));
}

},{}],40:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim





/*
*	React Components
*/

var Overview = require('./jsx/Overview.jsx');
var Langs = require('./jsx/Langs.jsx');





/*
*	Component Globals
*/

var langs = require('gw2w2w-static').langs;





/*
*	Export
*/

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug || 'en';
	var lang = langs[langSlug];

	React.render(React.createElement(Langs, {lang: lang}), document.getElementById('nav-langs'));
	React.render(React.createElement(Overview, {lang: lang}), document.getElementById('content'));
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./jsx/Langs.jsx":19,"./jsx/Overview.jsx":20,"gw2w2w-static":15}],41:[function(require,module,exports){
(function (global){
'use strict';

/*
*	Dependencies
*/

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);	// browserify shim
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);		// browserify shim





/*
*	React Components
*/

var Tracker = require('./jsx/Tracker.jsx');
var Langs = require('./jsx/Langs.jsx');





/*
*	Component Globals
*/

var langs = require('gw2w2w-static').langs;
var worlds = require('gw2w2w-static').worlds;





/*
*	Export
*/

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug;
	var lang = langs[langSlug];

	var worldSlug = ctx.params.worldSlug;
	var world = _.find(worlds, function(world) {
		return world[lang.slug].slug === worldSlug;
	});


	React.render(React.createElement(Langs, {lang: lang, world: world}), document.getElementById('nav-langs'));
	React.render(React.createElement(Tracker, {lang: lang, world: world}), document.getElementById('content'));
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./jsx/Langs.jsx":19,"./jsx/Tracker.jsx":21,"gw2w2w-static":15}]},{},[1]);
