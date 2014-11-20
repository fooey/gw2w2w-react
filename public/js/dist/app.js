(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
"use strict";


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

},{"./overview.jsx":39,"./tracker.jsx":40,"page":16}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
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
}

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
*	package.json reqwrites to this from getData.js for Browserify
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
		"mapIndex": 3,
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
		"mapIndex": 0,
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
		"mapIndex": 2,
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
		"mapIndex": 1,
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
"use strict";

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
	gw2api.getMatchDetailsState({world_slug: worldSlug}, callback);
}

},{"gw2api":7}],19:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var langs = require('gw2w2w-static').langs;
var worlds = require('gw2w2w-static').worlds;

module.exports = React.createClass({displayName: 'exports',	
	render: function() {
		var lang = this.props.lang;
		var world = this.props.world;

		langs = _.map(langs, function(lang){
			lang.link = '/' + lang.slug;

			if (world) {
				lang.link = lang.link + '/' + world[lang.slug].slug;
			} 

			return lang;
		});


		return (
			React.DOM.ul({className: "nav navbar-nav"}, 
				_.map(langs, function(l) {
					return (
						React.DOM.li({key: l.slug, className: (l.slug === lang.slug) ? 'active' : '', title: l.name}, 
							React.DOM.a({'data-slug': l.slug, href: l.link}, l.label)
						)
					);
				})
			)
		);
	},
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"gw2w2w-static":15}],20:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var RegionMatches = React.createFactory(require('./overview/RegionMatches.jsx'));
var RegionWorlds = React.createFactory(require('./overview/RegionWorlds.jsx'));

var worldsStatic = require('gw2w2w-static').worlds;



module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {matches: {}};
	},

	componentWillMount: function() {
	},

	componentDidMount: function() {
		this.updateTimer = null;
		this.getMatches();
	},

	componentWillUnmount: function() {
		clearTimeout(this.updateTimer);
	},
	
	render: function() {
		var lang = this.props.lang;

		var worlds = _.mapValues(worldsStatic, function(world) {
			world[lang.slug].id = world.id;
			world[lang.slug].region = world.region;
			world[lang.slug].link = '/' + lang.slug + '/' + world.slug;
			return world[lang.slug];
		});

		var matches = this.state.matches;

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
			React.DOM.div({id: "overview"}, 
				React.DOM.div({className: "row"}, 
					_.map(regions, function(region){
						return (
							React.DOM.div({className: "col-sm-12", key: region.label}, 
								RegionMatches({region: region, lang: lang})
							)
						);
					})
				), 

				React.DOM.hr(null), 

				React.DOM.div({className: "row"}, 
					_.map(regions, function(region){
						return (
							React.DOM.div({className: "col-sm-12", key: region.label}, 
								RegionWorlds({region: region, lang: lang})
							)
						);
					})
				)
			)
		);
	},



	getMatches: function() {
		var api = require('../api');
		var component = this;

		api.getMatches(function(err, data) {
			if (!err) {
				component.setState({matches: data});
			}
			
			var interval = _.random(2000, 4000);
			component.updateTimer = setTimeout(component.getMatches, interval);
		});

	},
});


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
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var async = (typeof window !== "undefined" ? window.async : typeof global !== "undefined" ? global.async : null);

var Scoreboard = React.createFactory(require('./tracker/Scoreboard.jsx'));
var Maps = React.createFactory(require('./tracker/Maps.jsx'));
var Guilds = React.createFactory(require('./tracker/guilds/Guilds.jsx'));

var staticData = require('gw2w2w-static');
var worldsStatic = staticData.worlds;

module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {
			match: [],
			details: [],
			guilds: {},
			lastmod: 0,
			timeOffset: 0,
		};
	},

	componentDidMount: function() {
		this.updateTimer = null;

		this.getMatchDetails();
	},

	componentWillUnmount: function() {
		clearTimeout(this.updateTimer);
	},

	// componentDidUpdate: function() {
	// 	// console.log(this.state);
	// 	// console.log(_.filter(this.state.objectives, function(o){ return o.lastCap !== 0; }));
	// },

	render: function() {
		var lang = this.props.lang;
		var world = this.props.world;

		var details = this.state.details;


		if (_.isEmpty(this.state.details) || this.state.details.initialized === false) {
			return null;
		}
		else {
			var timeOffset = this.state.timeOffset;
			var match = this.state.match;
			var guilds = this.state.guilds;

			var eventHistory = details.history;
			var scores = match.scores;
			var ticks = match.ticks;
			var holdings = match.holdings;

			var redWorld = worldsStatic[match.redId][lang.slug];
			var blueWorld = worldsStatic[match.blueId][lang.slug];
			var greenWorld = worldsStatic[match.greenId][lang.slug];

			var matchWorlds = {
				"red": {
					"world": redWorld,
					"score": scores[0],
					"tick": ticks[0],
					"holding": holdings[0],
				},
				"blue": {
					"world": blueWorld,
					"score": scores[1],
					"tick": ticks[1],
					"holding": holdings[1],
				},
				"green": {
					"world": greenWorld,
					"score": scores[2],
					"tick": ticks[2],
					"holding": holdings[2],
				},
			};

			setPageTitle(lang, world);


			var mapsMeta = [
				{
					'index': 0,
					'name': 'RedHome' ,
					'long': 'RedHome - ' + matchWorlds.red.name,
					'abbr': 'Red',
					'color': 'red',
					'world': matchWorlds.red
				}, {
					'index': 1,
					'name': 'GreenHome',
					'long': 'GreenHome - ' + matchWorlds.green.name,
					'abbr': 'Grn',
					'color': 'green',
					'world': matchWorlds.green
				}, {
					'index': 2,
					'name': 'BlueHome',
					'long': 'BlueHome - ' + matchWorlds.blue.name,
					'abbr': 'Blu',
					'color': 'blue',
					'world': matchWorlds.blue
				}, {
					'index': 3,
					'name': 'Eternal Battlegrounds',
					'long': 'Eternal Battlegrounds',
					'abbr': 'EBG',
					'color': 'neutral',
					'world': null
				},
			];

			return (
				React.DOM.div({id: "tracker"}, 

					Scoreboard({
						lang: lang, 
						matchWorlds: matchWorlds}
					), 

					Maps({
						timeOffset: timeOffset, 
						lang: lang, 
						details: details, 
						matchWorlds: matchWorlds, 
						mapsMeta: mapsMeta, 
						guilds: guilds}
					), 

					React.DOM.hr(null), 

					Guilds({
						lang: lang, 
						timeOffset: timeOffset, 
						guilds: guilds, 
						eventHistory: eventHistory, 
						mapsMeta: mapsMeta}
					)
					
				)
			);
		}

	},







	getMatchDetails: function() {
		var api = require('../api');

		var world = this.props.world;
		var lang = this.props.lang;
		var worldSlug = world[lang.slug].slug;

		api.getMatchDetailsByWorld(
			worldSlug,
			this.onMatchDetails
		);
	},

	onMatchDetails: function(err, data) {
		if (!err) {
			var msOffset = Date.now() - data.now;
			var secOffset = Math.floor(msOffset / 1000);

			this.setState({
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
				process.nextTick(queueGuildLookups.bind(this, guilds));
			}
		}

		var refreshTime = _.random(1000*2, 1000*4);
		this.updateTimer = setTimeout(this.getMatchDetails, refreshTime);
	},
});




function queueGuildLookups(guilds){
	var knownGuilds = _.keys(this.state.guilds);

	var newGuilds = _
		.chain(guilds)
		.uniq()
		.without(undefined, null)
		.difference(knownGuilds)
		.value();

	async.eachLimit(
		newGuilds,
		4,
		getGuildDetails.bind(this)
	);
}

function getGuildDetails(guildId, onComplete) {
	var api = require('../api');
	var component = this;

	api.getGuildDetails(
		guildId,
		function(err, data) {
			if(!err) {
				component.state.guilds[guildId] = data;
				component.setState({guilds: component.state.guilds});
			}
			onComplete();
		}
	);
}




function setPageTitle(lang, world) {
	var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
	var title = [world[lang.slug].name, 'gw2w2w'];

	if (lang.slug !== 'en') {
		title.push(lang.name);
	}

	$('title').text(title.join(' - '));
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../api":18,"./tracker/Maps.jsx":31,"./tracker/Scoreboard.jsx":32,"./tracker/guilds/Guilds.jsx":34,"_process":2,"gw2w2w-static":15}],22:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var worldsStatic = require('gw2w2w-static').worlds;


var Score = React.createFactory(require('./Score.jsx'));
var Pie = React.createFactory(require('./Pie.jsx'));

module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var match = this.props.match;
		var lang = this.props.lang;

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
			React.DOM.div({className: "matchContainer", key: match.id}, 
				React.DOM.table({className: "match"}, 
					_.map(matchWorlds, function(mw, color) {
						var world = mw.world;
						var score = mw.score;

						var href = ['', lang.slug, world.slug].join('/');
						var label = world.name;

						return (
							React.DOM.tr({key: color}, 
								React.DOM.td({className: "team name " + color}, 
									React.DOM.a({href: href}, label)
								), 
								React.DOM.td({className: "team score " + color}, 
									Score({
										key: match.id, 
										matchId: match.id, 
										team: color, 
										score: score}
									)
								), 
								(color === 'red') ?
									React.DOM.td({rowSpan: "3", className: "pie"}, Pie({scores: match.scores, size: "60", matchId: match.id})) :
									null
								
							)
						);
					})
				)
			)
		);
	},
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Pie.jsx":23,"./Score.jsx":26,"gw2w2w-static":15}],23:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);


module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var size = this.props.size || '60';
		var stroke = this.props.stroke || 2;
		var scores = this.props.scores || [];

		var pieSrc = 'http://www.piely.net/' + size + '/' + scores.join(',') + '?strokeWidth=' + stroke;

		return (
			(scores.length) ?
				React.DOM.img({
					width: "60", height: "60", 
					key: 'pie-' + this.props.matchId, 
					src: pieSrc}
				) :
				React.DOM.span(null)
		);
	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var Match = React.createFactory(require('./Match.jsx'));

module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var region = this.props.region;
		var lang = this.props.lang;

		return (
			React.DOM.div({className: "RegionMatches"}, 
				React.DOM.h2(null, region.label), 
				_.map(region.matches, function(match){
					return (
						Match({
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
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Match.jsx":22}],25:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var worldsStatic = require('gw2w2w-static').worlds;

module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var lang = this.props.lang;
		var region = this.props.region;

		var label = region.label + ' Worlds';
		var regionId = region.id;

		var worlds = _.chain(worldsStatic)
			.filter(function(w){return w.region == regionId;})
			.sortBy(function(w){return w[lang.slug].name;})
			.value();

		return (
			React.DOM.div({className: "RegionWorlds"}, 
				React.DOM.h2(null, label), 
				React.DOM.ul({className: "list-unstyled"}, 
					_.map(worlds, function(world){
						var href = ['', lang.slug, world[lang.slug].slug].join('/');
						var label = world[lang.slug].name;
						
						return (
							React.DOM.li({key: world.id}, 
								React.DOM.a({href: href}, label)
							)
						);
					})
				)
			)
		);
	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"gw2w2w-static":15}],26:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);


module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {diff: 0};
	},

	componentWillReceiveProps: function(nextProps){
		// console.log('Score::componentWillReceiveProps', nextProps.score, this.props.score);
		this.setState({diff: nextProps.score - this.props.score});
	},

	componentDidUpdate: function() {
		if(this.state.diff > 0) {
			var $diff = $('.diff', this.getDOMNode());

			// $diff
			// 	.hide()
			// 	.fadeIn(400)
			// 	.delay(4000)
			// 	.fadeOut(2000);
			$diff
				.velocity('fadeOut', {duration: 0})
				.velocity('fadeIn', {duration: 200})
				.velocity('fadeOut', {duration: 1200, delay: 400});
		}
	},

	render: function() {
		var matchId = this.props.matchId;
		var team = this.props.team;
		var score = this.props.score || 0;

		return (
			React.DOM.span(null, 
				React.DOM.span({className: "diff"}, 
					(this.state.diff) ?
						'+' + numeral(this.state.diff).format('0,0') :
						null
				), 
				React.DOM.span({className: "value"}, numeral(score).format('0,0'))
			)
		);
	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],27:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);


module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var meta = this.props.oMeta;

		if (meta.d) {
			var src = ['/img/icons/dist/arrow'];

			if (meta.n) {src.push('north'); }
			else if (meta.s) {src.push('south'); }

			if (meta.w) {src.push('west'); }
			else if (meta.e) {src.push('east'); }

			return (
				React.DOM.span({className: "direction"}, 
					React.DOM.img({src: src.join('-') + '.svg'})
				)
			);
		}
		else {
			return React.DOM.span({className: "direction"});
		}
	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);


var MapSection = React.createFactory(require('./MapSection.jsx'));

var staticData = require('gw2w2w-static');
var objectivesData = staticData.objectives;
var colorMap = ['red', 'green', 'blue'];

module.exports = React.createClass({displayName: 'exports',

	render: function() {
		var dateNow = this.props.dateNow;
		var timeOffset = this.props.timeOffset;
		var lang = this.props.lang;
		var details = this.props.details;
		var guilds = this.props.guilds;
		var matchWorlds = this.props.matchWorlds;
		var mapsMeta = this.props.mapsMeta;
		var mapIndex = this.props.mapIndex;

		var owners = details.objectives.owners;
		var claimers = details.objectives.claimers;

		var scores = _.map(details.maps.scores[mapIndex], function(score) {return numeral(score).format('0,0');});
		var ticks = details.maps.ticks[mapIndex];
		var holdings = details.maps.holdings[mapIndex];

		// var mapConfig = this.props.mapConfig;
		// var mapScores = this.props.mapsScores[mapConfig.mapIndex];
		// var mapName = this.props.mapName;
		// var mapColor = this.props.mapColor;


		var metaIndex = [3,0,2,1]; // output in different order than original data

		var mapMeta = mapsMeta[metaIndex[mapIndex]];
		var mapName = mapMeta.name;
		var mapColor = mapMeta.color;
		var mapConfig = staticData.objective_map[mapIndex];

		return (
			React.DOM.div({className: "map"}, 

				React.DOM.div({className: "mapScores"}, 
					React.DOM.h2({className: 'team ' + mapColor, onClick: this.onTitleClick}, 
						mapName
					), 
					React.DOM.ul({className: "list-inline"}, 
						_.map(scores, function(score, scoreIndex) {
							return (
								React.DOM.li({key: 'map-score-' + scoreIndex, className: getScoreClass(scoreIndex)}, 
									score
								)
							);
						})
					)
				), 

				React.DOM.div({className: "row"}, 
					_.map(mapConfig.sections, function(mapSection, secIndex) {

						var sectionClass = [
							'col-md-24',
							'map-section',
						];

						if (mapConfig.key === 'Center') {
							if (mapSection.label === 'Castle') {
								sectionClass.push('col-sm-24');
							}
							else {
								sectionClass.push('col-sm-8');
							}
						}
						else {
							sectionClass.push('col-sm-8');
						}

						return (
							React.DOM.div({className: sectionClass.join(' '), key: mapConfig.key + '-' + mapSection.label}, 
								MapSection({
									dateNow: dateNow, 
									timeOffset: timeOffset, 
									lang: lang, 
									mapSection: mapSection, 
									owners: owners, 
									claimers: claimers, 
									guilds: guilds}
								)
							)
						);
					})
				)


			)
		);
	},

	onTitleClick: function(e) {
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
	},
});


function getScoreClass(scoreIndex) {
	return ['team', colorMap[scoreIndex]].join(' ');
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./MapSection.jsx":30,"gw2w2w-static":15}],29:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var moment = (typeof window !== "undefined" ? window.moment : typeof global !== "undefined" ? global.moment : null);

 
var Sprite = React.createFactory(require('./Sprite.jsx'));
var Arrow = React.createFactory(require('./Arrow.jsx'));

var staticData = require('gw2w2w-static');
var objectivesNames = staticData.objective_names;
var objectivesTypes = staticData.objective_types;
var objectivesMeta = staticData.objective_meta;
var objectivesLabels = staticData.objective_labels;

module.exports = React.createClass({displayName: 'exports',

	render: function() {
		var dateNow = this.props.dateNow;
		var timeOffset = this.props.timeOffset;
		var nowOffset = dateNow + timeOffset;


		var lang = this.props.lang;
		var objectiveId = this.props.objectiveId;
		var owner = this.props.owner;
		var claimer = this.props.claimer;
		var guilds = this.props.guilds;


		if (!_.has(objectivesMeta, objectiveId)) {
			// short circuit
			return null;
		}

		var oMeta = objectivesMeta[objectiveId];
		var oName = objectivesNames[objectiveId];
		var oLabel = objectivesLabels[objectiveId];
		var oType = objectivesTypes[oMeta.type];

		var offsetTimestamp = owner.timestamp + timeOffset;
		var expires = offsetTimestamp + (5 * 60);
		var timerActive = (expires >= dateNow + 5); // show for 5 seconds after expiring
		var secondsRemaining = expires - dateNow;
		var expiration = moment(secondsRemaining * 1000);


		// console.log(objective.lastCap, objective.expires, now, objective.expires > now);

		var className = [
			'objective',
			'team', 
			owner.world,
		].join(' ');

		var timerClass = [
			'timer',
			(timerActive) ? 'active' : 'inactive',
		].join(' ');

		var tagClass = [
			'tag',
		].join(' ');

		var timerHtml = (timerActive) ? expiration.format('m:ss') : '0:00';

		return (
			React.DOM.div({className: className}, 
				React.DOM.div({className: "objective-icons"}, 
					Arrow({oMeta: oMeta}), 
 					Sprite({type: oType.name, color: owner.world})
				), 
				React.DOM.div({className: "objective-label"}, 
					React.DOM.span(null, oLabel[lang.slug])
				), 
				React.DOM.div({className: "objective-state"}, 
					renderGuild(claimer, guilds), 
					React.DOM.span({className: timerClass}, timerHtml)
				)
			)
		);
	},
});

function renderGuild(claimer, guilds){
	if (!claimer) {
		return null;
	}
	else {
		var guild = guilds[claimer.guild];

		var guildClass = [
			'guild',
			'tag',
			'pending'
		].join(' ');

		if(!guild) {
			return React.DOM.span({className: guildClass}, React.DOM.i({className: "fa fa-spinner fa-spin"}));
		}
		else {
			return React.DOM.a({className: guildClass, href: '#' + claimer.guild, title: guild.guild_name}, guild.tag);
		}
	}
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Arrow.jsx":27,"./Sprite.jsx":33,"gw2w2w-static":15}],30:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);


var MapObjective = React.createFactory(require('./MapObjective.jsx'));


module.exports = React.createClass({displayName: 'exports',

	render: function() {

		var dateNow = this.props.dateNow;
		var timeOffset = this.props.timeOffset;
		var lang = this.props.lang;
		var mapSection = this.props.mapSection;
		var owners = this.props.owners;
		var claimers = this.props.claimers;
		var guilds = this.props.guilds;

		return (
			React.DOM.ul({className: "list-unstyled"}, 
				_.map(mapSection.objectives, function(objectiveId) {

					var owner = owners[objectiveId];
					var claimer = claimers[objectiveId];
					// var claimer = (claimer && guilds[guildId]) ? guilds[guildId] : null;

					return (
						React.DOM.li({key: objectiveId, id: 'objective-' + objectiveId}, 
							MapObjective({
								dateNow: dateNow, 
								timeOffset: timeOffset, 
								lang: lang, 
								objectiveId: objectiveId, 
								owner: owner, 
								claimer: claimer, 
								guilds: guilds}
							)
						)
					);

				})
			)
		);
	},
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./MapObjective.jsx":29}],31:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);


var MapDetails = React.createFactory(require('./MapDetails.jsx'));
var Log = React.createFactory(require('./log/Log.jsx'));

var libDate = require('../../lib/date.js');

var staticData = require('gw2w2w-static');
var mapsConfig = staticData.objective_map;

module.exports = React.createClass({displayName: 'exports',

	getInitialState: function() {
		return {dateNow: libDate.dateNow()};
	},
	tick: function() {
		this.setState({dateNow: libDate.dateNow()});
	},
	componentDidMount: function() {
		this.interval = setInterval(this.tick, 1000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},


	render: function() {
		if (!this.props.details.initialized) {
			return null;
		}

		var dateNow = this.state.dateNow;
		var timeOffset = this.props.timeOffset;

		var lang = this.props.lang;
		var details = this.props.details;
		var matchWorlds = this.props.matchWorlds;
		var mapsMeta = this.props.mapsMeta;
		var guilds = this.props.guilds;
		
		var eventHistory = details.history;


		return (
			React.DOM.div({id: "maps"}, 
				React.DOM.div({className: "row"}, 
					React.DOM.div({className: "col-md-6"}, 
						MapDetails({
							dateNow: dateNow, 
							timeOffset: timeOffset, 
							lang: lang, 
							details: details, 
							guilds: guilds, 
							matchWorlds: matchWorlds, 
							mapsMeta: mapsMeta, 
							mapIndex: 0}
						)
					), 
					React.DOM.div({className: "col-md-18"}, 

						React.DOM.div({className: "row"}, 
							React.DOM.div({className: "col-md-8"}, 
								MapDetails({
									dateNow: dateNow, 
									timeOffset: timeOffset, 
									lang: lang, 
									details: details, 
									guilds: guilds, 
									matchWorlds: matchWorlds, 
									mapsMeta: mapsMeta, 
									mapIndex: 1}
								)
							), 
							React.DOM.div({className: "col-md-8"}, 
								MapDetails({
									dateNow: dateNow, 
									timeOffset: timeOffset, 
									lang: lang, 
									details: details, 
									guilds: guilds, 
									matchWorlds: matchWorlds, 
									mapsMeta: mapsMeta, 
									mapIndex: 2}
								)
							), 
							React.DOM.div({className: "col-md-8"}, 
								MapDetails({
									dateNow: dateNow, 
									timeOffset: timeOffset, 
									lang: lang, 
									details: details, 
									guilds: guilds, 
									matchWorlds: matchWorlds, 
									mapsMeta: mapsMeta, 
									mapIndex: 3}
								)
							)
						), 
						
						React.DOM.div({className: "row"}, 
							React.DOM.div({className: "col-md-24"}, 
								Log({
									dateNow: dateNow, 
									timeOffset: timeOffset, 
									lang: lang, 
									guilds: guilds, 
									eventHistory: eventHistory, 
									matchWorlds: matchWorlds, 
									mapsMeta: mapsMeta}
								)
							)
						)

					)
				 )
			)
		);
	},
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../lib/date.js":38,"./MapDetails.jsx":28,"./log/Log.jsx":36,"gw2w2w-static":15}],32:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);

var Sprite = React.createFactory(require('./Sprite.jsx'));
var staticData = require('gw2w2w-static');
var objectiveTypes = staticData.objective_types;

module.exports = React.createClass({displayName: 'exports',

	render: function() {
		var lang = this.props.lang;
		var matchWorlds = this.props.matchWorlds;

		return (
			React.DOM.div({className: "row", id: "scoreboards"}, 
				_.map(matchWorlds, function(mw, color) {
					var world = mw.world;
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
						React.DOM.div({className: "col-sm-8", key: color}, 
							React.DOM.div({className: scoreboardClass}, 

								React.DOM.h1(null, world.name), 
								React.DOM.h2(null, numeral(score).format('0,0'), " +", tick), 

								React.DOM.ul({className: "list-inline"}, 
									_.map(holdings, function(holding, ixHolding) {
										var oType = objectiveTypes[ixHolding + 1];

										return (
											React.DOM.li({key: ixHolding}, 
												Sprite({type: oType.name, color: color}), " x ", holding
											)
										);
									})
								)

							)
						)
					);
				})
			)
		);
	}
});

/*


								<ul className="list-inline">
									{_.map(holdings, function(holding, ixHolding) {
										var ot = objectiveTypes[ixHolding + 1];

										return (
											<li key={'type-holdings-' + ot.name}>
												<Sprite type={ot.name} color={colors[scoreIndex]} /> x {ot.holdings[scoreIndex]}
											</li>
										);
									})}
								</ul>
*/
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Sprite.jsx":33,"gw2w2w-static":15}],33:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var type = this.props.type;
		var color = this.props.color;

		return (
			React.DOM.span({className: ['sprite', type, color].join(' ')})
		);
	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],34:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);


var Objective = React.createFactory(require('./Objective.jsx'));

module.exports = React.createClass({displayName: 'exports',

	render: function() {
		var timeOffset = this.props.timeOffset;
		var dateNow = this.props.dateNow;
		var lang = this.props.lang;
		var eventHistory = this.props.eventHistory;
		var mapsMeta = this.props.mapsMeta;

		var guilds = _
			.chain(this.props.guilds)
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


		var guildsList = _.map(guilds, function(guild, guildId) {
			return (
				React.DOM.div({key: guild.guild_id, id: guild.guild_id, className: "guild"}, 
					React.DOM.div({className: "row"}, 
						React.DOM.div({className: "col-sm-4"}, 
							React.DOM.img({className: "emblem", src: getEmblemSrc(guild.guild_name)})
						), 
						React.DOM.div({className: "col-sm-20"}, 
							React.DOM.h1(null, guild.guild_name, " [", guild.tag, "]"), 
							React.DOM.ul({className: "list-unstyled"}, 
								_.map(guild.claims, function(entry, ixEntry) {
									return (
										React.DOM.li({key: guild.guild_id + '-' + ixEntry}, 
											Objective({
												timeOffset: timeOffset, 
												dateNow: dateNow, 
												lang: lang, 
												entry: entry, 
												ixEntry: ixEntry, 
												mapsMeta: mapsMeta}
											)
										)
									);
								})
							)
						)
					)
				)
			);
		});


		return (
			React.DOM.div({className: "list-unstyled", id: "guilds"}, 
				guildsList
			)
		);
	},
});

function getEmblemSrc(guildName) {
	return 'http://guilds.gw2w2w.com/guilds/' + encodeURIComponent(guildName.replace(/ /g, '-')) + '/64.svg';
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Objective.jsx":35}],35:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var moment = (typeof window !== "undefined" ? window.moment : typeof global !== "undefined" ? global.moment : null);


var Sprite = React.createFactory(require('../Sprite.jsx'));
var Arrow = React.createFactory(require('../Arrow.jsx'));


var staticData = require('gw2w2w-static');
var objectivesNames = staticData.objective_names;
var objectivesTypes = staticData.objective_types;
var objectivesMeta = staticData.objective_meta;
var objectivesLabels = staticData.objective_labels;


module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var timeOffset = this.props.timeOffset;
		var lang = this.props.lang;
		var entry = this.props.entry;
		var ixEntry = this.props.ixEntry;
		var guilds = this.props.guilds;
		var mapsMeta = this.props.mapsMeta;


		if (!_.has(objectivesMeta, entry.objectiveId)) {
			// short circuit
			return null;
		}

		var oMeta = objectivesMeta[entry.objectiveId];
		var oName = objectivesNames[entry.objectiveId];
		var oLabel = objectivesLabels[entry.objectiveId];
		var oType = objectivesTypes[oMeta.type];
		
		var timestamp = moment((entry.timestamp + timeOffset) * 1000);


		var className = [
			'objective',
			'team', 
			entry.world,
		].join(' ');

		var mapMeta = mapsMeta[oMeta.map];


		return (
			React.DOM.div({className: className, key: ixEntry}, 
				React.DOM.div({className: "objective-relative"}, 
					React.DOM.span(null, timestamp.twitterShort())
				), 
				React.DOM.div({className: "objective-timestamp"}, 
					timestamp.format('hh:mm:ss')
				), 
				React.DOM.div({className: "objective-map"}, 
					React.DOM.span({title: mapMeta.name}, mapMeta.abbr)
				), 
				React.DOM.div({className: "objective-icons"}, 
					Arrow({oMeta: oMeta}), 
 					Sprite({type: oType.name, color: entry.world})
				), 
				React.DOM.div({className: "objective-label"}, 
					React.DOM.span(null, oLabel[lang.slug])
				)
			)
		);
	},
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Arrow.jsx":27,"../Sprite.jsx":33,"gw2w2w-static":15}],36:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

var Objective = React.createFactory(require('./Objective.jsx'));

var staticData = require('gw2w2w-static');
var objectivesMeta = staticData.objective_meta;


module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {
			mapFilter: 'all',
			eventFilter: 'all',
		};
	},

	render: function() {
		var dateNow = this.props.dateNow;
		var timeOffset = this.props.timeOffset;
		var lang = this.props.lang;
		var guilds = this.props.guilds;
		var matchWorlds = this.props.matchWorlds;
		var mapsMeta = this.props.mapsMeta;

		var setWorld = this.setWorld;
		var setEvent = this.setEvent;

		var eventFilter = this.state.eventFilter;
		var mapFilter = this.state.mapFilter;

		var eventHistory = _.chain(this.props.eventHistory)
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
				var key = entry.timestamp + '-' + entry.objectiveId  + '-' + entry.type; 
				return (
					React.DOM.li({key: key, className: "transition"}, 
						Objective({
							dateNow: dateNow, 
							timeOffset: timeOffset, 
							lang: lang, 
							entry: entry, 
							guilds: guilds, 
							ixEntry: ixEntry, 
							matchWorlds: matchWorlds, 
							mapsMeta: mapsMeta}
						)
					)
				);
			})
			.value();

		return (
			React.DOM.div({id: "log-container"}, 

				React.DOM.div({className: "log-tabs"}, 
					React.DOM.div({className: "row"}, 
						React.DOM.div({className: "col-sm-16"}, 
							React.DOM.ul({id: "log-map-filters", className: "nav nav-pills"}, 
								React.DOM.li({className: (mapFilter == 'all') ? 'active': 'null'}, 
									React.DOM.a({onClick: setWorld, 'data-filter': "all"}, "All")
								), 

								_.map([
									mapsMeta[3],
									mapsMeta[0],
									mapsMeta[2],
									mapsMeta[1],
								], function(mapMeta, i) {
									return (
										React.DOM.li({key: mapMeta.index, className: (mapFilter === mapMeta.index) ? 'active': 'null'}, 
											React.DOM.a({onClick: setWorld, 'data-filter': mapMeta.index}, mapMeta.name)
										)
									);
								})
							)
						), 
						React.DOM.div({className: "col-sm-8"}, 
							React.DOM.ul({id: "log-event-filters", className: "nav nav-pills"}, 
								React.DOM.li({className: (eventFilter === 'claim') ? 'active': 'null'}, 
									React.DOM.a({onClick: setEvent, 'data-filter': "claim"}, "Claims")
								), 
								React.DOM.li({className: (eventFilter === 'capture') ? 'active': 'null'}, 
									React.DOM.a({onClick: setEvent, 'data-filter': "capture"}, "Captures")
								), 
								React.DOM.li({className: (eventFilter === 'all') ? 'active': 'null'}, 
									React.DOM.a({onClick: setEvent, 'data-filter': "all"}, "All")
								)
							)
						)
					)
				), 

				React.DOM.ul({className: "list-unstyled", id: "log"}, 
					eventHistory
				)

			)
		);
	},

	setWorld: function(e) {
		var filter = $(e.target).data('filter');
		this.setState({mapFilter: filter});
	},
	setEvent: function(e) {
		var filter = $(e.target).data('filter');
		this.setState({eventFilter: filter});
	},
});

/*

*/

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Objective.jsx":37,"gw2w2w-static":15}],37:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var moment = (typeof window !== "undefined" ? window.moment : typeof global !== "undefined" ? global.moment : null);

var Sprite = React.createFactory(require('../Sprite.jsx'));
var Arrow = React.createFactory(require('../Arrow.jsx'));

var libDate = require('../../../lib/date.js');

var staticData = require('gw2w2w-static');
var objectivesNames = staticData.objective_names;
var objectivesTypes = staticData.objective_types;
var objectivesMeta = staticData.objective_meta;
var objectivesLabels = staticData.objective_labels;

module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var dateNow = this.props.dateNow;
		var timeOffset = this.props.timeOffset;
		var nowOffset = dateNow + timeOffset;

		var lang = this.props.lang;
		var entry = this.props.entry;
		var ixEntry = this.props.ixEntry;
		var guilds = this.props.guilds;
		var matchWorlds = this.props.matchWorlds;
		var mapsMeta = this.props.mapsMeta;


		if (!_.has(objectivesMeta, entry.objectiveId)) {
			// short circuit
			return null;
		}

		var oMeta = objectivesMeta[entry.objectiveId];
		var oName = objectivesNames[entry.objectiveId];
		var oLabel = objectivesLabels[entry.objectiveId];
		var oType = objectivesTypes[oMeta.type];

		var expires = entry.timestamp + (5 * 60);
		var timerActive = (expires >= nowOffset + 5); // show  after expiring
		var secondsRemaining = expires - nowOffset;
		var expiration = moment(secondsRemaining * 1000);

		var timestamp = moment((entry.timestamp + timeOffset) * 1000);


		var className = [
			'objective',
			'team', 
			entry.world,
		].join(' ');

		var mapMeta = mapsMeta[oMeta.map];


		return (
			React.DOM.div({className: className, key: ixEntry}, 
				React.DOM.div({className: "objective-relative"}, 
					React.DOM.span(null, timestamp.twitterShort())
				), 
				React.DOM.div({className: "objective-timestamp"}, 
					timestamp.format('hh:mm:ss')
				), 
				React.DOM.div({className: "objective-map"}, 
					React.DOM.span({title: mapMeta.name}, mapMeta.abbr)
				), 
				React.DOM.div({className: "objective-icons"}, 
					Arrow({oMeta: oMeta}), 
 					Sprite({type: oType.name, color: entry.world})
				), 
				React.DOM.div({className: "objective-label"}, 
					React.DOM.span(null, oLabel[lang.slug])
				), 
				React.DOM.div({className: "objective-guild"}, 
					renderGuild(entry.guild, guilds)
				)
			)
		);
	},
});


function renderGuild(guildId, guilds) {
	if (!guildId) {
		return null;
	}
	else {
		var guild = guilds[guildId];

		var guildClass = [
			'guild',
			'name',
			'pending'
		].join(' ');

		if(!guild) {
			return React.DOM.span({className: guildClass}, React.DOM.i({className: "fa fa-spinner fa-spin"}));
		}
		else {
			return React.DOM.span(null, 
				React.DOM.a({className: guildClass, href: '#' + guildId, title: guild.guild_name}, guild.guild_name, " [", guild.tag, "]")
			);
		}
	}
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../../lib/date.js":38,"../Arrow.jsx":27,"../Sprite.jsx":33,"gw2w2w-static":15}],38:[function(require,module,exports){
"use strict";

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

},{}],39:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var Overview = React.createFactory(require('./jsx/Overview.jsx'));

var Langs = React.createFactory(require('./jsx/Langs.jsx'));
var langs = require('gw2w2w-static').langs;

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug || 'en';
	var lang = langs[langSlug];

	React.render(Langs({lang: lang}), document.getElementById('nav-langs'));
	React.render(Overview({lang: lang}), document.getElementById('content'));
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./jsx/Langs.jsx":19,"./jsx/Overview.jsx":20,"gw2w2w-static":15}],40:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var Tracker = React.createFactory(require('./jsx/Tracker.jsx'));

var Langs = React.createFactory(require('./jsx/Langs.jsx'));
var langs = require('gw2w2w-static').langs;
var worlds = require('gw2w2w-static').worlds;

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug;
	var lang = langs[langSlug];

	var worldSlug = ctx.params.worldSlug;
	var world = _.find(worlds, function(world) {
		return world[lang.slug].slug === worldSlug;
	});


	React.render(Langs({lang: lang, world: world}), document.getElementById('nav-langs'));
	React.render(Tracker({lang: lang, world: world}), document.getElementById('content'));
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./jsx/Langs.jsx":19,"./jsx/Tracker.jsx":21,"gw2w2w-static":15}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi9wdWJsaWMvanMvc3JjL2FwcC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZGVjb2RlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3Qvbm9kZV9tb2R1bGVzL2d3MmFwaS9saWIvZ2V0RGF0YUJyb3dzZXIuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3Qvbm9kZV9tb2R1bGVzL2d3MmFwaS9tYWluLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvbGFuZ3MuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3Qvbm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVfbGFiZWxzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21hcC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9ub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZV9tZXRhLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX25hbWVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX3R5cGVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvd29ybGRfbmFtZXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3Qvbm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3Qvbm9kZV9tb2R1bGVzL3BhZ2UvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3Qvbm9kZV9tb2R1bGVzL3BhZ2Uvbm9kZV9tb2R1bGVzL3BhdGgtdG8tcmVnZXhwL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvYXBpLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L0xhbmdzLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC9PdmVydmlldy5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvVHJhY2tlci5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvb3ZlcnZpZXcvTWF0Y2guanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L292ZXJ2aWV3L1BpZS5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvb3ZlcnZpZXcvUmVnaW9uTWF0Y2hlcy5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvb3ZlcnZpZXcvUmVnaW9uV29ybGRzLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC9vdmVydmlldy9TY29yZS5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9BcnJvdy5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9NYXBEZXRhaWxzLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC90cmFja2VyL01hcE9iamVjdGl2ZS5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9NYXBTZWN0aW9uLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC90cmFja2VyL01hcHMuanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L3RyYWNrZXIvU2NvcmVib2FyZC5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9TcHJpdGUuanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L3RyYWNrZXIvZ3VpbGRzL0d1aWxkcy5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9ndWlsZHMvT2JqZWN0aXZlLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC90cmFja2VyL2xvZy9Mb2cuanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L3RyYWNrZXIvbG9nL09iamVjdGl2ZS5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9saWIvZGF0ZS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL292ZXJ2aWV3LmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL3RyYWNrZXIuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOS9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Um91dGluZ1xyXG4qXHJcbiovXHJcblxyXG52YXIgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UnKTtcclxucGFnZSgnLzpsYW5nU2x1ZyhlbnxkZXxlc3xmcik/JywgcmVxdWlyZSgnLi9vdmVydmlldy5qc3gnKSk7XHJcbnBhZ2UoJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpLzp3b3JsZFNsdWcoW2Etei1dKyknLCByZXF1aXJlKCcuL3RyYWNrZXIuanN4JykpO1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuXHRwYWdlLnN0YXJ0KHtcclxuXHRcdGNsaWNrOiB0cnVlLFxyXG5cdFx0cG9wc3RhdGU6IGZhbHNlLFxyXG5cdFx0ZGlzcGF0Y2g6IHRydWUsXHJcblx0fSk7XHJcbn0pO1xyXG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuIiwiLypcclxuKlx0cGFja2FnZS5qc29uIHJlcXdyaXRlcyB0byB0aGlzIGZyb20gZ2V0RGF0YS5qcyBmb3IgQnJvd3NlcmlmeVxyXG4qL1xyXG5cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXF1ZXN0SnNvbihyZXF1ZXN0VXJsLCBmbkNhbGxiYWNrKSB7XHJcblx0cmVxdWVzdENsaWVudChyZXF1ZXN0VXJsLCBmbkNhbGxiYWNrKTtcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiByZXF1ZXN0Q2xpZW50KHJlcXVlc3RVcmwsIGZuQ2FsbGJhY2spIHtcclxuXHRpZiAoIXdpbmRvdyB8fCAhd2luZG93LmpRdWVyeSkge1xyXG5cdFx0dGhyb3cgKCdndzJhcGkgcmVxdWlyZXMgalF1ZXJ5IHdoZW4gdXNlZCBpbiB0aGUgYnJvd3NlcicpO1xyXG5cdH1cclxuXHR3aW5kb3cualF1ZXJ5LmdldEpTT04ocmVxdWVzdFVybClcclxuXHRcdC5kb25lKGZ1bmN0aW9uKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XHJcblx0XHRcdGZuQ2FsbGJhY2sobnVsbCwgZGF0YSk7XHJcblx0XHR9KVxyXG5cdFx0LmZhaWwoZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XHJcblx0XHRcdGZuQ2FsbGJhY2soe1xyXG5cdFx0XHRcdGpxWEhSOiBqcVhIUixcclxuXHRcdFx0XHR0ZXh0U3RhdHVzOiB0ZXh0U3RhdHVzLFxyXG5cdFx0XHRcdGVycm9yVGhyb3duOiBlcnJvclRocm93blxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qXHJcbipcclxuKlx0aHR0cHM6Ly9naXRodWIuY29tL2Zvb2V5L25vZGUtZ3cyXHJcbiogICBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSTpNYWluXHJcbipcclxuKi9cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIERFRklORSBFWFBPUlRcclxuKlxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0TWF0Y2hlczogZ2V0TWF0Y2hlcyxcclxuXHRnZXRNYXRjaGVzU3RhdGU6IGdldE1hdGNoZXNTdGF0ZSxcclxuXHRnZXRPYmplY3RpdmVOYW1lczogZ2V0T2JqZWN0aXZlTmFtZXMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzOiBnZXRNYXRjaERldGFpbHMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzU3RhdGU6IGdldE1hdGNoRGV0YWlsc1N0YXRlLFxyXG5cclxuXHRnZXRJdGVtczogZ2V0SXRlbXMsXHJcblx0Z2V0SXRlbURldGFpbHM6IGdldEl0ZW1EZXRhaWxzLFxyXG5cdGdldFJlY2lwZXM6IGdldFJlY2lwZXMsXHJcblx0Z2V0UmVjaXBlRGV0YWlsczogZ2V0UmVjaXBlRGV0YWlscyxcclxuXHJcblx0Z2V0V29ybGROYW1lczogZ2V0V29ybGROYW1lcyxcclxuXHRnZXRHdWlsZERldGFpbHM6IGdldEd1aWxkRGV0YWlscyxcclxuXHJcblx0Z2V0TWFwTmFtZXM6IGdldE1hcE5hbWVzLFxyXG5cdGdldENvbnRpbmVudHM6IGdldENvbnRpbmVudHMsXHJcblx0Z2V0TWFwczogZ2V0TWFwcyxcclxuXHRnZXRNYXBGbG9vcjogZ2V0TWFwRmxvb3IsXHJcblxyXG5cdGdldEJ1aWxkOiBnZXRCdWlsZCxcclxuXHRnZXRDb2xvcnM6IGdldENvbG9ycyxcclxuXHJcblx0Z2V0RmlsZXM6IGdldEZpbGVzLFxyXG5cdGdldEZpbGU6IGdldEZpbGUsXHJcblx0Z2V0RmlsZVJlbmRlclVybDogZ2V0RmlsZVJlbmRlclVybCxcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFBSSVZBVEUgUFJPUEVSVElFU1xyXG4qXHJcbiovXHJcblxyXG52YXIgZW5kUG9pbnRzID0ge1xyXG5cdHdvcmxkTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92Mi93b3JsZHMnLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjIvd29ybGRzP3BhZ2U9MFxyXG5cclxuXHRndWlsZERldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9ndWlsZF9kZXRhaWxzLmpzb24nLFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvZ3VpbGRfZGV0YWlsc1xyXG5cclxuXHRpdGVtczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL2l0ZW1zLmpzb24nLFx0XHRcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9pdGVtc1xyXG5cdGl0ZW1EZXRhaWxzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb212MS9pdGVtX2RldGFpbHMuanNvbicsXHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL2l0ZW1fZGV0YWlsc1xyXG5cdHJlY2lwZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9yZWNpcGVzLmpzb24nLFx0XHRcdFx0XHRcdC8vIGh0dHA6Ly93aWtpLmd1aWxkd2FyczIuY29tL3dpa2kvQVBJOjEvcmVjaXBlc1xyXG5cdHJlY2lwZURldGFpbHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9yZWNpcGVfZGV0YWlscy5qc29uJyxcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3JlY2lwZV9kZXRhaWxzXHJcblxyXG5cdG1hcE5hbWVzOiAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvbWFwX25hbWVzLmpzb24nLFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL21hcF9uYW1lc1xyXG5cdGNvbnRpbmVudHM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9jb250aW5lbnRzLmpzb24nLFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9jb250aW5lbnRzXHJcblx0bWFwczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL21hcHMuanNvbicsXHRcdFx0XHRcdFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL21hcHNcclxuXHRtYXBGbG9vcjogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL21hcF9mbG9vci5qc29uJyxcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS9tYXBfZmxvb3JcclxuXHJcblx0b2JqZWN0aXZlTmFtZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS93dncvb2JqZWN0aXZlX25hbWVzLmpzb24nLFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS93dncvbWF0Y2hlc1xyXG5cdG1hdGNoZXM6ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS93dncvbWF0Y2hlcy5qc29uJyxcdFx0XHRcdFx0Ly8gaHR0cDovL3dpa2kuZ3VpbGR3YXJzMi5jb20vd2lraS9BUEk6MS93dncvbWF0Y2hfZGV0YWlsc1xyXG5cdG1hdGNoRGV0YWlsczogJ2h0dHBzOi8vYXBpLmd1aWxkd2FyczIuY29tL3YxL3d2dy9tYXRjaF9kZXRhaWxzLmpzb24nLFx0XHQvLyBodHRwOi8vd2lraS5ndWlsZHdhcnMyLmNvbS93aWtpL0FQSToxL3d2dy9vYmplY3RpdmVfbmFtZXNcclxuXHJcblx0bWF0Y2hlc1N0YXRlOiAnaHR0cDovL3N0YXRlLmd3Mncydy5jb20vbWF0Y2hlcycsXHJcblx0bWF0Y2hEZXRhaWxzU3RhdGU6ICdodHRwOi8vc3RhdGUuZ3cydzJ3LmNvbS8nLFxyXG59O1xyXG5cclxuXHJcblxyXG4vKlxyXG4qXHJcbiogICBQVUJMSUMgTUVUSE9EU1xyXG4qXHJcbiovXHJcblxyXG5cclxuXHJcbi8qXHJcbipcdFdPUkxEIHZzIFdPUkxEXHJcbiovXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRPYmplY3RpdmVOYW1lcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnb2JqZWN0aXZlTmFtZXMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0TWF0Y2hlcyhjYWxsYmFjaykge1xyXG5cdGdldCgnbWF0Y2hlcycsIHt9LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcclxuXHRcdHZhciB3dndfbWF0Y2hlcyA9IChkYXRhICYmIGRhdGEud3Z3X21hdGNoZXMpID8gZGF0YS53dndfbWF0Y2hlcyA6IFtdO1xyXG5cdFx0Y2FsbGJhY2soZXJyLCB3dndfbWF0Y2hlcyk7XHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IG1hdGNoX2lkXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMubWF0Y2hfaWQpIHtcclxuXHRcdHRocm93ICgnbWF0Y2hfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0Z2V0KCdtYXRjaERldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBtYXRjaF9pZFxyXG5mdW5jdGlvbiBnZXRNYXRjaGVzU3RhdGUocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHJcblx0dmFyIHJlcXVlc3RVcmwgPSBlbmRQb2ludHNbJ21hdGNoZXNTdGF0ZSddO1xyXG5cclxuXHRpZiAocGFyYW1zLm1hdGNoX2lkKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9ICcnICsgbWF0Y2hfaWQ7XHJcblx0fVxyXG5cclxuXHRnZXQocmVxdWVzdFVybCwge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIFJFUVVJUkVEOiBtYXRjaF9pZCB8fCB3b3JsZF9zbHVnXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlsc1N0YXRlKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHR2YXIgcmVxdWVzdFVybCA9IGVuZFBvaW50c1snbWF0Y2hEZXRhaWxzU3RhdGUnXTtcclxuXHJcblx0aWYgKCFwYXJhbXMubWF0Y2hfaWQgJiYgIXBhcmFtcy53b3JsZF9zbHVnKSB7XHJcblx0XHR0aHJvdyAoJ0VpdGhlciBtYXRjaF9pZCBvciB3b3JsZF9zbHVnIG11c3QgYmUgcGFzc2VkJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKHBhcmFtcy5tYXRjaF9pZCkge1xyXG5cdFx0cmVxdWVzdFVybCArPSBwYXJhbXMubWF0Y2hfaWQ7XHJcblx0fVxyXG5cdGVsc2UgaWYgKHBhcmFtcy53b3JsZF9zbHVnKSB7XHJcblx0XHRyZXF1ZXN0VXJsICs9ICd3b3JsZC8nICsgcGFyYW1zLndvcmxkX3NsdWc7XHJcblx0fVxyXG5cdGdldChyZXF1ZXN0VXJsLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdEdFTkVSQUxcclxuKi9cclxuXHJcblxyXG4vLyBPUFRJT05BTDogbGFuZywgaWRzXHJcbmZ1bmN0aW9uIGdldFdvcmxkTmFtZXMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHJcblx0aWYgKCFwYXJhbXMuaWRzKSB7XHJcblx0XHRwYXJhbXMucGFnZSA9IDA7XHJcblx0fVxyXG5cdGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmlkcykpIHtcclxuXHRcdHBhcmFtcy5pZHMgPSBwYXJhbXMuaWRzLmpvaW4oJywnKTtcclxuXHR9XHJcblx0Z2V0KCd3b3JsZE5hbWVzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IGd1aWxkX2lkIHx8IGd1aWxkX25hbWUgKGlkIHRha2VzIHByaW9yaXR5KVxyXG5mdW5jdGlvbiBnZXRHdWlsZERldGFpbHMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLmd1aWxkX2lkICYmICFwYXJhbXMuZ3VpbGRfbmFtZSkge1xyXG5cdFx0dGhyb3cgKCdFaXRoZXIgZ3VpbGRfaWQgb3IgZ3VpbGRfbmFtZSBtdXN0IGJlIHBhc3NlZCcpO1xyXG5cdH1cclxuXHJcblx0Z2V0KCdndWlsZERldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRJVEVNU1xyXG4qL1xyXG5cclxuLy8gTk8gUEFSQU1TXHJcbmZ1bmN0aW9uIGdldEl0ZW1zKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdpdGVtcycsIHt9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogaXRlbV9pZFxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRJdGVtRGV0YWlscyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuaXRlbV9pZCkge1xyXG5cdFx0dGhyb3cgKCdpdGVtX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgnaXRlbURldGFpbHMnLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRSZWNpcGVzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdyZWNpcGVzJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuLy8gUkVRVUlSRUQ6IHJlY2lwZV9pZFxyXG4vLyBPUFRJT05BTDogbGFuZ1xyXG5mdW5jdGlvbiBnZXRSZWNpcGVEZXRhaWxzKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5yZWNpcGVfaWQpIHtcclxuXHRcdHRocm93ICgncmVjaXBlX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGdldCgncmVjaXBlRGV0YWlscycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcdE1BUCBJTkZPUk1BVElPTlxyXG4qL1xyXG5cclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0TWFwTmFtZXMocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcclxuXHRcdHBhcmFtcyA9IHt9O1xyXG5cdH1cclxuXHRnZXQoJ21hcE5hbWVzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcbi8vIE5PIFBBUkFNU1xyXG5mdW5jdGlvbiBnZXRDb250aW5lbnRzKGNhbGxiYWNrKSB7XHJcblx0Z2V0KCdjb250aW5lbnRzJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBtYXBfaWQsIGxhbmdcclxuZnVuY3Rpb24gZ2V0TWFwcyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnbWFwcycsIHBhcmFtcywgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuLy8gUkVRVUlSRUQ6IGNvbnRpbmVudF9pZCwgZmxvb3JcclxuLy8gT1BUSU9OQUw6IGxhbmdcclxuZnVuY3Rpb24gZ2V0TWFwRmxvb3IocGFyYW1zLCBjYWxsYmFjaykge1xyXG5cdGlmICghcGFyYW1zLmNvbnRpbmVudF9pZCkge1xyXG5cdFx0dGhyb3cgKCdjb250aW5lbnRfaWQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIXBhcmFtcy5mbG9vcikge1xyXG5cdFx0dGhyb3cgKCdmbG9vciBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRnZXQoJ21hcEZsb29yJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4qXHRNaXNjZWxsYW5lb3VzXHJcbiovXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuZnVuY3Rpb24gZ2V0QnVpbGQoY2FsbGJhY2spIHtcclxuXHRnZXQoJ2J1aWxkJywge30sIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbi8vIE9QVElPTkFMOiBsYW5nXHJcbmZ1bmN0aW9uIGdldENvbG9ycyhwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0cGFyYW1zID0ge307XHJcblx0fVxyXG5cdGdldCgnY29sb3JzJywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBOTyBQQVJBTVNcclxuLy8gdG8gZ2V0IGZpbGVzOiBodHRwczovL3JlbmRlci5ndWlsZHdhcnMyLmNvbS9maWxlL3tzaWduYXR1cmV9L3tmaWxlX2lkfS57Zm9ybWF0fVxyXG5mdW5jdGlvbiBnZXRGaWxlcyhjYWxsYmFjaykge1xyXG5cdGdldCgnZmlsZXMnLCB7fSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKiAgIFVUSUxJVFkgTUVUSE9EU1xyXG4qXHJcbiovXHJcblxyXG5cclxuLy8gU1BFQ0lBTCBDQVNFXHJcbi8vIFJFUVVJUkVEOiBzaWduYXR1cmUsIGZpbGVfaWQsIGZvcm1hdFxyXG5mdW5jdGlvbiBnZXRGaWxlKHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRpZiAoIXBhcmFtcy5zaWduYXR1cmUpIHtcclxuXHRcdHRocm93ICgnc2lnbmF0dXJlIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKCFwYXJhbXMuZmlsZV9pZCkge1xyXG5cdFx0dGhyb3cgKCdmaWxlX2lkIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XHJcblx0fVxyXG5cdGVsc2UgaWYgKCFwYXJhbXMuZm9ybWF0KSB7XHJcblx0XHR0aHJvdyAoJ2Zvcm1hdCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHJcblx0cmVxdWVzdEpzb24oZ2V0RmlsZVJlbmRlclVybChwYXJhbXMpLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG4vLyBSRVFVSVJFRDogc2lnbmF0dXJlLCBmaWxlX2lkLCBmb3JtYXRcclxuZnVuY3Rpb24gZ2V0RmlsZVJlbmRlclVybChwYXJhbXMsIGNhbGxiYWNrKSB7XHJcblx0aWYgKCFwYXJhbXMuc2lnbmF0dXJlKSB7XHJcblx0XHR0aHJvdyAoJ3NpZ25hdHVyZSBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZpbGVfaWQpIHtcclxuXHRcdHRocm93ICgnZmlsZV9pZCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xyXG5cdH1cclxuXHRlbHNlIGlmICghcGFyYW1zLmZvcm1hdCkge1xyXG5cdFx0dGhyb3cgKCdmb3JtYXQgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcclxuXHR9XHJcblxyXG5cdHZhciByZW5kZXJVcmwgPSAoXHJcblx0XHQnaHR0cHM6Ly9yZW5kZXIuZ3VpbGR3YXJzMi5jb20vZmlsZS8nXHJcblx0XHQrIHBhcmFtcy5zaWduYXR1cmVcclxuXHRcdCsgJy8nXHJcblx0XHQrIHBhcmFtcy5maWxlX2lkXHJcblx0XHQrICcuJ1xyXG5cdFx0KyBwYXJhbXMuZm9ybWF0XHJcblx0KTtcclxuXHRyZXR1cm4gcmVuZGVyVXJsO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qICAgUFJJVkFURSBNRVRIT0RTXHJcbipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGdldChrZXksIHBhcmFtcywgY2FsbGJhY2spIHtcclxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcblxyXG5cdHZhciBhcGlVcmwgPSBnZXRBcGlVcmwoa2V5LCBwYXJhbXMpO1xyXG5cdHZhciBnZXREYXRhID0gcmVxdWlyZSgnLi9saWIvZ2V0RGF0YS5qcycpO1xyXG5cclxuXHRnZXREYXRhKGFwaVVybCwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEFwaVVybChyZXF1ZXN0VXJsLCBwYXJhbXMpIHtcclxuXHR2YXIgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xyXG5cclxuXHR2YXIgcmVxdWVzdFVybCA9IChlbmRQb2ludHNbcmVxdWVzdFVybF0pXHJcblx0XHQ/IGVuZFBvaW50c1tyZXF1ZXN0VXJsXVxyXG5cdFx0OiByZXF1ZXN0VXJsO1xyXG5cclxuXHR2YXIgcXVlcnkgPSBxcy5zdHJpbmdpZnkocGFyYW1zKTtcclxuXHJcblx0aWYgKHF1ZXJ5Lmxlbmd0aCkge1xyXG5cdFx0cmVxdWVzdFVybCArPSAnPycgKyBxdWVyeTtcclxuXHR9XHJcblxyXG5cdHJldHVybiByZXF1ZXN0VXJsO1xyXG59XHJcblxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcImVuXCI6IHtcclxuXHRcdFwic29ydFwiOiAxLFxyXG5cdFx0XCJzbHVnXCI6IFwiZW5cIixcclxuXHRcdFwibGFiZWxcIjogXCJFTlwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2VuXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFbmdsaXNoXCJcclxuXHR9LFxyXG5cdFwiZGVcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDIsXHJcblx0XHRcInNsdWdcIjogXCJkZVwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkRFXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZGVcIixcclxuXHRcdFwibmFtZVwiOiBcIkRldXRzY2hcIlxyXG5cdH0sXHJcblx0XCJlc1wiOiB7XHJcblx0XHRcInNvcnRcIjogMyxcclxuXHRcdFwic2x1Z1wiOiBcImVzXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRVNcIixcclxuXHRcdFwibGlua1wiOiBcIi9lc1wiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRXNwYcOxb2xcIlxyXG5cdH0sXHJcblx0XCJmclwiOiB7XHJcblx0XHRcInNvcnRcIjogNCxcclxuXHRcdFwic2x1Z1wiOiBcImZyXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRlJcIixcclxuXHRcdFwibGlua1wiOiBcIi9mclwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRnJhbsOnYWlzXCJcclxuXHR9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMVwiOiB7XCJpZFwiOiBcIjFcIiwgXCJlblwiOiBcIk92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZVwiLCBcImVzXCI6IFwiTWlyYWRvclwiLCBcImRlXCI6IFwiQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCIyXCI6IHtcImlkXCI6IFwiMlwiLCBcImVuXCI6IFwiVmFsbGV5XCIsIFwiZnJcIjogXCJWYWxsw6llXCIsIFwiZXNcIjogXCJWYWxsZVwiLCBcImRlXCI6IFwiVGFsXCJ9LFxyXG5cdFwiM1wiOiB7XCJpZFwiOiBcIjNcIiwgXCJlblwiOiBcIkxvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzXCIsIFwiZXNcIjogXCJWZWdhXCIsIFwiZGVcIjogXCJUaWVmbGFuZFwifSxcclxuXHRcIjRcIjoge1wiaWRcIjogXCI0XCIsIFwiZW5cIjogXCJHb2xhbnRhIENsZWFyaW5nXCIsIFwiZnJcIjogXCJDbGFpcmnDqHJlIGRlIEdvbGFudGFcIiwgXCJlc1wiOiBcIkNsYXJvIEdvbGFudGFcIiwgXCJkZVwiOiBcIkdvbGFudGEtTGljaHR1bmdcIn0sXHJcblx0XCI1XCI6IHtcImlkXCI6IFwiNVwiLCBcImVuXCI6IFwiUGFuZ2xvc3MgUmlzZVwiLCBcImZyXCI6IFwiTW9udMOpZSBkZSBQYW5nbG9zc1wiLCBcImVzXCI6IFwiQ29saW5hIFBhbmdsb3NzXCIsIFwiZGVcIjogXCJQYW5nbG9zcy1BbmjDtmhlXCJ9LFxyXG5cdFwiNlwiOiB7XCJpZFwiOiBcIjZcIiwgXCJlblwiOiBcIlNwZWxkYW4gQ2xlYXJjdXRcIiwgXCJmclwiOiBcIkZvcsOqdCByYXPDqWUgZGUgU3BlbGRhblwiLCBcImVzXCI6IFwiQ2xhcm8gRXNwZWxkaWFcIiwgXCJkZVwiOiBcIlNwZWxkYW4gS2FobHNjaGxhZ1wifSxcclxuXHRcIjdcIjoge1wiaWRcIjogXCI3XCIsIFwiZW5cIjogXCJEYW5lbG9uIFBhc3NhZ2VcIiwgXCJmclwiOiBcIlBhc3NhZ2UgRGFuZWxvblwiLCBcImVzXCI6IFwiUGFzYWplIERhbmVsb25cIiwgXCJkZVwiOiBcIkRhbmVsb24tUGFzc2FnZVwifSxcclxuXHRcIjhcIjoge1wiaWRcIjogXCI4XCIsIFwiZW5cIjogXCJVbWJlcmdsYWRlIFdvb2RzXCIsIFwiZnJcIjogXCJCb2lzIGQnT21icmVjbGFpclwiLCBcImVzXCI6IFwiQm9zcXVlcyBDbGFyb3NvbWJyYVwiLCBcImRlXCI6IFwiVW1iZXJsaWNodHVuZy1Gb3JzdFwifSxcclxuXHRcIjlcIjoge1wiaWRcIjogXCI5XCIsIFwiZW5cIjogXCJTdG9uZW1pc3QgQ2FzdGxlXCIsIFwiZnJcIjogXCJDaMOidGVhdSBCcnVtZXBpZXJyZVwiLCBcImVzXCI6IFwiQ2FzdGlsbG8gUGllZHJhbmllYmxhXCIsIFwiZGVcIjogXCJTY2hsb3NzIFN0ZWlubmViZWxcIn0sXHJcblx0XCIxMFwiOiB7XCJpZFwiOiBcIjEwXCIsIFwiZW5cIjogXCJSb2d1ZSdzIFF1YXJyeVwiLCBcImZyXCI6IFwiQ2FycmnDqHJlIGRlcyB2b2xldXJzXCIsIFwiZXNcIjogXCJDYW50ZXJhIGRlbCBQw61jYXJvXCIsIFwiZGVcIjogXCJTY2h1cmtlbmJydWNoXCJ9LFxyXG5cdFwiMTFcIjoge1wiaWRcIjogXCIxMVwiLCBcImVuXCI6IFwiQWxkb24ncyBMZWRnZVwiLCBcImZyXCI6IFwiQ29ybmljaGUgZCdBbGRvblwiLCBcImVzXCI6IFwiQ29ybmlzYSBkZSBBbGRvblwiLCBcImRlXCI6IFwiQWxkb25zIFZvcnNwcnVuZ1wifSxcclxuXHRcIjEyXCI6IHtcImlkXCI6IFwiMTJcIiwgXCJlblwiOiBcIldpbGRjcmVlayBSdW5cIiwgXCJmclwiOiBcIlBpc3RlIGR1IFJ1aXNzZWF1IHNhdXZhZ2VcIiwgXCJlc1wiOiBcIlBpc3RhIEFycm95b3NhbHZhamVcIiwgXCJkZVwiOiBcIldpbGRiYWNoc3RyZWNrZVwifSxcclxuXHRcIjEzXCI6IHtcImlkXCI6IFwiMTNcIiwgXCJlblwiOiBcIkplcnJpZmVyJ3MgU2xvdWdoXCIsIFwiZnJcIjogXCJCb3VyYmllciBkZSBKZXJyaWZlclwiLCBcImVzXCI6IFwiQ2VuYWdhbCBkZSBKZXJyaWZlclwiLCBcImRlXCI6IFwiSmVycmlmZXJzIFN1bXBmbG9jaFwifSxcclxuXHRcIjE0XCI6IHtcImlkXCI6IFwiMTRcIiwgXCJlblwiOiBcIktsb3ZhbiBHdWxseVwiLCBcImZyXCI6IFwiUGV0aXQgcmF2aW4gZGUgS2xvdmFuXCIsIFwiZXNcIjogXCJCYXJyYW5jbyBLbG92YW5cIiwgXCJkZVwiOiBcIktsb3Zhbi1TZW5rZVwifSxcclxuXHRcIjE1XCI6IHtcImlkXCI6IFwiMTVcIiwgXCJlblwiOiBcIkxhbmdvciBHdWxjaFwiLCBcImZyXCI6IFwiUmF2aW4gZGUgTGFuZ29yXCIsIFwiZXNcIjogXCJCYXJyYW5jbyBMYW5nb3JcIiwgXCJkZVwiOiBcIkxhbmdvciAtIFNjaGx1Y2h0XCJ9LFxyXG5cdFwiMTZcIjoge1wiaWRcIjogXCIxNlwiLCBcImVuXCI6IFwiUXVlbnRpbiBMYWtlXCIsIFwiZnJcIjogXCJMYWMgUXVlbnRpblwiLCBcImVzXCI6IFwiTGFnbyBRdWVudGluXCIsIFwiZGVcIjogXCJRdWVudGluc2VlXCJ9LFxyXG5cdFwiMTdcIjoge1wiaWRcIjogXCIxN1wiLCBcImVuXCI6IFwiTWVuZG9uJ3MgR2FwXCIsIFwiZnJcIjogXCJGYWlsbGUgZGUgTWVuZG9uXCIsIFwiZXNcIjogXCJaYW5qYSBkZSBNZW5kb25cIiwgXCJkZVwiOiBcIk1lbmRvbnMgU3BhbHRcIn0sXHJcblx0XCIxOFwiOiB7XCJpZFwiOiBcIjE4XCIsIFwiZW5cIjogXCJBbnphbGlhcyBQYXNzXCIsIFwiZnJcIjogXCJDb2wgZCdBbnphbGlhc1wiLCBcImVzXCI6IFwiUGFzbyBBbnphbGlhc1wiLCBcImRlXCI6IFwiQW56YWxpYXMtUGFzc1wifSxcclxuXHRcIjE5XCI6IHtcImlkXCI6IFwiMTlcIiwgXCJlblwiOiBcIk9ncmV3YXRjaCBDdXRcIiwgXCJmclwiOiBcIlBlcmPDqWUgZGUgR2FyZG9ncmVcIiwgXCJlc1wiOiBcIlRham8gZGUgbGEgR3VhcmRpYSBkZWwgT2dyb1wiLCBcImRlXCI6IFwiT2dlcndhY2h0LUthbmFsXCJ9LFxyXG5cdFwiMjBcIjoge1wiaWRcIjogXCIyMFwiLCBcImVuXCI6IFwiVmVsb2thIFNsb3BlXCIsIFwiZnJcIjogXCJGbGFuYyBkZSBWZWxva2FcIiwgXCJlc1wiOiBcIlBlbmRpZW50ZSBWZWxva2FcIiwgXCJkZVwiOiBcIlZlbG9rYS1IYW5nXCJ9LFxyXG5cdFwiMjFcIjoge1wiaWRcIjogXCIyMVwiLCBcImVuXCI6IFwiRHVyaW9zIEd1bGNoXCIsIFwiZnJcIjogXCJSYXZpbiBkZSBEdXJpb3NcIiwgXCJlc1wiOiBcIkJhcnJhbmNvIER1cmlvc1wiLCBcImRlXCI6IFwiRHVyaW9zLVNjaGx1Y2h0XCJ9LFxyXG5cdFwiMjJcIjoge1wiaWRcIjogXCIyMlwiLCBcImVuXCI6IFwiQnJhdm9zdCBFc2NhcnBtZW50XCIsIFwiZnJcIjogXCJGYWxhaXNlIGRlIEJyYXZvc3RcIiwgXCJlc1wiOiBcIkVzY2FycGFkdXJhIEJyYXZvc3RcIiwgXCJkZVwiOiBcIkJyYXZvc3QtQWJoYW5nXCJ9LFxyXG5cdFwiMjNcIjoge1wiaWRcIjogXCIyM1wiLCBcImVuXCI6IFwiR2Fycmlzb25cIiwgXCJmclwiOiBcIkdhcm5pc29uXCIsIFwiZXNcIjogXCJGdWVydGVcIiwgXCJkZVwiOiBcIkZlc3R1bmdcIn0sXHJcblx0XCIyNFwiOiB7XCJpZFwiOiBcIjI0XCIsIFwiZW5cIjogXCJDaGFtcGlvbidzIERlbWVuc2VcIiwgXCJmclwiOiBcIkZpZWYgZHUgY2hhbXBpb25cIiwgXCJlc1wiOiBcIkRvbWluaW8gZGVsIENhbXBlw7NuXCIsIFwiZGVcIjogXCJMYW5kZ3V0IGRlcyBDaGFtcGlvbnNcIn0sXHJcblx0XCIyNVwiOiB7XCJpZFwiOiBcIjI1XCIsIFwiZW5cIjogXCJSZWRicmlhclwiLCBcImZyXCI6IFwiQnJ1eWVyb3VnZVwiLCBcImVzXCI6IFwiWmFyemFycm9qYVwiLCBcImRlXCI6IFwiUm90ZG9ybnN0cmF1Y2hcIn0sXHJcblx0XCIyNlwiOiB7XCJpZFwiOiBcIjI2XCIsIFwiZW5cIjogXCJHcmVlbmxha2VcIiwgXCJmclwiOiBcIkxhYyBWZXJ0XCIsIFwiZXNcIjogXCJMYWdvdmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xuc2VlXCJ9LFxyXG5cdFwiMjdcIjoge1wiaWRcIjogXCIyN1wiLCBcImVuXCI6IFwiQXNjZW5zaW9uIEJheVwiLCBcImZyXCI6IFwiQmFpZSBkZSBsJ0FzY2Vuc2lvblwiLCBcImVzXCI6IFwiQmFow61hIGRlIGxhIEFzY2Vuc2nDs25cIiwgXCJkZVwiOiBcIkJ1Y2h0IGRlcyBBdWZzdGllZ3NcIn0sXHJcblx0XCIyOFwiOiB7XCJpZFwiOiBcIjI4XCIsIFwiZW5cIjogXCJEYXduJ3MgRXlyaWVcIiwgXCJmclwiOiBcIlByb21vbnRvaXJlIGRlIGwnYXViZVwiLCBcImVzXCI6IFwiQWd1aWxlcmEgZGVsIEFsYmFcIiwgXCJkZVwiOiBcIkhvcnN0IGRlciBNb3JnZW5kYW1tZXJ1bmdcIn0sXHJcblx0XCIyOVwiOiB7XCJpZFwiOiBcIjI5XCIsIFwiZW5cIjogXCJUaGUgU3Bpcml0aG9sbWVcIiwgXCJmclwiOiBcIkwnYW50cmUgZGVzIGVzcHJpdHNcIiwgXCJlc1wiOiBcIkxhIElzbGV0YSBFc3Bpcml0dWFsXCIsIFwiZGVcIjogXCJEZXIgR2Vpc3RlcmhvbG1cIn0sXHJcblx0XCIzMFwiOiB7XCJpZFwiOiBcIjMwXCIsIFwiZW5cIjogXCJXb29kaGF2ZW5cIiwgXCJmclwiOiBcIkdlbnRlc3lsdmVcIiwgXCJlc1wiOiBcIlJlZnVnaW8gRm9yZXN0YWxcIiwgXCJkZVwiOiBcIldhbGQgLSBGcmVpc3RhdHRcIn0sXHJcblx0XCIzMVwiOiB7XCJpZFwiOiBcIjMxXCIsIFwiZW5cIjogXCJBc2thbGlvbiBIaWxsc1wiLCBcImZyXCI6IFwiQ29sbGluZXMgZCdBc2thbGlvblwiLCBcImVzXCI6IFwiQ29saW5hcyBBc2thbGlvblwiLCBcImRlXCI6IFwiQXNrYWxpb24gLSBIw7xnZWxcIn0sXHJcblx0XCIzMlwiOiB7XCJpZFwiOiBcIjMyXCIsIFwiZW5cIjogXCJFdGhlcm9uIEhpbGxzXCIsIFwiZnJcIjogXCJDb2xsaW5lcyBkJ0V0aGVyb25cIiwgXCJlc1wiOiBcIkNvbGluYXMgRXRoZXJvblwiLCBcImRlXCI6IFwiRXRoZXJvbiAtIEjDvGdlbFwifSxcclxuXHRcIjMzXCI6IHtcImlkXCI6IFwiMzNcIiwgXCJlblwiOiBcIkRyZWFtaW5nIEJheVwiLCBcImZyXCI6IFwiQmFpZSBkZXMgcsOqdmVzXCIsIFwiZXNcIjogXCJCYWjDrWEgT27DrXJpY2FcIiwgXCJkZVwiOiBcIlRyYXVtYnVjaHRcIn0sXHJcblx0XCIzNFwiOiB7XCJpZFwiOiBcIjM0XCIsIFwiZW5cIjogXCJWaWN0b3IncyBMb2RnZVwiLCBcImZyXCI6IFwiUGF2aWxsb24gZHUgdmFpbnF1ZXVyXCIsIFwiZXNcIjogXCJBbGJlcmd1ZSBkZWwgVmVuY2Vkb3JcIiwgXCJkZVwiOiBcIlNpZWdlciAtIEjDvHR0ZVwifSxcclxuXHRcIjM1XCI6IHtcImlkXCI6IFwiMzVcIiwgXCJlblwiOiBcIkdyZWVuYnJpYXJcIiwgXCJmclwiOiBcIlZlcnRlYnJhbmNoZVwiLCBcImVzXCI6IFwiWmFyemF2ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG5zdHJhdWNoXCJ9LFxyXG5cdFwiMzZcIjoge1wiaWRcIjogXCIzNlwiLCBcImVuXCI6IFwiQmx1ZWxha2VcIiwgXCJmclwiOiBcIkxhYyBibGV1XCIsIFwiZXNcIjogXCJMYWdvYXp1bFwiLCBcImRlXCI6IFwiQmxhdXNlZVwifSxcclxuXHRcIjM3XCI6IHtcImlkXCI6IFwiMzdcIiwgXCJlblwiOiBcIkdhcnJpc29uXCIsIFwiZnJcIjogXCJHYXJuaXNvblwiLCBcImVzXCI6IFwiRnVlcnRlXCIsIFwiZGVcIjogXCJGZXN0dW5nXCJ9LFxyXG5cdFwiMzhcIjoge1wiaWRcIjogXCIzOFwiLCBcImVuXCI6IFwiTG9uZ3ZpZXdcIiwgXCJmclwiOiBcIkxvbmd1ZXZ1ZVwiLCBcImVzXCI6IFwiVmlzdGFsdWVuZ2FcIiwgXCJkZVwiOiBcIldlaXRzaWNodFwifSxcclxuXHRcIjM5XCI6IHtcImlkXCI6IFwiMzlcIiwgXCJlblwiOiBcIlRoZSBHb2Rzd29yZFwiLCBcImZyXCI6IFwiTCdFcMOpZSBkaXZpbmVcIiwgXCJlc1wiOiBcIkxhIEhvamEgRGl2aW5hXCIsIFwiZGVcIjogXCJEYXMgR290dHNjaHdlcnRcIn0sXHJcblx0XCI0MFwiOiB7XCJpZFwiOiBcIjQwXCIsIFwiZW5cIjogXCJDbGlmZnNpZGVcIiwgXCJmclwiOiBcIkZsYW5jIGRlIGZhbGFpc2VcIiwgXCJlc1wiOiBcIkRlc3Blw7FhZGVyb1wiLCBcImRlXCI6IFwiRmVsc3dhbmRcIn0sXHJcblx0XCI0MVwiOiB7XCJpZFwiOiBcIjQxXCIsIFwiZW5cIjogXCJTaGFkYXJhbiBIaWxsc1wiLCBcImZyXCI6IFwiQ29sbGluZXMgZGUgU2hhZGFyYW5cIiwgXCJlc1wiOiBcIkNvbGluYXMgU2hhZGFyYW5cIiwgXCJkZVwiOiBcIlNoYWRhcmFuIEjDvGdlbFwifSxcclxuXHRcIjQyXCI6IHtcImlkXCI6IFwiNDJcIiwgXCJlblwiOiBcIlJlZGxha2VcIiwgXCJmclwiOiBcIlJvdWdlbGFjXCIsIFwiZXNcIjogXCJMYWdvcnJvam9cIiwgXCJkZVwiOiBcIlJvdHNlZVwifSxcclxuXHRcIjQzXCI6IHtcImlkXCI6IFwiNDNcIiwgXCJlblwiOiBcIkhlcm8ncyBMb2RnZVwiLCBcImZyXCI6IFwiUGF2aWxsb24gZHUgSMOpcm9zXCIsIFwiZXNcIjogXCJBbGJlcmd1ZSBkZWwgSMOpcm9lXCIsIFwiZGVcIjogXCJIw7x0dGUgZGVzIEhlbGRlblwifSxcclxuXHRcIjQ0XCI6IHtcImlkXCI6IFwiNDRcIiwgXCJlblwiOiBcIkRyZWFkZmFsbCBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZHUgTm9pciBkw6ljbGluXCIsIFwiZXNcIjogXCJCYWjDrWEgU2FsdG8gQWNpYWdvXCIsIFwiZGVcIjogXCJTY2hyZWNrZW5zZmFsbCAtIEJ1Y2h0XCJ9LFxyXG5cdFwiNDVcIjoge1wiaWRcIjogXCI0NVwiLCBcImVuXCI6IFwiQmx1ZWJyaWFyXCIsIFwiZnJcIjogXCJCcnV5YXp1clwiLCBcImVzXCI6IFwiWmFyemF6dWxcIiwgXCJkZVwiOiBcIkJsYXVkb3Juc3RyYXVjaFwifSxcclxuXHRcIjQ2XCI6IHtcImlkXCI6IFwiNDZcIiwgXCJlblwiOiBcIkdhcnJpc29uXCIsIFwiZnJcIjogXCJHYXJuaXNvblwiLCBcImVzXCI6IFwiRnVlcnRlXCIsIFwiZGVcIjogXCJGZXN0dW5nXCJ9LFxyXG5cdFwiNDdcIjoge1wiaWRcIjogXCI0N1wiLCBcImVuXCI6IFwiU3VubnloaWxsXCIsIFwiZnJcIjogXCJDb2xsaW5lIGVuc29sZWlsbMOpZVwiLCBcImVzXCI6IFwiQ29saW5hIFNvbGVhZGFcIiwgXCJkZVwiOiBcIlNvbm5lbmxpY2h0aMO8Z2VsXCJ9LFxyXG5cdFwiNDhcIjoge1wiaWRcIjogXCI0OFwiLCBcImVuXCI6IFwiRmFpdGhsZWFwXCIsIFwiZnJcIjogXCJGZXJ2ZXVyXCIsIFwiZXNcIjogXCJTYWx0byBkZSBGZVwiLCBcImRlXCI6IFwiR2xhdWJlbnNzcHJ1bmdcIn0sXHJcblx0XCI0OVwiOiB7XCJpZFwiOiBcIjQ5XCIsIFwiZW5cIjogXCJCbHVldmFsZSBSZWZ1Z2VcIiwgXCJmclwiOiBcIlJlZnVnZSBkZSBibGV1dmFsXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlYXp1bFwiLCBcImRlXCI6IFwiQmxhdXRhbCAtIFp1Zmx1Y2h0XCJ9LFxyXG5cdFwiNTBcIjoge1wiaWRcIjogXCI1MFwiLCBcImVuXCI6IFwiQmx1ZXdhdGVyIExvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LUF6dXJcIiwgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXp1bFwiLCBcImRlXCI6IFwiQmxhdXdhc3NlciAtIFRpZWZsYW5kXCJ9LFxyXG5cdFwiNTFcIjoge1wiaWRcIjogXCI1MVwiLCBcImVuXCI6IFwiQXN0cmFsaG9sbWVcIiwgXCJmclwiOiBcIkFzdHJhbGhvbG1lXCIsIFwiZXNcIjogXCJJc2xldGEgQXN0cmFsXCIsIFwiZGVcIjogXCJBc3RyYWxob2xtXCJ9LFxyXG5cdFwiNTJcIjoge1wiaWRcIjogXCI1MlwiLCBcImVuXCI6IFwiQXJhaCdzIEhvcGVcIiwgXCJmclwiOiBcIkVzcG9pciBkJ0FyYWhcIiwgXCJlc1wiOiBcIkVzcGVyYW56YSBkZSBBcmFoXCIsIFwiZGVcIjogXCJBcmFocyBIb2ZmbnVuZ1wifSxcclxuXHRcIjUzXCI6IHtcImlkXCI6IFwiNTNcIiwgXCJlblwiOiBcIkdyZWVudmFsZSBSZWZ1Z2VcIiwgXCJmclwiOiBcIlJlZnVnZSBkZSBWYWx2ZXJ0XCIsIFwiZXNcIjogXCJSZWZ1Z2lvIGRlIFZhbGxldmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xudGFsIC0gWnVmbHVjaHRcIn0sXHJcblx0XCI1NFwiOiB7XCJpZFwiOiBcIjU0XCIsIFwiZW5cIjogXCJGb2doYXZlblwiLCBcImZyXCI6IFwiSGF2cmUgZ3Jpc1wiLCBcImVzXCI6IFwiUmVmdWdpbyBOZWJsaW5vc29cIiwgXCJkZVwiOiBcIk5lYmVsIC0gRnJlaXN0YXR0XCJ9LFxyXG5cdFwiNTVcIjoge1wiaWRcIjogXCI1NVwiLCBcImVuXCI6IFwiUmVkd2F0ZXIgTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZGUgUnViaWNvblwiLCBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhcnJvamFcIiwgXCJkZVwiOiBcIlJvdHdhc3NlciAtIFRpZWZsYW5kXCJ9LFxyXG5cdFwiNTZcIjoge1wiaWRcIjogXCI1NlwiLCBcImVuXCI6IFwiVGhlIFRpdGFucGF3XCIsIFwiZnJcIjogXCJCcmFzIGR1IHRpdGFuXCIsIFwiZXNcIjogXCJMYSBHYXJyYSBkZWwgVGl0w6FuXCIsIFwiZGVcIjogXCJEaWUgVGl0YW5lbnByYW5rZVwifSxcclxuXHRcIjU3XCI6IHtcImlkXCI6IFwiNTdcIiwgXCJlblwiOiBcIkNyYWd0b3BcIiwgXCJmclwiOiBcIlNvbW1ldCBkZSBsJ2VzY2FycGVtZW50XCIsIFwiZXNcIjogXCJDdW1icmVwZcOxYXNjb1wiLCBcImRlXCI6IFwiRmVsc2Vuc3BpdHplXCJ9LFxyXG5cdFwiNThcIjoge1wiaWRcIjogXCI1OFwiLCBcImVuXCI6IFwiR29kc2xvcmVcIiwgXCJmclwiOiBcIkRpdmluYXRpb25cIiwgXCJlc1wiOiBcIlNhYmlkdXLDrWEgZGUgbG9zIERpb3Nlc1wiLCBcImRlXCI6IFwiR8O2dHRlcmt1bmRlXCJ9LFxyXG5cdFwiNTlcIjoge1wiaWRcIjogXCI1OVwiLCBcImVuXCI6IFwiUmVkdmFsZSBSZWZ1Z2VcIiwgXCJmclwiOiBcIlJlZnVnZSBkZSBWYWxyb3VnZVwiLCBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZXJvam9cIiwgXCJkZVwiOiBcIlJvdHRhbCAtIFp1Zmx1Y2h0XCJ9LFxyXG5cdFwiNjBcIjoge1wiaWRcIjogXCI2MFwiLCBcImVuXCI6IFwiU3Rhcmdyb3ZlXCIsIFwiZnJcIjogXCJCb3NxdWV0IHN0ZWxsYWlyZVwiLCBcImVzXCI6IFwiQXJib2xlZGEgZGUgbGFzIEVzdHJlbGxhc1wiLCBcImRlXCI6IFwiU3Rlcm5lbmhhaW5cIn0sXHJcblx0XCI2MVwiOiB7XCJpZFwiOiBcIjYxXCIsIFwiZW5cIjogXCJHcmVlbndhdGVyIExvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGQnRWF1LVZlcmRveWFudGVcIiwgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bndhc3NlciAtIFRpZWZsYW5kXCJ9LFxyXG5cdFwiNjJcIjoge1wiaWRcIjogXCI2MlwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxuXHRcIjYzXCI6IHtcImlkXCI6IFwiNjNcIiwgXCJlblwiOiBcIkJhdHRsZSdzIEhvbGxvd1wiLCBcImZyXCI6IFwiVmFsbG9uIGRlIGJhdGFpbGxlXCIsIFwiZXNcIjogXCJIb25kb25hZGEgZGUgbGEgQmF0dGFsbGFcIiwgXCJkZVwiOiBcIlNjaGxhY2h0ZW4tU2Vua2VcIn0sXHJcblx0XCI2NFwiOiB7XCJpZFwiOiBcIjY0XCIsIFwiZW5cIjogXCJCYXVlcidzIEVzdGF0ZVwiLCBcImZyXCI6IFwiRG9tYWluZSBkZSBCYXVlclwiLCBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmF1ZXJcIiwgXCJkZVwiOiBcIkJhdWVycyBBbndlc2VuXCJ9LFxyXG5cdFwiNjVcIjoge1wiaWRcIjogXCI2NVwiLCBcImVuXCI6IFwiT3JjaGFyZCBPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmUgZHUgVmVyZ2VyXCIsIFwiZXNcIjogXCJNaXJhZG9yIGRlbCBIdWVydG9cIiwgXCJkZVwiOiBcIk9ic3RnYXJ0ZW4gQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCI2NlwiOiB7XCJpZFwiOiBcIjY2XCIsIFwiZW5cIjogXCJDYXJ2ZXIncyBBc2NlbnRcIiwgXCJmclwiOiBcIkPDtHRlIGR1IGNvdXRlYXVcIiwgXCJlc1wiOiBcIkFzY2Vuc28gZGVsIFRyaW5jaGFkb3JcIiwgXCJkZVwiOiBcIkF1ZnN0aWVnIGRlcyBTY2huaXR6ZXJzXCJ9LFxyXG5cdFwiNjdcIjoge1wiaWRcIjogXCI2N1wiLCBcImVuXCI6IFwiQ2FydmVyJ3MgQXNjZW50XCIsIFwiZnJcIjogXCJDw7R0ZSBkdSBjb3V0ZWF1XCIsIFwiZXNcIjogXCJBc2NlbnNvIGRlbCBUcmluY2hhZG9yXCIsIFwiZGVcIjogXCJBdWZzdGllZyBkZXMgU2Nobml0emVyc1wifSxcclxuXHRcIjY4XCI6IHtcImlkXCI6IFwiNjhcIiwgXCJlblwiOiBcIk9yY2hhcmQgT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlIGR1IFZlcmdlclwiLCBcImVzXCI6IFwiTWlyYWRvciBkZWwgSHVlcnRvXCIsIFwiZGVcIjogXCJPYnN0Z2FydGVuIEF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiNjlcIjoge1wiaWRcIjogXCI2OVwiLCBcImVuXCI6IFwiQmF1ZXIncyBFc3RhdGVcIiwgXCJmclwiOiBcIkRvbWFpbmUgZGUgQmF1ZXJcIiwgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsIFwiZGVcIjogXCJCYXVlcnMgQW53ZXNlblwifSxcclxuXHRcIjcwXCI6IHtcImlkXCI6IFwiNzBcIiwgXCJlblwiOiBcIkJhdHRsZSdzIEhvbGxvd1wiLCBcImZyXCI6IFwiVmFsbG9uIGRlIGJhdGFpbGxlXCIsIFwiZXNcIjogXCJIb25kb25hZGEgZGUgbGEgQmF0dGFsbGFcIiwgXCJkZVwiOiBcIlNjaGxhY2h0ZW4tU2Vua2VcIn0sXHJcblx0XCI3MVwiOiB7XCJpZFwiOiBcIjcxXCIsIFwiZW5cIjogXCJUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzXCIsIFwiZnJcIjogXCJUZW1wbGUgZGVzIHByacOocmVzIHBlcmR1ZXNcIiwgXCJlc1wiOiBcIlRlbXBsbyBkZSBsYXMgUGVsZ2FyaWFzXCIsIFwiZGVcIjogXCJUZW1wZWwgZGVyIFZlcmxvcmVuZW4gR2ViZXRlXCJ9LFxyXG5cdFwiNzJcIjoge1wiaWRcIjogXCI3MlwiLCBcImVuXCI6IFwiQ2FydmVyJ3MgQXNjZW50XCIsIFwiZnJcIjogXCJDw7R0ZSBkdSBjb3V0ZWF1XCIsIFwiZXNcIjogXCJBc2NlbnNvIGRlbCBUcmluY2hhZG9yXCIsIFwiZGVcIjogXCJBdWZzdGllZyBkZXMgU2Nobml0emVyc1wifSxcclxuXHRcIjczXCI6IHtcImlkXCI6IFwiNzNcIiwgXCJlblwiOiBcIk9yY2hhcmQgT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlIGR1IFZlcmdlclwiLCBcImVzXCI6IFwiTWlyYWRvciBkZWwgSHVlcnRvXCIsIFwiZGVcIjogXCJPYnN0Z2FydGVuIEF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiNzRcIjoge1wiaWRcIjogXCI3NFwiLCBcImVuXCI6IFwiQmF1ZXIncyBFc3RhdGVcIiwgXCJmclwiOiBcIkRvbWFpbmUgZGUgQmF1ZXJcIiwgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsIFwiZGVcIjogXCJCYXVlcnMgQW53ZXNlblwifSxcclxuXHRcIjc1XCI6IHtcImlkXCI6IFwiNzVcIiwgXCJlblwiOiBcIkJhdHRsZSdzIEhvbGxvd1wiLCBcImZyXCI6IFwiVmFsbG9uIGRlIGJhdGFpbGxlXCIsIFwiZXNcIjogXCJIb25kb25hZGEgZGUgbGEgQmF0dGFsbGFcIiwgXCJkZVwiOiBcIlNjaGxhY2h0ZW4tU2Vua2VcIn0sXHJcblx0XCI3NlwiOiB7XCJpZFwiOiBcIjc2XCIsIFwiZW5cIjogXCJUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzXCIsIFwiZnJcIjogXCJUZW1wbGUgZGVzIHByacOocmVzIHBlcmR1ZXNcIiwgXCJlc1wiOiBcIlRlbXBsbyBkZSBsYXMgUGVsZ2FyaWFzXCIsIFwiZGVcIjogXCJUZW1wZWwgZGVyIFZlcmxvcmVuZW4gR2ViZXRlXCJ9LFxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHR7XHJcblx0XHRcImtleVwiOiBcIkNlbnRlclwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAzLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJDYXN0bGVcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzldLCBcdFx0XHRcdFx0XHRcdFx0Ly8gc21cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJSZWQgQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzEsIDE3LCAyMCwgMTgsIDE5LCA2LCA1XSxcdFx0Ly8gb3Zlcmxvb2ssIG1lbmRvbnMsIHZlbG9rYSwgYW56LCBvZ3JlLCBzcGVsZGFuLCBwYW5nXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiQmx1ZSBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzIsIDE1LCAyMiwgMTYsIDIxLCA3LCA4XVx0XHRcdC8vIHZhbGxleSwgbGFuZ29yLCBicmF2b3N0LCBxdWVudGluLCBkdXJpb3MsIGRhbmUsIHVtYmVyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiR3JlZW4gQ29ybmVyXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMywgMTEsIDEzLCAxMiwgMTQsIDEwLCA0XSBcdFx0Ly8gbG93bGFuZHMsIGFsZG9ucywgamVycmlmZXIsIHdpbGRjcmVlaywga2xvdmFuLCByb2d1ZXMsIGdvbGFudGFcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiUmVkSG9tZVwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAwLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJLZWVwc1wiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwicmVkXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszNywgMzMsIDMyXSBcdFx0XHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCBsb25ndmlldywgY2xpZmZzaWRlLCBnb2Rzd29yZCwgaG9wZXMsIGFzdHJhbFxyXG5cdFx0XHR9LCB7XHRcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiTm9ydGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcInJlZFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzgsIDQwLCAzOSwgNTIsIDUxXSBcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIGxvbmd2aWV3LCBjbGlmZnNpZGUsIGdvZHN3b3JkLCBob3BlcywgYXN0cmFsXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM1LCAzNiwgMzQsIDUzLCA1MF0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgbG9kZ2UsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs2MiwgNjMsIDY0LCA2NSwgNjZdIFx0XHRcdFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXSxcclxuXHR9LCB7XHJcblx0XHRcImtleVwiOiBcIkJsdWVIb21lXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDIsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJibHVlXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFsyMywgMjcsIDMxXSBcdFx0XHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCB3b29kaGF2ZW4sIGRhd25zLCBzcGlyaXQsIGdvZHMsIHN0YXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJOb3J0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzAsIDI4LCAyOSwgNTgsIDYwXSBcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHdvb2RoYXZlbiwgZGF3bnMsIHNwaXJpdCwgZ29kcywgc3RhclxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlNvdXRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFsyNSwgMjYsIDI0LCA1OSwgNjFdIFx0XHRcdFx0Ly8gYnJpYXIsIGxha2UsIGNoYW1wLCB2YWxlLCB3YXRlclxyXG5cdFx0XHQvLyB9LCB7XHJcblx0XHRcdC8vIFx0XCJsYWJlbFwiOiBcIlJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJncm91cFR5cGVcIjogXCJydWluc1wiLFxyXG5cdFx0XHQvLyBcdFwib2JqZWN0aXZlc1wiOiBbNzEsIDcwLCA2OSwgNjgsIDY3XSBcdFx0XHRcdC8vIHRlbXBsZSwgaG9sbG93LCBlc3RhdGUsIG9yY2hhcmQsIGFzY2VudFxyXG5cdFx0XHR9LF0sXHJcblx0fSwge1xyXG5cdFx0XCJrZXlcIjogXCJHcmVlbkhvbWVcIixcclxuXHRcdFwibWFwSW5kZXhcIjogMSxcclxuXHRcdFwic2VjdGlvbnNcIjogW3tcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiS2VlcHNcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImdyZWVuXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs0NiwgNDQsIDQxXSBcdFx0XHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCBzdW5ueSwgY3JhZywgdGl0YW4sIGZhaXRoLCBmb2dcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJOb3J0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiZ3JlZW5cIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzQ3LCA1NywgNTYsIDQ4LCA1NF0gXHRcdFx0XHQvLyBrZWVwLCBiYXksIGhpbGxzLCBzdW5ueSwgY3JhZywgdGl0YW4sIGZhaXRoLCBmb2dcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJTb3V0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbNDUsIDQyLCA0MywgNDksIDU1XSBcdFx0XHRcdC8vIGJyaWFyLCBsYWtlLCBsb2RnZSwgdmFsZSwgd2F0ZXJcclxuXHRcdFx0Ly8gfSwge1xyXG5cdFx0XHQvLyBcdFwibGFiZWxcIjogXCJSdWluc1wiLFxyXG5cdFx0XHQvLyBcdFwiZ3JvdXBUeXBlXCI6IFwicnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcIm9iamVjdGl2ZXNcIjogWzc2ICwgNzUgLCA3NCAsIDczICwgNzIgXSBcdFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXVxyXG5cdH0sXHJcbl07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdC8vXHRFQkdcclxuXHRcIjlcIjpcdHtcInR5cGVcIjogMSwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMCwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU3RvbmVtaXN0IENhc3RsZVxyXG5cclxuXHQvL1x0UmVkIENvcm5lclxyXG5cdFwiMVwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBSZWQgS2VlcCAtIE92ZXJsb29rXHJcblx0XCIxN1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBSZWQgVG93ZXIgLSBNZW5kb24ncyBHYXBcclxuXHRcIjIwXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBUb3dlciAtIFZlbG9rYSBTbG9wZVxyXG5cdFwiMThcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIFRvd2VyIC0gQW56YWxpYXMgUGFzc1xyXG5cdFwiMTlcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gUmVkIFRvd2VyIC0gT2dyZXdhdGNoIEN1dFxyXG5cdFwiNlwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBSZWQgQ2FtcCAtIE1pbGwgLSBTcGVsZGFuXHJcblx0XCI1XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBDYW1wIC0gTWluZSAtIFBhbmdsb3NzXHJcblxyXG5cdC8vXHRCbHVlIENvcm5lclxyXG5cdFwiMlwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIEtlZXAgLSBWYWxsZXlcclxuXHRcIjE1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJsdWUgVG93ZXIgLSBMYW5nb3IgR3VsY2hcclxuXHRcIjIyXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgVG93ZXIgLSBCcmF2b3N0IEVzY2FycG1lbnRcclxuXHRcIjE2XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJsdWUgVG93ZXIgLSBRdWVudGluIExha2VcclxuXHRcIjIxXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgVG93ZXIgLSBEdXJpb3MgR3VsY2hcclxuXHRcIjdcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gQmx1ZSBDYW1wIC0gTWluZSAtIERhbmVsb25cclxuXHRcIjhcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBDYW1wIC0gTWlsbCAtIFVtYmVyZ2xhZGVcclxuXHJcblx0Ly9cdEdyZWVuIENvcm5lclxyXG5cdFwiM1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHcmVlbiBLZWVwIC0gTG93bGFuZHNcclxuXHRcIjExXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIFRvd2VyIC0gQWxkb25zXHJcblx0XCIxM1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBHcmVlbiBUb3dlciAtIEplcnJpZmVyJ3MgU2xvdWdoXHJcblx0XCIxMlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBHcmVlbiBUb3dlciAtIFdpbGRjcmVla1xyXG5cdFwiMTRcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gVG93ZXIgLSBLbG92YW4gR3VsbHlcclxuXHRcIjEwXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIENhbXAgLSBNaW5lIC0gUm9ndWVzIFF1YXJyeVxyXG5cdFwiNFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBHcmVlbiBDYW1wIC0gTWlsbCAtIEdvbGFudGFcclxuXHJcblxyXG5cdC8vXHRSZWRIb21lXHJcblx0XCIzN1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHYXJyaXNvblxyXG5cdFwiMzNcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmF5IC0gRHJlYW1pbmcgQmF5XHJcblx0XCIzMlwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBIaWxscyAtIEV0aGVyb24gSGlsbHNcclxuXHRcIjM4XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIFRvd2VyIC0gTG9uZ3ZpZXdcclxuXHRcIjQwXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIFRvd2VyIC0gQ2xpZmZzaWRlXHJcblx0XCIzOVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBOb3J0aCBDYW1wIC0gQ3Jvc3Nyb2FkcyAtIFRoZSBHb2Rzd29yZFxyXG5cdFwiNTJcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgQ2FtcCAtIE1pbmUgLSBBcmFoJ3MgSG9wZVxyXG5cdFwiNTFcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgQ2FtcCAtIE1pbGwgLSBBc3RyYWxob2xtZVxyXG5cclxuXHRcIjM1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIFRvd2VyIC0gR3JlZW5icmlhclxyXG5cdFwiMzZcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgVG93ZXIgLSBCbHVlbGFrZVxyXG5cdFwiMzRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU291dGggQ2FtcCAtIE9yY2hhcmQgLSBWaWN0b3IncyBMb2RnZVxyXG5cdFwiNTNcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgQ2FtcCAtIFdvcmtzaG9wIC0gR3JlZW52YWxlIFJlZnVnZVxyXG5cdFwiNTBcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgQ2FtcCAtIEZpc2hpbmcgVmlsbGFnZSAtIEJsdWV3YXRlciBMb3dsYW5kc1xyXG5cclxuXHJcblx0Ly9cdEdyZWVuSG9tZVxyXG5cdFwiNDZcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjQ0XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJheSAtIERyZWFkZmFsbCBCYXlcclxuXHRcIjQxXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gU2hhZGFyYW4gSGlsbHNcclxuXHRcIjQ3XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIFRvd2VyIC0gU3VubnloaWxsXHJcblx0XCI1N1wiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBUb3dlciAtIENyYWd0b3BcclxuXHRcIjU2XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIE5vcnRoIENhbXAgLSBDcm9zc3JvYWRzIC0gVGhlIFRpdGFucGF3XHJcblx0XCI0OFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBDYW1wIC0gTWluZSAtIEZhaXRobGVhcFxyXG5cdFwiNTRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgQ2FtcCAtIE1pbGwgLSBGb2doYXZlblxyXG5cclxuXHRcIjQ1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIFRvd2VyIC0gQmx1ZWJyaWFyXHJcblx0XCI0MlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBUb3dlciAtIFJlZGxha2VcclxuXHRcIjQzXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFNvdXRoIENhbXAgLSBPcmNoYXJkIC0gSGVybydzIExvZGdlXHJcblx0XCI0OVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBCbHVldmFsZSBSZWZ1Z2VcclxuXHRcIjU1XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBSZWR3YXRlciBMb3dsYW5kc1xyXG5cclxuXHJcblx0Ly9cdEJsdWVIb21lXHJcblx0XCIyM1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHYXJyaXNvblxyXG5cdFwiMjdcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmF5IC0gQXNjZW5zaW9uIEJheVxyXG5cdFwiMzFcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gSGlsbHMgLSBBc2thbGlvbiBIaWxsc1xyXG5cdFwiMzBcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgVG93ZXIgLSBXb29kaGF2ZW5cclxuXHRcIjI4XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIFRvd2VyIC0gRGF3bidzIEV5cmllXHJcblx0XCIyOVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBOb3J0aCBDYW1wIC0gQ3Jvc3Nyb2FkcyAtIFRoZSBTcGlyaXRob2xtZVxyXG5cdFwiNThcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgQ2FtcCAtIE1pbmUgLSBHb2RzbG9yZVxyXG5cdFwiNjBcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgQ2FtcCAtIE1pbGwgLSBTdGFyZ3JvdmVcclxuXHJcblx0XCIyNVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIFJlZGJyaWFyXHJcblx0XCIyNlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBUb3dlciAtIEdyZWVubGFrZVxyXG5cdFwiMjRcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU291dGggQ2FtcCAtIE9yY2hhcmQgLSBDaGFtcGlvbidzIERlbWVuc2VcclxuXHRcIjU5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIENhbXAgLSBXb3Jrc2hvcCAtIFJlZHZhbGUgUmVmdWdlXHJcblx0XCI2MVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBDYW1wIC0gRmlzaGluZyBWaWxsYWdlIC0gR3JlZW53YXRlciBMb3dsYW5kc1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjFcIjoge1wiaWRcIjogMSwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjJcIjoge1wiaWRcIjogMiwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjNcIjoge1wiaWRcIjogMywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjRcIjoge1wiaWRcIjogNCwgXCJuYW1lXCI6IFwiR3JlZW4gTWlsbFwifSxcclxuXHRcIjVcIjoge1wiaWRcIjogNSwgXCJuYW1lXCI6IFwiUmVkIE1pbmVcIn0sXHJcblx0XCI2XCI6IHtcImlkXCI6IDYsIFwibmFtZVwiOiBcIlJlZCBNaWxsXCJ9LFxyXG5cdFwiN1wiOiB7XCJpZFwiOiA3LCBcIm5hbWVcIjogXCJCbHVlIE1pbmVcIn0sXHJcblx0XCI4XCI6IHtcImlkXCI6IDgsIFwibmFtZVwiOiBcIkJsdWUgTWlsbFwifSxcclxuXHRcIjlcIjoge1wiaWRcIjogOSwgXCJuYW1lXCI6IFwiQ2FzdGxlXCJ9LFxyXG5cdFwiMTBcIjoge1wiaWRcIjogMTAsIFwibmFtZVwiOiBcIkdyZWVuIE1pbmVcIn0sXHJcblx0XCIxMVwiOiB7XCJpZFwiOiAxMSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxMlwiOiB7XCJpZFwiOiAxMiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxM1wiOiB7XCJpZFwiOiAxMywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxNFwiOiB7XCJpZFwiOiAxNCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxNVwiOiB7XCJpZFwiOiAxNSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxNlwiOiB7XCJpZFwiOiAxNiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxN1wiOiB7XCJpZFwiOiAxNywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxOFwiOiB7XCJpZFwiOiAxOCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIxOVwiOiB7XCJpZFwiOiAxOSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyMFwiOiB7XCJpZFwiOiAyMCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyMVwiOiB7XCJpZFwiOiAyMSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyMlwiOiB7XCJpZFwiOiAyMiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyM1wiOiB7XCJpZFwiOiAyMywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjI1XCI6IHtcImlkXCI6IDI1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjI0XCI6IHtcImlkXCI6IDI0LCBcIm5hbWVcIjogXCJPcmNoYXJkXCJ9LFxyXG5cdFwiMjZcIjoge1wiaWRcIjogMjYsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjdcIjoge1wiaWRcIjogMjcsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIyOFwiOiB7XCJpZFwiOiAyOCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyOVwiOiB7XCJpZFwiOiAyOSwgXCJuYW1lXCI6IFwiQ3Jvc3Nyb2Fkc1wifSxcclxuXHRcIjMwXCI6IHtcImlkXCI6IDMwLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjMxXCI6IHtcImlkXCI6IDMxLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzJcIjoge1wiaWRcIjogMzIsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzM1wiOiB7XCJpZFwiOiAzMywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjM0XCI6IHtcImlkXCI6IDM0LCBcIm5hbWVcIjogXCJPcmNoYXJkXCJ9LFxyXG5cdFwiMzVcIjoge1wiaWRcIjogMzUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzZcIjoge1wiaWRcIjogMzYsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzdcIjoge1wiaWRcIjogMzcsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzOFwiOiB7XCJpZFwiOiAzOCwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzOVwiOiB7XCJpZFwiOiAzOSwgXCJuYW1lXCI6IFwiQ3Jvc3Nyb2Fkc1wifSxcclxuXHRcIjQwXCI6IHtcImlkXCI6IDQwLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQxXCI6IHtcImlkXCI6IDQxLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNDJcIjoge1wiaWRcIjogNDIsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDNcIjoge1wiaWRcIjogNDMsIFwibmFtZVwiOiBcIk9yY2hhcmRcIn0sXHJcblx0XCI0NFwiOiB7XCJpZFwiOiA0NCwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjQ1XCI6IHtcImlkXCI6IDQ1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjQ2XCI6IHtcImlkXCI6IDQ2LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNDdcIjoge1wiaWRcIjogNDcsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDhcIjoge1wiaWRcIjogNDgsIFwibmFtZVwiOiBcIlF1YXJyeVwifSxcclxuXHRcIjQ5XCI6IHtcImlkXCI6IDQ5LCBcIm5hbWVcIjogXCJXb3Jrc2hvcFwifSxcclxuXHRcIjUwXCI6IHtcImlkXCI6IDUwLCBcIm5hbWVcIjogXCJGaXNoaW5nIFZpbGxhZ2VcIn0sXHJcblx0XCI1MVwiOiB7XCJpZFwiOiA1MSwgXCJuYW1lXCI6IFwiTHVtYmVyIE1pbGxcIn0sXHJcblx0XCI1MlwiOiB7XCJpZFwiOiA1MiwgXCJuYW1lXCI6IFwiUXVhcnJ5XCJ9LFxyXG5cdFwiNTNcIjoge1wiaWRcIjogNTMsIFwibmFtZVwiOiBcIldvcmtzaG9wXCJ9LFxyXG5cdFwiNTRcIjoge1wiaWRcIjogNTQsIFwibmFtZVwiOiBcIkx1bWJlciBNaWxsXCJ9LFxyXG5cdFwiNTVcIjoge1wiaWRcIjogNTUsIFwibmFtZVwiOiBcIkZpc2hpbmcgVmlsbGFnZVwifSxcclxuXHRcIjU2XCI6IHtcImlkXCI6IDU2LCBcIm5hbWVcIjogXCJDcm9zc3JvYWRzXCJ9LFxyXG5cdFwiNTdcIjoge1wiaWRcIjogNTcsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNThcIjoge1wiaWRcIjogNTgsIFwibmFtZVwiOiBcIlF1YXJyeVwifSxcclxuXHRcIjU5XCI6IHtcImlkXCI6IDU5LCBcIm5hbWVcIjogXCJXb3Jrc2hvcFwifSxcclxuXHRcIjYwXCI6IHtcImlkXCI6IDYwLCBcIm5hbWVcIjogXCJMdW1iZXIgTWlsbFwifSxcclxuXHRcIjYxXCI6IHtcImlkXCI6IDYxLCBcIm5hbWVcIjogXCJGaXNoaW5nIFZpbGxhZ2VcIn0sXHJcblx0XCI2MlwiOiB7XCJpZFwiOiA2MiwgXCJuYW1lXCI6IFwiKChUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzKSlcIn0sXHJcblx0XCI2M1wiOiB7XCJpZFwiOiA2MywgXCJuYW1lXCI6IFwiKChCYXR0bGUncyBIb2xsb3cpKVwifSxcclxuXHRcIjY0XCI6IHtcImlkXCI6IDY0LCBcIm5hbWVcIjogXCIoKEJhdWVyJ3MgRXN0YXRlKSlcIn0sXHJcblx0XCI2NVwiOiB7XCJpZFwiOiA2NSwgXCJuYW1lXCI6IFwiKChPcmNoYXJkIE92ZXJsb29rKSlcIn0sXHJcblx0XCI2NlwiOiB7XCJpZFwiOiA2NiwgXCJuYW1lXCI6IFwiKChDYXJ2ZXIncyBBc2NlbnQpKVwifSxcclxuXHRcIjY3XCI6IHtcImlkXCI6IDY3LCBcIm5hbWVcIjogXCIoKENhcnZlcidzIEFzY2VudCkpXCJ9LFxyXG5cdFwiNjhcIjoge1wiaWRcIjogNjgsIFwibmFtZVwiOiBcIigoT3JjaGFyZCBPdmVybG9vaykpXCJ9LFxyXG5cdFwiNjlcIjoge1wiaWRcIjogNjksIFwibmFtZVwiOiBcIigoQmF1ZXIncyBFc3RhdGUpKVwifSxcclxuXHRcIjcwXCI6IHtcImlkXCI6IDcwLCBcIm5hbWVcIjogXCIoKEJhdHRsZSdzIEhvbGxvdykpXCJ9LFxyXG5cdFwiNzFcIjoge1wiaWRcIjogNzEsIFwibmFtZVwiOiBcIigoVGVtcGxlIG9mIExvc3QgUHJheWVycykpXCJ9LFxyXG5cdFwiNzJcIjoge1wiaWRcIjogNzIsIFwibmFtZVwiOiBcIigoQ2FydmVyJ3MgQXNjZW50KSlcIn0sXHJcblx0XCI3M1wiOiB7XCJpZFwiOiA3MywgXCJuYW1lXCI6IFwiKChPcmNoYXJkIE92ZXJsb29rKSlcIn0sXHJcblx0XCI3NFwiOiB7XCJpZFwiOiA3NCwgXCJuYW1lXCI6IFwiKChCYXVlcidzIEVzdGF0ZSkpXCJ9LFxyXG5cdFwiNzVcIjoge1wiaWRcIjogNzUsIFwibmFtZVwiOiBcIigoQmF0dGxlJ3MgSG9sbG93KSlcIn0sXHJcblx0XCI3NlwiOiB7XCJpZFwiOiA3NiwgXCJuYW1lXCI6IFwiKChUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzKSlcIn1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxXCI6IHtcImlkXCI6IDEsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiAzNSwgXCJuYW1lXCI6IFwiY2FzdGxlXCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiAyLCBcInRpbWVyXCI6IDEsIFwidmFsdWVcIjogMjUsIFwibmFtZVwiOiBcImtlZXBcIn0sXHJcblx0XCIzXCI6IHtcImlkXCI6IDMsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiAxMCwgXCJuYW1lXCI6IFwidG93ZXJcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IDQsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiA1LCBcIm5hbWVcIjogXCJjYW1wXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiA1LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwidGVtcGxlXCJ9LFxyXG5cdFwiNlwiOiB7XCJpZFwiOiA2LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwiaG9sbG93XCJ9LFxyXG5cdFwiN1wiOiB7XCJpZFwiOiA3LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwiZXN0YXRlXCJ9LFxyXG5cdFwiOFwiOiB7XCJpZFwiOiA4LCBcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwib3Zlcmxvb2tcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IDksIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJhc2NlbnRcIn1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxMDAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbWJvc3NmZWxzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFtYm9zc2ZlbHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbnZpbCBSb2NrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFudmlsLXJvY2tcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NhIGRlbCBZdW5xdWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicm9jYS1kZWwteXVucXVlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jaGVyIGRlIGwnZW5jbHVtZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NoZXItZGUtbGVuY2x1bWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMtUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcyBQYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzbyBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzby1kZS1ib3JsaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNzYWdlIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNzYWdlLWRlLWJvcmxpc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkpha2JpZWd1bmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFrYmllZ3VuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIllhaydzIEJlbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwieWFrcy1iZW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVjbGl2ZSBkZWwgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlY2xpdmUtZGVsLXlha1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNvdXJiZSBkdSBZYWtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY291cmJlLWR1LXlha1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlbnJhdmlzIEVyZHdlcmtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVucmF2aXMtZXJkd2Vya1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhlbmdlIG9mIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaGVuZ2Utb2YtZGVucmF2aVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkPDrXJjdWxvIGRlIERlbnJhdmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2lyY3Vsby1kZS1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3JvbWxlY2ggZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcm9tbGVjaC1kZS1kZW5yYXZpXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSG9jaG9mZW4gZGVyIEJldHLDvGJuaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaG9jaG9mZW4tZGVyLWJldHJ1Ym5pc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNvcnJvdydzIEZ1cm5hY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic29ycm93cy1mdXJuYWNlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnJhZ3VhIGRlbCBQZXNhclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmcmFndWEtZGVsLXBlc2FyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm91cm5haXNlIGRlcyBsYW1lbnRhdGlvbnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm91cm5haXNlLWRlcy1sYW1lbnRhdGlvbnNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUb3IgZGVzIElycnNpbm5zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRvci1kZXMtaXJyc2lubnNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYXRlIG9mIE1hZG5lc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2F0ZS1vZi1tYWRuZXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhIGRlIGxhIExvY3VyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwdWVydGEtZGUtbGEtbG9jdXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUG9ydGUgZGUgbGEgZm9saWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicG9ydGUtZGUtbGEtZm9saWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlLVN0ZWluYnJ1Y2hcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zdGVpbmJydWNoXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZSBRdWFycnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1xdWFycnlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW50ZXJhIGRlIEphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FudGVyYS1kZS1qYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FycmnDqHJlIGRlIGphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FycmllcmUtZGUtamFkZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgRXNwZW53YWxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtZXNwZW53YWxkXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBBc3Blbndvb2RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1hc3Blbndvb2RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1hc3Blbndvb2RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFRyZW1ibGVmb3LDqnRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC10cmVtYmxlZm9yZXRcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFaG1yeS1CdWNodFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlaG1yeS1idWNodFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5IEJheVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlaG1yeS1iYXlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgRWhtcnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtZWhtcnlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWllIGQnRWhtcnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFpZS1kZWhtcnlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDExXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdHVybWtsaXBwZW4tSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3R1cm1rbGlwcGVuLWluc2VsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3Rvcm1ibHVmZiBJc2xlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0b3JtYmx1ZmYtaXNsZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGEgQ2ltYXRvcm1lbnRhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtY2ltYXRvcm1lbnRhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIGxhIEZhbGFpc2UgdHVtdWx0dWV1c2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWxhLWZhbGFpc2UtdHVtdWx0dWV1c2VcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaW5zdGVyZnJlaXN0YXR0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpbnN0ZXJmcmVpc3RhdHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEYXJraGF2ZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGFya2hhdmVuXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdpbyBPc2N1cm9cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdpby1vc2N1cm9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2Ugbm9pclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2Utbm9pclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhlaWxpZ2UgSGFsbGUgdm9uIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaGVpbGlnZS1oYWxsZS12b24tcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dW0gb2YgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVtLW9mLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYWdyYXJpbyBkZSBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhZ3JhcmlvLWRlLXJhbGxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTYW5jdHVhaXJlIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FuY3R1YWlyZS1kZS1yYWxsXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS3Jpc3RhbGx3w7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia3Jpc3RhbGx3dXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyeXN0YWwgRGVzZXJ0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyeXN0YWwtZGVzZXJ0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzaWVydG8gZGUgQ3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNpZXJ0by1kZS1jcmlzdGFsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc2VydCBkZSBjcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2VydC1kZS1jcmlzdGFsXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFudGhpci1JbnNlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYW50aGlyLWluc2VsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsZSBvZiBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGUtb2YtamFudGhpclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGEgZGUgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xhLWRlLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbGUgZGUgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbGUtZGUtamFudGhpclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTZcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lZXIgZGVzIExlaWRzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lZXItZGVzLWxlaWRzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VhIG9mIFNvcnJvd3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VhLW9mLXNvcnJvd3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbCBNYXIgZGUgbG9zIFBlc2FyZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWwtbWFyLWRlLWxvcy1wZXNhcmVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlcyBsYW1lbnRhdGlvbnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVyLWRlcy1sYW1lbnRhdGlvbnNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCZWZsZWNrdGUgS8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJlZmxlY2t0ZS1rdXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRhcm5pc2hlZCBDb2FzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0YXJuaXNoZWQtY29hc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3N0YSBkZSBCcm9uY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY29zdGEtZGUtYnJvbmNlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8O0dGUgdGVybmllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdGUtdGVybmllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTsO2cmRsaWNoZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9yZGxpY2hlLXppdHRlcmdpcGZlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk5vcnRoZXJuIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcnRoZXJuLXNoaXZlcnBlYWtzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGljb3Nlc2NhbG9mcmlhbnRlcyBkZWwgTm9ydGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGljb3Nlc2NhbG9mcmlhbnRlcy1kZWwtbm9ydGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDaW1lZnJvaWRlcyBub3JkaXF1ZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2ltZWZyb2lkZXMtbm9yZGlxdWVzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2Nod2FyenRvclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzY2h3YXJ6dG9yXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2tnYXRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrZ2F0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlB1ZXJ0YW5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUG9ydGVub2lyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZW5vaXJlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb25zIEtyZXV6dW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1rcmV1enVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29uJ3MgQ3Jvc3NpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWNyb3NzaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRW5jcnVjaWphZGEgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZW5jcnVjaWphZGEtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9pc8OpZSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcm9pc2VlLWRlLWZlcmd1c29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJhY2hlbmJyYW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWNoZW5icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWdvbmJyYW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWdvbmJyYW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyY2EgZGVsIERyYWfDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyY2EtZGVsLWRyYWdvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0aWdtYXRlIGR1IGRyYWdvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdGlnbWF0ZS1kdS1kcmFnb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLYWluZW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImthaW5lbmdcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmFzIFJhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJlc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNjYW5zbyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzY2Fuc28tZGUtZGV2b25hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlcG9zLWRlLWRldm9uYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVyZWRvbi1UZXJyYXNzZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlcmVkb24tdGVycmFzc2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24gVGVycmFjZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlcmVkb24tdGVycmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRlcnJhemEgZGUgRXJlZG9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRlcnJhemEtZGUtZXJlZG9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhdGVhdSBkJ0VyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF0ZWF1LWRlcmVkb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLbGFnZW5yaXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtsYWdlbnJpc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXNzdXJlIG9mIFdvZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLW9mLXdvZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3VyYSBkZSBsYSBBZmxpY2Npw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3VyYS1kZS1sYS1hZmxpY2Npb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGaXNzdXJlIGR1IG1hbGhldXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzc3VyZS1kdS1tYWxoZXVyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiw5ZkbmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm9kbmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHYW5kYXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImdhbmRhcmFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6Zmx1dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzY2h3YXJ6Zmx1dFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJsYWNrdGlkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJibGFja3RpZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXJlYSBOZWdyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXJlYS1uZWdyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk5vaXJmbG90XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vaXJmbG90XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmV1ZXJyaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZldWVycmluZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpbmcgb2YgRmlyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaW5nLW9mLWZpcmVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbmlsbG8gZGUgRnVlZ29cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW5pbGxvLWRlLWZ1ZWdvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2VyY2xlIGRlIGZldVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjZXJjbGUtZGUtZmV1XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVW50ZXJ3ZWx0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVudGVyd2VsdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVuZGVyd29ybGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidW5kZXJ3b3JsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkluZnJhbXVuZG9cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaW5mcmFtdW5kb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk91dHJlLW1vbmRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm91dHJlLW1vbmRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVybmUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcm5lLXppdHRlcmdpcGZlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZhciBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmYXItc2hpdmVycGVha3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMZWphbmFzIFBpY29zZXNjYWxvZnJpYW50ZXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGVqYW5hcy1waWNvc2VzY2Fsb2ZyaWFudGVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTG9pbnRhaW5lcyBDaW1lZnJvaWRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsb2ludGFpbmVzLWNpbWVmcm9pZGVzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwOFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2Vpw59mbGFua2dyYXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2Vpc3NmbGFua2dyYXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXaGl0ZXNpZGUgUmlkZ2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2hpdGVzaWRlLXJpZGdlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FkZW5hIExhZGVyYWJsYW5jYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYWRlbmEtbGFkZXJhYmxhbmNhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3LDqnRlIGRlIFZlcnNlYmxhbmNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JldGUtZGUtdmVyc2VibGFuY1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDlcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5lbiB2b24gU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lbi12b24tc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbnMgb2YgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5zLW9mLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5hcyBkZSBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmFzLWRlLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5lcyBkZSBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmVzLWRlLXN1cm1pYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlZW1hbm5zcmFzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWVtYW5uc3Jhc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWFmYXJlcidzIFJlc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2VhZmFyZXJzLXJlc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2lvIGRlbCBWaWFqYW50ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2lvLWRlbC12aWFqYW50ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlcG9zIGR1IE1hcmluXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlcG9zLWR1LW1hcmluXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbi1QbGF0elwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWtlbi1wbGF0elwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpa2VuIFNxdWFyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWtlbi1zcXVhcmVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF6YSBkZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS1waWtlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYWNlIFBpa2VuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLXBpa2VuXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGljaHR1bmcgZGVyIE1vcmdlbnLDtnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxpY2h0dW5nLWRlci1tb3JnZW5yb3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVyb3JhIEdsYWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1cm9yYS1nbGFkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYXJvIGRlIGxhIEF1cm9yYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjbGFyby1kZS1sYS1hdXJvcmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDbGFpcmnDqHJlIGRlIGwnYXVyb3JlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYWlyaWVyZS1kZS1sYXVyb3JlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFycyBGZXN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWZlc3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFyJ3MgSG9sZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWhvbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1kZS1ndW5uYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW1wZW1lbnQgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbXBlbWVudC1kZS1ndW5uYXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlbWVlciBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGVtZWVyLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZSBTZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXNlYS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hciBkZSBKYWRlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWFyLWRlLWphZGUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1lci1kZS1qYWRlLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJlbnN0ZWluIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJ5IFJvY2sgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cnktcm9jay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIEF1Z3VyaW8gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC1hdWd1cmlvLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jaGUgZGUgbCdBdWd1cmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NoZS1kZS1sYXVndXJlLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haC1QbGF0eiBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZpenVuYWgtcGxhdHotZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWaXp1bmFoIFNxdWFyZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZpenVuYWgtc3F1YXJlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXphLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBkZSBWaXp1bmFoIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhY2UtZGUtdml6dW5haC1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhdWJlbnN0ZWluIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGF1YmVuc3RlaW4tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBcmJvcnN0b25lIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXJib3JzdG9uZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpZWRyYSBBcmLDs3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZWRyYS1hcmJvcmVhLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllcnJlIEFyYm9yZWEgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWVycmUtYXJib3JlYS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2NoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmx1c3N1ZmVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmx1c3N1ZmVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUml2ZXJzaWRlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicml2ZXJzaWRlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmliZXJhIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmliZXJhLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHJvdmluY2VzIGZsdXZpYWxlcyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInByb3ZpbmNlcy1mbHV2aWFsZXMtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbG9uYWZlbHMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbG9uYWZlbHMtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbG9uYSBSZWFjaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hLXJlYWNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2HDscOzbiBkZSBFbG9uYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbm9uLWRlLWVsb25hLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmllZiBkJ0Vsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmllZi1kZWxvbmEtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9ucyBNdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbXVuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb24ncyBNb3V0aCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW1vdXRoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9jYSBkZSBBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9jYS1kZS1hYmFkZG9uLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm91Y2hlIGQnQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvdWNoZS1kYWJhZGRvbi1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDVcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWtrYXItU2VlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1zZWUtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyIExha2UgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFra2FyLWxha2UtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYWdvIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWdvLWRyYWtrYXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMYWMgRHJha2thciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhYy1kcmFra2FyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWlsbGVyc3VuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1pbGxlcnN1bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXIncyBTb3VuZCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1pbGxlcnMtc291bmQtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFc3RyZWNobyBkZSBNaWxsZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlc3RyZWNoby1kZS1taWxsZXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6l0cm9pdCBkZSBNaWxsZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXRyb2l0LWRlLW1pbGxlci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMzAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMzAxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYXJ1Y2gtQnVjaHQgW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYXJ1Y2gtYnVjaHQtc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYXJ1Y2ggQmF5IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJheS1zcFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBCYXJ1Y2ggW0VTXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1iYXJ1Y2gtZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWllIGRlIEJhcnVjaCBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaWUtZGUtYmFydWNoLXNwXCJcclxuXHRcdH1cclxuXHR9LFxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRsYW5nczogcmVxdWlyZSgnLi9kYXRhL2xhbmdzJyksXHJcblx0d29ybGRzOiByZXF1aXJlKCcuL2RhdGEvd29ybGRfbmFtZXMnKSxcclxuXHRvYmplY3RpdmVfbmFtZXM6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbmFtZXMnKSxcclxuXHRvYmplY3RpdmVfdHlwZXM6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfdHlwZXMnKSxcclxuXHRvYmplY3RpdmVfbWV0YTogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9tZXRhJyksXHJcblx0b2JqZWN0aXZlX2xhYmVsczogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9sYWJlbHMnKSxcclxuXHRvYmplY3RpdmVfbWFwOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX21hcCcpLFxyXG59O1xyXG4iLCIgIC8qIGdsb2JhbHMgcmVxdWlyZSwgbW9kdWxlICovXG5cbi8qKlxuICAgKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICAgKi9cblxuICB2YXIgcGF0aHRvUmVnZXhwID0gcmVxdWlyZSgncGF0aC10by1yZWdleHAnKTtcblxuICAvKipcbiAgICogTW9kdWxlIGV4cG9ydHMuXG4gICAqL1xuXG4gIG1vZHVsZS5leHBvcnRzID0gcGFnZTtcblxuICAvKipcbiAgICogVG8gd29yayBwcm9wZXJseSB3aXRoIHRoZSBVUkxcbiAgICogaGlzdG9yeS5sb2NhdGlvbiBnZW5lcmF0ZWQgcG9seWZpbGwgaW4gaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuICAgKi9cblxuICB2YXIgbG9jYXRpb24gPSB3aW5kb3cuaGlzdG9yeS5sb2NhdGlvbiB8fCB3aW5kb3cubG9jYXRpb247XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gaW5pdGlhbCBkaXNwYXRjaC5cbiAgICovXG5cbiAgdmFyIGRpc3BhdGNoID0gdHJ1ZTtcblxuICAvKipcbiAgICogQmFzZSBwYXRoLlxuICAgKi9cblxuICB2YXIgYmFzZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBSdW5uaW5nIGZsYWcuXG4gICAqL1xuXG4gIHZhciBydW5uaW5nO1xuXG4gIC8qKlxuICAqIEhhc2hCYW5nIG9wdGlvblxuICAqL1xuXG4gIHZhciBoYXNoYmFuZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBgcGF0aGAgd2l0aCBjYWxsYmFjayBgZm4oKWAsXG4gICAqIG9yIHJvdXRlIGBwYXRoYCwgb3IgYHBhZ2Uuc3RhcnQoKWAuXG4gICAqXG4gICAqICAgcGFnZShmbik7XG4gICAqICAgcGFnZSgnKicsIGZuKTtcbiAgICogICBwYWdlKCcvdXNlci86aWQnLCBsb2FkLCB1c2VyKTtcbiAgICogICBwYWdlKCcvdXNlci8nICsgdXNlci5pZCwgeyBzb21lOiAndGhpbmcnIH0pO1xuICAgKiAgIHBhZ2UoJy91c2VyLycgKyB1c2VyLmlkKTtcbiAgICogICBwYWdlKCk7XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSBwYXRoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuLi4uXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHBhZ2UocGF0aCwgZm4pIHtcbiAgICAvLyA8Y2FsbGJhY2s+XG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBwYXRoKSB7XG4gICAgICByZXR1cm4gcGFnZSgnKicsIHBhdGgpO1xuICAgIH1cblxuICAgIC8vIHJvdXRlIDxwYXRoPiB0byA8Y2FsbGJhY2sgLi4uPlxuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZm4pIHtcbiAgICAgIHZhciByb3V0ZSA9IG5ldyBSb3V0ZShwYXRoKTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHBhZ2UuY2FsbGJhY2tzLnB1c2gocm91dGUubWlkZGxld2FyZShhcmd1bWVudHNbaV0pKTtcbiAgICAgIH1cbiAgICAvLyBzaG93IDxwYXRoPiB3aXRoIFtzdGF0ZV1cbiAgICB9IGVsc2UgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBwYXRoKSB7XG4gICAgICAnc3RyaW5nJyA9PT0gdHlwZW9mIGZuXG4gICAgICAgID8gcGFnZS5yZWRpcmVjdChwYXRoLCBmbilcbiAgICAgICAgOiBwYWdlLnNob3cocGF0aCwgZm4pO1xuICAgIC8vIHN0YXJ0IFtvcHRpb25zXVxuICAgIH0gZWxzZSB7XG4gICAgICBwYWdlLnN0YXJ0KHBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmdW5jdGlvbnMuXG4gICAqL1xuXG4gIHBhZ2UuY2FsbGJhY2tzID0gW107XG5cbiAgLyoqXG4gICAqIEdldCBvciBzZXQgYmFzZXBhdGggdG8gYHBhdGhgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLmJhc2UgPSBmdW5jdGlvbihwYXRoKXtcbiAgICBpZiAoMCA9PT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGJhc2U7XG4gICAgYmFzZSA9IHBhdGg7XG4gIH07XG5cbiAgLyoqXG4gICAqIEJpbmQgd2l0aCB0aGUgZ2l2ZW4gYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgICAtIGBjbGlja2AgYmluZCB0byBjbGljayBldmVudHMgW3RydWVdXG4gICAqICAgIC0gYHBvcHN0YXRlYCBiaW5kIHRvIHBvcHN0YXRlIFt0cnVlXVxuICAgKiAgICAtIGBkaXNwYXRjaGAgcGVyZm9ybSBpbml0aWFsIGRpc3BhdGNoIFt0cnVlXVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnN0YXJ0ID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKHJ1bm5pbmcpIHJldHVybjtcbiAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICBpZiAoZmFsc2UgPT09IG9wdGlvbnMuZGlzcGF0Y2gpIGRpc3BhdGNoID0gZmFsc2U7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLnBvcHN0YXRlKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLmNsaWNrKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNsaWNrLCBmYWxzZSk7XG4gICAgaWYgKHRydWUgPT09IG9wdGlvbnMuaGFzaGJhbmcpIGhhc2hiYW5nID0gdHJ1ZTtcbiAgICBpZiAoIWRpc3BhdGNoKSByZXR1cm47XG4gICAgdmFyIHVybCA9IChoYXNoYmFuZyAmJiB+bG9jYXRpb24uaGFzaC5pbmRleE9mKCcjIScpKVxuICAgICAgPyBsb2NhdGlvbi5oYXNoLnN1YnN0cigyKSArIGxvY2F0aW9uLnNlYXJjaFxuICAgICAgOiBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCArIGxvY2F0aW9uLmhhc2g7XG4gICAgcGFnZS5yZXBsYWNlKHVybCwgbnVsbCwgdHJ1ZSwgZGlzcGF0Y2gpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVbmJpbmQgY2xpY2sgYW5kIHBvcHN0YXRlIGV2ZW50IGhhbmRsZXJzLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnN0b3AgPSBmdW5jdGlvbigpe1xuICAgIGlmICghcnVubmluZykgcmV0dXJuO1xuICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNsaWNrLCBmYWxzZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25wb3BzdGF0ZSwgZmFsc2UpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93IGBwYXRoYCB3aXRoIG9wdGlvbmFsIGBzdGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQHBhcmFtIHtCb29sZWFufSBkaXNwYXRjaFxuICAgKiBAcmV0dXJuIHtDb250ZXh0fVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnNob3cgPSBmdW5jdGlvbihwYXRoLCBzdGF0ZSwgZGlzcGF0Y2gpe1xuICAgIHZhciBjdHggPSBuZXcgQ29udGV4dChwYXRoLCBzdGF0ZSk7XG4gICAgaWYgKGZhbHNlICE9PSBkaXNwYXRjaCkgcGFnZS5kaXNwYXRjaChjdHgpO1xuICAgIGlmIChmYWxzZSAhPT0gY3R4LmhhbmRsZWQpIGN0eC5wdXNoU3RhdGUoKTtcbiAgICByZXR1cm4gY3R4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93IGBwYXRoYCB3aXRoIG9wdGlvbmFsIGBzdGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZnJvbVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdG9cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG4gIHBhZ2UucmVkaXJlY3QgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICAgIHBhZ2UoZnJvbSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhZ2UucmVwbGFjZSh0byk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogUmVwbGFjZSBgcGF0aGAgd2l0aCBvcHRpb25hbCBgc3RhdGVgIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UucmVwbGFjZSA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBpbml0LCBkaXNwYXRjaCl7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBjdHguaW5pdCA9IGluaXQ7XG4gICAgY3R4LnNhdmUoKTsgLy8gc2F2ZSBiZWZvcmUgZGlzcGF0Y2hpbmcsIHdoaWNoIG1heSByZWRpcmVjdFxuICAgIGlmIChmYWxzZSAhPT0gZGlzcGF0Y2gpIHBhZ2UuZGlzcGF0Y2goY3R4KTtcbiAgICByZXR1cm4gY3R4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCB0aGUgZ2l2ZW4gYGN0eGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIHBhZ2UuZGlzcGF0Y2ggPSBmdW5jdGlvbihjdHgpe1xuICAgIHZhciBpID0gMDtcblxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB2YXIgZm4gPSBwYWdlLmNhbGxiYWNrc1tpKytdO1xuICAgICAgaWYgKCFmbikgcmV0dXJuIHVuaGFuZGxlZChjdHgpO1xuICAgICAgZm4oY3R4LCBuZXh0KTtcbiAgICB9XG5cbiAgICBuZXh0KCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFVuaGFuZGxlZCBgY3R4YC4gV2hlbiBpdCdzIG5vdCB0aGUgaW5pdGlhbFxuICAgKiBwb3BzdGF0ZSB0aGVuIHJlZGlyZWN0LiBJZiB5b3Ugd2lzaCB0byBoYW5kbGVcbiAgICogNDA0cyBvbiB5b3VyIG93biB1c2UgYHBhZ2UoJyonLCBjYWxsYmFjaylgLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbnRleHR9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gdW5oYW5kbGVkKGN0eCkge1xuICAgIGlmIChjdHguaGFuZGxlZCkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50O1xuXG4gICAgaWYgKGhhc2hiYW5nKSB7XG4gICAgICBjdXJyZW50ID0gYmFzZSArIGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIyEnLCcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50ID09PSBjdHguY2Fub25pY2FsUGF0aCkgcmV0dXJuO1xuICAgIHBhZ2Uuc3RvcCgpO1xuICAgIGN0eC5oYW5kbGVkID0gZmFsc2U7XG4gICAgbG9jYXRpb24uaHJlZiA9IGN0eC5jYW5vbmljYWxQYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBuZXcgXCJyZXF1ZXN0XCIgYENvbnRleHRgXG4gICAqIHdpdGggdGhlIGdpdmVuIGBwYXRoYCBhbmQgb3B0aW9uYWwgaW5pdGlhbCBgc3RhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gQ29udGV4dChwYXRoLCBzdGF0ZSkge1xuICAgIGlmICgnLycgPT09IHBhdGhbMF0gJiYgMCAhPT0gcGF0aC5pbmRleE9mKGJhc2UpKSBwYXRoID0gYmFzZSArIHBhdGg7XG4gICAgdmFyIGkgPSBwYXRoLmluZGV4T2YoJz8nKTtcblxuICAgIHRoaXMuY2Fub25pY2FsUGF0aCA9IHBhdGg7XG4gICAgdGhpcy5wYXRoID0gcGF0aC5yZXBsYWNlKGJhc2UsICcnKSB8fCAnLyc7XG5cbiAgICB0aGlzLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlIHx8IHt9O1xuICAgIHRoaXMuc3RhdGUucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5xdWVyeXN0cmluZyA9IH5pXG4gICAgICA/IHBhdGguc2xpY2UoaSArIDEpXG4gICAgICA6ICcnO1xuICAgIHRoaXMucGF0aG5hbWUgPSB+aVxuICAgICAgPyBwYXRoLnNsaWNlKDAsIGkpXG4gICAgICA6IHBhdGg7XG4gICAgdGhpcy5wYXJhbXMgPSBbXTtcblxuICAgIC8vIGZyYWdtZW50XG4gICAgdGhpcy5oYXNoID0gJyc7XG4gICAgaWYgKCF+dGhpcy5wYXRoLmluZGV4T2YoJyMnKSkgcmV0dXJuO1xuICAgIHZhciBwYXJ0cyA9IHRoaXMucGF0aC5zcGxpdCgnIycpO1xuICAgIHRoaXMucGF0aCA9IHBhcnRzWzBdO1xuICAgIHRoaXMuaGFzaCA9IHBhcnRzWzFdIHx8ICcnO1xuICAgIHRoaXMucXVlcnlzdHJpbmcgPSB0aGlzLnF1ZXJ5c3RyaW5nLnNwbGl0KCcjJylbMF07XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIGBDb250ZXh0YC5cbiAgICovXG5cbiAgcGFnZS5Db250ZXh0ID0gQ29udGV4dDtcblxuICAvKipcbiAgICogUHVzaCBzdGF0ZS5cbiAgICpcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIENvbnRleHQucHJvdG90eXBlLnB1c2hTdGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUodGhpcy5zdGF0ZVxuICAgICAgLCB0aGlzLnRpdGxlXG4gICAgICAsIGhhc2hiYW5nICYmIHRoaXMucGF0aCAhPT0gJy8nXG4gICAgICAgID8gJyMhJyArIHRoaXMucGF0aFxuICAgICAgICA6IHRoaXMuY2Fub25pY2FsUGF0aCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIGNvbnRleHQgc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIENvbnRleHQucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHRoaXMuc3RhdGVcbiAgICAgICwgdGhpcy50aXRsZVxuICAgICAgLCBoYXNoYmFuZyAmJiB0aGlzLnBhdGggIT09ICcvJ1xuICAgICAgICA/ICcjIScgKyB0aGlzLnBhdGhcbiAgICAgICAgOiB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGBSb3V0ZWAgd2l0aCB0aGUgZ2l2ZW4gSFRUUCBgcGF0aGAsXG4gICAqIGFuZCBhbiBhcnJheSBvZiBgY2FsbGJhY2tzYCBhbmQgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgIC0gYHNlbnNpdGl2ZWAgICAgZW5hYmxlIGNhc2Utc2Vuc2l0aXZlIHJvdXRlc1xuICAgKiAgIC0gYHN0cmljdGAgICAgICAgZW5hYmxlIHN0cmljdCBtYXRjaGluZyBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFJvdXRlKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnBhdGggPSAocGF0aCA9PT0gJyonKSA/ICcoLiopJyA6IHBhdGg7XG4gICAgdGhpcy5tZXRob2QgPSAnR0VUJztcbiAgICB0aGlzLnJlZ2V4cCA9IHBhdGh0b1JlZ2V4cCh0aGlzLnBhdGgsXG4gICAgICB0aGlzLmtleXMgPSBbXSxcbiAgICAgIG9wdGlvbnMuc2Vuc2l0aXZlLFxuICAgICAgb3B0aW9ucy5zdHJpY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgUm91dGVgLlxuICAgKi9cblxuICBwYWdlLlJvdXRlID0gUm91dGU7XG5cbiAgLyoqXG4gICAqIFJldHVybiByb3V0ZSBtaWRkbGV3YXJlIHdpdGhcbiAgICogdGhlIGdpdmVuIGNhbGxiYWNrIGBmbigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24oZm4pe1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24oY3R4LCBuZXh0KXtcbiAgICAgIGlmIChzZWxmLm1hdGNoKGN0eC5wYXRoLCBjdHgucGFyYW1zKSkgcmV0dXJuIGZuKGN0eCwgbmV4dCk7XG4gICAgICBuZXh0KCk7XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhpcyByb3V0ZSBtYXRjaGVzIGBwYXRoYCwgaWYgc29cbiAgICogcG9wdWxhdGUgYHBhcmFtc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtc1xuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24ocGF0aCwgcGFyYW1zKXtcbiAgICB2YXIga2V5cyA9IHRoaXMua2V5cyxcbiAgICAgICAgcXNJbmRleCA9IHBhdGguaW5kZXhPZignPycpLFxuICAgICAgICBwYXRobmFtZSA9IH5xc0luZGV4XG4gICAgICAgICAgPyBwYXRoLnNsaWNlKDAsIHFzSW5kZXgpXG4gICAgICAgICAgOiBwYXRoLFxuICAgICAgICBtID0gdGhpcy5yZWdleHAuZXhlYyhkZWNvZGVVUklDb21wb25lbnQocGF0aG5hbWUpKTtcblxuICAgIGlmICghbSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IG0ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2kgLSAxXTtcblxuICAgICAgdmFyIHZhbCA9ICdzdHJpbmcnID09PSB0eXBlb2YgbVtpXVxuICAgICAgICA/IGRlY29kZVVSSUNvbXBvbmVudChtW2ldKVxuICAgICAgICA6IG1baV07XG5cbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgcGFyYW1zW2tleS5uYW1lXSA9IHVuZGVmaW5lZCAhPT0gcGFyYW1zW2tleS5uYW1lXVxuICAgICAgICAgID8gcGFyYW1zW2tleS5uYW1lXVxuICAgICAgICAgIDogdmFsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyYW1zLnB1c2godmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIFwicG9wdWxhdGVcIiBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9ucG9wc3RhdGUoZSkge1xuICAgIGlmIChlLnN0YXRlKSB7XG4gICAgICB2YXIgcGF0aCA9IGUuc3RhdGUucGF0aDtcbiAgICAgIHBhZ2UucmVwbGFjZShwYXRoLCBlLnN0YXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFwiY2xpY2tcIiBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uY2xpY2soZSkge1xuICAgIGlmICgxICE9IHdoaWNoKGUpKSByZXR1cm47XG4gICAgaWYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5zaGlmdEtleSkgcmV0dXJuO1xuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcblxuICAgIC8vIGVuc3VyZSBsaW5rXG4gICAgdmFyIGVsID0gZS50YXJnZXQ7XG4gICAgd2hpbGUgKGVsICYmICdBJyAhPSBlbC5ub2RlTmFtZSkgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIGlmICghZWwgfHwgJ0EnICE9IGVsLm5vZGVOYW1lKSByZXR1cm47XG5cbiAgICAvLyBlbnN1cmUgbm9uLWhhc2ggZm9yIHRoZSBzYW1lIHBhdGhcbiAgICB2YXIgbGluayA9IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGlmIChlbC5wYXRobmFtZSA9PT0gbG9jYXRpb24ucGF0aG5hbWUgJiYgKGVsLmhhc2ggfHwgJyMnID09PSBsaW5rKSkgcmV0dXJuO1xuXG4gICAgLy8gQ2hlY2sgZm9yIG1haWx0bzogaW4gdGhlIGhyZWZcbiAgICBpZiAobGluayAmJiBsaW5rLmluZGV4T2YoXCJtYWlsdG86XCIpID4gLTEpIHJldHVybjtcblxuICAgIC8vIGNoZWNrIHRhcmdldFxuICAgIGlmIChlbC50YXJnZXQpIHJldHVybjtcblxuICAgIC8vIHgtb3JpZ2luXG4gICAgaWYgKCFzYW1lT3JpZ2luKGVsLmhyZWYpKSByZXR1cm47XG5cbiAgICAvLyByZWJ1aWxkIHBhdGhcbiAgICB2YXIgcGF0aCA9IGVsLnBhdGhuYW1lICsgZWwuc2VhcmNoICsgKGVsLmhhc2ggfHwgJycpO1xuXG4gICAgLy8gc2FtZSBwYWdlXG4gICAgdmFyIG9yaWcgPSBwYXRoO1xuXG4gICAgcGF0aCA9IHBhdGgucmVwbGFjZShiYXNlLCAnJyk7XG5cbiAgICBpZiAoYmFzZSAmJiBvcmlnID09PSBwYXRoKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGFnZS5zaG93KG9yaWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGJ1dHRvbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gd2hpY2goZSkge1xuICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICByZXR1cm4gbnVsbCA9PT0gZS53aGljaFxuICAgICAgPyBlLmJ1dHRvblxuICAgICAgOiBlLndoaWNoO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGBocmVmYCBpcyB0aGUgc2FtZSBvcmlnaW4uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNhbWVPcmlnaW4oaHJlZikge1xuICAgIHZhciBvcmlnaW4gPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0bmFtZTtcbiAgICBpZiAobG9jYXRpb24ucG9ydCkgb3JpZ2luICs9ICc6JyArIGxvY2F0aW9uLnBvcnQ7XG4gICAgcmV0dXJuIChocmVmICYmICgwID09PSBocmVmLmluZGV4T2Yob3JpZ2luKSkpO1xuICB9XG5cbiAgcGFnZS5zYW1lT3JpZ2luID0gc2FtZU9yaWdpbjtcbiIsIi8qKlxuICogRXhwb3NlIGBwYXRodG9SZWdleHBgLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHBhdGh0b1JlZ2V4cDtcblxuLyoqXG4gKiBUaGUgbWFpbiBwYXRoIG1hdGNoaW5nIHJlZ2V4cCB1dGlsaXR5LlxuICpcbiAqIEB0eXBlIHtSZWdFeHB9XG4gKi9cbnZhciBQQVRIX1JFR0VYUCA9IG5ldyBSZWdFeHAoW1xuICAvLyBNYXRjaCBhbHJlYWR5IGVzY2FwZWQgY2hhcmFjdGVycyB0aGF0IHdvdWxkIG90aGVyd2lzZSBpbmNvcnJlY3RseSBhcHBlYXJcbiAgLy8gaW4gZnV0dXJlIG1hdGNoZXMuIFRoaXMgYWxsb3dzIHRoZSB1c2VyIHRvIGVzY2FwZSBzcGVjaWFsIGNoYXJhY3RlcnMgdGhhdFxuICAvLyBzaG91bGRuJ3QgYmUgdHJhbnNmb3JtZWQuXG4gICcoXFxcXFxcXFwuKScsXG4gIC8vIE1hdGNoIEV4cHJlc3Mtc3R5bGUgcGFyYW1ldGVycyBhbmQgdW4tbmFtZWQgcGFyYW1ldGVycyB3aXRoIGEgcHJlZml4XG4gIC8vIGFuZCBvcHRpb25hbCBzdWZmaXhlcy4gTWF0Y2hlcyBhcHBlYXIgYXM6XG4gIC8vXG4gIC8vIFwiLzp0ZXN0KFxcXFxkKyk/XCIgPT4gW1wiL1wiLCBcInRlc3RcIiwgXCJcXGQrXCIsIHVuZGVmaW5lZCwgXCI/XCJdXG4gIC8vIFwiL3JvdXRlKFxcXFxkKylcIiA9PiBbdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJcXGQrXCIsIHVuZGVmaW5lZF1cbiAgJyhbXFxcXC8uXSk/KD86XFxcXDooXFxcXHcrKSg/OlxcXFwoKCg/OlxcXFxcXFxcLnxbXildKSopXFxcXCkpP3xcXFxcKCgoPzpcXFxcXFxcXC58W14pXSkqKVxcXFwpKShbKyo/XSk/JyxcbiAgLy8gTWF0Y2ggcmVnZXhwIHNwZWNpYWwgY2hhcmFjdGVycyB0aGF0IHNob3VsZCBhbHdheXMgYmUgZXNjYXBlZC5cbiAgJyhbLisqPz1eIToke30oKVtcXFxcXXxcXFxcL10pJ1xuXS5qb2luKCd8JyksICdnJyk7XG5cbi8qKlxuICogRXNjYXBlIHRoZSBjYXB0dXJpbmcgZ3JvdXAgYnkgZXNjYXBpbmcgc3BlY2lhbCBjaGFyYWN0ZXJzIGFuZCBtZWFuaW5nLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gZ3JvdXBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZXNjYXBlR3JvdXAgKGdyb3VwKSB7XG4gIHJldHVybiBncm91cC5yZXBsYWNlKC8oWz0hOiRcXC8oKV0pL2csICdcXFxcJDEnKTtcbn1cblxuLyoqXG4gKiBBdHRhY2ggdGhlIGtleXMgYXMgYSBwcm9wZXJ0eSBvZiB0aGUgcmVnZXhwLlxuICpcbiAqIEBwYXJhbSAge1JlZ0V4cH0gcmVcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG52YXIgYXR0YWNoS2V5cyA9IGZ1bmN0aW9uIChyZSwga2V5cykge1xuICByZS5rZXlzID0ga2V5cztcblxuICByZXR1cm4gcmU7XG59O1xuXG4vKipcbiAqIE5vcm1hbGl6ZSB0aGUgZ2l2ZW4gcGF0aCBzdHJpbmcsIHJldHVybmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAqXG4gKiBBbiBlbXB0eSBhcnJheSBzaG91bGQgYmUgcGFzc2VkIGluLCB3aGljaCB3aWxsIGNvbnRhaW4gdGhlIHBsYWNlaG9sZGVyIGtleVxuICogbmFtZXMuIEZvciBleGFtcGxlIGAvdXNlci86aWRgIHdpbGwgdGhlbiBjb250YWluIGBbXCJpZFwiXWAuXG4gKlxuICogQHBhcmFtICB7KFN0cmluZ3xSZWdFeHB8QXJyYXkpfSBwYXRoXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgICAgICAgICAgIGtleXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICAgICAgb3B0aW9uc1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBwYXRodG9SZWdleHAgKHBhdGgsIGtleXMsIG9wdGlvbnMpIHtcbiAgaWYgKGtleXMgJiYgIUFycmF5LmlzQXJyYXkoa2V5cykpIHtcbiAgICBvcHRpb25zID0ga2V5cztcbiAgICBrZXlzID0gbnVsbDtcbiAgfVxuXG4gIGtleXMgPSBrZXlzIHx8IFtdO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgc3RyaWN0ID0gb3B0aW9ucy5zdHJpY3Q7XG4gIHZhciBlbmQgPSBvcHRpb25zLmVuZCAhPT0gZmFsc2U7XG4gIHZhciBmbGFncyA9IG9wdGlvbnMuc2Vuc2l0aXZlID8gJycgOiAnaSc7XG4gIHZhciBpbmRleCA9IDA7XG5cbiAgaWYgKHBhdGggaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAvLyBNYXRjaCBhbGwgY2FwdHVyaW5nIGdyb3VwcyBvZiBhIHJlZ2V4cC5cbiAgICB2YXIgZ3JvdXBzID0gcGF0aC5zb3VyY2UubWF0Y2goL1xcKCg/IVxcPykvZykgfHwgW107XG5cbiAgICAvLyBNYXAgYWxsIHRoZSBtYXRjaGVzIHRvIHRoZWlyIG51bWVyaWMga2V5cyBhbmQgcHVzaCBpbnRvIHRoZSBrZXlzLlxuICAgIGtleXMucHVzaC5hcHBseShrZXlzLCBncm91cHMubWFwKGZ1bmN0aW9uIChtYXRjaCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6ICAgICAgaW5kZXgsXG4gICAgICAgIGRlbGltaXRlcjogbnVsbCxcbiAgICAgICAgb3B0aW9uYWw6ICBmYWxzZSxcbiAgICAgICAgcmVwZWF0OiAgICBmYWxzZVxuICAgICAgfTtcbiAgICB9KSk7XG5cbiAgICAvLyBSZXR1cm4gdGhlIHNvdXJjZSBiYWNrIHRvIHRoZSB1c2VyLlxuICAgIHJldHVybiBhdHRhY2hLZXlzKHBhdGgsIGtleXMpO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkocGF0aCkpIHtcbiAgICAvLyBNYXAgYXJyYXkgcGFydHMgaW50byByZWdleHBzIGFuZCByZXR1cm4gdGhlaXIgc291cmNlLiBXZSBhbHNvIHBhc3NcbiAgICAvLyB0aGUgc2FtZSBrZXlzIGFuZCBvcHRpb25zIGluc3RhbmNlIGludG8gZXZlcnkgZ2VuZXJhdGlvbiB0byBnZXRcbiAgICAvLyBjb25zaXN0ZW50IG1hdGNoaW5nIGdyb3VwcyBiZWZvcmUgd2Ugam9pbiB0aGUgc291cmNlcyB0b2dldGhlci5cbiAgICBwYXRoID0gcGF0aC5tYXAoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gcGF0aHRvUmVnZXhwKHZhbHVlLCBrZXlzLCBvcHRpb25zKS5zb3VyY2U7XG4gICAgfSk7XG5cbiAgICAvLyBHZW5lcmF0ZSBhIG5ldyByZWdleHAgaW5zdGFuY2UgYnkgam9pbmluZyBhbGwgdGhlIHBhcnRzIHRvZ2V0aGVyLlxuICAgIHJldHVybiBhdHRhY2hLZXlzKG5ldyBSZWdFeHAoJyg/OicgKyBwYXRoLmpvaW4oJ3wnKSArICcpJywgZmxhZ3MpLCBrZXlzKTtcbiAgfVxuXG4gIC8vIEFsdGVyIHRoZSBwYXRoIHN0cmluZyBpbnRvIGEgdXNhYmxlIHJlZ2V4cC5cbiAgcGF0aCA9IHBhdGgucmVwbGFjZShQQVRIX1JFR0VYUCwgZnVuY3Rpb24gKG1hdGNoLCBlc2NhcGVkLCBwcmVmaXgsIGtleSwgY2FwdHVyZSwgZ3JvdXAsIHN1ZmZpeCwgZXNjYXBlKSB7XG4gICAgLy8gQXZvaWRpbmcgcmUtZXNjYXBpbmcgZXNjYXBlZCBjaGFyYWN0ZXJzLlxuICAgIGlmIChlc2NhcGVkKSB7XG4gICAgICByZXR1cm4gZXNjYXBlZDtcbiAgICB9XG5cbiAgICAvLyBFc2NhcGUgcmVnZXhwIHNwZWNpYWwgY2hhcmFjdGVycy5cbiAgICBpZiAoZXNjYXBlKSB7XG4gICAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlO1xuICAgIH1cblxuICAgIHZhciByZXBlYXQgICA9IHN1ZmZpeCA9PT0gJysnIHx8IHN1ZmZpeCA9PT0gJyonO1xuICAgIHZhciBvcHRpb25hbCA9IHN1ZmZpeCA9PT0gJz8nIHx8IHN1ZmZpeCA9PT0gJyonO1xuXG4gICAga2V5cy5wdXNoKHtcbiAgICAgIG5hbWU6ICAgICAga2V5IHx8IGluZGV4KyssXG4gICAgICBkZWxpbWl0ZXI6IHByZWZpeCB8fCAnLycsXG4gICAgICBvcHRpb25hbDogIG9wdGlvbmFsLFxuICAgICAgcmVwZWF0OiAgICByZXBlYXRcbiAgICB9KTtcblxuICAgIC8vIEVzY2FwZSB0aGUgcHJlZml4IGNoYXJhY3Rlci5cbiAgICBwcmVmaXggPSBwcmVmaXggPyAnXFxcXCcgKyBwcmVmaXggOiAnJztcblxuICAgIC8vIE1hdGNoIHVzaW5nIHRoZSBjdXN0b20gY2FwdHVyaW5nIGdyb3VwLCBvciBmYWxsYmFjayB0byBjYXB0dXJpbmdcbiAgICAvLyBldmVyeXRoaW5nIHVwIHRvIHRoZSBuZXh0IHNsYXNoIChvciBuZXh0IHBlcmlvZCBpZiB0aGUgcGFyYW0gd2FzXG4gICAgLy8gcHJlZml4ZWQgd2l0aCBhIHBlcmlvZCkuXG4gICAgY2FwdHVyZSA9IGVzY2FwZUdyb3VwKGNhcHR1cmUgfHwgZ3JvdXAgfHwgJ1teJyArIChwcmVmaXggfHwgJ1xcXFwvJykgKyAnXSs/Jyk7XG5cbiAgICAvLyBBbGxvdyBwYXJhbWV0ZXJzIHRvIGJlIHJlcGVhdGVkIG1vcmUgdGhhbiBvbmNlLlxuICAgIGlmIChyZXBlYXQpIHtcbiAgICAgIGNhcHR1cmUgPSBjYXB0dXJlICsgJyg/OicgKyBwcmVmaXggKyBjYXB0dXJlICsgJykqJztcbiAgICB9XG5cbiAgICAvLyBBbGxvdyBhIHBhcmFtZXRlciB0byBiZSBvcHRpb25hbC5cbiAgICBpZiAob3B0aW9uYWwpIHtcbiAgICAgIHJldHVybiAnKD86JyArIHByZWZpeCArICcoJyArIGNhcHR1cmUgKyAnKSk/JztcbiAgICB9XG5cbiAgICAvLyBCYXNpYyBwYXJhbWV0ZXIgc3VwcG9ydC5cbiAgICByZXR1cm4gcHJlZml4ICsgJygnICsgY2FwdHVyZSArICcpJztcbiAgfSk7XG5cbiAgLy8gQ2hlY2sgd2hldGhlciB0aGUgcGF0aCBlbmRzIGluIGEgc2xhc2ggYXMgaXQgYWx0ZXJzIHNvbWUgbWF0Y2ggYmVoYXZpb3VyLlxuICB2YXIgZW5kc1dpdGhTbGFzaCA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXSA9PT0gJy8nO1xuXG4gIC8vIEluIG5vbi1zdHJpY3QgbW9kZSB3ZSBhbGxvdyBhbiBvcHRpb25hbCB0cmFpbGluZyBzbGFzaCBpbiB0aGUgbWF0Y2guIElmXG4gIC8vIHRoZSBwYXRoIHRvIG1hdGNoIGFscmVhZHkgZW5kZWQgd2l0aCBhIHNsYXNoLCB3ZSBuZWVkIHRvIHJlbW92ZSBpdCBmb3JcbiAgLy8gY29uc2lzdGVuY3kuIFRoZSBzbGFzaCBpcyBvbmx5IHZhbGlkIGF0IHRoZSB2ZXJ5IGVuZCBvZiBhIHBhdGggbWF0Y2gsIG5vdFxuICAvLyBhbnl3aGVyZSBpbiB0aGUgbWlkZGxlLiBUaGlzIGlzIGltcG9ydGFudCBmb3Igbm9uLWVuZGluZyBtb2RlLCBvdGhlcndpc2VcbiAgLy8gXCIvdGVzdC9cIiB3aWxsIG1hdGNoIFwiL3Rlc3QvL3JvdXRlXCIuXG4gIGlmICghc3RyaWN0KSB7XG4gICAgcGF0aCA9IChlbmRzV2l0aFNsYXNoID8gcGF0aC5zbGljZSgwLCAtMikgOiBwYXRoKSArICcoPzpcXFxcLyg/PSQpKT8nO1xuICB9XG5cbiAgLy8gSW4gbm9uLWVuZGluZyBtb2RlLCB3ZSBuZWVkIHByb21wdCB0aGUgY2FwdHVyaW5nIGdyb3VwcyB0byBtYXRjaCBhcyBtdWNoXG4gIC8vIGFzIHBvc3NpYmxlIGJ5IHVzaW5nIGEgcG9zaXRpdmUgbG9va2FoZWFkIGZvciB0aGUgZW5kIG9yIG5leHQgcGF0aCBzZWdtZW50LlxuICBpZiAoIWVuZCkge1xuICAgIHBhdGggKz0gc3RyaWN0ICYmIGVuZHNXaXRoU2xhc2ggPyAnJyA6ICcoPz1cXFxcL3wkKSc7XG4gIH1cblxuICByZXR1cm4gYXR0YWNoS2V5cyhuZXcgUmVnRXhwKCdeJyArIHBhdGggKyAoZW5kID8gJyQnIDogJycpLCBmbGFncyksIGtleXMpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGd3MmFwaSA9IHJlcXVpcmUoJ2d3MmFwaScpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldEd1aWxkRGV0YWlsczogZ2V0R3VpbGREZXRhaWxzLFxyXG5cdGdldE1hdGNoZXM6IGdldE1hdGNoZXMsXHJcblx0Ly8gZ2V0TWF0Y2hEZXRhaWxzOiBnZXRNYXRjaERldGFpbHMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzQnlXb3JsZDogZ2V0TWF0Y2hEZXRhaWxzQnlXb3JsZCxcclxufTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hlcyhjYWxsYmFjaykge1xyXG5cdGd3MmFwaS5nZXRNYXRjaGVzU3RhdGUoY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhndWlsZElkLCBjYWxsYmFjaykge1xyXG5cdGd3MmFwaS5nZXRHdWlsZERldGFpbHMoe2d1aWxkX2lkOiBndWlsZElkfSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlscyhtYXRjaElkLCBjYWxsYmFjaykge1xyXG5cdGd3MmFwaS5nZXRNYXRjaERldGFpbHNTdGF0ZSh7bWF0Y2hfaWQ6IG1hdGNoSWR9LCBjYWxsYmFjayk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hEZXRhaWxzQnlXb3JsZCh3b3JsZFNsdWcsIGNhbGxiYWNrKSB7XHJcblx0Z3cyYXBpLmdldE1hdGNoRGV0YWlsc1N0YXRlKHt3b3JsZF9zbHVnOiB3b3JsZFNsdWd9LCBjYWxsYmFjayk7XHJcbn1cclxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Ll8gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLl8gOiBudWxsKTtcclxuXHJcbnZhciBsYW5ncyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKS5sYW5ncztcclxudmFyIHdvcmxkcyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKS53b3JsZHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFx0XHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsYW5nID0gdGhpcy5wcm9wcy5sYW5nO1xyXG5cdFx0dmFyIHdvcmxkID0gdGhpcy5wcm9wcy53b3JsZDtcclxuXHJcblx0XHRsYW5ncyA9IF8ubWFwKGxhbmdzLCBmdW5jdGlvbihsYW5nKXtcclxuXHRcdFx0bGFuZy5saW5rID0gJy8nICsgbGFuZy5zbHVnO1xyXG5cclxuXHRcdFx0aWYgKHdvcmxkKSB7XHJcblx0XHRcdFx0bGFuZy5saW5rID0gbGFuZy5saW5rICsgJy8nICsgd29ybGRbbGFuZy5zbHVnXS5zbHVnO1xyXG5cdFx0XHR9IFxyXG5cclxuXHRcdFx0cmV0dXJuIGxhbmc7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0UmVhY3QuRE9NLnVsKHtjbGFzc05hbWU6IFwibmF2IG5hdmJhci1uYXZcIn0sIFxyXG5cdFx0XHRcdF8ubWFwKGxhbmdzLCBmdW5jdGlvbihsKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00ubGkoe2tleTogbC5zbHVnLCBjbGFzc05hbWU6IChsLnNsdWcgPT09IGxhbmcuc2x1ZykgPyAnYWN0aXZlJyA6ICcnLCB0aXRsZTogbC5uYW1lfSwgXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoeydkYXRhLXNsdWcnOiBsLnNsdWcsIGhyZWY6IGwubGlua30sIGwubGFiZWwpXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5fIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5fIDogbnVsbCk7XHJcblxyXG52YXIgUmVnaW9uTWF0Y2hlcyA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9vdmVydmlldy9SZWdpb25NYXRjaGVzLmpzeCcpKTtcclxudmFyIFJlZ2lvbldvcmxkcyA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9vdmVydmlldy9SZWdpb25Xb3JsZHMuanN4JykpO1xyXG5cclxudmFyIHdvcmxkc1N0YXRpYyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKS53b3JsZHM7XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7bWF0Y2hlczoge319O1xyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy51cGRhdGVUaW1lciA9IG51bGw7XHJcblx0XHR0aGlzLmdldE1hdGNoZXMoKTtcclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy51cGRhdGVUaW1lcik7XHJcblx0fSxcclxuXHRcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGxhbmcgPSB0aGlzLnByb3BzLmxhbmc7XHJcblxyXG5cdFx0dmFyIHdvcmxkcyA9IF8ubWFwVmFsdWVzKHdvcmxkc1N0YXRpYywgZnVuY3Rpb24od29ybGQpIHtcclxuXHRcdFx0d29ybGRbbGFuZy5zbHVnXS5pZCA9IHdvcmxkLmlkO1xyXG5cdFx0XHR3b3JsZFtsYW5nLnNsdWddLnJlZ2lvbiA9IHdvcmxkLnJlZ2lvbjtcclxuXHRcdFx0d29ybGRbbGFuZy5zbHVnXS5saW5rID0gJy8nICsgbGFuZy5zbHVnICsgJy8nICsgd29ybGQuc2x1ZztcclxuXHRcdFx0cmV0dXJuIHdvcmxkW2xhbmcuc2x1Z107XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgbWF0Y2hlcyA9IHRoaXMuc3RhdGUubWF0Y2hlcztcclxuXHJcblx0XHR2YXIgcmVnaW9ucyA9IFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJOQVwiLFxyXG5cdFx0XHRcdFwiaWRcIjogXCIxXCIsXHJcblx0XHRcdFx0XCJtYXRjaGVzXCI6IF8uZmlsdGVyKG1hdGNoZXMsIGZ1bmN0aW9uKG0pIHtyZXR1cm4gbS5yZWdpb24gPT0gMTt9KSxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJFVVwiLFxyXG5cdFx0XHRcdFwiaWRcIjogXCIyXCIsXHJcblx0XHRcdFx0XCJtYXRjaGVzXCI6IF8uZmlsdGVyKG1hdGNoZXMsIGZ1bmN0aW9uKG0pIHtyZXR1cm4gbS5yZWdpb24gPT0gMjt9KSxcclxuXHRcdFx0fSxcclxuXHRcdF07XHJcblxyXG5cclxuXHRcdHNldFBhZ2VUaXRsZShsYW5nKTtcclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0UmVhY3QuRE9NLmRpdih7aWQ6IFwib3ZlcnZpZXdcIn0sIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJyb3dcIn0sIFxyXG5cdFx0XHRcdFx0Xy5tYXAocmVnaW9ucywgZnVuY3Rpb24ocmVnaW9uKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLXNtLTEyXCIsIGtleTogcmVnaW9uLmxhYmVsfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRSZWdpb25NYXRjaGVzKHtyZWdpb246IHJlZ2lvbiwgbGFuZzogbGFuZ30pXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHQpLCBcclxuXHJcblx0XHRcdFx0UmVhY3QuRE9NLmhyKG51bGwpLCBcclxuXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInJvd1wifSwgXHJcblx0XHRcdFx0XHRfLm1hcChyZWdpb25zLCBmdW5jdGlvbihyZWdpb24pe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJjb2wtc20tMTJcIiwga2V5OiByZWdpb24ubGFiZWx9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFJlZ2lvbldvcmxkcyh7cmVnaW9uOiByZWdpb24sIGxhbmc6IGxhbmd9KVxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH0sXHJcblxyXG5cclxuXHJcblx0Z2V0TWF0Y2hlczogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYXBpID0gcmVxdWlyZSgnLi4vYXBpJyk7XHJcblx0XHR2YXIgY29tcG9uZW50ID0gdGhpcztcclxuXHJcblx0XHRhcGkuZ2V0TWF0Y2hlcyhmdW5jdGlvbihlcnIsIGRhdGEpIHtcclxuXHRcdFx0aWYgKCFlcnIpIHtcclxuXHRcdFx0XHRjb21wb25lbnQuc2V0U3RhdGUoe21hdGNoZXM6IGRhdGF9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0dmFyIGludGVydmFsID0gXy5yYW5kb20oMjAwMCwgNDAwMCk7XHJcblx0XHRcdGNvbXBvbmVudC51cGRhdGVUaW1lciA9IHNldFRpbWVvdXQoY29tcG9uZW50LmdldE1hdGNoZXMsIGludGVydmFsKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9LFxyXG59KTtcclxuXHJcblxyXG5mdW5jdGlvbiBzZXRQYWdlVGl0bGUobGFuZykge1xyXG5cdHZhciB0aXRsZSA9IFsnZ3cydzJ3J107XHJcblxyXG5cdGlmIChsYW5nKSB7XHJcblx0XHRpZiAobGFuZy5zbHVnICE9PSAnZW4nKSB7XHJcblx0XHRcdHRpdGxlLnB1c2gobGFuZy5uYW1lKTtcclxuXHRcdH1cclxuXHR9XHJcblx0JCgndGl0bGUnKS50ZXh0KHRpdGxlLmpvaW4oJyAtICcpKTtcclxufVxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG52YXIgYXN5bmMgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5hc3luYyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuYXN5bmMgOiBudWxsKTtcclxuXHJcbnZhciBTY29yZWJvYXJkID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL3RyYWNrZXIvU2NvcmVib2FyZC5qc3gnKSk7XHJcbnZhciBNYXBzID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL3RyYWNrZXIvTWFwcy5qc3gnKSk7XHJcbnZhciBHdWlsZHMgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vdHJhY2tlci9ndWlsZHMvR3VpbGRzLmpzeCcpKTtcclxuXHJcbnZhciBzdGF0aWNEYXRhID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG52YXIgd29ybGRzU3RhdGljID0gc3RhdGljRGF0YS53b3JsZHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtYXRjaDogW10sXHJcblx0XHRcdGRldGFpbHM6IFtdLFxyXG5cdFx0XHRndWlsZHM6IHt9LFxyXG5cdFx0XHRsYXN0bW9kOiAwLFxyXG5cdFx0XHR0aW1lT2Zmc2V0OiAwLFxyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnVwZGF0ZVRpbWVyID0gbnVsbDtcclxuXHJcblx0XHR0aGlzLmdldE1hdGNoRGV0YWlscygpO1xyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLnVwZGF0ZVRpbWVyKTtcclxuXHR9LFxyXG5cclxuXHQvLyBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xyXG5cdC8vIFx0Ly8gY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XHJcblx0Ly8gXHQvLyBjb25zb2xlLmxvZyhfLmZpbHRlcih0aGlzLnN0YXRlLm9iamVjdGl2ZXMsIGZ1bmN0aW9uKG8peyByZXR1cm4gby5sYXN0Q2FwICE9PSAwOyB9KSk7XHJcblx0Ly8gfSxcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsYW5nID0gdGhpcy5wcm9wcy5sYW5nO1xyXG5cdFx0dmFyIHdvcmxkID0gdGhpcy5wcm9wcy53b3JsZDtcclxuXHJcblx0XHR2YXIgZGV0YWlscyA9IHRoaXMuc3RhdGUuZGV0YWlscztcclxuXHJcblxyXG5cdFx0aWYgKF8uaXNFbXB0eSh0aGlzLnN0YXRlLmRldGFpbHMpIHx8IHRoaXMuc3RhdGUuZGV0YWlscy5pbml0aWFsaXplZCA9PT0gZmFsc2UpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dmFyIHRpbWVPZmZzZXQgPSB0aGlzLnN0YXRlLnRpbWVPZmZzZXQ7XHJcblx0XHRcdHZhciBtYXRjaCA9IHRoaXMuc3RhdGUubWF0Y2g7XHJcblx0XHRcdHZhciBndWlsZHMgPSB0aGlzLnN0YXRlLmd1aWxkcztcclxuXHJcblx0XHRcdHZhciBldmVudEhpc3RvcnkgPSBkZXRhaWxzLmhpc3Rvcnk7XHJcblx0XHRcdHZhciBzY29yZXMgPSBtYXRjaC5zY29yZXM7XHJcblx0XHRcdHZhciB0aWNrcyA9IG1hdGNoLnRpY2tzO1xyXG5cdFx0XHR2YXIgaG9sZGluZ3MgPSBtYXRjaC5ob2xkaW5ncztcclxuXHJcblx0XHRcdHZhciByZWRXb3JsZCA9IHdvcmxkc1N0YXRpY1ttYXRjaC5yZWRJZF1bbGFuZy5zbHVnXTtcclxuXHRcdFx0dmFyIGJsdWVXb3JsZCA9IHdvcmxkc1N0YXRpY1ttYXRjaC5ibHVlSWRdW2xhbmcuc2x1Z107XHJcblx0XHRcdHZhciBncmVlbldvcmxkID0gd29ybGRzU3RhdGljW21hdGNoLmdyZWVuSWRdW2xhbmcuc2x1Z107XHJcblxyXG5cdFx0XHR2YXIgbWF0Y2hXb3JsZHMgPSB7XHJcblx0XHRcdFx0XCJyZWRcIjoge1xyXG5cdFx0XHRcdFx0XCJ3b3JsZFwiOiByZWRXb3JsZCxcclxuXHRcdFx0XHRcdFwic2NvcmVcIjogc2NvcmVzWzBdLFxyXG5cdFx0XHRcdFx0XCJ0aWNrXCI6IHRpY2tzWzBdLFxyXG5cdFx0XHRcdFx0XCJob2xkaW5nXCI6IGhvbGRpbmdzWzBdLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0XCJibHVlXCI6IHtcclxuXHRcdFx0XHRcdFwid29ybGRcIjogYmx1ZVdvcmxkLFxyXG5cdFx0XHRcdFx0XCJzY29yZVwiOiBzY29yZXNbMV0sXHJcblx0XHRcdFx0XHRcInRpY2tcIjogdGlja3NbMV0sXHJcblx0XHRcdFx0XHRcImhvbGRpbmdcIjogaG9sZGluZ3NbMV0sXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRcImdyZWVuXCI6IHtcclxuXHRcdFx0XHRcdFwid29ybGRcIjogZ3JlZW5Xb3JsZCxcclxuXHRcdFx0XHRcdFwic2NvcmVcIjogc2NvcmVzWzJdLFxyXG5cdFx0XHRcdFx0XCJ0aWNrXCI6IHRpY2tzWzJdLFxyXG5cdFx0XHRcdFx0XCJob2xkaW5nXCI6IGhvbGRpbmdzWzJdLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzZXRQYWdlVGl0bGUobGFuZywgd29ybGQpO1xyXG5cclxuXHJcblx0XHRcdHZhciBtYXBzTWV0YSA9IFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQnaW5kZXgnOiAwLFxyXG5cdFx0XHRcdFx0J25hbWUnOiAnUmVkSG9tZScgLFxyXG5cdFx0XHRcdFx0J2xvbmcnOiAnUmVkSG9tZSAtICcgKyBtYXRjaFdvcmxkcy5yZWQubmFtZSxcclxuXHRcdFx0XHRcdCdhYmJyJzogJ1JlZCcsXHJcblx0XHRcdFx0XHQnY29sb3InOiAncmVkJyxcclxuXHRcdFx0XHRcdCd3b3JsZCc6IG1hdGNoV29ybGRzLnJlZFxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdCdpbmRleCc6IDEsXHJcblx0XHRcdFx0XHQnbmFtZSc6ICdHcmVlbkhvbWUnLFxyXG5cdFx0XHRcdFx0J2xvbmcnOiAnR3JlZW5Ib21lIC0gJyArIG1hdGNoV29ybGRzLmdyZWVuLm5hbWUsXHJcblx0XHRcdFx0XHQnYWJicic6ICdHcm4nLFxyXG5cdFx0XHRcdFx0J2NvbG9yJzogJ2dyZWVuJyxcclxuXHRcdFx0XHRcdCd3b3JsZCc6IG1hdGNoV29ybGRzLmdyZWVuXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0J2luZGV4JzogMixcclxuXHRcdFx0XHRcdCduYW1lJzogJ0JsdWVIb21lJyxcclxuXHRcdFx0XHRcdCdsb25nJzogJ0JsdWVIb21lIC0gJyArIG1hdGNoV29ybGRzLmJsdWUubmFtZSxcclxuXHRcdFx0XHRcdCdhYmJyJzogJ0JsdScsXHJcblx0XHRcdFx0XHQnY29sb3InOiAnYmx1ZScsXHJcblx0XHRcdFx0XHQnd29ybGQnOiBtYXRjaFdvcmxkcy5ibHVlXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0J2luZGV4JzogMyxcclxuXHRcdFx0XHRcdCduYW1lJzogJ0V0ZXJuYWwgQmF0dGxlZ3JvdW5kcycsXHJcblx0XHRcdFx0XHQnbG9uZyc6ICdFdGVybmFsIEJhdHRsZWdyb3VuZHMnLFxyXG5cdFx0XHRcdFx0J2FiYnInOiAnRUJHJyxcclxuXHRcdFx0XHRcdCdjb2xvcic6ICduZXV0cmFsJyxcclxuXHRcdFx0XHRcdCd3b3JsZCc6IG51bGxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRdO1xyXG5cclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtpZDogXCJ0cmFja2VyXCJ9LCBcclxuXHJcblx0XHRcdFx0XHRTY29yZWJvYXJkKHtcclxuXHRcdFx0XHRcdFx0bGFuZzogbGFuZywgXHJcblx0XHRcdFx0XHRcdG1hdGNoV29ybGRzOiBtYXRjaFdvcmxkc31cclxuXHRcdFx0XHRcdCksIFxyXG5cclxuXHRcdFx0XHRcdE1hcHMoe1xyXG5cdFx0XHRcdFx0XHR0aW1lT2Zmc2V0OiB0aW1lT2Zmc2V0LCBcclxuXHRcdFx0XHRcdFx0bGFuZzogbGFuZywgXHJcblx0XHRcdFx0XHRcdGRldGFpbHM6IGRldGFpbHMsIFxyXG5cdFx0XHRcdFx0XHRtYXRjaFdvcmxkczogbWF0Y2hXb3JsZHMsIFxyXG5cdFx0XHRcdFx0XHRtYXBzTWV0YTogbWFwc01ldGEsIFxyXG5cdFx0XHRcdFx0XHRndWlsZHM6IGd1aWxkc31cclxuXHRcdFx0XHRcdCksIFxyXG5cclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5ocihudWxsKSwgXHJcblxyXG5cdFx0XHRcdFx0R3VpbGRzKHtcclxuXHRcdFx0XHRcdFx0bGFuZzogbGFuZywgXHJcblx0XHRcdFx0XHRcdHRpbWVPZmZzZXQ6IHRpbWVPZmZzZXQsIFxyXG5cdFx0XHRcdFx0XHRndWlsZHM6IGd1aWxkcywgXHJcblx0XHRcdFx0XHRcdGV2ZW50SGlzdG9yeTogZXZlbnRIaXN0b3J5LCBcclxuXHRcdFx0XHRcdFx0bWFwc01ldGE6IG1hcHNNZXRhfVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHR9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRnZXRNYXRjaERldGFpbHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGFwaSA9IHJlcXVpcmUoJy4uL2FwaScpO1xyXG5cclxuXHRcdHZhciB3b3JsZCA9IHRoaXMucHJvcHMud29ybGQ7XHJcblx0XHR2YXIgbGFuZyA9IHRoaXMucHJvcHMubGFuZztcclxuXHRcdHZhciB3b3JsZFNsdWcgPSB3b3JsZFtsYW5nLnNsdWddLnNsdWc7XHJcblxyXG5cdFx0YXBpLmdldE1hdGNoRGV0YWlsc0J5V29ybGQoXHJcblx0XHRcdHdvcmxkU2x1ZyxcclxuXHRcdFx0dGhpcy5vbk1hdGNoRGV0YWlsc1xyXG5cdFx0KTtcclxuXHR9LFxyXG5cclxuXHRvbk1hdGNoRGV0YWlsczogZnVuY3Rpb24oZXJyLCBkYXRhKSB7XHJcblx0XHRpZiAoIWVycikge1xyXG5cdFx0XHR2YXIgbXNPZmZzZXQgPSBEYXRlLm5vdygpIC0gZGF0YS5ub3c7XHJcblx0XHRcdHZhciBzZWNPZmZzZXQgPSBNYXRoLmZsb29yKG1zT2Zmc2V0IC8gMTAwMCk7XHJcblxyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRsYXN0bW9kOiBkYXRhLm5vdyxcclxuXHRcdFx0XHR0aW1lT2Zmc2V0OiBzZWNPZmZzZXQsXHJcblx0XHRcdFx0bWF0Y2g6IGRhdGEubWF0Y2gsXHJcblx0XHRcdFx0ZGV0YWlsczogZGF0YS5kZXRhaWxzLFxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHZhciBjbGFpbUN1cnJlbnQgPSBfLnBsdWNrKGRhdGEuZGV0YWlscy5vYmplY3RpdmVzLmNsYWltZXJzLCAnZ3VpbGQnKTtcclxuXHRcdFx0dmFyIGNsYWltSGlzdG9yeSA9IF8uY2hhaW4oZGF0YS5kZXRhaWxzLmhpc3RvcnkpXHJcblx0XHRcdFx0LmZpbHRlcih7dHlwZTogJ2NsYWltJ30pXHJcblx0XHRcdFx0LnBsdWNrKCdndWlsZCcpXHJcblx0XHRcdFx0LnZhbHVlKCk7XHJcblxyXG5cdFx0XHR2YXIgZ3VpbGRzID0gY2xhaW1DdXJyZW50LmNvbmNhdChjbGFpbUhpc3RvcnkpO1xyXG5cclxuXHRcdFx0aWYoZ3VpbGRzLmxlbmd0aCkge1xyXG5cdFx0XHRcdHByb2Nlc3MubmV4dFRpY2socXVldWVHdWlsZExvb2t1cHMuYmluZCh0aGlzLCBndWlsZHMpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciByZWZyZXNoVGltZSA9IF8ucmFuZG9tKDEwMDAqMiwgMTAwMCo0KTtcclxuXHRcdHRoaXMudXBkYXRlVGltZXIgPSBzZXRUaW1lb3V0KHRoaXMuZ2V0TWF0Y2hEZXRhaWxzLCByZWZyZXNoVGltZSk7XHJcblx0fSxcclxufSk7XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBxdWV1ZUd1aWxkTG9va3VwcyhndWlsZHMpe1xyXG5cdHZhciBrbm93bkd1aWxkcyA9IF8ua2V5cyh0aGlzLnN0YXRlLmd1aWxkcyk7XHJcblxyXG5cdHZhciBuZXdHdWlsZHMgPSBfXHJcblx0XHQuY2hhaW4oZ3VpbGRzKVxyXG5cdFx0LnVuaXEoKVxyXG5cdFx0LndpdGhvdXQodW5kZWZpbmVkLCBudWxsKVxyXG5cdFx0LmRpZmZlcmVuY2Uoa25vd25HdWlsZHMpXHJcblx0XHQudmFsdWUoKTtcclxuXHJcblx0YXN5bmMuZWFjaExpbWl0KFxyXG5cdFx0bmV3R3VpbGRzLFxyXG5cdFx0NCxcclxuXHRcdGdldEd1aWxkRGV0YWlscy5iaW5kKHRoaXMpXHJcblx0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0R3VpbGREZXRhaWxzKGd1aWxkSWQsIG9uQ29tcGxldGUpIHtcclxuXHR2YXIgYXBpID0gcmVxdWlyZSgnLi4vYXBpJyk7XHJcblx0dmFyIGNvbXBvbmVudCA9IHRoaXM7XHJcblxyXG5cdGFwaS5nZXRHdWlsZERldGFpbHMoXHJcblx0XHRndWlsZElkLFxyXG5cdFx0ZnVuY3Rpb24oZXJyLCBkYXRhKSB7XHJcblx0XHRcdGlmKCFlcnIpIHtcclxuXHRcdFx0XHRjb21wb25lbnQuc3RhdGUuZ3VpbGRzW2d1aWxkSWRdID0gZGF0YTtcclxuXHRcdFx0XHRjb21wb25lbnQuc2V0U3RhdGUoe2d1aWxkczogY29tcG9uZW50LnN0YXRlLmd1aWxkc30pO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9uQ29tcGxldGUoKTtcclxuXHRcdH1cclxuXHQpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzZXRQYWdlVGl0bGUobGFuZywgd29ybGQpIHtcclxuXHR2YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LiQgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLiQgOiBudWxsKTtcclxuXHR2YXIgdGl0bGUgPSBbd29ybGRbbGFuZy5zbHVnXS5uYW1lLCAnZ3cydzJ3J107XHJcblxyXG5cdGlmIChsYW5nLnNsdWcgIT09ICdlbicpIHtcclxuXHRcdHRpdGxlLnB1c2gobGFuZy5uYW1lKTtcclxuXHR9XHJcblxyXG5cdCQoJ3RpdGxlJykudGV4dCh0aXRsZS5qb2luKCcgLSAnKSk7XHJcbn1cbn0pLmNhbGwodGhpcyxyZXF1aXJlKCdfcHJvY2VzcycpLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Ll8gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLl8gOiBudWxsKTtcclxuXHJcbnZhciB3b3JsZHNTdGF0aWMgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJykud29ybGRzO1xyXG5cclxuXHJcbnZhciBTY29yZSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9TY29yZS5qc3gnKSk7XHJcbnZhciBQaWUgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vUGllLmpzeCcpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBtYXRjaCA9IHRoaXMucHJvcHMubWF0Y2g7XHJcblx0XHR2YXIgbGFuZyA9IHRoaXMucHJvcHMubGFuZztcclxuXHJcblx0XHR2YXIgc2NvcmVzID0gbWF0Y2guc2NvcmVzO1xyXG5cclxuXHRcdHZhciByZWRXb3JsZCA9IHdvcmxkc1N0YXRpY1ttYXRjaC5yZWRJZF1bbGFuZy5zbHVnXTtcclxuXHRcdHZhciBibHVlV29ybGQgPSB3b3JsZHNTdGF0aWNbbWF0Y2guYmx1ZUlkXVtsYW5nLnNsdWddO1xyXG5cdFx0dmFyIGdyZWVuV29ybGQgPSB3b3JsZHNTdGF0aWNbbWF0Y2guZ3JlZW5JZF1bbGFuZy5zbHVnXTtcclxuXHJcblx0XHR2YXIgbWF0Y2hXb3JsZHMgPSB7XHJcblx0XHRcdFwicmVkXCI6IHtcIndvcmxkXCI6IHJlZFdvcmxkLCBcInNjb3JlXCI6IHNjb3Jlc1swXX0sXHJcblx0XHRcdFwiYmx1ZVwiOiB7XCJ3b3JsZFwiOiBibHVlV29ybGQsIFwic2NvcmVcIjogc2NvcmVzWzFdfSxcclxuXHRcdFx0XCJncmVlblwiOiB7XCJ3b3JsZFwiOiBncmVlbldvcmxkLCBcInNjb3JlXCI6IHNjb3Jlc1syXX0sXHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJtYXRjaENvbnRhaW5lclwiLCBrZXk6IG1hdGNoLmlkfSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLnRhYmxlKHtjbGFzc05hbWU6IFwibWF0Y2hcIn0sIFxyXG5cdFx0XHRcdFx0Xy5tYXAobWF0Y2hXb3JsZHMsIGZ1bmN0aW9uKG13LCBjb2xvcikge1xyXG5cdFx0XHRcdFx0XHR2YXIgd29ybGQgPSBtdy53b3JsZDtcclxuXHRcdFx0XHRcdFx0dmFyIHNjb3JlID0gbXcuc2NvcmU7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgaHJlZiA9IFsnJywgbGFuZy5zbHVnLCB3b3JsZC5zbHVnXS5qb2luKCcvJyk7XHJcblx0XHRcdFx0XHRcdHZhciBsYWJlbCA9IHdvcmxkLm5hbWU7XHJcblxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS50cih7a2V5OiBjb2xvcn0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLnRkKHtjbGFzc05hbWU6IFwidGVhbSBuYW1lIFwiICsgY29sb3J9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe2hyZWY6IGhyZWZ9LCBsYWJlbClcclxuXHRcdFx0XHRcdFx0XHRcdCksIFxyXG5cdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLnRkKHtjbGFzc05hbWU6IFwidGVhbSBzY29yZSBcIiArIGNvbG9yfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFNjb3JlKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRrZXk6IG1hdGNoLmlkLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtYXRjaElkOiBtYXRjaC5pZCwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGVhbTogY29sb3IsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNjb3JlOiBzY29yZX1cclxuXHRcdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRcdFx0XHQoY29sb3IgPT09ICdyZWQnKSA/XHJcblx0XHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS50ZCh7cm93U3BhbjogXCIzXCIsIGNsYXNzTmFtZTogXCJwaWVcIn0sIFBpZSh7c2NvcmVzOiBtYXRjaC5zY29yZXMsIHNpemU6IFwiNjBcIiwgbWF0Y2hJZDogbWF0Y2guaWR9KSkgOlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRudWxsXHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2l6ZSA9IHRoaXMucHJvcHMuc2l6ZSB8fCAnNjAnO1xyXG5cdFx0dmFyIHN0cm9rZSA9IHRoaXMucHJvcHMuc3Ryb2tlIHx8IDI7XHJcblx0XHR2YXIgc2NvcmVzID0gdGhpcy5wcm9wcy5zY29yZXMgfHwgW107XHJcblxyXG5cdFx0dmFyIHBpZVNyYyA9ICdodHRwOi8vd3d3LnBpZWx5Lm5ldC8nICsgc2l6ZSArICcvJyArIHNjb3Jlcy5qb2luKCcsJykgKyAnP3N0cm9rZVdpZHRoPScgKyBzdHJva2U7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0KHNjb3Jlcy5sZW5ndGgpID9cclxuXHRcdFx0XHRSZWFjdC5ET00uaW1nKHtcclxuXHRcdFx0XHRcdHdpZHRoOiBcIjYwXCIsIGhlaWdodDogXCI2MFwiLCBcclxuXHRcdFx0XHRcdGtleTogJ3BpZS0nICsgdGhpcy5wcm9wcy5tYXRjaElkLCBcclxuXHRcdFx0XHRcdHNyYzogcGllU3JjfVxyXG5cdFx0XHRcdCkgOlxyXG5cdFx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwpXHJcblx0XHQpO1xyXG5cdH1cclxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG5cclxudmFyIE1hdGNoID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL01hdGNoLmpzeCcpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciByZWdpb24gPSB0aGlzLnByb3BzLnJlZ2lvbjtcclxuXHRcdHZhciBsYW5nID0gdGhpcy5wcm9wcy5sYW5nO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJSZWdpb25NYXRjaGVzXCJ9LCBcclxuXHRcdFx0XHRSZWFjdC5ET00uaDIobnVsbCwgcmVnaW9uLmxhYmVsKSwgXHJcblx0XHRcdFx0Xy5tYXAocmVnaW9uLm1hdGNoZXMsIGZ1bmN0aW9uKG1hdGNoKXtcclxuXHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdE1hdGNoKHtcclxuXHRcdFx0XHRcdFx0XHRrZXk6IG1hdGNoLmlkLCBcclxuXHRcdFx0XHRcdFx0XHRjbGFzc05hbWU6IFwibWF0Y2hcIiwgXHJcblx0XHRcdFx0XHRcdFx0bWF0Y2g6IG1hdGNoLCBcclxuXHRcdFx0XHRcdFx0XHRsYW5nOiBsYW5nfVxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fVxyXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5fIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5fIDogbnVsbCk7XHJcblxyXG52YXIgd29ybGRzU3RhdGljID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpLndvcmxkcztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsYW5nID0gdGhpcy5wcm9wcy5sYW5nO1xyXG5cdFx0dmFyIHJlZ2lvbiA9IHRoaXMucHJvcHMucmVnaW9uO1xyXG5cclxuXHRcdHZhciBsYWJlbCA9IHJlZ2lvbi5sYWJlbCArICcgV29ybGRzJztcclxuXHRcdHZhciByZWdpb25JZCA9IHJlZ2lvbi5pZDtcclxuXHJcblx0XHR2YXIgd29ybGRzID0gXy5jaGFpbih3b3JsZHNTdGF0aWMpXHJcblx0XHRcdC5maWx0ZXIoZnVuY3Rpb24odyl7cmV0dXJuIHcucmVnaW9uID09IHJlZ2lvbklkO30pXHJcblx0XHRcdC5zb3J0QnkoZnVuY3Rpb24odyl7cmV0dXJuIHdbbGFuZy5zbHVnXS5uYW1lO30pXHJcblx0XHRcdC52YWx1ZSgpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJSZWdpb25Xb3JsZHNcIn0sIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5oMihudWxsLCBsYWJlbCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS51bCh7Y2xhc3NOYW1lOiBcImxpc3QtdW5zdHlsZWRcIn0sIFxyXG5cdFx0XHRcdFx0Xy5tYXAod29ybGRzLCBmdW5jdGlvbih3b3JsZCl7XHJcblx0XHRcdFx0XHRcdHZhciBocmVmID0gWycnLCBsYW5nLnNsdWcsIHdvcmxkW2xhbmcuc2x1Z10uc2x1Z10uam9pbignLycpO1xyXG5cdFx0XHRcdFx0XHR2YXIgbGFiZWwgPSB3b3JsZFtsYW5nLnNsdWddLm5hbWU7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7a2V5OiB3b3JsZC5pZH0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe2hyZWY6IGhyZWZ9LCBsYWJlbClcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Ll8gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLl8gOiBudWxsKTtcclxudmFyICQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy4kIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC4kIDogbnVsbCk7XHJcbnZhciBudW1lcmFsID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cubnVtZXJhbCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwubnVtZXJhbCA6IG51bGwpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7ZGlmZjogMH07XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKXtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdTY29yZTo6Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcycsIG5leHRQcm9wcy5zY29yZSwgdGhpcy5wcm9wcy5zY29yZSk7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtkaWZmOiBuZXh0UHJvcHMuc2NvcmUgLSB0aGlzLnByb3BzLnNjb3JlfSk7XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHRoaXMuc3RhdGUuZGlmZiA+IDApIHtcclxuXHRcdFx0dmFyICRkaWZmID0gJCgnLmRpZmYnLCB0aGlzLmdldERPTU5vZGUoKSk7XHJcblxyXG5cdFx0XHQvLyAkZGlmZlxyXG5cdFx0XHQvLyBcdC5oaWRlKClcclxuXHRcdFx0Ly8gXHQuZmFkZUluKDQwMClcclxuXHRcdFx0Ly8gXHQuZGVsYXkoNDAwMClcclxuXHRcdFx0Ly8gXHQuZmFkZU91dCgyMDAwKTtcclxuXHRcdFx0JGRpZmZcclxuXHRcdFx0XHQudmVsb2NpdHkoJ2ZhZGVPdXQnLCB7ZHVyYXRpb246IDB9KVxyXG5cdFx0XHRcdC52ZWxvY2l0eSgnZmFkZUluJywge2R1cmF0aW9uOiAyMDB9KVxyXG5cdFx0XHRcdC52ZWxvY2l0eSgnZmFkZU91dCcsIHtkdXJhdGlvbjogMTIwMCwgZGVsYXk6IDQwMH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbWF0Y2hJZCA9IHRoaXMucHJvcHMubWF0Y2hJZDtcclxuXHRcdHZhciB0ZWFtID0gdGhpcy5wcm9wcy50ZWFtO1xyXG5cdFx0dmFyIHNjb3JlID0gdGhpcy5wcm9wcy5zY29yZSB8fCAwO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwsIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IFwiZGlmZlwifSwgXHJcblx0XHRcdFx0XHQodGhpcy5zdGF0ZS5kaWZmKSA/XHJcblx0XHRcdFx0XHRcdCcrJyArIG51bWVyYWwodGhpcy5zdGF0ZS5kaWZmKS5mb3JtYXQoJzAsMCcpIDpcclxuXHRcdFx0XHRcdFx0bnVsbFxyXG5cdFx0XHRcdCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IFwidmFsdWVcIn0sIG51bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJykpXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fVxyXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbWV0YSA9IHRoaXMucHJvcHMub01ldGE7XHJcblxyXG5cdFx0aWYgKG1ldGEuZCkge1xyXG5cdFx0XHR2YXIgc3JjID0gWycvaW1nL2ljb25zL2Rpc3QvYXJyb3cnXTtcclxuXHJcblx0XHRcdGlmIChtZXRhLm4pIHtzcmMucHVzaCgnbm9ydGgnKTsgfVxyXG5cdFx0XHRlbHNlIGlmIChtZXRhLnMpIHtzcmMucHVzaCgnc291dGgnKTsgfVxyXG5cclxuXHRcdFx0aWYgKG1ldGEudykge3NyYy5wdXNoKCd3ZXN0Jyk7IH1cclxuXHRcdFx0ZWxzZSBpZiAobWV0YS5lKSB7c3JjLnB1c2goJ2Vhc3QnKTsgfVxyXG5cclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiBcImRpcmVjdGlvblwifSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uaW1nKHtzcmM6IHNyYy5qb2luKCctJykgKyAnLnN2Zyd9KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gUmVhY3QuRE9NLnNwYW4oe2NsYXNzTmFtZTogXCJkaXJlY3Rpb25cIn0pO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG52YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LiQgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLiQgOiBudWxsKTtcclxudmFyIG51bWVyYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5udW1lcmFsIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5udW1lcmFsIDogbnVsbCk7XHJcblxyXG5cclxudmFyIE1hcFNlY3Rpb24gPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vTWFwU2VjdGlvbi5qc3gnKSk7XHJcblxyXG52YXIgc3RhdGljRGF0YSA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxudmFyIG9iamVjdGl2ZXNEYXRhID0gc3RhdGljRGF0YS5vYmplY3RpdmVzO1xyXG52YXIgY29sb3JNYXAgPSBbJ3JlZCcsICdncmVlbicsICdibHVlJ107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhdGVOb3cgPSB0aGlzLnByb3BzLmRhdGVOb3c7XHJcblx0XHR2YXIgdGltZU9mZnNldCA9IHRoaXMucHJvcHMudGltZU9mZnNldDtcclxuXHRcdHZhciBsYW5nID0gdGhpcy5wcm9wcy5sYW5nO1xyXG5cdFx0dmFyIGRldGFpbHMgPSB0aGlzLnByb3BzLmRldGFpbHM7XHJcblx0XHR2YXIgZ3VpbGRzID0gdGhpcy5wcm9wcy5ndWlsZHM7XHJcblx0XHR2YXIgbWF0Y2hXb3JsZHMgPSB0aGlzLnByb3BzLm1hdGNoV29ybGRzO1xyXG5cdFx0dmFyIG1hcHNNZXRhID0gdGhpcy5wcm9wcy5tYXBzTWV0YTtcclxuXHRcdHZhciBtYXBJbmRleCA9IHRoaXMucHJvcHMubWFwSW5kZXg7XHJcblxyXG5cdFx0dmFyIG93bmVycyA9IGRldGFpbHMub2JqZWN0aXZlcy5vd25lcnM7XHJcblx0XHR2YXIgY2xhaW1lcnMgPSBkZXRhaWxzLm9iamVjdGl2ZXMuY2xhaW1lcnM7XHJcblxyXG5cdFx0dmFyIHNjb3JlcyA9IF8ubWFwKGRldGFpbHMubWFwcy5zY29yZXNbbWFwSW5kZXhdLCBmdW5jdGlvbihzY29yZSkge3JldHVybiBudW1lcmFsKHNjb3JlKS5mb3JtYXQoJzAsMCcpO30pO1xyXG5cdFx0dmFyIHRpY2tzID0gZGV0YWlscy5tYXBzLnRpY2tzW21hcEluZGV4XTtcclxuXHRcdHZhciBob2xkaW5ncyA9IGRldGFpbHMubWFwcy5ob2xkaW5nc1ttYXBJbmRleF07XHJcblxyXG5cdFx0Ly8gdmFyIG1hcENvbmZpZyA9IHRoaXMucHJvcHMubWFwQ29uZmlnO1xyXG5cdFx0Ly8gdmFyIG1hcFNjb3JlcyA9IHRoaXMucHJvcHMubWFwc1Njb3Jlc1ttYXBDb25maWcubWFwSW5kZXhdO1xyXG5cdFx0Ly8gdmFyIG1hcE5hbWUgPSB0aGlzLnByb3BzLm1hcE5hbWU7XHJcblx0XHQvLyB2YXIgbWFwQ29sb3IgPSB0aGlzLnByb3BzLm1hcENvbG9yO1xyXG5cclxuXHJcblx0XHR2YXIgbWV0YUluZGV4ID0gWzMsMCwyLDFdOyAvLyBvdXRwdXQgaW4gZGlmZmVyZW50IG9yZGVyIHRoYW4gb3JpZ2luYWwgZGF0YVxyXG5cclxuXHRcdHZhciBtYXBNZXRhID0gbWFwc01ldGFbbWV0YUluZGV4W21hcEluZGV4XV07XHJcblx0XHR2YXIgbWFwTmFtZSA9IG1hcE1ldGEubmFtZTtcclxuXHRcdHZhciBtYXBDb2xvciA9IG1hcE1ldGEuY29sb3I7XHJcblx0XHR2YXIgbWFwQ29uZmlnID0gc3RhdGljRGF0YS5vYmplY3RpdmVfbWFwW21hcEluZGV4XTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwibWFwXCJ9LCBcclxuXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm1hcFNjb3Jlc1wifSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uaDIoe2NsYXNzTmFtZTogJ3RlYW0gJyArIG1hcENvbG9yLCBvbkNsaWNrOiB0aGlzLm9uVGl0bGVDbGlja30sIFxyXG5cdFx0XHRcdFx0XHRtYXBOYW1lXHJcblx0XHRcdFx0XHQpLCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS51bCh7Y2xhc3NOYW1lOiBcImxpc3QtaW5saW5lXCJ9LCBcclxuXHRcdFx0XHRcdFx0Xy5tYXAoc2NvcmVzLCBmdW5jdGlvbihzY29yZSwgc2NvcmVJbmRleCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00ubGkoe2tleTogJ21hcC1zY29yZS0nICsgc2NvcmVJbmRleCwgY2xhc3NOYW1lOiBnZXRTY29yZUNsYXNzKHNjb3JlSW5kZXgpfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdHNjb3JlXHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHQpLCBcclxuXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInJvd1wifSwgXHJcblx0XHRcdFx0XHRfLm1hcChtYXBDb25maWcuc2VjdGlvbnMsIGZ1bmN0aW9uKG1hcFNlY3Rpb24sIHNlY0luZGV4KSB7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgc2VjdGlvbkNsYXNzID0gW1xyXG5cdFx0XHRcdFx0XHRcdCdjb2wtbWQtMjQnLFxyXG5cdFx0XHRcdFx0XHRcdCdtYXAtc2VjdGlvbicsXHJcblx0XHRcdFx0XHRcdF07XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAobWFwQ29uZmlnLmtleSA9PT0gJ0NlbnRlcicpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAobWFwU2VjdGlvbi5sYWJlbCA9PT0gJ0Nhc3RsZScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25DbGFzcy5wdXNoKCdjb2wtc20tMjQnKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uQ2xhc3MucHVzaCgnY29sLXNtLTgnKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0c2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS04Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBzZWN0aW9uQ2xhc3Muam9pbignICcpLCBrZXk6IG1hcENvbmZpZy5rZXkgKyAnLScgKyBtYXBTZWN0aW9uLmxhYmVsfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRNYXBTZWN0aW9uKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0ZU5vdzogZGF0ZU5vdywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpbWVPZmZzZXQ6IHRpbWVPZmZzZXQsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsYW5nOiBsYW5nLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwU2VjdGlvbjogbWFwU2VjdGlvbiwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdG93bmVyczogb3duZXJzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xhaW1lcnM6IGNsYWltZXJzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3VpbGRzOiBndWlsZHN9XHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHQpXHJcblxyXG5cclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG5cclxuXHRvblRpdGxlQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciAkbWFwcyA9ICQoJy5tYXAnKTtcclxuXHRcdHZhciAkbWFwID0gJChlLnRhcmdldCkuY2xvc2VzdCgnLm1hcCcsICRtYXBzKTtcclxuXHJcblx0XHR2YXIgaGFzRm9jdXMgPSAkbWFwLmhhc0NsYXNzKCdtYXAtZm9jdXMnKTtcclxuXHJcblxyXG5cdFx0aWYoIWhhc0ZvY3VzKSB7XHJcblx0XHRcdCRtYXBcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ21hcC1mb2N1cycpXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtYmx1cicpO1xyXG5cclxuXHRcdFx0JG1hcHMubm90KCRtYXApXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtZm9jdXMnKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnbWFwLWJsdXInKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQkbWFwc1xyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnbWFwLWZvY3VzJylcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ21hcC1ibHVyJyk7XHJcblxyXG5cdFx0fVxyXG5cdH0sXHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNjb3JlQ2xhc3Moc2NvcmVJbmRleCkge1xyXG5cdHJldHVybiBbJ3RlYW0nLCBjb2xvck1hcFtzY29yZUluZGV4XV0uam9pbignICcpO1xyXG59XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG52YXIgbW9tZW50ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cubW9tZW50IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5tb21lbnQgOiBudWxsKTtcclxuXHJcbiBcclxudmFyIFNwcml0ZSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9TcHJpdGUuanN4JykpO1xyXG52YXIgQXJyb3cgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vQXJyb3cuanN4JykpO1xyXG5cclxudmFyIHN0YXRpY0RhdGEgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcbnZhciBvYmplY3RpdmVzTmFtZXMgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV9uYW1lcztcclxudmFyIG9iamVjdGl2ZXNUeXBlcyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX3R5cGVzO1xyXG52YXIgb2JqZWN0aXZlc01ldGEgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV9tZXRhO1xyXG52YXIgb2JqZWN0aXZlc0xhYmVscyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX2xhYmVscztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGF0ZU5vdyA9IHRoaXMucHJvcHMuZGF0ZU5vdztcclxuXHRcdHZhciB0aW1lT2Zmc2V0ID0gdGhpcy5wcm9wcy50aW1lT2Zmc2V0O1xyXG5cdFx0dmFyIG5vd09mZnNldCA9IGRhdGVOb3cgKyB0aW1lT2Zmc2V0O1xyXG5cclxuXHJcblx0XHR2YXIgbGFuZyA9IHRoaXMucHJvcHMubGFuZztcclxuXHRcdHZhciBvYmplY3RpdmVJZCA9IHRoaXMucHJvcHMub2JqZWN0aXZlSWQ7XHJcblx0XHR2YXIgb3duZXIgPSB0aGlzLnByb3BzLm93bmVyO1xyXG5cdFx0dmFyIGNsYWltZXIgPSB0aGlzLnByb3BzLmNsYWltZXI7XHJcblx0XHR2YXIgZ3VpbGRzID0gdGhpcy5wcm9wcy5ndWlsZHM7XHJcblxyXG5cclxuXHRcdGlmICghXy5oYXMob2JqZWN0aXZlc01ldGEsIG9iamVjdGl2ZUlkKSkge1xyXG5cdFx0XHQvLyBzaG9ydCBjaXJjdWl0XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBvTWV0YSA9IG9iamVjdGl2ZXNNZXRhW29iamVjdGl2ZUlkXTtcclxuXHRcdHZhciBvTmFtZSA9IG9iamVjdGl2ZXNOYW1lc1tvYmplY3RpdmVJZF07XHJcblx0XHR2YXIgb0xhYmVsID0gb2JqZWN0aXZlc0xhYmVsc1tvYmplY3RpdmVJZF07XHJcblx0XHR2YXIgb1R5cGUgPSBvYmplY3RpdmVzVHlwZXNbb01ldGEudHlwZV07XHJcblxyXG5cdFx0dmFyIG9mZnNldFRpbWVzdGFtcCA9IG93bmVyLnRpbWVzdGFtcCArIHRpbWVPZmZzZXQ7XHJcblx0XHR2YXIgZXhwaXJlcyA9IG9mZnNldFRpbWVzdGFtcCArICg1ICogNjApO1xyXG5cdFx0dmFyIHRpbWVyQWN0aXZlID0gKGV4cGlyZXMgPj0gZGF0ZU5vdyArIDUpOyAvLyBzaG93IGZvciA1IHNlY29uZHMgYWZ0ZXIgZXhwaXJpbmdcclxuXHRcdHZhciBzZWNvbmRzUmVtYWluaW5nID0gZXhwaXJlcyAtIGRhdGVOb3c7XHJcblx0XHR2YXIgZXhwaXJhdGlvbiA9IG1vbWVudChzZWNvbmRzUmVtYWluaW5nICogMTAwMCk7XHJcblxyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKG9iamVjdGl2ZS5sYXN0Q2FwLCBvYmplY3RpdmUuZXhwaXJlcywgbm93LCBvYmplY3RpdmUuZXhwaXJlcyA+IG5vdyk7XHJcblxyXG5cdFx0dmFyIGNsYXNzTmFtZSA9IFtcclxuXHRcdFx0J29iamVjdGl2ZScsXHJcblx0XHRcdCd0ZWFtJywgXHJcblx0XHRcdG93bmVyLndvcmxkLFxyXG5cdFx0XS5qb2luKCcgJyk7XHJcblxyXG5cdFx0dmFyIHRpbWVyQ2xhc3MgPSBbXHJcblx0XHRcdCd0aW1lcicsXHJcblx0XHRcdCh0aW1lckFjdGl2ZSkgPyAnYWN0aXZlJyA6ICdpbmFjdGl2ZScsXHJcblx0XHRdLmpvaW4oJyAnKTtcclxuXHJcblx0XHR2YXIgdGFnQ2xhc3MgPSBbXHJcblx0XHRcdCd0YWcnLFxyXG5cdFx0XS5qb2luKCcgJyk7XHJcblxyXG5cdFx0dmFyIHRpbWVySHRtbCA9ICh0aW1lckFjdGl2ZSkgPyBleHBpcmF0aW9uLmZvcm1hdCgnbTpzcycpIDogJzA6MDAnO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogY2xhc3NOYW1lfSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS1pY29uc1wifSwgXHJcblx0XHRcdFx0XHRBcnJvdyh7b01ldGE6IG9NZXRhfSksIFxyXG4gXHRcdFx0XHRcdFNwcml0ZSh7dHlwZTogb1R5cGUubmFtZSwgY29sb3I6IG93bmVyLndvcmxkfSlcclxuXHRcdFx0XHQpLCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwib2JqZWN0aXZlLWxhYmVsXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwsIG9MYWJlbFtsYW5nLnNsdWddKVxyXG5cdFx0XHRcdCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJvYmplY3RpdmUtc3RhdGVcIn0sIFxyXG5cdFx0XHRcdFx0cmVuZGVyR3VpbGQoY2xhaW1lciwgZ3VpbGRzKSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiB0aW1lckNsYXNzfSwgdGltZXJIdG1sKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHJlbmRlckd1aWxkKGNsYWltZXIsIGd1aWxkcyl7XHJcblx0aWYgKCFjbGFpbWVyKSB7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR2YXIgZ3VpbGQgPSBndWlsZHNbY2xhaW1lci5ndWlsZF07XHJcblxyXG5cdFx0dmFyIGd1aWxkQ2xhc3MgPSBbXHJcblx0XHRcdCdndWlsZCcsXHJcblx0XHRcdCd0YWcnLFxyXG5cdFx0XHQncGVuZGluZydcclxuXHRcdF0uam9pbignICcpO1xyXG5cclxuXHRcdGlmKCFndWlsZCkge1xyXG5cdFx0XHRyZXR1cm4gUmVhY3QuRE9NLnNwYW4oe2NsYXNzTmFtZTogZ3VpbGRDbGFzc30sIFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCJ9KSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIFJlYWN0LkRPTS5hKHtjbGFzc05hbWU6IGd1aWxkQ2xhc3MsIGhyZWY6ICcjJyArIGNsYWltZXIuZ3VpbGQsIHRpdGxlOiBndWlsZC5ndWlsZF9uYW1lfSwgZ3VpbGQudGFnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5fIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5fIDogbnVsbCk7XHJcblxyXG5cclxudmFyIE1hcE9iamVjdGl2ZSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9NYXBPYmplY3RpdmUuanN4JykpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGRhdGVOb3cgPSB0aGlzLnByb3BzLmRhdGVOb3c7XHJcblx0XHR2YXIgdGltZU9mZnNldCA9IHRoaXMucHJvcHMudGltZU9mZnNldDtcclxuXHRcdHZhciBsYW5nID0gdGhpcy5wcm9wcy5sYW5nO1xyXG5cdFx0dmFyIG1hcFNlY3Rpb24gPSB0aGlzLnByb3BzLm1hcFNlY3Rpb247XHJcblx0XHR2YXIgb3duZXJzID0gdGhpcy5wcm9wcy5vd25lcnM7XHJcblx0XHR2YXIgY2xhaW1lcnMgPSB0aGlzLnByb3BzLmNsYWltZXJzO1xyXG5cdFx0dmFyIGd1aWxkcyA9IHRoaXMucHJvcHMuZ3VpbGRzO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS51bCh7Y2xhc3NOYW1lOiBcImxpc3QtdW5zdHlsZWRcIn0sIFxyXG5cdFx0XHRcdF8ubWFwKG1hcFNlY3Rpb24ub2JqZWN0aXZlcywgZnVuY3Rpb24ob2JqZWN0aXZlSWQpIHtcclxuXHJcblx0XHRcdFx0XHR2YXIgb3duZXIgPSBvd25lcnNbb2JqZWN0aXZlSWRdO1xyXG5cdFx0XHRcdFx0dmFyIGNsYWltZXIgPSBjbGFpbWVyc1tvYmplY3RpdmVJZF07XHJcblx0XHRcdFx0XHQvLyB2YXIgY2xhaW1lciA9IChjbGFpbWVyICYmIGd1aWxkc1tndWlsZElkXSkgPyBndWlsZHNbZ3VpbGRJZF0gOiBudWxsO1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7a2V5OiBvYmplY3RpdmVJZCwgaWQ6ICdvYmplY3RpdmUtJyArIG9iamVjdGl2ZUlkfSwgXHJcblx0XHRcdFx0XHRcdFx0TWFwT2JqZWN0aXZlKHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGVOb3c6IGRhdGVOb3csIFxyXG5cdFx0XHRcdFx0XHRcdFx0dGltZU9mZnNldDogdGltZU9mZnNldCwgXHJcblx0XHRcdFx0XHRcdFx0XHRsYW5nOiBsYW5nLCBcclxuXHRcdFx0XHRcdFx0XHRcdG9iamVjdGl2ZUlkOiBvYmplY3RpdmVJZCwgXHJcblx0XHRcdFx0XHRcdFx0XHRvd25lcjogb3duZXIsIFxyXG5cdFx0XHRcdFx0XHRcdFx0Y2xhaW1lcjogY2xhaW1lciwgXHJcblx0XHRcdFx0XHRcdFx0XHRndWlsZHM6IGd1aWxkc31cclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fSxcclxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG5cclxuXHJcbnZhciBNYXBEZXRhaWxzID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL01hcERldGFpbHMuanN4JykpO1xyXG52YXIgTG9nID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL2xvZy9Mb2cuanN4JykpO1xyXG5cclxudmFyIGxpYkRhdGUgPSByZXF1aXJlKCcuLi8uLi9saWIvZGF0ZS5qcycpO1xyXG5cclxudmFyIHN0YXRpY0RhdGEgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcbnZhciBtYXBzQ29uZmlnID0gc3RhdGljRGF0YS5vYmplY3RpdmVfbWFwO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7ZGF0ZU5vdzogbGliRGF0ZS5kYXRlTm93KCl9O1xyXG5cdH0sXHJcblx0dGljazogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtkYXRlTm93OiBsaWJEYXRlLmRhdGVOb3coKX0pO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKHRoaXMudGljaywgMTAwMCk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmRldGFpbHMuaW5pdGlhbGl6ZWQpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGRhdGVOb3cgPSB0aGlzLnN0YXRlLmRhdGVOb3c7XHJcblx0XHR2YXIgdGltZU9mZnNldCA9IHRoaXMucHJvcHMudGltZU9mZnNldDtcclxuXHJcblx0XHR2YXIgbGFuZyA9IHRoaXMucHJvcHMubGFuZztcclxuXHRcdHZhciBkZXRhaWxzID0gdGhpcy5wcm9wcy5kZXRhaWxzO1xyXG5cdFx0dmFyIG1hdGNoV29ybGRzID0gdGhpcy5wcm9wcy5tYXRjaFdvcmxkcztcclxuXHRcdHZhciBtYXBzTWV0YSA9IHRoaXMucHJvcHMubWFwc01ldGE7XHJcblx0XHR2YXIgZ3VpbGRzID0gdGhpcy5wcm9wcy5ndWlsZHM7XHJcblx0XHRcclxuXHRcdHZhciBldmVudEhpc3RvcnkgPSBkZXRhaWxzLmhpc3Rvcnk7XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2lkOiBcIm1hcHNcIn0sIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJyb3dcIn0sIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImNvbC1tZC02XCJ9LCBcclxuXHRcdFx0XHRcdFx0TWFwRGV0YWlscyh7XHJcblx0XHRcdFx0XHRcdFx0ZGF0ZU5vdzogZGF0ZU5vdywgXHJcblx0XHRcdFx0XHRcdFx0dGltZU9mZnNldDogdGltZU9mZnNldCwgXHJcblx0XHRcdFx0XHRcdFx0bGFuZzogbGFuZywgXHJcblx0XHRcdFx0XHRcdFx0ZGV0YWlsczogZGV0YWlscywgXHJcblx0XHRcdFx0XHRcdFx0Z3VpbGRzOiBndWlsZHMsIFxyXG5cdFx0XHRcdFx0XHRcdG1hdGNoV29ybGRzOiBtYXRjaFdvcmxkcywgXHJcblx0XHRcdFx0XHRcdFx0bWFwc01ldGE6IG1hcHNNZXRhLCBcclxuXHRcdFx0XHRcdFx0XHRtYXBJbmRleDogMH1cclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLW1kLTE4XCJ9LCBcclxuXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJyb3dcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJjb2wtbWQtOFwifSwgXHJcblx0XHRcdFx0XHRcdFx0XHRNYXBEZXRhaWxzKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0ZU5vdzogZGF0ZU5vdywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpbWVPZmZzZXQ6IHRpbWVPZmZzZXQsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsYW5nOiBsYW5nLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGV0YWlsczogZGV0YWlscywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGd1aWxkczogZ3VpbGRzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWF0Y2hXb3JsZHM6IG1hdGNoV29ybGRzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwc01ldGE6IG1hcHNNZXRhLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwSW5kZXg6IDF9XHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImNvbC1tZC04XCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRcdE1hcERldGFpbHMoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRlTm93OiBkYXRlTm93LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGltZU9mZnNldDogdGltZU9mZnNldCwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxhbmc6IGxhbmcsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkZXRhaWxzOiBkZXRhaWxzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3VpbGRzOiBndWlsZHMsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXRjaFdvcmxkczogbWF0Y2hXb3JsZHMsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBzTWV0YTogbWFwc01ldGEsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBJbmRleDogMn1cclxuXHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHQpLCBcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLW1kLThcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0TWFwRGV0YWlscyh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGVOb3c6IGRhdGVOb3csIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aW1lT2Zmc2V0OiB0aW1lT2Zmc2V0LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGFuZzogbGFuZywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGRldGFpbHM6IGRldGFpbHMsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRndWlsZHM6IGd1aWxkcywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdG1hdGNoV29ybGRzOiBtYXRjaFdvcmxkcywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdG1hcHNNZXRhOiBtYXBzTWV0YSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdG1hcEluZGV4OiAzfVxyXG5cdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicm93XCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLW1kLTI0XCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRcdExvZyh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGVOb3c6IGRhdGVOb3csIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aW1lT2Zmc2V0OiB0aW1lT2Zmc2V0LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGFuZzogbGFuZywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGd1aWxkczogZ3VpbGRzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZXZlbnRIaXN0b3J5OiBldmVudEhpc3RvcnksIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXRjaFdvcmxkczogbWF0Y2hXb3JsZHMsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBzTWV0YTogbWFwc01ldGF9XHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHQpXHJcblxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdCApXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fSxcclxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG52YXIgbnVtZXJhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Lm51bWVyYWwgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLm51bWVyYWwgOiBudWxsKTtcclxuXHJcbnZhciBTcHJpdGUgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vU3ByaXRlLmpzeCcpKTtcclxudmFyIHN0YXRpY0RhdGEgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcbnZhciBvYmplY3RpdmVUeXBlcyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX3R5cGVzO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsYW5nID0gdGhpcy5wcm9wcy5sYW5nO1xyXG5cdFx0dmFyIG1hdGNoV29ybGRzID0gdGhpcy5wcm9wcy5tYXRjaFdvcmxkcztcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicm93XCIsIGlkOiBcInNjb3JlYm9hcmRzXCJ9LCBcclxuXHRcdFx0XHRfLm1hcChtYXRjaFdvcmxkcywgZnVuY3Rpb24obXcsIGNvbG9yKSB7XHJcblx0XHRcdFx0XHR2YXIgd29ybGQgPSBtdy53b3JsZDtcclxuXHRcdFx0XHRcdHZhciBzY29yZSA9IG13LnNjb3JlO1xyXG5cdFx0XHRcdFx0dmFyIHRpY2sgPSBtdy50aWNrO1xyXG5cdFx0XHRcdFx0dmFyIGhvbGRpbmdzID0gbXcuaG9sZGluZztcclxuXHJcblx0XHRcdFx0XHR2YXIgc2NvcmVib2FyZENsYXNzID0gW1xyXG5cdFx0XHRcdFx0XHQnc2NvcmVib2FyZCcsXHJcblx0XHRcdFx0XHRcdCd0ZWFtLWJnJyxcclxuXHRcdFx0XHRcdFx0J3RlYW0nLFxyXG5cdFx0XHRcdFx0XHQndGV4dC1jZW50ZXInLFxyXG5cdFx0XHRcdFx0XHRjb2xvclxyXG5cdFx0XHRcdFx0XS5qb2luKCcgJyk7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImNvbC1zbS04XCIsIGtleTogY29sb3J9LCBcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IHNjb3JlYm9hcmRDbGFzc30sIFxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5oMShudWxsLCB3b3JsZC5uYW1lKSwgXHJcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaDIobnVsbCwgbnVtZXJhbChzY29yZSkuZm9ybWF0KCcwLDAnKSwgXCIgK1wiLCB0aWNrKSwgXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLnVsKHtjbGFzc05hbWU6IFwibGlzdC1pbmxpbmVcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRfLm1hcChob2xkaW5ncywgZnVuY3Rpb24oaG9sZGluZywgaXhIb2xkaW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIG9UeXBlID0gb2JqZWN0aXZlVHlwZXNbaXhIb2xkaW5nICsgMV07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00ubGkoe2tleTogaXhIb2xkaW5nfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNwcml0ZSh7dHlwZTogb1R5cGUubmFtZSwgY29sb3I6IGNvbG9yfSksIFwiIHggXCIsIGhvbGRpbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdFx0KVxyXG5cclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxuLypcclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0PHVsIGNsYXNzTmFtZT1cImxpc3QtaW5saW5lXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdHtfLm1hcChob2xkaW5ncywgZnVuY3Rpb24oaG9sZGluZywgaXhIb2xkaW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIG90ID0gb2JqZWN0aXZlVHlwZXNbaXhIb2xkaW5nICsgMV07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8bGkga2V5PXsndHlwZS1ob2xkaW5ncy0nICsgb3QubmFtZX0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxTcHJpdGUgdHlwZT17b3QubmFtZX0gY29sb3I9e2NvbG9yc1tzY29yZUluZGV4XX0gLz4geCB7b3QuaG9sZGluZ3Nbc2NvcmVJbmRleF19XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pfVxyXG5cdFx0XHRcdFx0XHRcdFx0PC91bD5cclxuKi9cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0eXBlID0gdGhpcy5wcm9wcy50eXBlO1xyXG5cdFx0dmFyIGNvbG9yID0gdGhpcy5wcm9wcy5jb2xvcjtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiBbJ3Nwcml0ZScsIHR5cGUsIGNvbG9yXS5qb2luKCcgJyl9KVxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Ll8gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLl8gOiBudWxsKTtcclxuXHJcblxyXG52YXIgT2JqZWN0aXZlID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL09iamVjdGl2ZS5qc3gnKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRpbWVPZmZzZXQgPSB0aGlzLnByb3BzLnRpbWVPZmZzZXQ7XHJcblx0XHR2YXIgZGF0ZU5vdyA9IHRoaXMucHJvcHMuZGF0ZU5vdztcclxuXHRcdHZhciBsYW5nID0gdGhpcy5wcm9wcy5sYW5nO1xyXG5cdFx0dmFyIGV2ZW50SGlzdG9yeSA9IHRoaXMucHJvcHMuZXZlbnRIaXN0b3J5O1xyXG5cdFx0dmFyIG1hcHNNZXRhID0gdGhpcy5wcm9wcy5tYXBzTWV0YTtcclxuXHJcblx0XHR2YXIgZ3VpbGRzID0gX1xyXG5cdFx0XHQuY2hhaW4odGhpcy5wcm9wcy5ndWlsZHMpXHJcblx0XHRcdC5tYXAoZnVuY3Rpb24oZ3VpbGQpe1xyXG5cdFx0XHRcdGd1aWxkLmNsYWltcyA9IF8uY2hhaW4oZXZlbnRIaXN0b3J5KVxyXG5cdFx0XHRcdFx0LmZpbHRlcihmdW5jdGlvbihlbnRyeSl7XHJcblx0XHRcdFx0XHRcdHJldHVybiAoZW50cnkudHlwZSA9PT0gJ2NsYWltJyAmJiBlbnRyeS5ndWlsZCA9PT0gZ3VpbGQuZ3VpbGRfaWQpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC5zb3J0QnkoJ3RpbWVzdGFtcCcpXHJcblx0XHRcdFx0XHQucmV2ZXJzZSgpXHJcblx0XHRcdFx0XHQudmFsdWUoKTtcclxuXHJcblx0XHRcdFx0Z3VpbGQubGFzdENsYWltID0gKGd1aWxkLmNsYWltcyAmJiBndWlsZC5jbGFpbXMubGVuZ3RoKSA/IGd1aWxkLmNsYWltc1swXS50aW1lc3RhbXAgOiAwO1xyXG5cdFx0XHRcdHJldHVybiBndWlsZDtcclxuXHRcdFx0fSlcclxuXHRcdFx0LnNvcnRCeSgnZ3VpbGRfbmFtZScpXHJcblx0XHRcdC5zb3J0QnkoZnVuY3Rpb24oZ3VpbGQpe1xyXG5cdFx0XHRcdHJldHVybiAtZ3VpbGQubGFzdENsYWltO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQudmFsdWUoKTtcclxuXHJcblxyXG5cdFx0dmFyIGd1aWxkc0xpc3QgPSBfLm1hcChndWlsZHMsIGZ1bmN0aW9uKGd1aWxkLCBndWlsZElkKSB7XHJcblx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7a2V5OiBndWlsZC5ndWlsZF9pZCwgaWQ6IGd1aWxkLmd1aWxkX2lkLCBjbGFzc05hbWU6IFwiZ3VpbGRcIn0sIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInJvd1wifSwgXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJjb2wtc20tNFwifSwgXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmltZyh7Y2xhc3NOYW1lOiBcImVtYmxlbVwiLCBzcmM6IGdldEVtYmxlbVNyYyhndWlsZC5ndWlsZF9uYW1lKX0pXHJcblx0XHRcdFx0XHRcdCksIFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLXNtLTIwXCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaDEobnVsbCwgZ3VpbGQuZ3VpbGRfbmFtZSwgXCIgW1wiLCBndWlsZC50YWcsIFwiXVwiKSwgXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLnVsKHtjbGFzc05hbWU6IFwibGlzdC11bnN0eWxlZFwifSwgXHJcblx0XHRcdFx0XHRcdFx0XHRfLm1hcChndWlsZC5jbGFpbXMsIGZ1bmN0aW9uKGVudHJ5LCBpeEVudHJ5KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmxpKHtrZXk6IGd1aWxkLmd1aWxkX2lkICsgJy0nICsgaXhFbnRyeX0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0T2JqZWN0aXZlKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZU9mZnNldDogdGltZU9mZnNldCwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGVOb3c6IGRhdGVOb3csIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYW5nOiBsYW5nLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50cnk6IGVudHJ5LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXhFbnRyeTogaXhFbnRyeSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1hcHNNZXRhOiBtYXBzTWV0YX1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHRcdH0pO1xyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwibGlzdC11bnN0eWxlZFwiLCBpZDogXCJndWlsZHNcIn0sIFxyXG5cdFx0XHRcdGd1aWxkc0xpc3RcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGdldEVtYmxlbVNyYyhndWlsZE5hbWUpIHtcclxuXHRyZXR1cm4gJ2h0dHA6Ly9ndWlsZHMuZ3cydzJ3LmNvbS9ndWlsZHMvJyArIGVuY29kZVVSSUNvbXBvbmVudChndWlsZE5hbWUucmVwbGFjZSgvIC9nLCAnLScpKSArICcvNjQuc3ZnJztcclxufVxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Ll8gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLl8gOiBudWxsKTtcclxudmFyIG1vbWVudCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Lm1vbWVudCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwubW9tZW50IDogbnVsbCk7XHJcblxyXG5cclxudmFyIFNwcml0ZSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi4vU3ByaXRlLmpzeCcpKTtcclxudmFyIEFycm93ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuLi9BcnJvdy5qc3gnKSk7XHJcblxyXG5cclxudmFyIHN0YXRpY0RhdGEgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcbnZhciBvYmplY3RpdmVzTmFtZXMgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV9uYW1lcztcclxudmFyIG9iamVjdGl2ZXNUeXBlcyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX3R5cGVzO1xyXG52YXIgb2JqZWN0aXZlc01ldGEgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV9tZXRhO1xyXG52YXIgb2JqZWN0aXZlc0xhYmVscyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX2xhYmVscztcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGltZU9mZnNldCA9IHRoaXMucHJvcHMudGltZU9mZnNldDtcclxuXHRcdHZhciBsYW5nID0gdGhpcy5wcm9wcy5sYW5nO1xyXG5cdFx0dmFyIGVudHJ5ID0gdGhpcy5wcm9wcy5lbnRyeTtcclxuXHRcdHZhciBpeEVudHJ5ID0gdGhpcy5wcm9wcy5peEVudHJ5O1xyXG5cdFx0dmFyIGd1aWxkcyA9IHRoaXMucHJvcHMuZ3VpbGRzO1xyXG5cdFx0dmFyIG1hcHNNZXRhID0gdGhpcy5wcm9wcy5tYXBzTWV0YTtcclxuXHJcblxyXG5cdFx0aWYgKCFfLmhhcyhvYmplY3RpdmVzTWV0YSwgZW50cnkub2JqZWN0aXZlSWQpKSB7XHJcblx0XHRcdC8vIHNob3J0IGNpcmN1aXRcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG9NZXRhID0gb2JqZWN0aXZlc01ldGFbZW50cnkub2JqZWN0aXZlSWRdO1xyXG5cdFx0dmFyIG9OYW1lID0gb2JqZWN0aXZlc05hbWVzW2VudHJ5Lm9iamVjdGl2ZUlkXTtcclxuXHRcdHZhciBvTGFiZWwgPSBvYmplY3RpdmVzTGFiZWxzW2VudHJ5Lm9iamVjdGl2ZUlkXTtcclxuXHRcdHZhciBvVHlwZSA9IG9iamVjdGl2ZXNUeXBlc1tvTWV0YS50eXBlXTtcclxuXHRcdFxyXG5cdFx0dmFyIHRpbWVzdGFtcCA9IG1vbWVudCgoZW50cnkudGltZXN0YW1wICsgdGltZU9mZnNldCkgKiAxMDAwKTtcclxuXHJcblxyXG5cdFx0dmFyIGNsYXNzTmFtZSA9IFtcclxuXHRcdFx0J29iamVjdGl2ZScsXHJcblx0XHRcdCd0ZWFtJywgXHJcblx0XHRcdGVudHJ5LndvcmxkLFxyXG5cdFx0XS5qb2luKCcgJyk7XHJcblxyXG5cdFx0dmFyIG1hcE1ldGEgPSBtYXBzTWV0YVtvTWV0YS5tYXBdO1xyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IGNsYXNzTmFtZSwga2V5OiBpeEVudHJ5fSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS1yZWxhdGl2ZVwifSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uc3BhbihudWxsLCB0aW1lc3RhbXAudHdpdHRlclNob3J0KCkpXHJcblx0XHRcdFx0KSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS10aW1lc3RhbXBcIn0sIFxyXG5cdFx0XHRcdFx0dGltZXN0YW1wLmZvcm1hdCgnaGg6bW06c3MnKVxyXG5cdFx0XHRcdCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJvYmplY3RpdmUtbWFwXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5zcGFuKHt0aXRsZTogbWFwTWV0YS5uYW1lfSwgbWFwTWV0YS5hYmJyKVxyXG5cdFx0XHRcdCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJvYmplY3RpdmUtaWNvbnNcIn0sIFxyXG5cdFx0XHRcdFx0QXJyb3coe29NZXRhOiBvTWV0YX0pLCBcclxuIFx0XHRcdFx0XHRTcHJpdGUoe3R5cGU6IG9UeXBlLm5hbWUsIGNvbG9yOiBlbnRyeS53b3JsZH0pXHJcblx0XHRcdFx0KSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS1sYWJlbFwifSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uc3BhbihudWxsLCBvTGFiZWxbbGFuZy5zbHVnXSlcclxuXHRcdFx0XHQpXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fSxcclxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG52YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LiQgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLiQgOiBudWxsKTtcclxuXHJcbnZhciBPYmplY3RpdmUgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vT2JqZWN0aXZlLmpzeCcpKTtcclxuXHJcbnZhciBzdGF0aWNEYXRhID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG52YXIgb2JqZWN0aXZlc01ldGEgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV9tZXRhO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1hcEZpbHRlcjogJ2FsbCcsXHJcblx0XHRcdGV2ZW50RmlsdGVyOiAnYWxsJyxcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkYXRlTm93ID0gdGhpcy5wcm9wcy5kYXRlTm93O1xyXG5cdFx0dmFyIHRpbWVPZmZzZXQgPSB0aGlzLnByb3BzLnRpbWVPZmZzZXQ7XHJcblx0XHR2YXIgbGFuZyA9IHRoaXMucHJvcHMubGFuZztcclxuXHRcdHZhciBndWlsZHMgPSB0aGlzLnByb3BzLmd1aWxkcztcclxuXHRcdHZhciBtYXRjaFdvcmxkcyA9IHRoaXMucHJvcHMubWF0Y2hXb3JsZHM7XHJcblx0XHR2YXIgbWFwc01ldGEgPSB0aGlzLnByb3BzLm1hcHNNZXRhO1xyXG5cclxuXHRcdHZhciBzZXRXb3JsZCA9IHRoaXMuc2V0V29ybGQ7XHJcblx0XHR2YXIgc2V0RXZlbnQgPSB0aGlzLnNldEV2ZW50O1xyXG5cclxuXHRcdHZhciBldmVudEZpbHRlciA9IHRoaXMuc3RhdGUuZXZlbnRGaWx0ZXI7XHJcblx0XHR2YXIgbWFwRmlsdGVyID0gdGhpcy5zdGF0ZS5tYXBGaWx0ZXI7XHJcblxyXG5cdFx0dmFyIGV2ZW50SGlzdG9yeSA9IF8uY2hhaW4odGhpcy5wcm9wcy5ldmVudEhpc3RvcnkpXHJcblx0XHRcdC5maWx0ZXIoZnVuY3Rpb24oZW50cnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGV2ZW50RmlsdGVyID09ICdhbGwnIHx8IGVudHJ5LnR5cGUgPT0gZXZlbnRGaWx0ZXIpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZmlsdGVyKGZ1bmN0aW9uKGVudHJ5KSB7XHJcblx0XHRcdFx0dmFyIG9NZXRhID0gb2JqZWN0aXZlc01ldGFbZW50cnkub2JqZWN0aXZlSWRdO1xyXG5cdFx0XHRcdHJldHVybiAobWFwRmlsdGVyID09ICdhbGwnIHx8IG9NZXRhLm1hcCA9PSBtYXBGaWx0ZXIpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuc29ydEJ5KCd0aW1lc3RhbXAnKVxyXG5cdFx0XHQucmV2ZXJzZSgpXHJcblx0XHRcdC5tYXAoZnVuY3Rpb24oZW50cnksIGl4RW50cnkpIHtcclxuXHRcdFx0XHR2YXIga2V5ID0gZW50cnkudGltZXN0YW1wICsgJy0nICsgZW50cnkub2JqZWN0aXZlSWQgICsgJy0nICsgZW50cnkudHlwZTsgXHJcblx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7a2V5OiBrZXksIGNsYXNzTmFtZTogXCJ0cmFuc2l0aW9uXCJ9LCBcclxuXHRcdFx0XHRcdFx0T2JqZWN0aXZlKHtcclxuXHRcdFx0XHRcdFx0XHRkYXRlTm93OiBkYXRlTm93LCBcclxuXHRcdFx0XHRcdFx0XHR0aW1lT2Zmc2V0OiB0aW1lT2Zmc2V0LCBcclxuXHRcdFx0XHRcdFx0XHRsYW5nOiBsYW5nLCBcclxuXHRcdFx0XHRcdFx0XHRlbnRyeTogZW50cnksIFxyXG5cdFx0XHRcdFx0XHRcdGd1aWxkczogZ3VpbGRzLCBcclxuXHRcdFx0XHRcdFx0XHRpeEVudHJ5OiBpeEVudHJ5LCBcclxuXHRcdFx0XHRcdFx0XHRtYXRjaFdvcmxkczogbWF0Y2hXb3JsZHMsIFxyXG5cdFx0XHRcdFx0XHRcdG1hcHNNZXRhOiBtYXBzTWV0YX1cclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC52YWx1ZSgpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2lkOiBcImxvZy1jb250YWluZXJcIn0sIFxyXG5cclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwibG9nLXRhYnNcIn0sIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInJvd1wifSwgXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJjb2wtc20tMTZcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS51bCh7aWQ6IFwibG9nLW1hcC1maWx0ZXJzXCIsIGNsYXNzTmFtZTogXCJuYXYgbmF2LXBpbGxzXCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7Y2xhc3NOYW1lOiAobWFwRmlsdGVyID09ICdhbGwnKSA/ICdhY3RpdmUnOiAnbnVsbCd9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe29uQ2xpY2s6IHNldFdvcmxkLCAnZGF0YS1maWx0ZXInOiBcImFsbFwifSwgXCJBbGxcIilcclxuXHRcdFx0XHRcdFx0XHRcdCksIFxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdF8ubWFwKFtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwc01ldGFbM10sXHJcblx0XHRcdFx0XHRcdFx0XHRcdG1hcHNNZXRhWzBdLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBzTWV0YVsyXSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwc01ldGFbMV0sXHJcblx0XHRcdFx0XHRcdFx0XHRdLCBmdW5jdGlvbihtYXBNZXRhLCBpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmxpKHtrZXk6IG1hcE1ldGEuaW5kZXgsIGNsYXNzTmFtZTogKG1hcEZpbHRlciA9PT0gbWFwTWV0YS5pbmRleCkgPyAnYWN0aXZlJzogJ251bGwnfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7b25DbGljazogc2V0V29ybGQsICdkYXRhLWZpbHRlcic6IG1hcE1ldGEuaW5kZXh9LCBtYXBNZXRhLm5hbWUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdCksIFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLXNtLThcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS51bCh7aWQ6IFwibG9nLWV2ZW50LWZpbHRlcnNcIiwgY2xhc3NOYW1lOiBcIm5hdiBuYXYtcGlsbHNcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmxpKHtjbGFzc05hbWU6IChldmVudEZpbHRlciA9PT0gJ2NsYWltJykgPyAnYWN0aXZlJzogJ251bGwnfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5hKHtvbkNsaWNrOiBzZXRFdmVudCwgJ2RhdGEtZmlsdGVyJzogXCJjbGFpbVwifSwgXCJDbGFpbXNcIilcclxuXHRcdFx0XHRcdFx0XHRcdCksIFxyXG5cdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmxpKHtjbGFzc05hbWU6IChldmVudEZpbHRlciA9PT0gJ2NhcHR1cmUnKSA/ICdhY3RpdmUnOiAnbnVsbCd9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe29uQ2xpY2s6IHNldEV2ZW50LCAnZGF0YS1maWx0ZXInOiBcImNhcHR1cmVcIn0sIFwiQ2FwdHVyZXNcIilcclxuXHRcdFx0XHRcdFx0XHRcdCksIFxyXG5cdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmxpKHtjbGFzc05hbWU6IChldmVudEZpbHRlciA9PT0gJ2FsbCcpID8gJ2FjdGl2ZSc6ICdudWxsJ30sIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7b25DbGljazogc2V0RXZlbnQsICdkYXRhLWZpbHRlcic6IFwiYWxsXCJ9LCBcIkFsbFwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdCksIFxyXG5cclxuXHRcdFx0XHRSZWFjdC5ET00udWwoe2NsYXNzTmFtZTogXCJsaXN0LXVuc3R5bGVkXCIsIGlkOiBcImxvZ1wifSwgXHJcblx0XHRcdFx0XHRldmVudEhpc3RvcnlcclxuXHRcdFx0XHQpXHJcblxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH0sXHJcblxyXG5cdHNldFdvcmxkOiBmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgZmlsdGVyID0gJChlLnRhcmdldCkuZGF0YSgnZmlsdGVyJyk7XHJcblx0XHR0aGlzLnNldFN0YXRlKHttYXBGaWx0ZXI6IGZpbHRlcn0pO1xyXG5cdH0sXHJcblx0c2V0RXZlbnQ6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBmaWx0ZXIgPSAkKGUudGFyZ2V0KS5kYXRhKCdmaWx0ZXInKTtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe2V2ZW50RmlsdGVyOiBmaWx0ZXJ9KTtcclxuXHR9LFxyXG59KTtcclxuXHJcbi8qXHJcblxyXG4qL1xyXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5fIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5fIDogbnVsbCk7XHJcbnZhciBtb21lbnQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5tb21lbnQgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLm1vbWVudCA6IG51bGwpO1xyXG5cclxudmFyIFNwcml0ZSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi4vU3ByaXRlLmpzeCcpKTtcclxudmFyIEFycm93ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuLi9BcnJvdy5qc3gnKSk7XHJcblxyXG52YXIgbGliRGF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9kYXRlLmpzJyk7XHJcblxyXG52YXIgc3RhdGljRGF0YSA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxudmFyIG9iamVjdGl2ZXNOYW1lcyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX25hbWVzO1xyXG52YXIgb2JqZWN0aXZlc1R5cGVzID0gc3RhdGljRGF0YS5vYmplY3RpdmVfdHlwZXM7XHJcbnZhciBvYmplY3RpdmVzTWV0YSA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX21ldGE7XHJcbnZhciBvYmplY3RpdmVzTGFiZWxzID0gc3RhdGljRGF0YS5vYmplY3RpdmVfbGFiZWxzO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhdGVOb3cgPSB0aGlzLnByb3BzLmRhdGVOb3c7XHJcblx0XHR2YXIgdGltZU9mZnNldCA9IHRoaXMucHJvcHMudGltZU9mZnNldDtcclxuXHRcdHZhciBub3dPZmZzZXQgPSBkYXRlTm93ICsgdGltZU9mZnNldDtcclxuXHJcblx0XHR2YXIgbGFuZyA9IHRoaXMucHJvcHMubGFuZztcclxuXHRcdHZhciBlbnRyeSA9IHRoaXMucHJvcHMuZW50cnk7XHJcblx0XHR2YXIgaXhFbnRyeSA9IHRoaXMucHJvcHMuaXhFbnRyeTtcclxuXHRcdHZhciBndWlsZHMgPSB0aGlzLnByb3BzLmd1aWxkcztcclxuXHRcdHZhciBtYXRjaFdvcmxkcyA9IHRoaXMucHJvcHMubWF0Y2hXb3JsZHM7XHJcblx0XHR2YXIgbWFwc01ldGEgPSB0aGlzLnByb3BzLm1hcHNNZXRhO1xyXG5cclxuXHJcblx0XHRpZiAoIV8uaGFzKG9iamVjdGl2ZXNNZXRhLCBlbnRyeS5vYmplY3RpdmVJZCkpIHtcclxuXHRcdFx0Ly8gc2hvcnQgY2lyY3VpdFxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgb01ldGEgPSBvYmplY3RpdmVzTWV0YVtlbnRyeS5vYmplY3RpdmVJZF07XHJcblx0XHR2YXIgb05hbWUgPSBvYmplY3RpdmVzTmFtZXNbZW50cnkub2JqZWN0aXZlSWRdO1xyXG5cdFx0dmFyIG9MYWJlbCA9IG9iamVjdGl2ZXNMYWJlbHNbZW50cnkub2JqZWN0aXZlSWRdO1xyXG5cdFx0dmFyIG9UeXBlID0gb2JqZWN0aXZlc1R5cGVzW29NZXRhLnR5cGVdO1xyXG5cclxuXHRcdHZhciBleHBpcmVzID0gZW50cnkudGltZXN0YW1wICsgKDUgKiA2MCk7XHJcblx0XHR2YXIgdGltZXJBY3RpdmUgPSAoZXhwaXJlcyA+PSBub3dPZmZzZXQgKyA1KTsgLy8gc2hvdyAgYWZ0ZXIgZXhwaXJpbmdcclxuXHRcdHZhciBzZWNvbmRzUmVtYWluaW5nID0gZXhwaXJlcyAtIG5vd09mZnNldDtcclxuXHRcdHZhciBleHBpcmF0aW9uID0gbW9tZW50KHNlY29uZHNSZW1haW5pbmcgKiAxMDAwKTtcclxuXHJcblx0XHR2YXIgdGltZXN0YW1wID0gbW9tZW50KChlbnRyeS50aW1lc3RhbXAgKyB0aW1lT2Zmc2V0KSAqIDEwMDApO1xyXG5cclxuXHJcblx0XHR2YXIgY2xhc3NOYW1lID0gW1xyXG5cdFx0XHQnb2JqZWN0aXZlJyxcclxuXHRcdFx0J3RlYW0nLCBcclxuXHRcdFx0ZW50cnkud29ybGQsXHJcblx0XHRdLmpvaW4oJyAnKTtcclxuXHJcblx0XHR2YXIgbWFwTWV0YSA9IG1hcHNNZXRhW29NZXRhLm1hcF07XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogY2xhc3NOYW1lLCBrZXk6IGl4RW50cnl9LCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwib2JqZWN0aXZlLXJlbGF0aXZlXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwsIHRpbWVzdGFtcC50d2l0dGVyU2hvcnQoKSlcclxuXHRcdFx0XHQpLCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwib2JqZWN0aXZlLXRpbWVzdGFtcFwifSwgXHJcblx0XHRcdFx0XHR0aW1lc3RhbXAuZm9ybWF0KCdoaDptbTpzcycpXHJcblx0XHRcdFx0KSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS1tYXBcIn0sIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnNwYW4oe3RpdGxlOiBtYXBNZXRhLm5hbWV9LCBtYXBNZXRhLmFiYnIpXHJcblx0XHRcdFx0KSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS1pY29uc1wifSwgXHJcblx0XHRcdFx0XHRBcnJvdyh7b01ldGE6IG9NZXRhfSksIFxyXG4gXHRcdFx0XHRcdFNwcml0ZSh7dHlwZTogb1R5cGUubmFtZSwgY29sb3I6IGVudHJ5LndvcmxkfSlcclxuXHRcdFx0XHQpLCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwib2JqZWN0aXZlLWxhYmVsXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwsIG9MYWJlbFtsYW5nLnNsdWddKVxyXG5cdFx0XHRcdCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJvYmplY3RpdmUtZ3VpbGRcIn0sIFxyXG5cdFx0XHRcdFx0cmVuZGVyR3VpbGQoZW50cnkuZ3VpbGQsIGd1aWxkcylcclxuXHRcdFx0XHQpXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fSxcclxufSk7XHJcblxyXG5cclxuZnVuY3Rpb24gcmVuZGVyR3VpbGQoZ3VpbGRJZCwgZ3VpbGRzKSB7XHJcblx0aWYgKCFndWlsZElkKSB7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR2YXIgZ3VpbGQgPSBndWlsZHNbZ3VpbGRJZF07XHJcblxyXG5cdFx0dmFyIGd1aWxkQ2xhc3MgPSBbXHJcblx0XHRcdCdndWlsZCcsXHJcblx0XHRcdCduYW1lJyxcclxuXHRcdFx0J3BlbmRpbmcnXHJcblx0XHRdLmpvaW4oJyAnKTtcclxuXHJcblx0XHRpZighZ3VpbGQpIHtcclxuXHRcdFx0cmV0dXJuIFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IGd1aWxkQ2xhc3N9LCBSZWFjdC5ET00uaSh7Y2xhc3NOYW1lOiBcImZhIGZhLXNwaW5uZXIgZmEtc3BpblwifSkpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiBSZWFjdC5ET00uc3BhbihudWxsLCBcclxuXHRcdFx0XHRSZWFjdC5ET00uYSh7Y2xhc3NOYW1lOiBndWlsZENsYXNzLCBocmVmOiAnIycgKyBndWlsZElkLCB0aXRsZTogZ3VpbGQuZ3VpbGRfbmFtZX0sIGd1aWxkLmd1aWxkX25hbWUsIFwiIFtcIiwgZ3VpbGQudGFnLCBcIl1cIilcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0ZGF0ZU5vdzogZGF0ZU5vdyxcclxuXHRhZGQ1OiBhZGQ1LFxyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRhdGVOb3coKSB7XHJcblx0cmV0dXJuIE1hdGguZmxvb3IoXy5ub3coKSAvIDEwMDApO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gYWRkNShpbkRhdGUpIHtcclxuXHR2YXIgX2Jhc2VEYXRlID0gaW5EYXRlIHx8IGRhdGVOb3coKTtcclxuXHJcblx0cmV0dXJuIChfYmFzZURhdGUgKyAoNSAqIDYwKSk7XHJcbn1cclxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG5cclxudmFyIE92ZXJ2aWV3ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL2pzeC9PdmVydmlldy5qc3gnKSk7XHJcblxyXG52YXIgTGFuZ3MgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vanN4L0xhbmdzLmpzeCcpKTtcclxudmFyIGxhbmdzID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpLmxhbmdzO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvdmVydmlldyhjdHgpIHtcclxuXHR2YXIgbGFuZ1NsdWcgPSBjdHgucGFyYW1zLmxhbmdTbHVnIHx8ICdlbic7XHJcblx0dmFyIGxhbmcgPSBsYW5nc1tsYW5nU2x1Z107XHJcblxyXG5cdFJlYWN0LnJlbmRlcihMYW5ncyh7bGFuZzogbGFuZ30pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWxhbmdzJykpO1xyXG5cdFJlYWN0LnJlbmRlcihPdmVydmlldyh7bGFuZzogbGFuZ30pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpKTtcclxufTtcclxuXHJcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Ll8gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLl8gOiBudWxsKTtcclxuXHJcbnZhciBUcmFja2VyID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL2pzeC9UcmFja2VyLmpzeCcpKTtcclxuXHJcbnZhciBMYW5ncyA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9qc3gvTGFuZ3MuanN4JykpO1xyXG52YXIgbGFuZ3MgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJykubGFuZ3M7XHJcbnZhciB3b3JsZHMgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJykud29ybGRzO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvdmVydmlldyhjdHgpIHtcclxuXHR2YXIgbGFuZ1NsdWcgPSBjdHgucGFyYW1zLmxhbmdTbHVnO1xyXG5cdHZhciBsYW5nID0gbGFuZ3NbbGFuZ1NsdWddO1xyXG5cclxuXHR2YXIgd29ybGRTbHVnID0gY3R4LnBhcmFtcy53b3JsZFNsdWc7XHJcblx0dmFyIHdvcmxkID0gXy5maW5kKHdvcmxkcywgZnVuY3Rpb24od29ybGQpIHtcclxuXHRcdHJldHVybiB3b3JsZFtsYW5nLnNsdWddLnNsdWcgPT09IHdvcmxkU2x1ZztcclxuXHR9KTtcclxuXHJcblxyXG5cdFJlYWN0LnJlbmRlcihMYW5ncyh7bGFuZzogbGFuZywgd29ybGQ6IHdvcmxkfSksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtbGFuZ3MnKSk7XHJcblx0UmVhY3QucmVuZGVyKFRyYWNrZXIoe2xhbmc6IGxhbmcsIHdvcmxkOiB3b3JsZH0pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpKTtcclxufTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSJdfQ==
