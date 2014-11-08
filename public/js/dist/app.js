(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
"use strict";

/*
*
*	config
*
*/

window.app = {
	state: {
		lang: 'en',
	},
	guilds: {},
 };



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

},{"./overview.jsx":33,"./tracker.jsx":34,"page":11}],2:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
module.exports = {
	langs: require('./data/langs'),
	worlds: require('./data/world_names'),
	objective_names: require('./data/objective_names'),
	objective_types: require('./data/objective_types'),
	objective_meta: require('./data/objective_meta'),
	objective_labels: require('./data/objective_labels'),
	objective_map: require('./data/objective_map'),
};

},{"./data/langs":3,"./data/objective_labels":4,"./data/objective_map":5,"./data/objective_meta":6,"./data/objective_names":7,"./data/objective_types":8,"./data/world_names":9}],11:[function(require,module,exports){

;(function(){

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
    if ('function' == typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' == typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
    // show <path> with [state]
    } else if ('string' == typeof path) {
      page.show(path, fn);
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
    if (0 == arguments.length) return base;
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
    if (!dispatch) return;
    var url = location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function(){
    running = false;
    removeEventListener('click', onclick, false);
    removeEventListener('popstate', onpopstate, false);
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
    if (!ctx.unhandled) ctx.pushState();
    return ctx;
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
    if (null == dispatch) dispatch = true;
    if (dispatch) page.dispatch(ctx);
    ctx.save();
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
    var current = window.location.pathname + window.location.search;
    if (current == ctx.canonicalPath) return;
    page.stop();
    ctx.unhandled = true;
    window.location = ctx.canonicalPath;
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
    if ('/' == path[0] && 0 != path.indexOf(base)) path = base + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? path.slice(i + 1) : '';
    this.pathname = ~i ? path.slice(0, i) : path;
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
    history.pushState(this.state, this.title, this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function(){
    history.replaceState(this.state, this.title, this.canonicalPath);
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
    this.path = path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(path
      , this.keys = []
      , options.sensitive
      , options.strict);
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
    var keys = this.keys
      , qsIndex = path.indexOf('?')
      , pathname = ~qsIndex ? path.slice(0, qsIndex) : path
      , m = this.regexp.exec(pathname);

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = 'string' == typeof m[i]
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
   * Normalize the given path string,
   * returning a regular expression.
   *
   * An empty array should be passed,
   * which will contain the placeholder
   * key names. For example "/user/:id" will
   * then contain ["id"].
   *
   * @param  {String|RegExp|Array} path
   * @param  {Array} keys
   * @param  {Boolean} sensitive
   * @param  {Boolean} strict
   * @return {RegExp}
   * @api private
   */

  function pathtoRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  }

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
    if (el.pathname == location.pathname && (el.hash || '#' == link)) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;

    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // same page
    var orig = path + el.hash;

    path = path.replace(base, '');
    if (base && orig == path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null == e.which
      ? e.button
      : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return 0 == href.indexOf(origin);
  }

  /**
   * Expose `page`.
   */

  if ('undefined' == typeof module) {
    window.page = page;
  } else {
    module.exports = page;
  }

})();

},{}],12:[function(require,module,exports){
"use strict";


module.exports = {
	getGuildDetails: getGuildDetails,
	getMatches: getMatches,
	getMatchDetails: getMatchDetails,
	getMatchDetailsByWorld: getMatchDetailsByWorld,
};



function getGuildDetails(guildId, onSuccess, onError, onComplete) {
	var requestUrl = 'https://api.guildwars2.com/v1/guild_details.json?guild_id=' + guildId;
	get(requestUrl, onSuccess, onError, onComplete);
}



function getMatches(onSuccess, onError, onComplete) {
	var requestUrl = 'http://state.gw2w2w.com/matches';
	get(requestUrl, onSuccess, onError, onComplete);
}



function getMatchDetails(matchId, onSuccess, onError, onComplete) {
	var requestUrl = 'http://state.gw2w2w.com/' + matchId;
	get(requestUrl, onSuccess, onError, onComplete);
}

function getMatchDetailsByWorld(worldSlug, onSuccess, onError, onComplete) {
	var requestUrl = 'http://state.gw2w2w.com/world/' + worldSlug;
	get(requestUrl, onSuccess, onError, onComplete);
}



function get(url, onSuccess, onError, onComplete) {
	$.ajax({
		url: url,
		dataType: 'json',
		success: onSuccess,
		error: onError,
		complete: onComplete,
	});
}



},{}],13:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var langs = require('gw2w2w-static').langs;
var worlds = require('gw2w2w-static').worlds;

module.exports = React.createClass({displayName: 'exports',	
	render: function() {
		var langSlug = this.props.langSlug;
		var worldSlug = this.props.worldSlug;

		if (worldSlug) {
			var world = _.find(worlds, function(world) {
				return world[langSlug].slug === worldSlug;
			});
		}

		langs = _.map(langs, function(lang){
			lang.link = '/' + lang.slug;

			if (world) {
				lang.link = lang.link + '/' + world[lang.slug].slug;
			} 

			return lang;
		});


		return (
			React.DOM.ul({className: "nav navbar-nav"}, 
				_.map(langs, function(lang) {
					return (
						React.DOM.li({key: lang.slug, className: (lang.slug === langSlug) ? 'active' : '', title: lang.name}, 
							React.DOM.a({'data-slug': lang.slug, href: lang.link}, lang.label)
						)
					);
				})
			)
		);
	},
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"gw2w2w-static":10}],14:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var RegionMatches = React.createFactory(require('./overview/RegionMatches.jsx'));
var RegionWorlds = React.createFactory(require('./overview/RegionWorlds.jsx'));

var regions = [
	{"label": "NA Worlds", "regionId": "1"},
	{"label": "EU Worlds", "regionId": "2"},
];


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
		var lang = window.app.state.lang;
		var langSlug = lang.slug;

		var regionMatches = [
			{"label": "NA Matchups", "matches": _.filter(this.state.matches, {region: 1})},
			{"label": "EU Matchups", "matches": _.filter(this.state.matches, {region: 2})},
		];

		return (
			React.DOM.div({id: "overview"}, 
				React.DOM.div({className: "row"}, 
					_.map(regionMatches, function(region){
						return (
							React.DOM.div({className: "col-sm-12", key: region.label}, 
								RegionMatches({region: region})
							)
						);
					})
				), 

				React.DOM.hr(null), 

				React.DOM.div({className: "row"}, 
					_.map(regions, function(region){
						return (
							React.DOM.div({className: "col-sm-12", key: region.label}, 
								RegionWorlds({region: region})
							)
						);
					})
				)
			)
		);
	},



	getMatches: function() {
		var api = require('../api');

		api.getMatches(
			this.getMatchesSuccess,
			this.getMatchesError,
			this.getMatchesComplete
		);

	},

	getMatchesSuccess: function(data) {
		this.setState({matches: data});
	},
	getMatchesError: function(xhr, status, err) {
		console.log('Overview::getMatches:data error', status, err.toString()); 
	},
	getMatchesComplete: function() {
		var interval = _.random(2000, 4000);
		this.updateTimer = setTimeout(this.getMatches, interval);
	},
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../api":12,"./overview/RegionMatches.jsx":18,"./overview/RegionWorlds.jsx":19}],15:[function(require,module,exports){
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
var worlds = staticData.worlds;

module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {
			match: [],
			details: [],
			guilds: {},
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
		var lang = window.app.state.lang;
		var langSlug = lang.slug;

		var details = this.state.details;


		if (_.isEmpty(this.state.details) || this.state.details.initialized === false) {
			return null;
		}
		else {
			var match = this.state.match;
			var guilds = this.state.guilds;
			
			var eventHistory = details.history;

			var matchWorlds = _.map(
				[match.redId, match.blueId, match.greenId],
				function(worldId, worldIndex) {
					var world = worlds[worldId][langSlug];
					world.link = '/' + langSlug + '/' + world.slug;
					world.color = ['red','blue','green'][worldIndex];
					return world;
				}
			);

			var mapsMeta = [
				{
					'index': 0,
					'name': 'RedHome' ,
					'long': 'RedHome - ' + matchWorlds[0].name,
					'abbr': 'Red',
					'color': 'red',
					'world': matchWorlds[0]
				}, {
					'index': 1,
					'name': 'GreenHome',
					'long': 'GreenHome - ' + matchWorlds[2].name,
					'abbr': 'Grn',
					'color': 'green',
					'world': matchWorlds[2]
				}, {
					'index': 2,
					'name': 'BlueHome',
					'long': 'BlueHome - ' + matchWorlds[1].name,
					'abbr': 'Blu',
					'color': 'blue',
					'world': matchWorlds[1]
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
						match: match, 
						matchWorlds: matchWorlds, 
						mapsMeta: mapsMeta}
					), 

					Maps({
						details: details, 
						matchWorlds: matchWorlds, 
						mapsMeta: mapsMeta, 
						guilds: guilds}
					), 
					
					React.DOM.hr(null), 

					Guilds({
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
		
		api.getMatchDetailsByWorld(
			this.props.worldSlug,
			this.onMatchDetailsSuccess, 
			this.onMatchDetailsError, 
			this.onMatchDetailsComplete
		);
	},

	onMatchDetailsSuccess: function(data) {
		// console.log('Match::onMatchDetailsSuccess', this.props.data.wvw_match_id, data);
		var component = this;

		this.setState({
			match: data.match,
			details: data.details,
			// guilds: guilds,
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
	},

	onMatchDetailsError: function(xhr, status, err) {
		console.log('Overview::getMatchDetails:data error', status, err.toString()); 
	},

	onMatchDetailsComplete: function(xhr, status, err) {
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
		function(data) {
			// console.log('component.state', component.state);
			// var guild = _.merge(component.state.guilds[guildId], data);
			component.state.guilds[guildId] = data;
			component.setState({guilds: component.state.guilds});
		}, 
		_.noop,
		onComplete.bind(null, null) // so no error is returned
	);
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../api":12,"./tracker/Maps.jsx":25,"./tracker/Scoreboard.jsx":26,"./tracker/guilds/Guilds.jsx":28,"_process":2,"gw2w2w-static":10}],16:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);


var Score = React.createFactory(require('./Score.jsx'));
var Pie = React.createFactory(require('./Pie.jsx'));

var worldsStatic = require('gw2w2w-static').worlds;

module.exports = React.createClass({displayName: 'exports',
	render: function() {
		// console.log('Match:render', this.props.match.id);
		var lang = window.app.state.lang;
		var langSlug = lang.slug;

		var match = this.props.match;

		var redWorld = worldsStatic[match.redId][langSlug];
		var blueWorld = worldsStatic[match.blueId][langSlug];
		var greenWorld = worldsStatic[match.greenId][langSlug];

		[redWorld, blueWorld, greenWorld].map(function(world) {
			world.link = '/' + langSlug + '/' + world.slug;
			return world;
		});

		return (
			React.DOM.div({className: "matchContainer", key: match.id}, 
				React.DOM.table({className: "match"}, 
					React.DOM.tr(null, 
						React.DOM.td({className: "team red name"}, React.DOM.a({href: redWorld.link}, redWorld.name)), 
						React.DOM.td({className: "team red score"}, 
							Score({
								key: 'red-score-' + match.id, 
								matchId: match.id, 
								team: "red", 
								score: match.scores[0]}
							)
						), 
						React.DOM.td({rowSpan: "3", className: "pie"}, 
							Pie({scores: match.scores, size: "60", matchId: match.id})
						)
					), 
					React.DOM.tr(null, 
						React.DOM.td({className: "team blue name"}, React.DOM.a({href: blueWorld.link}, blueWorld.name)), 
						React.DOM.td({className: "team blue score"}, 
							Score({
								key: 'blue-score-' + match.id, 
								matchId: match.id, 
								team: "blue", 
								score: match.scores[1]}
							)
						)
					), 
					React.DOM.tr(null, 
						React.DOM.td({className: "team green name"}, React.DOM.a({href: greenWorld.link}, greenWorld.name)), 
						React.DOM.td({className: "team green score"}, 
							Score({
								key: 'green-score-' + match.id, 
								matchId: match.id, 
								team: "green", 
								score: match.scores[2]}
							)
						)
					)
				)
			)
		);
	},
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Pie.jsx":17,"./Score.jsx":20,"gw2w2w-static":10}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);


var Match = React.createFactory(require('./Match.jsx'));

module.exports = React.createClass({displayName: 'exports',
	render: function() {

		var region = this.props.region;
		var worlds = this.props.worlds;

		return (
			React.DOM.div({className: "RegionMatches"}, 
				React.DOM.h2(null, region.label), 
				_.map(region.matches, function(match){
					return (
						Match({
							key: 'match-' + match.id, 
							className: "match", 
							match: match, 
							worlds: worlds}
						)
					);
				})
			)
		);
	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Match.jsx":16}],19:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);


var worldsStatic = require('gw2w2w-static').worlds;

module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var lang = window.app.state.lang;
		var langSlug = lang.slug;

		var label = this.props.region.label;
		var regionId = this.props.region.regionId;

		var worlds = _.chain(worldsStatic)
			.filter(function(world) {return world.region == regionId;})
			.map(function(world) {
				world[langSlug].id = world.id;
				world[langSlug].link = '/' + langSlug + '/' + world.slug;
				return world[langSlug];
			})
			.sortBy('name')
			.value();

		return (
			React.DOM.div({className: "RegionWorlds"}, 
				React.DOM.h2(null, label), 
				React.DOM.ul({className: "list-unstyled"}, 
					_.map(worlds, function(world){
						return (
							React.DOM.li({key: 'world' + world.id}, 
								React.DOM.a({href: world.slug}, 
									world.name
								)
							)
						);
					})
				)
			)
		);
	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"gw2w2w-static":10}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{"./MapSection.jsx":24,"gw2w2w-static":10}],23:[function(require,module,exports){
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
		var appState = window.app.state;

		var dateNow = this.props.dateNow;
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

		var expires = owner.timestamp + (5 * 60);
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
					React.DOM.span(null, oLabel[appState.lang.slug])
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
},{"./Arrow.jsx":21,"./Sprite.jsx":27,"gw2w2w-static":10}],24:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);


var MapObjective = React.createFactory(require('./MapObjective.jsx'));


module.exports = React.createClass({displayName: 'exports',

	render: function() {

		var dateNow = this.props.dateNow;
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
},{"./MapObjective.jsx":23}],25:[function(require,module,exports){
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
},{"../../lib/date.js":32,"./MapDetails.jsx":22,"./log/Log.jsx":30,"gw2w2w-static":10}],26:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
var numeral = (typeof window !== "undefined" ? window.numeral : typeof global !== "undefined" ? global.numeral : null);

var Sprite = React.createFactory(require('./Sprite.jsx'));
var staticData = require('gw2w2w-static');
var objectiveTypes = staticData.objective_types;

var colors = ['red', 'blue', 'green'];
var colorMap = {"red": 0, "green": 1, "blue": 2};

module.exports = React.createClass({displayName: 'exports',

	componentDidMount: function() {
	},

	render: function() {
		var lang = window.app.state.lang;
		var langSlug = lang.slug;

		var match = this.props.match;
		var scores = _.map(match.scores, function(score){return numeral(score).format('0,0'); });
		var ticks = match.ticks;
		var holdings = match.holdings;
		var matchWorlds = this.props.matchWorlds;

		return (
			React.DOM.div({className: "row", id: "scoreboards"}, 
				_.map(scores, function(score, scoreIndex) {

					var scoreboardClass = [
						'scoreboard',
						'team-bg',
						'team',
						'text-center',
						colors[scoreIndex]
					].join(' ');

					return (
						React.DOM.div({className: "col-sm-8", key: 'total-score-' + scoreIndex}, 
							React.DOM.div({className: scoreboardClass}, 

								React.DOM.h1(null, matchWorlds[scoreIndex].name), 
								React.DOM.h2(null, score, " +", ticks[scoreIndex]), 

								React.DOM.ul({className: "list-inline"}, 
									_.map(holdings[scoreIndex], function(holding, ixHolding) {
										var oType = objectiveTypes[ixHolding + 1];

										return (
											React.DOM.li({key: ixHolding}, 
												Sprite({type: oType.name, color: colors[scoreIndex]}), " x ", holding
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
},{"./Sprite.jsx":27,"gw2w2w-static":10}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);


var Objective = React.createFactory(require('./Objective.jsx'));

module.exports = React.createClass({displayName: 'exports',

	render: function() {
		var dateNow = this.props.dateNow;
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
},{"./Objective.jsx":29}],29:[function(require,module,exports){
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
		var appState = window.app.state;

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
		
		var timestamp = moment(entry.timestamp * 1000);


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
					React.DOM.span(null, oLabel[appState.lang.slug])
				)
			)
		);
	},
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Arrow.jsx":21,"../Sprite.jsx":27,"gw2w2w-static":10}],30:[function(require,module,exports){
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
},{"./Objective.jsx":31,"gw2w2w-static":10}],31:[function(require,module,exports){
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
		var appState = window.app.state;

		var dateNow = this.props.dateNow;
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
		var timerActive = (expires >= dateNow + 5); // show for 5 seconds after expiring
		var secondsRemaining = expires - dateNow;
		var expiration = moment(secondsRemaining * 1000);

		var timestamp = moment(entry.timestamp * 1000);


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
					React.DOM.span(null, oLabel[appState.lang.slug])
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
},{"../../../lib/date.js":32,"../Arrow.jsx":21,"../Sprite.jsx":27,"gw2w2w-static":10}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var Overview = React.createFactory(require('./jsx/Overview.jsx'));

var Langs = React.createFactory(require('./jsx/Langs.jsx'));
var langs = require('gw2w2w-static').langs;

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug || 'en';

	var appState = window.app.state;
	appState.lang = langs[langSlug];

	React.render(Langs({langSlug: langSlug}), document.getElementById('nav-langs'));
	React.render(Overview(null), document.getElementById('content'));
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./jsx/Langs.jsx":13,"./jsx/Overview.jsx":14,"gw2w2w-static":10}],34:[function(require,module,exports){
(function (global){
/** @jsx React.DOM *//*jslint node: true */
"use strict";

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var Tracker = React.createFactory(require('./jsx/Tracker.jsx'));

var Langs = React.createFactory(require('./jsx/Langs.jsx'));
var langs = require('gw2w2w-static').langs;

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug;
	var worldSlug = ctx.params.worldSlug;

	var appState = window.app.state;
	appState.lang = langs[langSlug];

	React.render(Langs({langSlug: langSlug, worldSlug: worldSlug}), document.getElementById('nav-langs'));
	React.render(Tracker({worldSlug: worldSlug}), document.getElementById('content'));
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./jsx/Langs.jsx":13,"./jsx/Tracker.jsx":15,"gw2w2w-static":10}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi9wdWJsaWMvanMvc3JjL2FwcC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvbGFuZ3MuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3Qvbm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvZGF0YS9vYmplY3RpdmVfbGFiZWxzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX21hcC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9ub2RlX21vZHVsZXMvZ3cydzJ3LXN0YXRpYy9kYXRhL29iamVjdGl2ZV9tZXRhLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX25hbWVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvb2JqZWN0aXZlX3R5cGVzLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9ndzJ3Mnctc3RhdGljL2RhdGEvd29ybGRfbmFtZXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3Qvbm9kZV9tb2R1bGVzL2d3Mncydy1zdGF0aWMvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3Qvbm9kZV9tb2R1bGVzL3BhZ2UvaW5kZXguanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9hcGkuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvTGFuZ3MuanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L092ZXJ2aWV3LmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC9UcmFja2VyLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC9vdmVydmlldy9NYXRjaC5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvb3ZlcnZpZXcvUGllLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC9vdmVydmlldy9SZWdpb25NYXRjaGVzLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC9vdmVydmlldy9SZWdpb25Xb3JsZHMuanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L292ZXJ2aWV3L1Njb3JlLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC90cmFja2VyL0Fycm93LmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC90cmFja2VyL01hcERldGFpbHMuanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L3RyYWNrZXIvTWFwT2JqZWN0aXZlLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC90cmFja2VyL01hcFNlY3Rpb24uanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L3RyYWNrZXIvTWFwcy5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9TY29yZWJvYXJkLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC90cmFja2VyL1Nwcml0ZS5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9ndWlsZHMvR3VpbGRzLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC90cmFja2VyL2d1aWxkcy9PYmplY3RpdmUuanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L3RyYWNrZXIvbG9nL0xvZy5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9sb2cvT2JqZWN0aXZlLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9kYXRlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvb3ZlcnZpZXcuanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvdHJhY2tlci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOS9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4qXHJcbipcdGNvbmZpZ1xyXG4qXHJcbiovXHJcblxyXG53aW5kb3cuYXBwID0ge1xyXG5cdHN0YXRlOiB7XHJcblx0XHRsYW5nOiAnZW4nLFxyXG5cdH0sXHJcblx0Z3VpbGRzOiB7fSxcclxuIH07XHJcblxyXG5cclxuXHJcbi8qXHJcbipcclxuKlx0Um91dGluZ1xyXG4qXHJcbiovXHJcblxyXG52YXIgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UnKTtcclxucGFnZSgnLzpsYW5nU2x1ZyhlbnxkZXxlc3xmcik/JywgcmVxdWlyZSgnLi9vdmVydmlldy5qc3gnKSk7XHJcbnBhZ2UoJy86bGFuZ1NsdWcoZW58ZGV8ZXN8ZnIpLzp3b3JsZFNsdWcoW2Etei1dKyknLCByZXF1aXJlKCcuL3RyYWNrZXIuanN4JykpO1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuXHRwYWdlLnN0YXJ0KHtcclxuXHRcdGNsaWNrOiB0cnVlLFxyXG5cdFx0cG9wc3RhdGU6IGZhbHNlLFxyXG5cdFx0ZGlzcGF0Y2g6IHRydWUsXHJcblx0fSk7XHJcbn0pO1xyXG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiZW5cIjoge1xyXG5cdFx0XCJzb3J0XCI6IDEsXHJcblx0XHRcInNsdWdcIjogXCJlblwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVOXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZW5cIixcclxuXHRcdFwibmFtZVwiOiBcIkVuZ2xpc2hcIlxyXG5cdH0sXHJcblx0XCJkZVwiOiB7XHJcblx0XHRcInNvcnRcIjogMixcclxuXHRcdFwic2x1Z1wiOiBcImRlXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiREVcIixcclxuXHRcdFwibGlua1wiOiBcIi9kZVwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRGV1dHNjaFwiXHJcblx0fSxcclxuXHRcImVzXCI6IHtcclxuXHRcdFwic29ydFwiOiAzLFxyXG5cdFx0XCJzbHVnXCI6IFwiZXNcIixcclxuXHRcdFwibGFiZWxcIjogXCJFU1wiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2VzXCIsXHJcblx0XHRcIm5hbWVcIjogXCJFc3Bhw7FvbFwiXHJcblx0fSxcclxuXHRcImZyXCI6IHtcclxuXHRcdFwic29ydFwiOiA0LFxyXG5cdFx0XCJzbHVnXCI6IFwiZnJcIixcclxuXHRcdFwibGFiZWxcIjogXCJGUlwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2ZyXCIsXHJcblx0XHRcIm5hbWVcIjogXCJGcmFuw6dhaXNcIlxyXG5cdH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCIxXCI6IHtcImlkXCI6IFwiMVwiLCBcImVuXCI6IFwiT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlXCIsIFwiZXNcIjogXCJNaXJhZG9yXCIsIFwiZGVcIjogXCJBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjJcIjoge1wiaWRcIjogXCIyXCIsIFwiZW5cIjogXCJWYWxsZXlcIiwgXCJmclwiOiBcIlZhbGzDqWVcIiwgXCJlc1wiOiBcIlZhbGxlXCIsIFwiZGVcIjogXCJUYWxcIn0sXHJcblx0XCIzXCI6IHtcImlkXCI6IFwiM1wiLCBcImVuXCI6IFwiTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXNcIiwgXCJlc1wiOiBcIlZlZ2FcIiwgXCJkZVwiOiBcIlRpZWZsYW5kXCJ9LFxyXG5cdFwiNFwiOiB7XCJpZFwiOiBcIjRcIiwgXCJlblwiOiBcIkdvbGFudGEgQ2xlYXJpbmdcIiwgXCJmclwiOiBcIkNsYWlyacOocmUgZGUgR29sYW50YVwiLCBcImVzXCI6IFwiQ2xhcm8gR29sYW50YVwiLCBcImRlXCI6IFwiR29sYW50YS1MaWNodHVuZ1wifSxcclxuXHRcIjVcIjoge1wiaWRcIjogXCI1XCIsIFwiZW5cIjogXCJQYW5nbG9zcyBSaXNlXCIsIFwiZnJcIjogXCJNb250w6llIGRlIFBhbmdsb3NzXCIsIFwiZXNcIjogXCJDb2xpbmEgUGFuZ2xvc3NcIiwgXCJkZVwiOiBcIlBhbmdsb3NzLUFuaMO2aGVcIn0sXHJcblx0XCI2XCI6IHtcImlkXCI6IFwiNlwiLCBcImVuXCI6IFwiU3BlbGRhbiBDbGVhcmN1dFwiLCBcImZyXCI6IFwiRm9yw6p0IHJhc8OpZSBkZSBTcGVsZGFuXCIsIFwiZXNcIjogXCJDbGFybyBFc3BlbGRpYVwiLCBcImRlXCI6IFwiU3BlbGRhbiBLYWhsc2NobGFnXCJ9LFxyXG5cdFwiN1wiOiB7XCJpZFwiOiBcIjdcIiwgXCJlblwiOiBcIkRhbmVsb24gUGFzc2FnZVwiLCBcImZyXCI6IFwiUGFzc2FnZSBEYW5lbG9uXCIsIFwiZXNcIjogXCJQYXNhamUgRGFuZWxvblwiLCBcImRlXCI6IFwiRGFuZWxvbi1QYXNzYWdlXCJ9LFxyXG5cdFwiOFwiOiB7XCJpZFwiOiBcIjhcIiwgXCJlblwiOiBcIlVtYmVyZ2xhZGUgV29vZHNcIiwgXCJmclwiOiBcIkJvaXMgZCdPbWJyZWNsYWlyXCIsIFwiZXNcIjogXCJCb3NxdWVzIENsYXJvc29tYnJhXCIsIFwiZGVcIjogXCJVbWJlcmxpY2h0dW5nLUZvcnN0XCJ9LFxyXG5cdFwiOVwiOiB7XCJpZFwiOiBcIjlcIiwgXCJlblwiOiBcIlN0b25lbWlzdCBDYXN0bGVcIiwgXCJmclwiOiBcIkNow6J0ZWF1IEJydW1lcGllcnJlXCIsIFwiZXNcIjogXCJDYXN0aWxsbyBQaWVkcmFuaWVibGFcIiwgXCJkZVwiOiBcIlNjaGxvc3MgU3RlaW5uZWJlbFwifSxcclxuXHRcIjEwXCI6IHtcImlkXCI6IFwiMTBcIiwgXCJlblwiOiBcIlJvZ3VlJ3MgUXVhcnJ5XCIsIFwiZnJcIjogXCJDYXJyacOocmUgZGVzIHZvbGV1cnNcIiwgXCJlc1wiOiBcIkNhbnRlcmEgZGVsIFDDrWNhcm9cIiwgXCJkZVwiOiBcIlNjaHVya2VuYnJ1Y2hcIn0sXHJcblx0XCIxMVwiOiB7XCJpZFwiOiBcIjExXCIsIFwiZW5cIjogXCJBbGRvbidzIExlZGdlXCIsIFwiZnJcIjogXCJDb3JuaWNoZSBkJ0FsZG9uXCIsIFwiZXNcIjogXCJDb3JuaXNhIGRlIEFsZG9uXCIsIFwiZGVcIjogXCJBbGRvbnMgVm9yc3BydW5nXCJ9LFxyXG5cdFwiMTJcIjoge1wiaWRcIjogXCIxMlwiLCBcImVuXCI6IFwiV2lsZGNyZWVrIFJ1blwiLCBcImZyXCI6IFwiUGlzdGUgZHUgUnVpc3NlYXUgc2F1dmFnZVwiLCBcImVzXCI6IFwiUGlzdGEgQXJyb3lvc2FsdmFqZVwiLCBcImRlXCI6IFwiV2lsZGJhY2hzdHJlY2tlXCJ9LFxyXG5cdFwiMTNcIjoge1wiaWRcIjogXCIxM1wiLCBcImVuXCI6IFwiSmVycmlmZXIncyBTbG91Z2hcIiwgXCJmclwiOiBcIkJvdXJiaWVyIGRlIEplcnJpZmVyXCIsIFwiZXNcIjogXCJDZW5hZ2FsIGRlIEplcnJpZmVyXCIsIFwiZGVcIjogXCJKZXJyaWZlcnMgU3VtcGZsb2NoXCJ9LFxyXG5cdFwiMTRcIjoge1wiaWRcIjogXCIxNFwiLCBcImVuXCI6IFwiS2xvdmFuIEd1bGx5XCIsIFwiZnJcIjogXCJQZXRpdCByYXZpbiBkZSBLbG92YW5cIiwgXCJlc1wiOiBcIkJhcnJhbmNvIEtsb3ZhblwiLCBcImRlXCI6IFwiS2xvdmFuLVNlbmtlXCJ9LFxyXG5cdFwiMTVcIjoge1wiaWRcIjogXCIxNVwiLCBcImVuXCI6IFwiTGFuZ29yIEd1bGNoXCIsIFwiZnJcIjogXCJSYXZpbiBkZSBMYW5nb3JcIiwgXCJlc1wiOiBcIkJhcnJhbmNvIExhbmdvclwiLCBcImRlXCI6IFwiTGFuZ29yIC0gU2NobHVjaHRcIn0sXHJcblx0XCIxNlwiOiB7XCJpZFwiOiBcIjE2XCIsIFwiZW5cIjogXCJRdWVudGluIExha2VcIiwgXCJmclwiOiBcIkxhYyBRdWVudGluXCIsIFwiZXNcIjogXCJMYWdvIFF1ZW50aW5cIiwgXCJkZVwiOiBcIlF1ZW50aW5zZWVcIn0sXHJcblx0XCIxN1wiOiB7XCJpZFwiOiBcIjE3XCIsIFwiZW5cIjogXCJNZW5kb24ncyBHYXBcIiwgXCJmclwiOiBcIkZhaWxsZSBkZSBNZW5kb25cIiwgXCJlc1wiOiBcIlphbmphIGRlIE1lbmRvblwiLCBcImRlXCI6IFwiTWVuZG9ucyBTcGFsdFwifSxcclxuXHRcIjE4XCI6IHtcImlkXCI6IFwiMThcIiwgXCJlblwiOiBcIkFuemFsaWFzIFBhc3NcIiwgXCJmclwiOiBcIkNvbCBkJ0FuemFsaWFzXCIsIFwiZXNcIjogXCJQYXNvIEFuemFsaWFzXCIsIFwiZGVcIjogXCJBbnphbGlhcy1QYXNzXCJ9LFxyXG5cdFwiMTlcIjoge1wiaWRcIjogXCIxOVwiLCBcImVuXCI6IFwiT2dyZXdhdGNoIEN1dFwiLCBcImZyXCI6IFwiUGVyY8OpZSBkZSBHYXJkb2dyZVwiLCBcImVzXCI6IFwiVGFqbyBkZSBsYSBHdWFyZGlhIGRlbCBPZ3JvXCIsIFwiZGVcIjogXCJPZ2Vyd2FjaHQtS2FuYWxcIn0sXHJcblx0XCIyMFwiOiB7XCJpZFwiOiBcIjIwXCIsIFwiZW5cIjogXCJWZWxva2EgU2xvcGVcIiwgXCJmclwiOiBcIkZsYW5jIGRlIFZlbG9rYVwiLCBcImVzXCI6IFwiUGVuZGllbnRlIFZlbG9rYVwiLCBcImRlXCI6IFwiVmVsb2thLUhhbmdcIn0sXHJcblx0XCIyMVwiOiB7XCJpZFwiOiBcIjIxXCIsIFwiZW5cIjogXCJEdXJpb3MgR3VsY2hcIiwgXCJmclwiOiBcIlJhdmluIGRlIER1cmlvc1wiLCBcImVzXCI6IFwiQmFycmFuY28gRHVyaW9zXCIsIFwiZGVcIjogXCJEdXJpb3MtU2NobHVjaHRcIn0sXHJcblx0XCIyMlwiOiB7XCJpZFwiOiBcIjIyXCIsIFwiZW5cIjogXCJCcmF2b3N0IEVzY2FycG1lbnRcIiwgXCJmclwiOiBcIkZhbGFpc2UgZGUgQnJhdm9zdFwiLCBcImVzXCI6IFwiRXNjYXJwYWR1cmEgQnJhdm9zdFwiLCBcImRlXCI6IFwiQnJhdm9zdC1BYmhhbmdcIn0sXHJcblx0XCIyM1wiOiB7XCJpZFwiOiBcIjIzXCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjI0XCI6IHtcImlkXCI6IFwiMjRcIiwgXCJlblwiOiBcIkNoYW1waW9uJ3MgRGVtZW5zZVwiLCBcImZyXCI6IFwiRmllZiBkdSBjaGFtcGlvblwiLCBcImVzXCI6IFwiRG9taW5pbyBkZWwgQ2FtcGXDs25cIiwgXCJkZVwiOiBcIkxhbmRndXQgZGVzIENoYW1waW9uc1wifSxcclxuXHRcIjI1XCI6IHtcImlkXCI6IFwiMjVcIiwgXCJlblwiOiBcIlJlZGJyaWFyXCIsIFwiZnJcIjogXCJCcnV5ZXJvdWdlXCIsIFwiZXNcIjogXCJaYXJ6YXJyb2phXCIsIFwiZGVcIjogXCJSb3Rkb3Juc3RyYXVjaFwifSxcclxuXHRcIjI2XCI6IHtcImlkXCI6IFwiMjZcIiwgXCJlblwiOiBcIkdyZWVubGFrZVwiLCBcImZyXCI6IFwiTGFjIFZlcnRcIiwgXCJlc1wiOiBcIkxhZ292ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG5zZWVcIn0sXHJcblx0XCIyN1wiOiB7XCJpZFwiOiBcIjI3XCIsIFwiZW5cIjogXCJBc2NlbnNpb24gQmF5XCIsIFwiZnJcIjogXCJCYWllIGRlIGwnQXNjZW5zaW9uXCIsIFwiZXNcIjogXCJCYWjDrWEgZGUgbGEgQXNjZW5zacOzblwiLCBcImRlXCI6IFwiQnVjaHQgZGVzIEF1ZnN0aWVnc1wifSxcclxuXHRcIjI4XCI6IHtcImlkXCI6IFwiMjhcIiwgXCJlblwiOiBcIkRhd24ncyBFeXJpZVwiLCBcImZyXCI6IFwiUHJvbW9udG9pcmUgZGUgbCdhdWJlXCIsIFwiZXNcIjogXCJBZ3VpbGVyYSBkZWwgQWxiYVwiLCBcImRlXCI6IFwiSG9yc3QgZGVyIE1vcmdlbmRhbW1lcnVuZ1wifSxcclxuXHRcIjI5XCI6IHtcImlkXCI6IFwiMjlcIiwgXCJlblwiOiBcIlRoZSBTcGlyaXRob2xtZVwiLCBcImZyXCI6IFwiTCdhbnRyZSBkZXMgZXNwcml0c1wiLCBcImVzXCI6IFwiTGEgSXNsZXRhIEVzcGlyaXR1YWxcIiwgXCJkZVwiOiBcIkRlciBHZWlzdGVyaG9sbVwifSxcclxuXHRcIjMwXCI6IHtcImlkXCI6IFwiMzBcIiwgXCJlblwiOiBcIldvb2RoYXZlblwiLCBcImZyXCI6IFwiR2VudGVzeWx2ZVwiLCBcImVzXCI6IFwiUmVmdWdpbyBGb3Jlc3RhbFwiLCBcImRlXCI6IFwiV2FsZCAtIEZyZWlzdGF0dFwifSxcclxuXHRcIjMxXCI6IHtcImlkXCI6IFwiMzFcIiwgXCJlblwiOiBcIkFza2FsaW9uIEhpbGxzXCIsIFwiZnJcIjogXCJDb2xsaW5lcyBkJ0Fza2FsaW9uXCIsIFwiZXNcIjogXCJDb2xpbmFzIEFza2FsaW9uXCIsIFwiZGVcIjogXCJBc2thbGlvbiAtIEjDvGdlbFwifSxcclxuXHRcIjMyXCI6IHtcImlkXCI6IFwiMzJcIiwgXCJlblwiOiBcIkV0aGVyb24gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGQnRXRoZXJvblwiLCBcImVzXCI6IFwiQ29saW5hcyBFdGhlcm9uXCIsIFwiZGVcIjogXCJFdGhlcm9uIC0gSMO8Z2VsXCJ9LFxyXG5cdFwiMzNcIjoge1wiaWRcIjogXCIzM1wiLCBcImVuXCI6IFwiRHJlYW1pbmcgQmF5XCIsIFwiZnJcIjogXCJCYWllIGRlcyByw6p2ZXNcIiwgXCJlc1wiOiBcIkJhaMOtYSBPbsOtcmljYVwiLCBcImRlXCI6IFwiVHJhdW1idWNodFwifSxcclxuXHRcIjM0XCI6IHtcImlkXCI6IFwiMzRcIiwgXCJlblwiOiBcIlZpY3RvcidzIExvZGdlXCIsIFwiZnJcIjogXCJQYXZpbGxvbiBkdSB2YWlucXVldXJcIiwgXCJlc1wiOiBcIkFsYmVyZ3VlIGRlbCBWZW5jZWRvclwiLCBcImRlXCI6IFwiU2llZ2VyIC0gSMO8dHRlXCJ9LFxyXG5cdFwiMzVcIjoge1wiaWRcIjogXCIzNVwiLCBcImVuXCI6IFwiR3JlZW5icmlhclwiLCBcImZyXCI6IFwiVmVydGVicmFuY2hlXCIsIFwiZXNcIjogXCJaYXJ6YXZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnN0cmF1Y2hcIn0sXHJcblx0XCIzNlwiOiB7XCJpZFwiOiBcIjM2XCIsIFwiZW5cIjogXCJCbHVlbGFrZVwiLCBcImZyXCI6IFwiTGFjIGJsZXVcIiwgXCJlc1wiOiBcIkxhZ29henVsXCIsIFwiZGVcIjogXCJCbGF1c2VlXCJ9LFxyXG5cdFwiMzdcIjoge1wiaWRcIjogXCIzN1wiLCBcImVuXCI6IFwiR2Fycmlzb25cIiwgXCJmclwiOiBcIkdhcm5pc29uXCIsIFwiZXNcIjogXCJGdWVydGVcIiwgXCJkZVwiOiBcIkZlc3R1bmdcIn0sXHJcblx0XCIzOFwiOiB7XCJpZFwiOiBcIjM4XCIsIFwiZW5cIjogXCJMb25ndmlld1wiLCBcImZyXCI6IFwiTG9uZ3VldnVlXCIsIFwiZXNcIjogXCJWaXN0YWx1ZW5nYVwiLCBcImRlXCI6IFwiV2VpdHNpY2h0XCJ9LFxyXG5cdFwiMzlcIjoge1wiaWRcIjogXCIzOVwiLCBcImVuXCI6IFwiVGhlIEdvZHN3b3JkXCIsIFwiZnJcIjogXCJMJ0Vww6llIGRpdmluZVwiLCBcImVzXCI6IFwiTGEgSG9qYSBEaXZpbmFcIiwgXCJkZVwiOiBcIkRhcyBHb3R0c2Nod2VydFwifSxcclxuXHRcIjQwXCI6IHtcImlkXCI6IFwiNDBcIiwgXCJlblwiOiBcIkNsaWZmc2lkZVwiLCBcImZyXCI6IFwiRmxhbmMgZGUgZmFsYWlzZVwiLCBcImVzXCI6IFwiRGVzcGXDsWFkZXJvXCIsIFwiZGVcIjogXCJGZWxzd2FuZFwifSxcclxuXHRcIjQxXCI6IHtcImlkXCI6IFwiNDFcIiwgXCJlblwiOiBcIlNoYWRhcmFuIEhpbGxzXCIsIFwiZnJcIjogXCJDb2xsaW5lcyBkZSBTaGFkYXJhblwiLCBcImVzXCI6IFwiQ29saW5hcyBTaGFkYXJhblwiLCBcImRlXCI6IFwiU2hhZGFyYW4gSMO8Z2VsXCJ9LFxyXG5cdFwiNDJcIjoge1wiaWRcIjogXCI0MlwiLCBcImVuXCI6IFwiUmVkbGFrZVwiLCBcImZyXCI6IFwiUm91Z2VsYWNcIiwgXCJlc1wiOiBcIkxhZ29ycm9qb1wiLCBcImRlXCI6IFwiUm90c2VlXCJ9LFxyXG5cdFwiNDNcIjoge1wiaWRcIjogXCI0M1wiLCBcImVuXCI6IFwiSGVybydzIExvZGdlXCIsIFwiZnJcIjogXCJQYXZpbGxvbiBkdSBIw6lyb3NcIiwgXCJlc1wiOiBcIkFsYmVyZ3VlIGRlbCBIw6lyb2VcIiwgXCJkZVwiOiBcIkjDvHR0ZSBkZXMgSGVsZGVuXCJ9LFxyXG5cdFwiNDRcIjoge1wiaWRcIjogXCI0NFwiLCBcImVuXCI6IFwiRHJlYWRmYWxsIEJheVwiLCBcImZyXCI6IFwiQmFpZSBkdSBOb2lyIGTDqWNsaW5cIiwgXCJlc1wiOiBcIkJhaMOtYSBTYWx0byBBY2lhZ29cIiwgXCJkZVwiOiBcIlNjaHJlY2tlbnNmYWxsIC0gQnVjaHRcIn0sXHJcblx0XCI0NVwiOiB7XCJpZFwiOiBcIjQ1XCIsIFwiZW5cIjogXCJCbHVlYnJpYXJcIiwgXCJmclwiOiBcIkJydXlhenVyXCIsIFwiZXNcIjogXCJaYXJ6YXp1bFwiLCBcImRlXCI6IFwiQmxhdWRvcm5zdHJhdWNoXCJ9LFxyXG5cdFwiNDZcIjoge1wiaWRcIjogXCI0NlwiLCBcImVuXCI6IFwiR2Fycmlzb25cIiwgXCJmclwiOiBcIkdhcm5pc29uXCIsIFwiZXNcIjogXCJGdWVydGVcIiwgXCJkZVwiOiBcIkZlc3R1bmdcIn0sXHJcblx0XCI0N1wiOiB7XCJpZFwiOiBcIjQ3XCIsIFwiZW5cIjogXCJTdW5ueWhpbGxcIiwgXCJmclwiOiBcIkNvbGxpbmUgZW5zb2xlaWxsw6llXCIsIFwiZXNcIjogXCJDb2xpbmEgU29sZWFkYVwiLCBcImRlXCI6IFwiU29ubmVubGljaHRow7xnZWxcIn0sXHJcblx0XCI0OFwiOiB7XCJpZFwiOiBcIjQ4XCIsIFwiZW5cIjogXCJGYWl0aGxlYXBcIiwgXCJmclwiOiBcIkZlcnZldXJcIiwgXCJlc1wiOiBcIlNhbHRvIGRlIEZlXCIsIFwiZGVcIjogXCJHbGF1YmVuc3NwcnVuZ1wifSxcclxuXHRcIjQ5XCI6IHtcImlkXCI6IFwiNDlcIiwgXCJlblwiOiBcIkJsdWV2YWxlIFJlZnVnZVwiLCBcImZyXCI6IFwiUmVmdWdlIGRlIGJsZXV2YWxcIiwgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVhenVsXCIsIFwiZGVcIjogXCJCbGF1dGFsIC0gWnVmbHVjaHRcIn0sXHJcblx0XCI1MFwiOiB7XCJpZFwiOiBcIjUwXCIsIFwiZW5cIjogXCJCbHVld2F0ZXIgTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZCdFYXUtQXp1clwiLCBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhenVsXCIsIFwiZGVcIjogXCJCbGF1d2Fzc2VyIC0gVGllZmxhbmRcIn0sXHJcblx0XCI1MVwiOiB7XCJpZFwiOiBcIjUxXCIsIFwiZW5cIjogXCJBc3RyYWxob2xtZVwiLCBcImZyXCI6IFwiQXN0cmFsaG9sbWVcIiwgXCJlc1wiOiBcIklzbGV0YSBBc3RyYWxcIiwgXCJkZVwiOiBcIkFzdHJhbGhvbG1cIn0sXHJcblx0XCI1MlwiOiB7XCJpZFwiOiBcIjUyXCIsIFwiZW5cIjogXCJBcmFoJ3MgSG9wZVwiLCBcImZyXCI6IFwiRXNwb2lyIGQnQXJhaFwiLCBcImVzXCI6IFwiRXNwZXJhbnphIGRlIEFyYWhcIiwgXCJkZVwiOiBcIkFyYWhzIEhvZmZudW5nXCJ9LFxyXG5cdFwiNTNcIjoge1wiaWRcIjogXCI1M1wiLCBcImVuXCI6IFwiR3JlZW52YWxlIFJlZnVnZVwiLCBcImZyXCI6IFwiUmVmdWdlIGRlIFZhbHZlcnRcIiwgXCJlc1wiOiBcIlJlZnVnaW8gZGUgVmFsbGV2ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG50YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjU0XCI6IHtcImlkXCI6IFwiNTRcIiwgXCJlblwiOiBcIkZvZ2hhdmVuXCIsIFwiZnJcIjogXCJIYXZyZSBncmlzXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIE5lYmxpbm9zb1wiLCBcImRlXCI6IFwiTmViZWwgLSBGcmVpc3RhdHRcIn0sXHJcblx0XCI1NVwiOiB7XCJpZFwiOiBcIjU1XCIsIFwiZW5cIjogXCJSZWR3YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkZSBSdWJpY29uXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWFycm9qYVwiLCBcImRlXCI6IFwiUm90d2Fzc2VyIC0gVGllZmxhbmRcIn0sXHJcblx0XCI1NlwiOiB7XCJpZFwiOiBcIjU2XCIsIFwiZW5cIjogXCJUaGUgVGl0YW5wYXdcIiwgXCJmclwiOiBcIkJyYXMgZHUgdGl0YW5cIiwgXCJlc1wiOiBcIkxhIEdhcnJhIGRlbCBUaXTDoW5cIiwgXCJkZVwiOiBcIkRpZSBUaXRhbmVucHJhbmtlXCJ9LFxyXG5cdFwiNTdcIjoge1wiaWRcIjogXCI1N1wiLCBcImVuXCI6IFwiQ3JhZ3RvcFwiLCBcImZyXCI6IFwiU29tbWV0IGRlIGwnZXNjYXJwZW1lbnRcIiwgXCJlc1wiOiBcIkN1bWJyZXBlw7Fhc2NvXCIsIFwiZGVcIjogXCJGZWxzZW5zcGl0emVcIn0sXHJcblx0XCI1OFwiOiB7XCJpZFwiOiBcIjU4XCIsIFwiZW5cIjogXCJHb2RzbG9yZVwiLCBcImZyXCI6IFwiRGl2aW5hdGlvblwiLCBcImVzXCI6IFwiU2FiaWR1csOtYSBkZSBsb3MgRGlvc2VzXCIsIFwiZGVcIjogXCJHw7Z0dGVya3VuZGVcIn0sXHJcblx0XCI1OVwiOiB7XCJpZFwiOiBcIjU5XCIsIFwiZW5cIjogXCJSZWR2YWxlIFJlZnVnZVwiLCBcImZyXCI6IFwiUmVmdWdlIGRlIFZhbHJvdWdlXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIFZhbGxlcm9qb1wiLCBcImRlXCI6IFwiUm90dGFsIC0gWnVmbHVjaHRcIn0sXHJcblx0XCI2MFwiOiB7XCJpZFwiOiBcIjYwXCIsIFwiZW5cIjogXCJTdGFyZ3JvdmVcIiwgXCJmclwiOiBcIkJvc3F1ZXQgc3RlbGxhaXJlXCIsIFwiZXNcIjogXCJBcmJvbGVkYSBkZSBsYXMgRXN0cmVsbGFzXCIsIFwiZGVcIjogXCJTdGVybmVuaGFpblwifSxcclxuXHRcIjYxXCI6IHtcImlkXCI6IFwiNjFcIiwgXCJlblwiOiBcIkdyZWVud2F0ZXIgTG93bGFuZHNcIiwgXCJmclwiOiBcIkJhc3NlcyB0ZXJyZXMgZCdFYXUtVmVyZG95YW50ZVwiLCBcImVzXCI6IFwiVGllcnJhcyBCYWphcyBkZSBBZ3VhdmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xud2Fzc2VyIC0gVGllZmxhbmRcIn0sXHJcblx0XCI2MlwiOiB7XCJpZFwiOiBcIjYyXCIsIFwiZW5cIjogXCJUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzXCIsIFwiZnJcIjogXCJUZW1wbGUgZGVzIHByacOocmVzIHBlcmR1ZXNcIiwgXCJlc1wiOiBcIlRlbXBsbyBkZSBsYXMgUGVsZ2FyaWFzXCIsIFwiZGVcIjogXCJUZW1wZWwgZGVyIFZlcmxvcmVuZW4gR2ViZXRlXCJ9LFxyXG5cdFwiNjNcIjoge1wiaWRcIjogXCI2M1wiLCBcImVuXCI6IFwiQmF0dGxlJ3MgSG9sbG93XCIsIFwiZnJcIjogXCJWYWxsb24gZGUgYmF0YWlsbGVcIiwgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZSBsYSBCYXR0YWxsYVwiLCBcImRlXCI6IFwiU2NobGFjaHRlbi1TZW5rZVwifSxcclxuXHRcIjY0XCI6IHtcImlkXCI6IFwiNjRcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI2NVwiOiB7XCJpZFwiOiBcIjY1XCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjY2XCI6IHtcImlkXCI6IFwiNjZcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI2N1wiOiB7XCJpZFwiOiBcIjY3XCIsIFwiZW5cIjogXCJDYXJ2ZXIncyBBc2NlbnRcIiwgXCJmclwiOiBcIkPDtHRlIGR1IGNvdXRlYXVcIiwgXCJlc1wiOiBcIkFzY2Vuc28gZGVsIFRyaW5jaGFkb3JcIiwgXCJkZVwiOiBcIkF1ZnN0aWVnIGRlcyBTY2huaXR6ZXJzXCJ9LFxyXG5cdFwiNjhcIjoge1wiaWRcIjogXCI2OFwiLCBcImVuXCI6IFwiT3JjaGFyZCBPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmUgZHUgVmVyZ2VyXCIsIFwiZXNcIjogXCJNaXJhZG9yIGRlbCBIdWVydG9cIiwgXCJkZVwiOiBcIk9ic3RnYXJ0ZW4gQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCI2OVwiOiB7XCJpZFwiOiBcIjY5XCIsIFwiZW5cIjogXCJCYXVlcidzIEVzdGF0ZVwiLCBcImZyXCI6IFwiRG9tYWluZSBkZSBCYXVlclwiLCBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmF1ZXJcIiwgXCJkZVwiOiBcIkJhdWVycyBBbndlc2VuXCJ9LFxyXG5cdFwiNzBcIjoge1wiaWRcIjogXCI3MFwiLCBcImVuXCI6IFwiQmF0dGxlJ3MgSG9sbG93XCIsIFwiZnJcIjogXCJWYWxsb24gZGUgYmF0YWlsbGVcIiwgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZSBsYSBCYXR0YWxsYVwiLCBcImRlXCI6IFwiU2NobGFjaHRlbi1TZW5rZVwifSxcclxuXHRcIjcxXCI6IHtcImlkXCI6IFwiNzFcIiwgXCJlblwiOiBcIlRlbXBsZSBvZiBMb3N0IFByYXllcnNcIiwgXCJmclwiOiBcIlRlbXBsZSBkZXMgcHJpw6hyZXMgcGVyZHVlc1wiLCBcImVzXCI6IFwiVGVtcGxvIGRlIGxhcyBQZWxnYXJpYXNcIiwgXCJkZVwiOiBcIlRlbXBlbCBkZXIgVmVybG9yZW5lbiBHZWJldGVcIn0sXHJcblx0XCI3MlwiOiB7XCJpZFwiOiBcIjcyXCIsIFwiZW5cIjogXCJDYXJ2ZXIncyBBc2NlbnRcIiwgXCJmclwiOiBcIkPDtHRlIGR1IGNvdXRlYXVcIiwgXCJlc1wiOiBcIkFzY2Vuc28gZGVsIFRyaW5jaGFkb3JcIiwgXCJkZVwiOiBcIkF1ZnN0aWVnIGRlcyBTY2huaXR6ZXJzXCJ9LFxyXG5cdFwiNzNcIjoge1wiaWRcIjogXCI3M1wiLCBcImVuXCI6IFwiT3JjaGFyZCBPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmUgZHUgVmVyZ2VyXCIsIFwiZXNcIjogXCJNaXJhZG9yIGRlbCBIdWVydG9cIiwgXCJkZVwiOiBcIk9ic3RnYXJ0ZW4gQXVzc2ljaHRzcHVua3RcIn0sXHJcblx0XCI3NFwiOiB7XCJpZFwiOiBcIjc0XCIsIFwiZW5cIjogXCJCYXVlcidzIEVzdGF0ZVwiLCBcImZyXCI6IFwiRG9tYWluZSBkZSBCYXVlclwiLCBcImVzXCI6IFwiSGFjaWVuZGEgZGUgQmF1ZXJcIiwgXCJkZVwiOiBcIkJhdWVycyBBbndlc2VuXCJ9LFxyXG5cdFwiNzVcIjoge1wiaWRcIjogXCI3NVwiLCBcImVuXCI6IFwiQmF0dGxlJ3MgSG9sbG93XCIsIFwiZnJcIjogXCJWYWxsb24gZGUgYmF0YWlsbGVcIiwgXCJlc1wiOiBcIkhvbmRvbmFkYSBkZSBsYSBCYXR0YWxsYVwiLCBcImRlXCI6IFwiU2NobGFjaHRlbi1TZW5rZVwifSxcclxuXHRcIjc2XCI6IHtcImlkXCI6IFwiNzZcIiwgXCJlblwiOiBcIlRlbXBsZSBvZiBMb3N0IFByYXllcnNcIiwgXCJmclwiOiBcIlRlbXBsZSBkZXMgcHJpw6hyZXMgcGVyZHVlc1wiLCBcImVzXCI6IFwiVGVtcGxvIGRlIGxhcyBQZWxnYXJpYXNcIiwgXCJkZVwiOiBcIlRlbXBlbCBkZXIgVmVybG9yZW5lbiBHZWJldGVcIn0sXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdHtcclxuXHRcdFwia2V5XCI6IFwiQ2VudGVyXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDMsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIkNhc3RsZVwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbOV0sIFx0XHRcdFx0XHRcdFx0XHQvLyBzbVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlJlZCBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcInJlZFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMSwgMTcsIDIwLCAxOCwgMTksIDYsIDVdLFx0XHQvLyBvdmVybG9vaywgbWVuZG9ucywgdmVsb2thLCBhbnosIG9ncmUsIHNwZWxkYW4sIHBhbmdcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJCbHVlIENvcm5lclwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMiwgMTUsIDIyLCAxNiwgMjEsIDcsIDhdXHRcdFx0Ly8gdmFsbGV5LCBsYW5nb3IsIGJyYXZvc3QsIHF1ZW50aW4sIGR1cmlvcywgZGFuZSwgdW1iZXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJHcmVlbiBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImdyZWVuXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszLCAxMSwgMTMsIDEyLCAxNCwgMTAsIDRdIFx0XHQvLyBsb3dsYW5kcywgYWxkb25zLCBqZXJyaWZlciwgd2lsZGNyZWVrLCBrbG92YW4sIHJvZ3VlcywgZ29sYW50YVxyXG5cdFx0XHR9LF0sXHJcblx0fSwge1xyXG5cdFx0XCJrZXlcIjogXCJSZWRIb21lXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDAsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM3LCAzMywgMzJdIFx0XHRcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIGxvbmd2aWV3LCBjbGlmZnNpZGUsIGdvZHN3b3JkLCBob3BlcywgYXN0cmFsXHJcblx0XHRcdH0sIHtcdFxyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJOb3J0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwicmVkXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszOCwgNDAsIDM5LCA1MiwgNTFdIFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgbG9uZ3ZpZXcsIGNsaWZmc2lkZSwgZ29kc3dvcmQsIGhvcGVzLCBhc3RyYWxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJTb3V0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzUsIDM2LCAzNCwgNTMsIDUwXSBcdFx0XHRcdC8vIGJyaWFyLCBsYWtlLCBsb2RnZSwgdmFsZSwgd2F0ZXJcclxuXHRcdFx0Ly8gfSwge1xyXG5cdFx0XHQvLyBcdFwibGFiZWxcIjogXCJSdWluc1wiLFxyXG5cdFx0XHQvLyBcdFwiZ3JvdXBUeXBlXCI6IFwicnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcIm9iamVjdGl2ZXNcIjogWzYyLCA2MywgNjQsIDY1LCA2Nl0gXHRcdFx0XHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiQmx1ZUhvbWVcIixcclxuXHRcdFwibWFwSW5kZXhcIjogMixcclxuXHRcdFwic2VjdGlvbnNcIjogW3tcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiS2VlcHNcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzIzLCAyNywgMzFdIFx0XHRcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHdvb2RoYXZlbiwgZGF3bnMsIHNwaXJpdCwgZ29kcywgc3RhclxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIk5vcnRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJibHVlXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszMCwgMjgsIDI5LCA1OCwgNjBdIFx0XHRcdFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgd29vZGhhdmVuLCBkYXducywgc3Bpcml0LCBnb2RzLCBzdGFyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzI1LCAyNiwgMjQsIDU5LCA2MV0gXHRcdFx0XHQvLyBicmlhciwgbGFrZSwgY2hhbXAsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs3MSwgNzAsIDY5LCA2OCwgNjddIFx0XHRcdFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXSxcclxuXHR9LCB7XHJcblx0XHRcImtleVwiOiBcIkdyZWVuSG9tZVwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAxLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJLZWVwc1wiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiZ3JlZW5cIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzQ2LCA0NCwgNDFdIFx0XHRcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHN1bm55LCBjcmFnLCB0aXRhbiwgZmFpdGgsIGZvZ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIk5vcnRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbNDcsIDU3LCA1NiwgNDgsIDU0XSBcdFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHN1bm55LCBjcmFnLCB0aXRhbiwgZmFpdGgsIGZvZ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlNvdXRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs0NSwgNDIsIDQzLCA0OSwgNTVdIFx0XHRcdFx0Ly8gYnJpYXIsIGxha2UsIGxvZGdlLCB2YWxlLCB3YXRlclxyXG5cdFx0XHQvLyB9LCB7XHJcblx0XHRcdC8vIFx0XCJsYWJlbFwiOiBcIlJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJncm91cFR5cGVcIjogXCJydWluc1wiLFxyXG5cdFx0XHQvLyBcdFwib2JqZWN0aXZlc1wiOiBbNzYgLCA3NSAsIDc0ICwgNzMgLCA3MiBdIFx0XHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdXHJcblx0fSxcclxuXTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Ly9cdEVCR1xyXG5cdFwiOVwiOlx0e1widHlwZVwiOiAxLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAwLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTdG9uZW1pc3QgQ2FzdGxlXHJcblxyXG5cdC8vXHRSZWQgQ29ybmVyXHJcblx0XCIxXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFJlZCBLZWVwIC0gT3Zlcmxvb2tcclxuXHRcIjE3XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFJlZCBUb3dlciAtIE1lbmRvbidzIEdhcFxyXG5cdFwiMjBcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gUmVkIFRvd2VyIC0gVmVsb2thIFNsb3BlXHJcblx0XCIxOFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBSZWQgVG93ZXIgLSBBbnphbGlhcyBQYXNzXHJcblx0XCIxOVwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBSZWQgVG93ZXIgLSBPZ3Jld2F0Y2ggQ3V0XHJcblx0XCI2XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFJlZCBDYW1wIC0gTWlsbCAtIFNwZWxkYW5cclxuXHRcIjVcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gUmVkIENhbXAgLSBNaW5lIC0gUGFuZ2xvc3NcclxuXHJcblx0Ly9cdEJsdWUgQ29ybmVyXHJcblx0XCIyXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgS2VlcCAtIFZhbGxleVxyXG5cdFwiMTVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmx1ZSBUb3dlciAtIExhbmdvciBHdWxjaFxyXG5cdFwiMjJcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBUb3dlciAtIEJyYXZvc3QgRXNjYXJwbWVudFxyXG5cdFwiMTZcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmx1ZSBUb3dlciAtIFF1ZW50aW4gTGFrZVxyXG5cdFwiMjFcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBUb3dlciAtIER1cmlvcyBHdWxjaFxyXG5cdFwiN1wiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBCbHVlIENhbXAgLSBNaW5lIC0gRGFuZWxvblxyXG5cdFwiOFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBCbHVlIENhbXAgLSBNaWxsIC0gVW1iZXJnbGFkZVxyXG5cclxuXHQvL1x0R3JlZW4gQ29ybmVyXHJcblx0XCIzXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIEtlZXAgLSBMb3dsYW5kc1xyXG5cdFwiMTFcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gVG93ZXIgLSBBbGRvbnNcclxuXHRcIjEzXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEdyZWVuIFRvd2VyIC0gSmVycmlmZXIncyBTbG91Z2hcclxuXHRcIjEyXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEdyZWVuIFRvd2VyIC0gV2lsZGNyZWVrXHJcblx0XCIxNFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDMsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBHcmVlbiBUb3dlciAtIEtsb3ZhbiBHdWxseVxyXG5cdFwiMTBcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAzLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gQ2FtcCAtIE1pbmUgLSBSb2d1ZXMgUXVhcnJ5XHJcblx0XCI0XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMywgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEdyZWVuIENhbXAgLSBNaWxsIC0gR29sYW50YVxyXG5cclxuXHJcblx0Ly9cdFJlZEhvbWVcclxuXHRcIjM3XCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdhcnJpc29uXHJcblx0XCIzM1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCYXkgLSBEcmVhbWluZyBCYXlcclxuXHRcIjMyXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gRXRoZXJvbiBIaWxsc1xyXG5cdFwiMzhcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgVG93ZXIgLSBMb25ndmlld1xyXG5cdFwiNDBcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgVG93ZXIgLSBDbGlmZnNpZGVcclxuXHRcIjM5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMCwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIE5vcnRoIENhbXAgLSBDcm9zc3JvYWRzIC0gVGhlIEdvZHN3b3JkXHJcblx0XCI1MlwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBDYW1wIC0gTWluZSAtIEFyYWgncyBIb3BlXHJcblx0XCI1MVwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBDYW1wIC0gTWlsbCAtIEFzdHJhbGhvbG1lXHJcblxyXG5cdFwiMzVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAwLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBHcmVlbmJyaWFyXHJcblx0XCIzNlwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBUb3dlciAtIEJsdWVsYWtlXHJcblx0XCIzNFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTb3V0aCBDYW1wIC0gT3JjaGFyZCAtIFZpY3RvcidzIExvZGdlXHJcblx0XCI1M1wiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBHcmVlbnZhbGUgUmVmdWdlXHJcblx0XCI1MFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDAsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBDYW1wIC0gRmlzaGluZyBWaWxsYWdlIC0gQmx1ZXdhdGVyIExvd2xhbmRzXHJcblxyXG5cclxuXHQvL1x0R3JlZW5Ib21lXHJcblx0XCI0NlwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHYXJyaXNvblxyXG5cdFwiNDRcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmF5IC0gRHJlYWRmYWxsIEJheVxyXG5cdFwiNDFcIjpcdHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gSGlsbHMgLSBTaGFkYXJhbiBIaWxsc1xyXG5cdFwiNDdcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgVG93ZXIgLSBTdW5ueWhpbGxcclxuXHRcIjU3XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIFRvd2VyIC0gQ3JhZ3RvcFxyXG5cdFwiNTZcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgVGl0YW5wYXdcclxuXHRcIjQ4XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gRmFpdGhsZWFwXHJcblx0XCI1NFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBDYW1wIC0gTWlsbCAtIEZvZ2hhdmVuXHJcblxyXG5cdFwiNDVcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBCbHVlYnJpYXJcclxuXHRcIjQyXCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIFRvd2VyIC0gUmVkbGFrZVxyXG5cdFwiNDNcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU291dGggQ2FtcCAtIE9yY2hhcmQgLSBIZXJvJ3MgTG9kZ2VcclxuXHRcIjQ5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIENhbXAgLSBXb3Jrc2hvcCAtIEJsdWV2YWxlIFJlZnVnZVxyXG5cdFwiNTVcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gU0UgQ2FtcCAtIEZpc2hpbmcgVmlsbGFnZSAtIFJlZHdhdGVyIExvd2xhbmRzXHJcblxyXG5cclxuXHQvL1x0Qmx1ZUhvbWVcclxuXHRcIjIzXCI6XHR7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIEdhcnJpc29uXHJcblx0XCIyN1wiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCYXkgLSBBc2NlbnNpb24gQmF5XHJcblx0XCIzMVwiOlx0e1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBIaWxscyAtIEFza2FsaW9uIEhpbGxzXHJcblx0XCIzMFwiOlx0e1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIFdvb2RoYXZlblxyXG5cdFwiMjhcIjpcdHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgVG93ZXIgLSBEYXduJ3MgRXlyaWVcclxuXHRcIjI5XCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIE5vcnRoIENhbXAgLSBDcm9zc3JvYWRzIC0gVGhlIFNwaXJpdGhvbG1lXHJcblx0XCI1OFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBDYW1wIC0gTWluZSAtIEdvZHNsb3JlXHJcblx0XCI2MFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBDYW1wIC0gTWlsbCAtIFN0YXJncm92ZVxyXG5cclxuXHRcIjI1XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIFNXIFRvd2VyIC0gUmVkYnJpYXJcclxuXHRcIjI2XCI6XHR7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIFRvd2VyIC0gR3JlZW5sYWtlXHJcblx0XCIyNFwiOlx0e1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwibWFwXCI6IDIsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTb3V0aCBDYW1wIC0gT3JjaGFyZCAtIENoYW1waW9uJ3MgRGVtZW5zZVxyXG5cdFwiNTlcIjpcdHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcIm1hcFwiOiAyLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgQ2FtcCAtIFdvcmtzaG9wIC0gUmVkdmFsZSBSZWZ1Z2VcclxuXHRcIjYxXCI6XHR7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJtYXBcIjogMiwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBHcmVlbndhdGVyIExvd2xhbmRzXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwiMVwiOiB7XCJpZFwiOiAxLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiAyLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiM1wiOiB7XCJpZFwiOiAzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNFwiOiB7XCJpZFwiOiA0LCBcIm5hbWVcIjogXCJHcmVlbiBNaWxsXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiA1LCBcIm5hbWVcIjogXCJSZWQgTWluZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogNiwgXCJuYW1lXCI6IFwiUmVkIE1pbGxcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IDcsIFwibmFtZVwiOiBcIkJsdWUgTWluZVwifSxcclxuXHRcIjhcIjoge1wiaWRcIjogOCwgXCJuYW1lXCI6IFwiQmx1ZSBNaWxsXCJ9LFxyXG5cdFwiOVwiOiB7XCJpZFwiOiA5LCBcIm5hbWVcIjogXCJDYXN0bGVcIn0sXHJcblx0XCIxMFwiOiB7XCJpZFwiOiAxMCwgXCJuYW1lXCI6IFwiR3JlZW4gTWluZVwifSxcclxuXHRcIjExXCI6IHtcImlkXCI6IDExLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjEyXCI6IHtcImlkXCI6IDEyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjEzXCI6IHtcImlkXCI6IDEzLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE0XCI6IHtcImlkXCI6IDE0LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE1XCI6IHtcImlkXCI6IDE1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE2XCI6IHtcImlkXCI6IDE2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE3XCI6IHtcImlkXCI6IDE3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE4XCI6IHtcImlkXCI6IDE4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE5XCI6IHtcImlkXCI6IDE5LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIwXCI6IHtcImlkXCI6IDIwLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIxXCI6IHtcImlkXCI6IDIxLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIyXCI6IHtcImlkXCI6IDIyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIzXCI6IHtcImlkXCI6IDIzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMjVcIjoge1wiaWRcIjogMjUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjRcIjoge1wiaWRcIjogMjQsIFwibmFtZVwiOiBcIk9yY2hhcmRcIn0sXHJcblx0XCIyNlwiOiB7XCJpZFwiOiAyNiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyN1wiOiB7XCJpZFwiOiAyNywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjI4XCI6IHtcImlkXCI6IDI4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjI5XCI6IHtcImlkXCI6IDI5LCBcIm5hbWVcIjogXCJDcm9zc3JvYWRzXCJ9LFxyXG5cdFwiMzBcIjoge1wiaWRcIjogMzAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzFcIjoge1wiaWRcIjogMzEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzMlwiOiB7XCJpZFwiOiAzMiwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjMzXCI6IHtcImlkXCI6IDMzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzRcIjoge1wiaWRcIjogMzQsIFwibmFtZVwiOiBcIk9yY2hhcmRcIn0sXHJcblx0XCIzNVwiOiB7XCJpZFwiOiAzNSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzNlwiOiB7XCJpZFwiOiAzNiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzN1wiOiB7XCJpZFwiOiAzNywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjM4XCI6IHtcImlkXCI6IDM4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM5XCI6IHtcImlkXCI6IDM5LCBcIm5hbWVcIjogXCJDcm9zc3JvYWRzXCJ9LFxyXG5cdFwiNDBcIjoge1wiaWRcIjogNDAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDFcIjoge1wiaWRcIjogNDEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0MlwiOiB7XCJpZFwiOiA0MiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0M1wiOiB7XCJpZFwiOiA0MywgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjQ0XCI6IHtcImlkXCI6IDQ0LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNDVcIjoge1wiaWRcIjogNDUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDZcIjoge1wiaWRcIjogNDYsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0N1wiOiB7XCJpZFwiOiA0NywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0OFwiOiB7XCJpZFwiOiA0OCwgXCJuYW1lXCI6IFwiUXVhcnJ5XCJ9LFxyXG5cdFwiNDlcIjoge1wiaWRcIjogNDksIFwibmFtZVwiOiBcIldvcmtzaG9wXCJ9LFxyXG5cdFwiNTBcIjoge1wiaWRcIjogNTAsIFwibmFtZVwiOiBcIkZpc2hpbmcgVmlsbGFnZVwifSxcclxuXHRcIjUxXCI6IHtcImlkXCI6IDUxLCBcIm5hbWVcIjogXCJMdW1iZXIgTWlsbFwifSxcclxuXHRcIjUyXCI6IHtcImlkXCI6IDUyLCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI1M1wiOiB7XCJpZFwiOiA1MywgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI1NFwiOiB7XCJpZFwiOiA1NCwgXCJuYW1lXCI6IFwiTHVtYmVyIE1pbGxcIn0sXHJcblx0XCI1NVwiOiB7XCJpZFwiOiA1NSwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNTZcIjoge1wiaWRcIjogNTYsIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCI1N1wiOiB7XCJpZFwiOiA1NywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI1OFwiOiB7XCJpZFwiOiA1OCwgXCJuYW1lXCI6IFwiUXVhcnJ5XCJ9LFxyXG5cdFwiNTlcIjoge1wiaWRcIjogNTksIFwibmFtZVwiOiBcIldvcmtzaG9wXCJ9LFxyXG5cdFwiNjBcIjoge1wiaWRcIjogNjAsIFwibmFtZVwiOiBcIkx1bWJlciBNaWxsXCJ9LFxyXG5cdFwiNjFcIjoge1wiaWRcIjogNjEsIFwibmFtZVwiOiBcIkZpc2hpbmcgVmlsbGFnZVwifSxcclxuXHRcIjYyXCI6IHtcImlkXCI6IDYyLCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifSxcclxuXHRcIjYzXCI6IHtcImlkXCI6IDYzLCBcIm5hbWVcIjogXCIoKEJhdHRsZSdzIEhvbGxvdykpXCJ9LFxyXG5cdFwiNjRcIjoge1wiaWRcIjogNjQsIFwibmFtZVwiOiBcIigoQmF1ZXIncyBFc3RhdGUpKVwifSxcclxuXHRcIjY1XCI6IHtcImlkXCI6IDY1LCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjY2XCI6IHtcImlkXCI6IDY2LCBcIm5hbWVcIjogXCIoKENhcnZlcidzIEFzY2VudCkpXCJ9LFxyXG5cdFwiNjdcIjoge1wiaWRcIjogNjcsIFwibmFtZVwiOiBcIigoQ2FydmVyJ3MgQXNjZW50KSlcIn0sXHJcblx0XCI2OFwiOiB7XCJpZFwiOiA2OCwgXCJuYW1lXCI6IFwiKChPcmNoYXJkIE92ZXJsb29rKSlcIn0sXHJcblx0XCI2OVwiOiB7XCJpZFwiOiA2OSwgXCJuYW1lXCI6IFwiKChCYXVlcidzIEVzdGF0ZSkpXCJ9LFxyXG5cdFwiNzBcIjoge1wiaWRcIjogNzAsIFwibmFtZVwiOiBcIigoQmF0dGxlJ3MgSG9sbG93KSlcIn0sXHJcblx0XCI3MVwiOiB7XCJpZFwiOiA3MSwgXCJuYW1lXCI6IFwiKChUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzKSlcIn0sXHJcblx0XCI3MlwiOiB7XCJpZFwiOiA3MiwgXCJuYW1lXCI6IFwiKChDYXJ2ZXIncyBBc2NlbnQpKVwifSxcclxuXHRcIjczXCI6IHtcImlkXCI6IDczLCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjc0XCI6IHtcImlkXCI6IDc0LCBcIm5hbWVcIjogXCIoKEJhdWVyJ3MgRXN0YXRlKSlcIn0sXHJcblx0XCI3NVwiOiB7XCJpZFwiOiA3NSwgXCJuYW1lXCI6IFwiKChCYXR0bGUncyBIb2xsb3cpKVwifSxcclxuXHRcIjc2XCI6IHtcImlkXCI6IDc2LCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjFcIjoge1wiaWRcIjogMSwgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDM1LCBcIm5hbWVcIjogXCJjYXN0bGVcIn0sXHJcblx0XCIyXCI6IHtcImlkXCI6IDIsIFwidGltZXJcIjogMSwgXCJ2YWx1ZVwiOiAyNSwgXCJuYW1lXCI6IFwia2VlcFwifSxcclxuXHRcIjNcIjoge1wiaWRcIjogMywgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDEwLCBcIm5hbWVcIjogXCJ0b3dlclwifSxcclxuXHRcIjRcIjoge1wiaWRcIjogNCwgXCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDUsIFwibmFtZVwiOiBcImNhbXBcIn0sXHJcblx0XCI1XCI6IHtcImlkXCI6IDUsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJ0ZW1wbGVcIn0sXHJcblx0XCI2XCI6IHtcImlkXCI6IDYsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJob2xsb3dcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IDcsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJlc3RhdGVcIn0sXHJcblx0XCI4XCI6IHtcImlkXCI6IDgsIFwidGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJvdmVybG9va1wifSxcclxuXHRcIjlcIjoge1wiaWRcIjogOSwgXCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImFzY2VudFwifVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIjEwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFtYm9zc2ZlbHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW1ib3NzZmVsc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFudmlsIFJvY2tcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW52aWwtcm9ja1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIFl1bnF1ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC15dW5xdWVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZXIgZGUgbCdlbmNsdW1lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlci1kZS1sZW5jbHVtZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcy1QYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9ybGlzIFBhc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9ybGlzLXBhc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNvIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNvLWRlLWJvcmxpc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBhc3NhZ2UgZGUgQm9ybGlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBhc3NhZ2UtZGUtYm9ybGlzXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFrYmllZ3VuZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWtiaWVndW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiWWFrJ3MgQmVuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ5YWtzLWJlbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZWNsaXZlIGRlbCBZYWtcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVjbGl2ZS1kZWwteWFrXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ291cmJlIGR1IFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3VyYmUtZHUteWFrXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVucmF2aXMgRXJkd2Vya1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZW5yYXZpcy1lcmR3ZXJrXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVuZ2Ugb2YgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZW5nZS1vZi1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8OtcmN1bG8gZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaXJjdWxvLWRlLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9tbGVjaCBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb21sZWNoLWRlLWRlbnJhdmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYWd1dW1hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hZ3V1bWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJIb2Nob2ZlbiBkZXIgQmV0csO8Ym5pc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJob2Nob2Zlbi1kZXItYmV0cnVibmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU29ycm93J3MgRnVybmFjZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzb3Jyb3dzLWZ1cm5hY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGcmFndWEgZGVsIFBlc2FyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZyYWd1YS1kZWwtcGVzYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3VybmFpc2UgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3VybmFpc2UtZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRvciBkZXMgSXJyc2lubnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidG9yLWRlcy1pcnJzaW5uc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhdGUgb2YgTWFkbmVzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYXRlLW9mLW1hZG5lc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGEgZGUgbGEgTG9jdXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YS1kZS1sYS1sb2N1cmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZSBkZSBsYSBmb2xpZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZS1kZS1sYS1mb2xpZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDhcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUtU3RlaW5icnVjaFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXN0ZWluYnJ1Y2hcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFF1YXJyeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlLXF1YXJyeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbnRlcmEgZGUgSmFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYW50ZXJhLWRlLWphZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYXJyacOocmUgZGUgamFkZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYXJyaWVyZS1kZS1qYWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBFc3BlbndhbGRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1lc3BlbndhbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBBc3Blbndvb2RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWFzcGVud29vZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgVHJlbWJsZWZvcsOqdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXRyZW1ibGVmb3JldFwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTBcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTBcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5LUJ1Y2h0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJ1Y2h0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnkgQmF5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJheVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1laG1yeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZCdFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlaG1yeVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlN0dXJta2xpcHBlbi1JbnNlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzdHVybWtsaXBwZW4taW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdG9ybWJsdWZmIElzbGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3Rvcm1ibHVmZi1pc2xlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBDaW1hdG9ybWVudGFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1jaW1hdG9ybWVudGFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbGUgZGUgbGEgRmFsYWlzZSB0dW11bHR1ZXVzZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbGUtZGUtbGEtZmFsYWlzZS10dW11bHR1ZXVzZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpbnN0ZXJmcmVpc3RhdHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmluc3RlcmZyZWlzdGF0dFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRhcmtoYXZlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkYXJraGF2ZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZWZ1Z2lvIE9zY3Vyb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyZWZ1Z2lvLW9zY3Vyb1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnZSBub2lyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnZS1ub2lyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxM1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVpbGlnZSBIYWxsZSB2b24gUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZWlsaWdlLWhhbGxlLXZvbi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1bSBvZiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dW0tb2YtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhZ3JhcmlvIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FncmFyaW8tZGUtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dWFpcmUgZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVhaXJlLWRlLXJhbGxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLcmlzdGFsbHfDvHN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrcmlzdGFsbHd1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3J5c3RhbCBEZXNlcnRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3J5c3RhbC1kZXNlcnRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNpZXJ0byBkZSBDcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2llcnRvLWRlLWNyaXN0YWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEw6lzZXJ0IGRlIGNyaXN0YWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzZXJ0LWRlLWNyaXN0YWxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYW50aGlyLUluc2VsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphbnRoaXItaW5zZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xlIG9mIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsZS1vZi1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSXNsYSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtZGUtamFudGhpclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklsZSBkZSBKYW50aGlyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlsZS1kZS1qYW50aGlyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNlwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVlciBkZXMgTGVpZHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVlci1kZXMtbGVpZHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWEgb2YgU29ycm93c1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWEtb2Ytc29ycm93c1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsIE1hciBkZSBsb3MgUGVzYXJlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbC1tYXItZGUtbG9zLXBlc2FyZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTdcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJlZmxlY2t0ZSBLw7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmVmbGVja3RlLWt1c3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGFybmlzaGVkIENvYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInRhcm5pc2hlZC1jb2FzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNvc3RhIGRlIEJyb25jZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjb3N0YS1kZS1icm9uY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDw7R0ZSB0ZXJuaWVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY290ZS10ZXJuaWVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOw7ZyZGxpY2hlIFppdHRlcmdpcGZlbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3JkbGljaGUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9ydGhlcm4gU2hpdmVycGVha3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9ydGhlcm4tc2hpdmVycGVha3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWNvc2VzY2Fsb2ZyaWFudGVzIGRlbCBOb3J0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwaWNvc2VzY2Fsb2ZyaWFudGVzLWRlbC1ub3J0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNpbWVmcm9pZGVzIG5vcmRpcXVlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaW1lZnJvaWRlcy1ub3JkaXF1ZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE5XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE5XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6dG9yXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnp0b3JcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja2dhdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2tnYXRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhbmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZW5vaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlbm9pcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIwXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJndXNvbnMgS3JldXp1bmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWtyZXV6dW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb24ncyBDcm9zc2luZ1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmZXJndXNvbnMtY3Jvc3NpbmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFbmNydWNpamFkYSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbmNydWNpamFkYS1kZS1mZXJndXNvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyb2lzw6llIGRlIEZlcmd1c29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb2lzZWUtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIxXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFjaGVuYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhY2hlbmJyYW5kXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJhZ29uYnJhbmRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJhZ29uYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXJjYSBkZWwgRHJhZ8OzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXJjYS1kZWwtZHJhZ29uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3RpZ21hdGUgZHUgZHJhZ29uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0aWdtYXRlLWR1LWRyYWdvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRldm9uYXMgUmFzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJhc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmEncyBSZXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldm9uYXMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlc2NhbnNvIGRlIERldm9uYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNjYW5zby1kZS1kZXZvbmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSZXBvcyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZGUtZGV2b25hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyNFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uLVRlcnJhc3NlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYXNzZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVyZWRvbiBUZXJyYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVyZWRvbi10ZXJyYWNlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVGVycmF6YSBkZSBFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidGVycmF6YS1kZS1lcmVkb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF0ZWF1IGQnRXJlZG9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXRlYXUtZGVyZWRvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktsYWdlbnJpc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2xhZ2Vucmlzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgb2YgV29lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtb2Ytd29lXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzdXJhIGRlIGxhIEFmbGljY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzdXJhLWRlLWxhLWFmbGljY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgZHUgbWFsaGV1clwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLWR1LW1hbGhldXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCLDlmRuaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib2RuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNvbGFjacOzblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGFjaW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc29sYXRpb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhdGlvblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhbmRhcmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZ2FuZGFyYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnpmbHV0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnpmbHV0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2t0aWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrdGlkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmVhIE5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmVhLW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9pcmZsb3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9pcmZsb3RcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA1XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXVlcnJpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmV1ZXJyaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmluZyBvZiBGaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpbmctb2YtZmlyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFuaWxsbyBkZSBGdWVnb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhbmlsbG8tZGUtZnVlZ29cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDZXJjbGUgZGUgZmV1XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNlcmNsZS1kZS1mZXVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbnRlcndlbHRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidW50ZXJ3ZWx0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVW5kZXJ3b3JsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bmRlcndvcmxkXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSW5mcmFtdW5kb1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpbmZyYW11bmRvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiT3V0cmUtbW9uZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwib3V0cmUtbW9uZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA3XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA3XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJuZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVybmUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmFyIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZhci1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxlamFuYXMgUGljb3Nlc2NhbG9mcmlhbnRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsZWphbmFzLXBpY29zZXNjYWxvZnJpYW50ZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMb2ludGFpbmVzIENpbWVmcm9pZGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxvaW50YWluZXMtY2ltZWZyb2lkZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA4XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXZWnDn2ZsYW5rZ3JhdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3ZWlzc2ZsYW5rZ3JhdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIldoaXRlc2lkZSBSaWRnZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ3aGl0ZXNpZGUtcmlkZ2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYWRlbmEgTGFkZXJhYmxhbmNhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhZGVuYS1sYWRlcmFibGFuY2FcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcsOqdGUgZGUgVmVyc2VibGFuY1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcmV0ZS1kZS12ZXJzZWJsYW5jXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwOVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwOVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVuIHZvbiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbmVuLXZvbi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWlucyBvZiBTdXJtaWFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicnVpbnMtb2Ytc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmFzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluYXMtZGUtc3VybWlhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUnVpbmVzIGRlIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZXMtZGUtc3VybWlhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAxMFwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VlbWFubnNyYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlZW1hbm5zcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYWZhcmVyJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWFmYXJlcnMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gZGVsIFZpYWphbnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tZGVsLXZpYWphbnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZHUgTWFyaW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZHUtbWFyaW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDExXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTJcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpa2VuLVBsYXR6XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXBsYXR6XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4gU3F1YXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpa2VuLXNxdWFyZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFBpa2VuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYXphLWRlLXBpa2VuXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhY2UtcGlrZW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMaWNodHVuZyBkZXIgTW9yZ2VucsO2dGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGljaHR1bmctZGVyLW1vcmdlbnJvdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdXJvcmEgR2xhZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVyb3JhLWdsYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhcm8gZGUgbGEgQXVyb3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYXJvLWRlLWxhLWF1cm9yYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYWlyacOocmUgZGUgbCdhdXJvcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhaXJpZXJlLWRlLWxhdXJvcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDE0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXJzIEZlc3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtZmVzdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJHdW5uYXIncyBIb2xkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImd1bm5hcnMtaG9sZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZ1ZXJ0ZSBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLWRlLWd1bm5hclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNhbXBlbWVudCBkZSBHdW5uYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FtcGVtZW50LWRlLWd1bm5hclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGVtZWVyIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZW1lZXItZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlIFNlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImphZGUtc2VhLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYXItZGUtamFkZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1lciBkZSBKYWRlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVyLWRlLWphZGUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAzXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cmVuc3RlaW4tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdWd1cnkgUm9jayBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImF1Z3VyeS1yb2NrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jYSBkZWwgQXVndXJpbyBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2EtZGVsLWF1Z3VyaW8tZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZSBkZSBsJ0F1Z3VyZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlLWRlLWxhdWd1cmUtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA0XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWaXp1bmFoLVBsYXR6IFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1wbGF0ei1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWggU3F1YXJlIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidml6dW5haC1zcXVhcmUtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGF6YSBkZSBWaXp1bmFoIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtdml6dW5haC1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYWNlIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGF1YmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYXViZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFyYm9yc3RvbmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhcmJvcnN0b25lLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllZHJhIEFyYsOzcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllZHJhLWFyYm9yZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVycmUgQXJib3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZXJyZS1hcmJvcmVhLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNjaCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImtvZGFzY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJLb2Rhc2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2gtZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjAyXCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGbHVzc3VmZXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmbHVzc3VmZXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaXZlcnNpZGUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaXZlcnNpZGUtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSaWJlcmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaWJlcmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQcm92aW5jZXMgZmx1dmlhbGVzIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHJvdmluY2VzLWZsdXZpYWxlcy1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDNcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hZmVscyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hZmVscy1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hIFJlYWNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmEtcmVhY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYcOxw7NuIGRlIEVsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2Fub24tZGUtZWxvbmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCaWVmIGQnRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiaWVmLWRlbG9uYS1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDRcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb25zIE11bmQgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhYmFkZG9ucy1tdW5kLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQWJhZGRvbidzIE1vdXRoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbW91dGgtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb2NhIGRlIEFiYWRkb24gW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib2NhLWRlLWFiYWRkb24tZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3VjaGUgZCdBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm91Y2hlLWRhYmFkZG9uLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwNVwiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thci1TZWUgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFra2FyLXNlZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWtrYXIgTGFrZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItbGFrZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhZ28gRHJha2thciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxhZ28tZHJha2thci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxhYyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFjLWRyYWtrYXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMjA2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMjA2XCIsXHJcblx0XHRcInJlZ2lvblwiOiBcIjJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXJzdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVyc3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcidzIFNvdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVycy1zb3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVzdHJlY2hvIGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVzdHJlY2hvLWRlLW1pbGxlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXRyb2l0IGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldHJvaXQtZGUtbWlsbGVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwN1wiLFxyXG5cdFx0XCJyZWdpb25cIjogXCIyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIzMDFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIzMDFcIixcclxuXHRcdFwicmVnaW9uXCI6IFwiMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaC1CdWNodCBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1idWNodC1zcFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhcnVjaCBCYXkgW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYXJ1Y2gtYmF5LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFow61hIGRlIEJhcnVjaCBbRVNdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhaGlhLWRlLWJhcnVjaC1lc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZGUgQmFydWNoIFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFpZS1kZS1iYXJ1Y2gtc3BcIlxyXG5cdFx0fVxyXG5cdH0sXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGxhbmdzOiByZXF1aXJlKCcuL2RhdGEvbGFuZ3MnKSxcclxuXHR3b3JsZHM6IHJlcXVpcmUoJy4vZGF0YS93b3JsZF9uYW1lcycpLFxyXG5cdG9iamVjdGl2ZV9uYW1lczogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV9uYW1lcycpLFxyXG5cdG9iamVjdGl2ZV90eXBlczogcmVxdWlyZSgnLi9kYXRhL29iamVjdGl2ZV90eXBlcycpLFxyXG5cdG9iamVjdGl2ZV9tZXRhOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX21ldGEnKSxcclxuXHRvYmplY3RpdmVfbGFiZWxzOiByZXF1aXJlKCcuL2RhdGEvb2JqZWN0aXZlX2xhYmVscycpLFxyXG5cdG9iamVjdGl2ZV9tYXA6IHJlcXVpcmUoJy4vZGF0YS9vYmplY3RpdmVfbWFwJyksXHJcbn07XHJcbiIsIlxuOyhmdW5jdGlvbigpe1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGluaXRpYWwgZGlzcGF0Y2guXG4gICAqL1xuXG4gIHZhciBkaXNwYXRjaCA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEJhc2UgcGF0aC5cbiAgICovXG5cbiAgdmFyIGJhc2UgPSAnJztcblxuICAvKipcbiAgICogUnVubmluZyBmbGFnLlxuICAgKi9cblxuICB2YXIgcnVubmluZztcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYHBhdGhgIHdpdGggY2FsbGJhY2sgYGZuKClgLFxuICAgKiBvciByb3V0ZSBgcGF0aGAsIG9yIGBwYWdlLnN0YXJ0KClgLlxuICAgKlxuICAgKiAgIHBhZ2UoZm4pO1xuICAgKiAgIHBhZ2UoJyonLCBmbik7XG4gICAqICAgcGFnZSgnL3VzZXIvOmlkJywgbG9hZCwgdXNlcik7XG4gICAqICAgcGFnZSgnL3VzZXIvJyArIHVzZXIuaWQsIHsgc29tZTogJ3RoaW5nJyB9KTtcbiAgICogICBwYWdlKCcvdXNlci8nICsgdXNlci5pZCk7XG4gICAqICAgcGFnZSgpO1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gcGF0aFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbi4uLlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBwYWdlKHBhdGgsIGZuKSB7XG4gICAgLy8gPGNhbGxiYWNrPlxuICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBwYXRoKSB7XG4gICAgICByZXR1cm4gcGFnZSgnKicsIHBhdGgpO1xuICAgIH1cblxuICAgIC8vIHJvdXRlIDxwYXRoPiB0byA8Y2FsbGJhY2sgLi4uPlxuICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBmbikge1xuICAgICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHBhdGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcGFnZS5jYWxsYmFja3MucHVzaChyb3V0ZS5taWRkbGV3YXJlKGFyZ3VtZW50c1tpXSkpO1xuICAgICAgfVxuICAgIC8vIHNob3cgPHBhdGg+IHdpdGggW3N0YXRlXVxuICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHBhdGgpIHtcbiAgICAgIHBhZ2Uuc2hvdyhwYXRoLCBmbik7XG4gICAgLy8gc3RhcnQgW29wdGlvbnNdXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhZ2Uuc3RhcnQocGF0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZ1bmN0aW9ucy5cbiAgICovXG5cbiAgcGFnZS5jYWxsYmFja3MgPSBbXTtcblxuICAvKipcbiAgICogR2V0IG9yIHNldCBiYXNlcGF0aCB0byBgcGF0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UuYmFzZSA9IGZ1bmN0aW9uKHBhdGgpe1xuICAgIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBiYXNlO1xuICAgIGJhc2UgPSBwYXRoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBCaW5kIHdpdGggdGhlIGdpdmVuIGBvcHRpb25zYC5cbiAgICpcbiAgICogT3B0aW9uczpcbiAgICpcbiAgICogICAgLSBgY2xpY2tgIGJpbmQgdG8gY2xpY2sgZXZlbnRzIFt0cnVlXVxuICAgKiAgICAtIGBwb3BzdGF0ZWAgYmluZCB0byBwb3BzdGF0ZSBbdHJ1ZV1cbiAgICogICAgLSBgZGlzcGF0Y2hgIHBlcmZvcm0gaW5pdGlhbCBkaXNwYXRjaCBbdHJ1ZV1cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdGFydCA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChydW5uaW5nKSByZXR1cm47XG4gICAgcnVubmluZyA9IHRydWU7XG4gICAgaWYgKGZhbHNlID09PSBvcHRpb25zLmRpc3BhdGNoKSBkaXNwYXRjaCA9IGZhbHNlO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5wb3BzdGF0ZSkgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25wb3BzdGF0ZSwgZmFsc2UpO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5jbGljaykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jbGljaywgZmFsc2UpO1xuICAgIGlmICghZGlzcGF0Y2gpIHJldHVybjtcbiAgICB2YXIgdXJsID0gbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2ggKyBsb2NhdGlvbi5oYXNoO1xuICAgIHBhZ2UucmVwbGFjZSh1cmwsIG51bGwsIHRydWUsIGRpc3BhdGNoKTtcbiAgfTtcblxuICAvKipcbiAgICogVW5iaW5kIGNsaWNrIGFuZCBwb3BzdGF0ZSBldmVudCBoYW5kbGVycy5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdG9wID0gZnVuY3Rpb24oKXtcbiAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNsaWNrLCBmYWxzZSk7XG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3cgYHBhdGhgIHdpdGggb3B0aW9uYWwgYHN0YXRlYCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRpc3BhdGNoXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc2hvdyA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBkaXNwYXRjaCl7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBpZiAoZmFsc2UgIT09IGRpc3BhdGNoKSBwYWdlLmRpc3BhdGNoKGN0eCk7XG4gICAgaWYgKCFjdHgudW5oYW5kbGVkKSBjdHgucHVzaFN0YXRlKCk7XG4gICAgcmV0dXJuIGN0eDtcbiAgfTtcblxuICAvKipcbiAgICogUmVwbGFjZSBgcGF0aGAgd2l0aCBvcHRpb25hbCBgc3RhdGVgIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UucmVwbGFjZSA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBpbml0LCBkaXNwYXRjaCl7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBjdHguaW5pdCA9IGluaXQ7XG4gICAgaWYgKG51bGwgPT0gZGlzcGF0Y2gpIGRpc3BhdGNoID0gdHJ1ZTtcbiAgICBpZiAoZGlzcGF0Y2gpIHBhZ2UuZGlzcGF0Y2goY3R4KTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIHRoZSBnaXZlbiBgY3R4YC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgcGFnZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKGN0eCl7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHZhciBmbiA9IHBhZ2UuY2FsbGJhY2tzW2krK107XG4gICAgICBpZiAoIWZuKSByZXR1cm4gdW5oYW5kbGVkKGN0eCk7XG4gICAgICBmbihjdHgsIG5leHQpO1xuICAgIH1cblxuICAgIG5leHQoKTtcbiAgfTtcblxuICAvKipcbiAgICogVW5oYW5kbGVkIGBjdHhgLiBXaGVuIGl0J3Mgbm90IHRoZSBpbml0aWFsXG4gICAqIHBvcHN0YXRlIHRoZW4gcmVkaXJlY3QuIElmIHlvdSB3aXNoIHRvIGhhbmRsZVxuICAgKiA0MDRzIG9uIHlvdXIgb3duIHVzZSBgcGFnZSgnKicsIGNhbGxiYWNrKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29udGV4dH0gY3R4XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiB1bmhhbmRsZWQoY3R4KSB7XG4gICAgdmFyIGN1cnJlbnQgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuICAgIGlmIChjdXJyZW50ID09IGN0eC5jYW5vbmljYWxQYXRoKSByZXR1cm47XG4gICAgcGFnZS5zdG9wKCk7XG4gICAgY3R4LnVuaGFuZGxlZCA9IHRydWU7XG4gICAgd2luZG93LmxvY2F0aW9uID0gY3R4LmNhbm9uaWNhbFBhdGg7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5ldyBcInJlcXVlc3RcIiBgQ29udGV4dGBcbiAgICogd2l0aCB0aGUgZ2l2ZW4gYHBhdGhgIGFuZCBvcHRpb25hbCBpbml0aWFsIGBzdGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBDb250ZXh0KHBhdGgsIHN0YXRlKSB7XG4gICAgaWYgKCcvJyA9PSBwYXRoWzBdICYmIDAgIT0gcGF0aC5pbmRleE9mKGJhc2UpKSBwYXRoID0gYmFzZSArIHBhdGg7XG4gICAgdmFyIGkgPSBwYXRoLmluZGV4T2YoJz8nKTtcblxuICAgIHRoaXMuY2Fub25pY2FsUGF0aCA9IHBhdGg7XG4gICAgdGhpcy5wYXRoID0gcGF0aC5yZXBsYWNlKGJhc2UsICcnKSB8fCAnLyc7XG5cbiAgICB0aGlzLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlIHx8IHt9O1xuICAgIHRoaXMuc3RhdGUucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5xdWVyeXN0cmluZyA9IH5pID8gcGF0aC5zbGljZShpICsgMSkgOiAnJztcbiAgICB0aGlzLnBhdGhuYW1lID0gfmkgPyBwYXRoLnNsaWNlKDAsIGkpIDogcGF0aDtcbiAgICB0aGlzLnBhcmFtcyA9IFtdO1xuXG4gICAgLy8gZnJhZ21lbnRcbiAgICB0aGlzLmhhc2ggPSAnJztcbiAgICBpZiAoIX50aGlzLnBhdGguaW5kZXhPZignIycpKSByZXR1cm47XG4gICAgdmFyIHBhcnRzID0gdGhpcy5wYXRoLnNwbGl0KCcjJyk7XG4gICAgdGhpcy5wYXRoID0gcGFydHNbMF07XG4gICAgdGhpcy5oYXNoID0gcGFydHNbMV0gfHwgJyc7XG4gICAgdGhpcy5xdWVyeXN0cmluZyA9IHRoaXMucXVlcnlzdHJpbmcuc3BsaXQoJyMnKVswXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgYENvbnRleHRgLlxuICAgKi9cblxuICBwYWdlLkNvbnRleHQgPSBDb250ZXh0O1xuXG4gIC8qKlxuICAgKiBQdXNoIHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgQ29udGV4dC5wcm90b3R5cGUucHVzaFN0YXRlID0gZnVuY3Rpb24oKXtcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBjb250ZXh0IHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGBSb3V0ZWAgd2l0aCB0aGUgZ2l2ZW4gSFRUUCBgcGF0aGAsXG4gICAqIGFuZCBhbiBhcnJheSBvZiBgY2FsbGJhY2tzYCBhbmQgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgIC0gYHNlbnNpdGl2ZWAgICAgZW5hYmxlIGNhc2Utc2Vuc2l0aXZlIHJvdXRlc1xuICAgKiAgIC0gYHN0cmljdGAgICAgICAgZW5hYmxlIHN0cmljdCBtYXRjaGluZyBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFJvdXRlKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMubWV0aG9kID0gJ0dFVCc7XG4gICAgdGhpcy5yZWdleHAgPSBwYXRodG9SZWdleHAocGF0aFxuICAgICAgLCB0aGlzLmtleXMgPSBbXVxuICAgICAgLCBvcHRpb25zLnNlbnNpdGl2ZVxuICAgICAgLCBvcHRpb25zLnN0cmljdCk7XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIGBSb3V0ZWAuXG4gICAqL1xuXG4gIHBhZ2UuUm91dGUgPSBSb3V0ZTtcblxuICAvKipcbiAgICogUmV0dXJuIHJvdXRlIG1pZGRsZXdhcmUgd2l0aFxuICAgKiB0aGUgZ2l2ZW4gY2FsbGJhY2sgYGZuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLm1pZGRsZXdhcmUgPSBmdW5jdGlvbihmbil7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBmdW5jdGlvbihjdHgsIG5leHQpe1xuICAgICAgaWYgKHNlbGYubWF0Y2goY3R4LnBhdGgsIGN0eC5wYXJhbXMpKSByZXR1cm4gZm4oY3R4LCBuZXh0KTtcbiAgICAgIG5leHQoKTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIHJvdXRlIG1hdGNoZXMgYHBhdGhgLCBpZiBzb1xuICAgKiBwb3B1bGF0ZSBgcGFyYW1zYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtBcnJheX0gcGFyYW1zXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihwYXRoLCBwYXJhbXMpe1xuICAgIHZhciBrZXlzID0gdGhpcy5rZXlzXG4gICAgICAsIHFzSW5kZXggPSBwYXRoLmluZGV4T2YoJz8nKVxuICAgICAgLCBwYXRobmFtZSA9IH5xc0luZGV4ID8gcGF0aC5zbGljZSgwLCBxc0luZGV4KSA6IHBhdGhcbiAgICAgICwgbSA9IHRoaXMucmVnZXhwLmV4ZWMocGF0aG5hbWUpO1xuXG4gICAgaWYgKCFtKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMSwgbGVuID0gbS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaSAtIDFdO1xuXG4gICAgICB2YXIgdmFsID0gJ3N0cmluZycgPT0gdHlwZW9mIG1baV1cbiAgICAgICAgPyBkZWNvZGVVUklDb21wb25lbnQobVtpXSlcbiAgICAgICAgOiBtW2ldO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHBhcmFtc1trZXkubmFtZV0gPSB1bmRlZmluZWQgIT09IHBhcmFtc1trZXkubmFtZV1cbiAgICAgICAgICA/IHBhcmFtc1trZXkubmFtZV1cbiAgICAgICAgICA6IHZhbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmFtcy5wdXNoKHZhbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZSB0aGUgZ2l2ZW4gcGF0aCBzdHJpbmcsXG4gICAqIHJldHVybmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQW4gZW1wdHkgYXJyYXkgc2hvdWxkIGJlIHBhc3NlZCxcbiAgICogd2hpY2ggd2lsbCBjb250YWluIHRoZSBwbGFjZWhvbGRlclxuICAgKiBrZXkgbmFtZXMuIEZvciBleGFtcGxlIFwiL3VzZXIvOmlkXCIgd2lsbFxuICAgKiB0aGVuIGNvbnRhaW4gW1wiaWRcIl0uXG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ3xSZWdFeHB8QXJyYXl9IHBhdGhcbiAgICogQHBhcmFtICB7QXJyYXl9IGtleXNcbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gc2Vuc2l0aXZlXG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IHN0cmljdFxuICAgKiBAcmV0dXJuIHtSZWdFeHB9XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiBwYXRodG9SZWdleHAocGF0aCwga2V5cywgc2Vuc2l0aXZlLCBzdHJpY3QpIHtcbiAgICBpZiAocGF0aCBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHBhdGg7XG4gICAgaWYgKHBhdGggaW5zdGFuY2VvZiBBcnJheSkgcGF0aCA9ICcoJyArIHBhdGguam9pbignfCcpICsgJyknO1xuICAgIHBhdGggPSBwYXRoXG4gICAgICAuY29uY2F0KHN0cmljdCA/ICcnIDogJy8/JylcbiAgICAgIC5yZXBsYWNlKC9cXC9cXCgvZywgJyg/Oi8nKVxuICAgICAgLnJlcGxhY2UoLyhcXC8pPyhcXC4pPzooXFx3KykoPzooXFwoLio/XFwpKSk/KFxcPyk/L2csIGZ1bmN0aW9uKF8sIHNsYXNoLCBmb3JtYXQsIGtleSwgY2FwdHVyZSwgb3B0aW9uYWwpe1xuICAgICAgICBrZXlzLnB1c2goeyBuYW1lOiBrZXksIG9wdGlvbmFsOiAhISBvcHRpb25hbCB9KTtcbiAgICAgICAgc2xhc2ggPSBzbGFzaCB8fCAnJztcbiAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgKyAob3B0aW9uYWwgPyAnJyA6IHNsYXNoKVxuICAgICAgICAgICsgJyg/OidcbiAgICAgICAgICArIChvcHRpb25hbCA/IHNsYXNoIDogJycpXG4gICAgICAgICAgKyAoZm9ybWF0IHx8ICcnKSArIChjYXB0dXJlIHx8IChmb3JtYXQgJiYgJyhbXi8uXSs/KScgfHwgJyhbXi9dKz8pJykpICsgJyknXG4gICAgICAgICAgKyAob3B0aW9uYWwgfHwgJycpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8oW1xcLy5dKS9nLCAnXFxcXCQxJylcbiAgICAgIC5yZXBsYWNlKC9cXCovZywgJyguKiknKTtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXicgKyBwYXRoICsgJyQnLCBzZW5zaXRpdmUgPyAnJyA6ICdpJyk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFwicG9wdWxhdGVcIiBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9ucG9wc3RhdGUoZSkge1xuICAgIGlmIChlLnN0YXRlKSB7XG4gICAgICB2YXIgcGF0aCA9IGUuc3RhdGUucGF0aDtcbiAgICAgIHBhZ2UucmVwbGFjZShwYXRoLCBlLnN0YXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFwiY2xpY2tcIiBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uY2xpY2soZSkge1xuICAgIGlmICgxICE9IHdoaWNoKGUpKSByZXR1cm47XG4gICAgaWYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5zaGlmdEtleSkgcmV0dXJuO1xuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcblxuICAgIC8vIGVuc3VyZSBsaW5rXG4gICAgdmFyIGVsID0gZS50YXJnZXQ7XG4gICAgd2hpbGUgKGVsICYmICdBJyAhPSBlbC5ub2RlTmFtZSkgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIGlmICghZWwgfHwgJ0EnICE9IGVsLm5vZGVOYW1lKSByZXR1cm47XG5cbiAgICAvLyBlbnN1cmUgbm9uLWhhc2ggZm9yIHRoZSBzYW1lIHBhdGhcbiAgICB2YXIgbGluayA9IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGlmIChlbC5wYXRobmFtZSA9PSBsb2NhdGlvbi5wYXRobmFtZSAmJiAoZWwuaGFzaCB8fCAnIycgPT0gbGluaykpIHJldHVybjtcblxuICAgIC8vIGNoZWNrIHRhcmdldFxuICAgIGlmIChlbC50YXJnZXQpIHJldHVybjtcblxuICAgIC8vIHgtb3JpZ2luXG4gICAgaWYgKCFzYW1lT3JpZ2luKGVsLmhyZWYpKSByZXR1cm47XG5cbiAgICAvLyByZWJ1aWxkIHBhdGhcbiAgICB2YXIgcGF0aCA9IGVsLnBhdGhuYW1lICsgZWwuc2VhcmNoICsgKGVsLmhhc2ggfHwgJycpO1xuXG4gICAgLy8gc2FtZSBwYWdlXG4gICAgdmFyIG9yaWcgPSBwYXRoICsgZWwuaGFzaDtcblxuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoYmFzZSwgJycpO1xuICAgIGlmIChiYXNlICYmIG9yaWcgPT0gcGF0aCkgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBhZ2Uuc2hvdyhvcmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBidXR0b24uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHdoaWNoKGUpIHtcbiAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgcmV0dXJuIG51bGwgPT0gZS53aGljaFxuICAgICAgPyBlLmJ1dHRvblxuICAgICAgOiBlLndoaWNoO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGBocmVmYCBpcyB0aGUgc2FtZSBvcmlnaW4uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNhbWVPcmlnaW4oaHJlZikge1xuICAgIHZhciBvcmlnaW4gPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0bmFtZTtcbiAgICBpZiAobG9jYXRpb24ucG9ydCkgb3JpZ2luICs9ICc6JyArIGxvY2F0aW9uLnBvcnQ7XG4gICAgcmV0dXJuIDAgPT0gaHJlZi5pbmRleE9mKG9yaWdpbik7XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIGBwYWdlYC5cbiAgICovXG5cbiAgaWYgKCd1bmRlZmluZWQnID09IHR5cGVvZiBtb2R1bGUpIHtcbiAgICB3aW5kb3cucGFnZSA9IHBhZ2U7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuICB9XG5cbn0pKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRnZXRHdWlsZERldGFpbHM6IGdldEd1aWxkRGV0YWlscyxcclxuXHRnZXRNYXRjaGVzOiBnZXRNYXRjaGVzLFxyXG5cdGdldE1hdGNoRGV0YWlsczogZ2V0TWF0Y2hEZXRhaWxzLFxyXG5cdGdldE1hdGNoRGV0YWlsc0J5V29ybGQ6IGdldE1hdGNoRGV0YWlsc0J5V29ybGQsXHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhndWlsZElkLCBvblN1Y2Nlc3MsIG9uRXJyb3IsIG9uQ29tcGxldGUpIHtcclxuXHR2YXIgcmVxdWVzdFVybCA9ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9ndWlsZF9kZXRhaWxzLmpzb24/Z3VpbGRfaWQ9JyArIGd1aWxkSWQ7XHJcblx0Z2V0KHJlcXVlc3RVcmwsIG9uU3VjY2Vzcywgb25FcnJvciwgb25Db21wbGV0ZSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hlcyhvblN1Y2Nlc3MsIG9uRXJyb3IsIG9uQ29tcGxldGUpIHtcclxuXHR2YXIgcmVxdWVzdFVybCA9ICdodHRwOi8vc3RhdGUuZ3cydzJ3LmNvbS9tYXRjaGVzJztcclxuXHRnZXQocmVxdWVzdFVybCwgb25TdWNjZXNzLCBvbkVycm9yLCBvbkNvbXBsZXRlKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHMobWF0Y2hJZCwgb25TdWNjZXNzLCBvbkVycm9yLCBvbkNvbXBsZXRlKSB7XHJcblx0dmFyIHJlcXVlc3RVcmwgPSAnaHR0cDovL3N0YXRlLmd3Mncydy5jb20vJyArIG1hdGNoSWQ7XHJcblx0Z2V0KHJlcXVlc3RVcmwsIG9uU3VjY2Vzcywgb25FcnJvciwgb25Db21wbGV0ZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoRGV0YWlsc0J5V29ybGQod29ybGRTbHVnLCBvblN1Y2Nlc3MsIG9uRXJyb3IsIG9uQ29tcGxldGUpIHtcclxuXHR2YXIgcmVxdWVzdFVybCA9ICdodHRwOi8vc3RhdGUuZ3cydzJ3LmNvbS93b3JsZC8nICsgd29ybGRTbHVnO1xyXG5cdGdldChyZXF1ZXN0VXJsLCBvblN1Y2Nlc3MsIG9uRXJyb3IsIG9uQ29tcGxldGUpO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldCh1cmwsIG9uU3VjY2Vzcywgb25FcnJvciwgb25Db21wbGV0ZSkge1xyXG5cdCQuYWpheCh7XHJcblx0XHR1cmw6IHVybCxcclxuXHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRzdWNjZXNzOiBvblN1Y2Nlc3MsXHJcblx0XHRlcnJvcjogb25FcnJvcixcclxuXHRcdGNvbXBsZXRlOiBvbkNvbXBsZXRlLFxyXG5cdH0pO1xyXG59XHJcblxyXG5cclxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Ll8gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLl8gOiBudWxsKTtcclxuXHJcbnZhciBsYW5ncyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKS5sYW5ncztcclxudmFyIHdvcmxkcyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKS53b3JsZHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFx0XHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsYW5nU2x1ZyA9IHRoaXMucHJvcHMubGFuZ1NsdWc7XHJcblx0XHR2YXIgd29ybGRTbHVnID0gdGhpcy5wcm9wcy53b3JsZFNsdWc7XHJcblxyXG5cdFx0aWYgKHdvcmxkU2x1Zykge1xyXG5cdFx0XHR2YXIgd29ybGQgPSBfLmZpbmQod29ybGRzLCBmdW5jdGlvbih3b3JsZCkge1xyXG5cdFx0XHRcdHJldHVybiB3b3JsZFtsYW5nU2x1Z10uc2x1ZyA9PT0gd29ybGRTbHVnO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRsYW5ncyA9IF8ubWFwKGxhbmdzLCBmdW5jdGlvbihsYW5nKXtcclxuXHRcdFx0bGFuZy5saW5rID0gJy8nICsgbGFuZy5zbHVnO1xyXG5cclxuXHRcdFx0aWYgKHdvcmxkKSB7XHJcblx0XHRcdFx0bGFuZy5saW5rID0gbGFuZy5saW5rICsgJy8nICsgd29ybGRbbGFuZy5zbHVnXS5zbHVnO1xyXG5cdFx0XHR9IFxyXG5cclxuXHRcdFx0cmV0dXJuIGxhbmc7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0UmVhY3QuRE9NLnVsKHtjbGFzc05hbWU6IFwibmF2IG5hdmJhci1uYXZcIn0sIFxyXG5cdFx0XHRcdF8ubWFwKGxhbmdzLCBmdW5jdGlvbihsYW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00ubGkoe2tleTogbGFuZy5zbHVnLCBjbGFzc05hbWU6IChsYW5nLnNsdWcgPT09IGxhbmdTbHVnKSA/ICdhY3RpdmUnIDogJycsIHRpdGxlOiBsYW5nLm5hbWV9LCBcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7J2RhdGEtc2x1Zyc6IGxhbmcuc2x1ZywgaHJlZjogbGFuZy5saW5rfSwgbGFuZy5sYWJlbClcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH0sXHJcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Ll8gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLl8gOiBudWxsKTtcclxuXHJcbnZhciBSZWdpb25NYXRjaGVzID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL292ZXJ2aWV3L1JlZ2lvbk1hdGNoZXMuanN4JykpO1xyXG52YXIgUmVnaW9uV29ybGRzID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL292ZXJ2aWV3L1JlZ2lvbldvcmxkcy5qc3gnKSk7XHJcblxyXG52YXIgcmVnaW9ucyA9IFtcclxuXHR7XCJsYWJlbFwiOiBcIk5BIFdvcmxkc1wiLCBcInJlZ2lvbklkXCI6IFwiMVwifSxcclxuXHR7XCJsYWJlbFwiOiBcIkVVIFdvcmxkc1wiLCBcInJlZ2lvbklkXCI6IFwiMlwifSxcclxuXTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge21hdGNoZXM6IHt9fTtcclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMudXBkYXRlVGltZXIgPSBudWxsO1xyXG5cdFx0dGhpcy5nZXRNYXRjaGVzKCk7XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudXBkYXRlVGltZXIpO1xyXG5cdH0sXHJcblx0XHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsYW5nID0gd2luZG93LmFwcC5zdGF0ZS5sYW5nO1xyXG5cdFx0dmFyIGxhbmdTbHVnID0gbGFuZy5zbHVnO1xyXG5cclxuXHRcdHZhciByZWdpb25NYXRjaGVzID0gW1xyXG5cdFx0XHR7XCJsYWJlbFwiOiBcIk5BIE1hdGNodXBzXCIsIFwibWF0Y2hlc1wiOiBfLmZpbHRlcih0aGlzLnN0YXRlLm1hdGNoZXMsIHtyZWdpb246IDF9KX0sXHJcblx0XHRcdHtcImxhYmVsXCI6IFwiRVUgTWF0Y2h1cHNcIiwgXCJtYXRjaGVzXCI6IF8uZmlsdGVyKHRoaXMuc3RhdGUubWF0Y2hlcywge3JlZ2lvbjogMn0pfSxcclxuXHRcdF07XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0UmVhY3QuRE9NLmRpdih7aWQ6IFwib3ZlcnZpZXdcIn0sIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJyb3dcIn0sIFxyXG5cdFx0XHRcdFx0Xy5tYXAocmVnaW9uTWF0Y2hlcywgZnVuY3Rpb24ocmVnaW9uKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLXNtLTEyXCIsIGtleTogcmVnaW9uLmxhYmVsfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRSZWdpb25NYXRjaGVzKHtyZWdpb246IHJlZ2lvbn0pXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHQpLCBcclxuXHJcblx0XHRcdFx0UmVhY3QuRE9NLmhyKG51bGwpLCBcclxuXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInJvd1wifSwgXHJcblx0XHRcdFx0XHRfLm1hcChyZWdpb25zLCBmdW5jdGlvbihyZWdpb24pe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJjb2wtc20tMTJcIiwga2V5OiByZWdpb24ubGFiZWx9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFJlZ2lvbldvcmxkcyh7cmVnaW9uOiByZWdpb259KVxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH0sXHJcblxyXG5cclxuXHJcblx0Z2V0TWF0Y2hlczogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYXBpID0gcmVxdWlyZSgnLi4vYXBpJyk7XHJcblxyXG5cdFx0YXBpLmdldE1hdGNoZXMoXHJcblx0XHRcdHRoaXMuZ2V0TWF0Y2hlc1N1Y2Nlc3MsXHJcblx0XHRcdHRoaXMuZ2V0TWF0Y2hlc0Vycm9yLFxyXG5cdFx0XHR0aGlzLmdldE1hdGNoZXNDb21wbGV0ZVxyXG5cdFx0KTtcclxuXHJcblx0fSxcclxuXHJcblx0Z2V0TWF0Y2hlc1N1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe21hdGNoZXM6IGRhdGF9KTtcclxuXHR9LFxyXG5cdGdldE1hdGNoZXNFcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xyXG5cdFx0Y29uc29sZS5sb2coJ092ZXJ2aWV3OjpnZXRNYXRjaGVzOmRhdGEgZXJyb3InLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTsgXHJcblx0fSxcclxuXHRnZXRNYXRjaGVzQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGludGVydmFsID0gXy5yYW5kb20oMjAwMCwgNDAwMCk7XHJcblx0XHR0aGlzLnVwZGF0ZVRpbWVyID0gc2V0VGltZW91dCh0aGlzLmdldE1hdGNoZXMsIGludGVydmFsKTtcclxuXHR9LFxyXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Ll8gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLl8gOiBudWxsKTtcclxudmFyIGFzeW5jID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuYXN5bmMgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLmFzeW5jIDogbnVsbCk7XHJcblxyXG52YXIgU2NvcmVib2FyZCA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi90cmFja2VyL1Njb3JlYm9hcmQuanN4JykpO1xyXG52YXIgTWFwcyA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi90cmFja2VyL01hcHMuanN4JykpO1xyXG52YXIgR3VpbGRzID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL3RyYWNrZXIvZ3VpbGRzL0d1aWxkcy5qc3gnKSk7XHJcblxyXG52YXIgc3RhdGljRGF0YSA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxudmFyIHdvcmxkcyA9IHN0YXRpY0RhdGEud29ybGRzO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bWF0Y2g6IFtdLFxyXG5cdFx0XHRkZXRhaWxzOiBbXSxcclxuXHRcdFx0Z3VpbGRzOiB7fSxcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy51cGRhdGVUaW1lciA9IG51bGw7XHJcblxyXG5cdFx0dGhpcy5nZXRNYXRjaERldGFpbHMoKTtcclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy51cGRhdGVUaW1lcik7XHJcblx0fSxcclxuXHJcblx0Ly8gY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuXHQvLyBcdC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xyXG5cdC8vIFx0Ly8gY29uc29sZS5sb2coXy5maWx0ZXIodGhpcy5zdGF0ZS5vYmplY3RpdmVzLCBmdW5jdGlvbihvKXsgcmV0dXJuIG8ubGFzdENhcCAhPT0gMDsgfSkpO1xyXG5cdC8vIH0sXHJcblx0XHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBsYW5nID0gd2luZG93LmFwcC5zdGF0ZS5sYW5nO1xyXG5cdFx0dmFyIGxhbmdTbHVnID0gbGFuZy5zbHVnO1xyXG5cclxuXHRcdHZhciBkZXRhaWxzID0gdGhpcy5zdGF0ZS5kZXRhaWxzO1xyXG5cclxuXHJcblx0XHRpZiAoXy5pc0VtcHR5KHRoaXMuc3RhdGUuZGV0YWlscykgfHwgdGhpcy5zdGF0ZS5kZXRhaWxzLmluaXRpYWxpemVkID09PSBmYWxzZSkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR2YXIgbWF0Y2ggPSB0aGlzLnN0YXRlLm1hdGNoO1xyXG5cdFx0XHR2YXIgZ3VpbGRzID0gdGhpcy5zdGF0ZS5ndWlsZHM7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgZXZlbnRIaXN0b3J5ID0gZGV0YWlscy5oaXN0b3J5O1xyXG5cclxuXHRcdFx0dmFyIG1hdGNoV29ybGRzID0gXy5tYXAoXHJcblx0XHRcdFx0W21hdGNoLnJlZElkLCBtYXRjaC5ibHVlSWQsIG1hdGNoLmdyZWVuSWRdLFxyXG5cdFx0XHRcdGZ1bmN0aW9uKHdvcmxkSWQsIHdvcmxkSW5kZXgpIHtcclxuXHRcdFx0XHRcdHZhciB3b3JsZCA9IHdvcmxkc1t3b3JsZElkXVtsYW5nU2x1Z107XHJcblx0XHRcdFx0XHR3b3JsZC5saW5rID0gJy8nICsgbGFuZ1NsdWcgKyAnLycgKyB3b3JsZC5zbHVnO1xyXG5cdFx0XHRcdFx0d29ybGQuY29sb3IgPSBbJ3JlZCcsJ2JsdWUnLCdncmVlbiddW3dvcmxkSW5kZXhdO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHdvcmxkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdHZhciBtYXBzTWV0YSA9IFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQnaW5kZXgnOiAwLFxyXG5cdFx0XHRcdFx0J25hbWUnOiAnUmVkSG9tZScgLFxyXG5cdFx0XHRcdFx0J2xvbmcnOiAnUmVkSG9tZSAtICcgKyBtYXRjaFdvcmxkc1swXS5uYW1lLFxyXG5cdFx0XHRcdFx0J2FiYnInOiAnUmVkJyxcclxuXHRcdFx0XHRcdCdjb2xvcic6ICdyZWQnLFxyXG5cdFx0XHRcdFx0J3dvcmxkJzogbWF0Y2hXb3JsZHNbMF1cclxuXHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHQnaW5kZXgnOiAxLFxyXG5cdFx0XHRcdFx0J25hbWUnOiAnR3JlZW5Ib21lJyxcclxuXHRcdFx0XHRcdCdsb25nJzogJ0dyZWVuSG9tZSAtICcgKyBtYXRjaFdvcmxkc1syXS5uYW1lLFxyXG5cdFx0XHRcdFx0J2FiYnInOiAnR3JuJyxcclxuXHRcdFx0XHRcdCdjb2xvcic6ICdncmVlbicsXHJcblx0XHRcdFx0XHQnd29ybGQnOiBtYXRjaFdvcmxkc1syXVxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdCdpbmRleCc6IDIsXHJcblx0XHRcdFx0XHQnbmFtZSc6ICdCbHVlSG9tZScsXHJcblx0XHRcdFx0XHQnbG9uZyc6ICdCbHVlSG9tZSAtICcgKyBtYXRjaFdvcmxkc1sxXS5uYW1lLFxyXG5cdFx0XHRcdFx0J2FiYnInOiAnQmx1JyxcclxuXHRcdFx0XHRcdCdjb2xvcic6ICdibHVlJyxcclxuXHRcdFx0XHRcdCd3b3JsZCc6IG1hdGNoV29ybGRzWzFdXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0J2luZGV4JzogMyxcclxuXHRcdFx0XHRcdCduYW1lJzogJ0V0ZXJuYWwgQmF0dGxlZ3JvdW5kcycsXHJcblx0XHRcdFx0XHQnbG9uZyc6ICdFdGVybmFsIEJhdHRsZWdyb3VuZHMnLFxyXG5cdFx0XHRcdFx0J2FiYnInOiAnRUJHJyxcclxuXHRcdFx0XHRcdCdjb2xvcic6ICduZXV0cmFsJyxcclxuXHRcdFx0XHRcdCd3b3JsZCc6IG51bGxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRdO1xyXG5cclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtpZDogXCJ0cmFja2VyXCJ9LCBcclxuXHRcdFx0XHRcdFNjb3JlYm9hcmQoe1xyXG5cdFx0XHRcdFx0XHRtYXRjaDogbWF0Y2gsIFxyXG5cdFx0XHRcdFx0XHRtYXRjaFdvcmxkczogbWF0Y2hXb3JsZHMsIFxyXG5cdFx0XHRcdFx0XHRtYXBzTWV0YTogbWFwc01ldGF9XHJcblx0XHRcdFx0XHQpLCBcclxuXHJcblx0XHRcdFx0XHRNYXBzKHtcclxuXHRcdFx0XHRcdFx0ZGV0YWlsczogZGV0YWlscywgXHJcblx0XHRcdFx0XHRcdG1hdGNoV29ybGRzOiBtYXRjaFdvcmxkcywgXHJcblx0XHRcdFx0XHRcdG1hcHNNZXRhOiBtYXBzTWV0YSwgXHJcblx0XHRcdFx0XHRcdGd1aWxkczogZ3VpbGRzfVxyXG5cdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5ocihudWxsKSwgXHJcblxyXG5cdFx0XHRcdFx0R3VpbGRzKHtcclxuXHRcdFx0XHRcdFx0Z3VpbGRzOiBndWlsZHMsIFxyXG5cdFx0XHRcdFx0XHRldmVudEhpc3Rvcnk6IGV2ZW50SGlzdG9yeSwgXHJcblx0XHRcdFx0XHRcdG1hcHNNZXRhOiBtYXBzTWV0YX1cclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHQpXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdGdldE1hdGNoRGV0YWlsczogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYXBpID0gcmVxdWlyZSgnLi4vYXBpJyk7XHJcblx0XHRcclxuXHRcdGFwaS5nZXRNYXRjaERldGFpbHNCeVdvcmxkKFxyXG5cdFx0XHR0aGlzLnByb3BzLndvcmxkU2x1ZyxcclxuXHRcdFx0dGhpcy5vbk1hdGNoRGV0YWlsc1N1Y2Nlc3MsIFxyXG5cdFx0XHR0aGlzLm9uTWF0Y2hEZXRhaWxzRXJyb3IsIFxyXG5cdFx0XHR0aGlzLm9uTWF0Y2hEZXRhaWxzQ29tcGxldGVcclxuXHRcdCk7XHJcblx0fSxcclxuXHJcblx0b25NYXRjaERldGFpbHNTdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnTWF0Y2g6Om9uTWF0Y2hEZXRhaWxzU3VjY2VzcycsIHRoaXMucHJvcHMuZGF0YS53dndfbWF0Y2hfaWQsIGRhdGEpO1xyXG5cdFx0dmFyIGNvbXBvbmVudCA9IHRoaXM7XHJcblxyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdG1hdGNoOiBkYXRhLm1hdGNoLFxyXG5cdFx0XHRkZXRhaWxzOiBkYXRhLmRldGFpbHMsXHJcblx0XHRcdC8vIGd1aWxkczogZ3VpbGRzLFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIGNsYWltQ3VycmVudCA9IF8ucGx1Y2soZGF0YS5kZXRhaWxzLm9iamVjdGl2ZXMuY2xhaW1lcnMsICdndWlsZCcpO1xyXG5cdFx0dmFyIGNsYWltSGlzdG9yeSA9IF8uY2hhaW4oZGF0YS5kZXRhaWxzLmhpc3RvcnkpXHJcblx0XHRcdC5maWx0ZXIoe3R5cGU6ICdjbGFpbSd9KVxyXG5cdFx0XHQucGx1Y2soJ2d1aWxkJylcclxuXHRcdFx0LnZhbHVlKCk7XHJcblxyXG5cdFx0dmFyIGd1aWxkcyA9IGNsYWltQ3VycmVudC5jb25jYXQoY2xhaW1IaXN0b3J5KTtcclxuXHRcdFxyXG5cdFx0aWYoZ3VpbGRzLmxlbmd0aCkge1xyXG5cclxuXHRcdFx0cHJvY2Vzcy5uZXh0VGljayhxdWV1ZUd1aWxkTG9va3Vwcy5iaW5kKHRoaXMsIGd1aWxkcykpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdG9uTWF0Y2hEZXRhaWxzRXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdPdmVydmlldzo6Z2V0TWF0Y2hEZXRhaWxzOmRhdGEgZXJyb3InLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTsgXHJcblx0fSxcclxuXHJcblx0b25NYXRjaERldGFpbHNDb21wbGV0ZTogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xyXG5cdFx0dmFyIHJlZnJlc2hUaW1lID0gXy5yYW5kb20oMTAwMCoyLCAxMDAwKjQpO1xyXG5cdFx0dGhpcy51cGRhdGVUaW1lciA9IHNldFRpbWVvdXQodGhpcy5nZXRNYXRjaERldGFpbHMsIHJlZnJlc2hUaW1lKTtcclxuXHR9LFxyXG59KTtcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHF1ZXVlR3VpbGRMb29rdXBzKGd1aWxkcyl7XHJcblx0dmFyIGtub3duR3VpbGRzID0gXy5rZXlzKHRoaXMuc3RhdGUuZ3VpbGRzKTtcclxuXHJcblx0dmFyIG5ld0d1aWxkcyA9IF9cclxuXHRcdC5jaGFpbihndWlsZHMpXHJcblx0XHQudW5pcSgpXHJcblx0XHQud2l0aG91dCh1bmRlZmluZWQsIG51bGwpXHJcblx0XHQuZGlmZmVyZW5jZShrbm93bkd1aWxkcylcclxuXHRcdC52YWx1ZSgpO1xyXG5cclxuXHRhc3luYy5lYWNoTGltaXQoXHJcblx0XHRuZXdHdWlsZHMsXHJcblx0XHQ0LFxyXG5cdFx0Z2V0R3VpbGREZXRhaWxzLmJpbmQodGhpcylcclxuXHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRHdWlsZERldGFpbHMoZ3VpbGRJZCwgb25Db21wbGV0ZSkge1xyXG5cdHZhciBhcGkgPSByZXF1aXJlKCcuLi9hcGknKTtcclxuXHR2YXIgY29tcG9uZW50ID0gdGhpcztcclxuXHJcblx0YXBpLmdldEd1aWxkRGV0YWlscyhcclxuXHRcdGd1aWxkSWQsXHJcblx0XHRmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdjb21wb25lbnQuc3RhdGUnLCBjb21wb25lbnQuc3RhdGUpO1xyXG5cdFx0XHQvLyB2YXIgZ3VpbGQgPSBfLm1lcmdlKGNvbXBvbmVudC5zdGF0ZS5ndWlsZHNbZ3VpbGRJZF0sIGRhdGEpO1xyXG5cdFx0XHRjb21wb25lbnQuc3RhdGUuZ3VpbGRzW2d1aWxkSWRdID0gZGF0YTtcclxuXHRcdFx0Y29tcG9uZW50LnNldFN0YXRlKHtndWlsZHM6IGNvbXBvbmVudC5zdGF0ZS5ndWlsZHN9KTtcclxuXHRcdH0sIFxyXG5cdFx0Xy5ub29wLFxyXG5cdFx0b25Db21wbGV0ZS5iaW5kKG51bGwsIG51bGwpIC8vIHNvIG5vIGVycm9yIGlzIHJldHVybmVkXHJcblx0KTtcclxufVxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJyksdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcblxyXG5cclxudmFyIFNjb3JlID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL1Njb3JlLmpzeCcpKTtcclxudmFyIFBpZSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9QaWUuanN4JykpO1xyXG5cclxudmFyIHdvcmxkc1N0YXRpYyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKS53b3JsZHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnTWF0Y2g6cmVuZGVyJywgdGhpcy5wcm9wcy5tYXRjaC5pZCk7XHJcblx0XHR2YXIgbGFuZyA9IHdpbmRvdy5hcHAuc3RhdGUubGFuZztcclxuXHRcdHZhciBsYW5nU2x1ZyA9IGxhbmcuc2x1ZztcclxuXHJcblx0XHR2YXIgbWF0Y2ggPSB0aGlzLnByb3BzLm1hdGNoO1xyXG5cclxuXHRcdHZhciByZWRXb3JsZCA9IHdvcmxkc1N0YXRpY1ttYXRjaC5yZWRJZF1bbGFuZ1NsdWddO1xyXG5cdFx0dmFyIGJsdWVXb3JsZCA9IHdvcmxkc1N0YXRpY1ttYXRjaC5ibHVlSWRdW2xhbmdTbHVnXTtcclxuXHRcdHZhciBncmVlbldvcmxkID0gd29ybGRzU3RhdGljW21hdGNoLmdyZWVuSWRdW2xhbmdTbHVnXTtcclxuXHJcblx0XHRbcmVkV29ybGQsIGJsdWVXb3JsZCwgZ3JlZW5Xb3JsZF0ubWFwKGZ1bmN0aW9uKHdvcmxkKSB7XHJcblx0XHRcdHdvcmxkLmxpbmsgPSAnLycgKyBsYW5nU2x1ZyArICcvJyArIHdvcmxkLnNsdWc7XHJcblx0XHRcdHJldHVybiB3b3JsZDtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJtYXRjaENvbnRhaW5lclwiLCBrZXk6IG1hdGNoLmlkfSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLnRhYmxlKHtjbGFzc05hbWU6IFwibWF0Y2hcIn0sIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRyKG51bGwsIFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00udGQoe2NsYXNzTmFtZTogXCJ0ZWFtIHJlZCBuYW1lXCJ9LCBSZWFjdC5ET00uYSh7aHJlZjogcmVkV29ybGQubGlua30sIHJlZFdvcmxkLm5hbWUpKSwgXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS50ZCh7Y2xhc3NOYW1lOiBcInRlYW0gcmVkIHNjb3JlXCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRTY29yZSh7XHJcblx0XHRcdFx0XHRcdFx0XHRrZXk6ICdyZWQtc2NvcmUtJyArIG1hdGNoLmlkLCBcclxuXHRcdFx0XHRcdFx0XHRcdG1hdGNoSWQ6IG1hdGNoLmlkLCBcclxuXHRcdFx0XHRcdFx0XHRcdHRlYW06IFwicmVkXCIsIFxyXG5cdFx0XHRcdFx0XHRcdFx0c2NvcmU6IG1hdGNoLnNjb3Jlc1swXX1cclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdCksIFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00udGQoe3Jvd1NwYW46IFwiM1wiLCBjbGFzc05hbWU6IFwicGllXCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRQaWUoe3Njb3JlczogbWF0Y2guc2NvcmVzLCBzaXplOiBcIjYwXCIsIG1hdGNoSWQ6IG1hdGNoLmlkfSlcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00udHIobnVsbCwgXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS50ZCh7Y2xhc3NOYW1lOiBcInRlYW0gYmx1ZSBuYW1lXCJ9LCBSZWFjdC5ET00uYSh7aHJlZjogYmx1ZVdvcmxkLmxpbmt9LCBibHVlV29ybGQubmFtZSkpLCBcclxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLnRkKHtjbGFzc05hbWU6IFwidGVhbSBibHVlIHNjb3JlXCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRTY29yZSh7XHJcblx0XHRcdFx0XHRcdFx0XHRrZXk6ICdibHVlLXNjb3JlLScgKyBtYXRjaC5pZCwgXHJcblx0XHRcdFx0XHRcdFx0XHRtYXRjaElkOiBtYXRjaC5pZCwgXHJcblx0XHRcdFx0XHRcdFx0XHR0ZWFtOiBcImJsdWVcIiwgXHJcblx0XHRcdFx0XHRcdFx0XHRzY29yZTogbWF0Y2guc2NvcmVzWzFdfVxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00udHIobnVsbCwgXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS50ZCh7Y2xhc3NOYW1lOiBcInRlYW0gZ3JlZW4gbmFtZVwifSwgUmVhY3QuRE9NLmEoe2hyZWY6IGdyZWVuV29ybGQubGlua30sIGdyZWVuV29ybGQubmFtZSkpLCBcclxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLnRkKHtjbGFzc05hbWU6IFwidGVhbSBncmVlbiBzY29yZVwifSwgXHJcblx0XHRcdFx0XHRcdFx0U2NvcmUoe1xyXG5cdFx0XHRcdFx0XHRcdFx0a2V5OiAnZ3JlZW4tc2NvcmUtJyArIG1hdGNoLmlkLCBcclxuXHRcdFx0XHRcdFx0XHRcdG1hdGNoSWQ6IG1hdGNoLmlkLCBcclxuXHRcdFx0XHRcdFx0XHRcdHRlYW06IFwiZ3JlZW5cIiwgXHJcblx0XHRcdFx0XHRcdFx0XHRzY29yZTogbWF0Y2guc2NvcmVzWzJdfVxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2l6ZSA9IHRoaXMucHJvcHMuc2l6ZSB8fCAnNjAnO1xyXG5cdFx0dmFyIHN0cm9rZSA9IHRoaXMucHJvcHMuc3Ryb2tlIHx8IDI7XHJcblx0XHR2YXIgc2NvcmVzID0gdGhpcy5wcm9wcy5zY29yZXMgfHwgW107XHJcblxyXG5cdFx0dmFyIHBpZVNyYyA9ICdodHRwOi8vd3d3LnBpZWx5Lm5ldC8nICsgc2l6ZSArICcvJyArIHNjb3Jlcy5qb2luKCcsJykgKyAnP3N0cm9rZVdpZHRoPScgKyBzdHJva2U7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0KHNjb3Jlcy5sZW5ndGgpID9cclxuXHRcdFx0XHRSZWFjdC5ET00uaW1nKHtcclxuXHRcdFx0XHRcdHdpZHRoOiBcIjYwXCIsIGhlaWdodDogXCI2MFwiLCBcclxuXHRcdFx0XHRcdGtleTogJ3BpZS0nICsgdGhpcy5wcm9wcy5tYXRjaElkLCBcclxuXHRcdFx0XHRcdHNyYzogcGllU3JjfVxyXG5cdFx0XHRcdCkgOlxyXG5cdFx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwpXHJcblx0XHQpO1xyXG5cdH1cclxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG5cclxuXHJcbnZhciBNYXRjaCA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9NYXRjaC5qc3gnKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHJlZ2lvbiA9IHRoaXMucHJvcHMucmVnaW9uO1xyXG5cdFx0dmFyIHdvcmxkcyA9IHRoaXMucHJvcHMud29ybGRzO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJSZWdpb25NYXRjaGVzXCJ9LCBcclxuXHRcdFx0XHRSZWFjdC5ET00uaDIobnVsbCwgcmVnaW9uLmxhYmVsKSwgXHJcblx0XHRcdFx0Xy5tYXAocmVnaW9uLm1hdGNoZXMsIGZ1bmN0aW9uKG1hdGNoKXtcclxuXHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdE1hdGNoKHtcclxuXHRcdFx0XHRcdFx0XHRrZXk6ICdtYXRjaC0nICsgbWF0Y2guaWQsIFxyXG5cdFx0XHRcdFx0XHRcdGNsYXNzTmFtZTogXCJtYXRjaFwiLCBcclxuXHRcdFx0XHRcdFx0XHRtYXRjaDogbWF0Y2gsIFxyXG5cdFx0XHRcdFx0XHRcdHdvcmxkczogd29ybGRzfVxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fVxyXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5fIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5fIDogbnVsbCk7XHJcblxyXG5cclxudmFyIHdvcmxkc1N0YXRpYyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKS53b3JsZHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbGFuZyA9IHdpbmRvdy5hcHAuc3RhdGUubGFuZztcclxuXHRcdHZhciBsYW5nU2x1ZyA9IGxhbmcuc2x1ZztcclxuXHJcblx0XHR2YXIgbGFiZWwgPSB0aGlzLnByb3BzLnJlZ2lvbi5sYWJlbDtcclxuXHRcdHZhciByZWdpb25JZCA9IHRoaXMucHJvcHMucmVnaW9uLnJlZ2lvbklkO1xyXG5cclxuXHRcdHZhciB3b3JsZHMgPSBfLmNoYWluKHdvcmxkc1N0YXRpYylcclxuXHRcdFx0LmZpbHRlcihmdW5jdGlvbih3b3JsZCkge3JldHVybiB3b3JsZC5yZWdpb24gPT0gcmVnaW9uSWQ7fSlcclxuXHRcdFx0Lm1hcChmdW5jdGlvbih3b3JsZCkge1xyXG5cdFx0XHRcdHdvcmxkW2xhbmdTbHVnXS5pZCA9IHdvcmxkLmlkO1xyXG5cdFx0XHRcdHdvcmxkW2xhbmdTbHVnXS5saW5rID0gJy8nICsgbGFuZ1NsdWcgKyAnLycgKyB3b3JsZC5zbHVnO1xyXG5cdFx0XHRcdHJldHVybiB3b3JsZFtsYW5nU2x1Z107XHJcblx0XHRcdH0pXHJcblx0XHRcdC5zb3J0QnkoJ25hbWUnKVxyXG5cdFx0XHQudmFsdWUoKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiUmVnaW9uV29ybGRzXCJ9LCBcclxuXHRcdFx0XHRSZWFjdC5ET00uaDIobnVsbCwgbGFiZWwpLCBcclxuXHRcdFx0XHRSZWFjdC5ET00udWwoe2NsYXNzTmFtZTogXCJsaXN0LXVuc3R5bGVkXCJ9LCBcclxuXHRcdFx0XHRcdF8ubWFwKHdvcmxkcywgZnVuY3Rpb24od29ybGQpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7a2V5OiAnd29ybGQnICsgd29ybGQuaWR9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5hKHtocmVmOiB3b3JsZC5zbHVnfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdHdvcmxkLm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Ll8gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLl8gOiBudWxsKTtcclxudmFyICQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy4kIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC4kIDogbnVsbCk7XHJcbnZhciBudW1lcmFsID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cubnVtZXJhbCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwubnVtZXJhbCA6IG51bGwpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7ZGlmZjogMH07XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKXtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdTY29yZTo6Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcycsIG5leHRQcm9wcy5zY29yZSwgdGhpcy5wcm9wcy5zY29yZSk7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtkaWZmOiBuZXh0UHJvcHMuc2NvcmUgLSB0aGlzLnByb3BzLnNjb3JlfSk7XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHRoaXMuc3RhdGUuZGlmZiA+IDApIHtcclxuXHRcdFx0dmFyICRkaWZmID0gJCgnLmRpZmYnLCB0aGlzLmdldERPTU5vZGUoKSk7XHJcblxyXG5cdFx0XHQvLyAkZGlmZlxyXG5cdFx0XHQvLyBcdC5oaWRlKClcclxuXHRcdFx0Ly8gXHQuZmFkZUluKDQwMClcclxuXHRcdFx0Ly8gXHQuZGVsYXkoNDAwMClcclxuXHRcdFx0Ly8gXHQuZmFkZU91dCgyMDAwKTtcclxuXHRcdFx0JGRpZmZcclxuXHRcdFx0XHQudmVsb2NpdHkoJ2ZhZGVPdXQnLCB7ZHVyYXRpb246IDB9KVxyXG5cdFx0XHRcdC52ZWxvY2l0eSgnZmFkZUluJywge2R1cmF0aW9uOiAyMDB9KVxyXG5cdFx0XHRcdC52ZWxvY2l0eSgnZmFkZU91dCcsIHtkdXJhdGlvbjogMTIwMCwgZGVsYXk6IDQwMH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbWF0Y2hJZCA9IHRoaXMucHJvcHMubWF0Y2hJZDtcclxuXHRcdHZhciB0ZWFtID0gdGhpcy5wcm9wcy50ZWFtO1xyXG5cdFx0dmFyIHNjb3JlID0gdGhpcy5wcm9wcy5zY29yZSB8fCAwO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwsIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IFwiZGlmZlwifSwgXHJcblx0XHRcdFx0XHQodGhpcy5zdGF0ZS5kaWZmKSA/XHJcblx0XHRcdFx0XHRcdCcrJyArIG51bWVyYWwodGhpcy5zdGF0ZS5kaWZmKS5mb3JtYXQoJzAsMCcpIDpcclxuXHRcdFx0XHRcdFx0bnVsbFxyXG5cdFx0XHRcdCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IFwidmFsdWVcIn0sIG51bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJykpXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fVxyXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbWV0YSA9IHRoaXMucHJvcHMub01ldGE7XHJcblxyXG5cdFx0aWYgKG1ldGEuZCkge1xyXG5cdFx0XHR2YXIgc3JjID0gWycvaW1nL2ljb25zL2Rpc3QvYXJyb3cnXTtcclxuXHJcblx0XHRcdGlmIChtZXRhLm4pIHtzcmMucHVzaCgnbm9ydGgnKTsgfVxyXG5cdFx0XHRlbHNlIGlmIChtZXRhLnMpIHtzcmMucHVzaCgnc291dGgnKTsgfVxyXG5cclxuXHRcdFx0aWYgKG1ldGEudykge3NyYy5wdXNoKCd3ZXN0Jyk7IH1cclxuXHRcdFx0ZWxzZSBpZiAobWV0YS5lKSB7c3JjLnB1c2goJ2Vhc3QnKTsgfVxyXG5cclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiBcImRpcmVjdGlvblwifSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uaW1nKHtzcmM6IHNyYy5qb2luKCctJykgKyAnLnN2Zyd9KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gUmVhY3QuRE9NLnNwYW4oe2NsYXNzTmFtZTogXCJkaXJlY3Rpb25cIn0pO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG52YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LiQgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLiQgOiBudWxsKTtcclxudmFyIG51bWVyYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5udW1lcmFsIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5udW1lcmFsIDogbnVsbCk7XHJcblxyXG5cclxudmFyIE1hcFNlY3Rpb24gPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vTWFwU2VjdGlvbi5qc3gnKSk7XHJcblxyXG52YXIgc3RhdGljRGF0YSA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKTtcclxudmFyIG9iamVjdGl2ZXNEYXRhID0gc3RhdGljRGF0YS5vYmplY3RpdmVzO1xyXG52YXIgY29sb3JNYXAgPSBbJ3JlZCcsICdncmVlbicsICdibHVlJ107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhdGVOb3cgPSB0aGlzLnByb3BzLmRhdGVOb3c7XHJcblx0XHR2YXIgZGV0YWlscyA9IHRoaXMucHJvcHMuZGV0YWlscztcclxuXHRcdHZhciBndWlsZHMgPSB0aGlzLnByb3BzLmd1aWxkcztcclxuXHRcdHZhciBtYXRjaFdvcmxkcyA9IHRoaXMucHJvcHMubWF0Y2hXb3JsZHM7XHJcblx0XHR2YXIgbWFwc01ldGEgPSB0aGlzLnByb3BzLm1hcHNNZXRhO1xyXG5cdFx0dmFyIG1hcEluZGV4ID0gdGhpcy5wcm9wcy5tYXBJbmRleDtcclxuXHJcblx0XHR2YXIgb3duZXJzID0gZGV0YWlscy5vYmplY3RpdmVzLm93bmVycztcclxuXHRcdHZhciBjbGFpbWVycyA9IGRldGFpbHMub2JqZWN0aXZlcy5jbGFpbWVycztcclxuXHJcblx0XHR2YXIgc2NvcmVzID0gXy5tYXAoZGV0YWlscy5tYXBzLnNjb3Jlc1ttYXBJbmRleF0sIGZ1bmN0aW9uKHNjb3JlKSB7cmV0dXJuIG51bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJyk7fSk7XHJcblx0XHR2YXIgdGlja3MgPSBkZXRhaWxzLm1hcHMudGlja3NbbWFwSW5kZXhdO1xyXG5cdFx0dmFyIGhvbGRpbmdzID0gZGV0YWlscy5tYXBzLmhvbGRpbmdzW21hcEluZGV4XTtcclxuXHJcblx0XHQvLyB2YXIgbWFwQ29uZmlnID0gdGhpcy5wcm9wcy5tYXBDb25maWc7XHJcblx0XHQvLyB2YXIgbWFwU2NvcmVzID0gdGhpcy5wcm9wcy5tYXBzU2NvcmVzW21hcENvbmZpZy5tYXBJbmRleF07XHJcblx0XHQvLyB2YXIgbWFwTmFtZSA9IHRoaXMucHJvcHMubWFwTmFtZTtcclxuXHRcdC8vIHZhciBtYXBDb2xvciA9IHRoaXMucHJvcHMubWFwQ29sb3I7XHJcblxyXG5cclxuXHRcdHZhciBtZXRhSW5kZXggPSBbMywwLDIsMV07IC8vIG91dHB1dCBpbiBkaWZmZXJlbnQgb3JkZXIgdGhhbiBvcmlnaW5hbCBkYXRhXHJcblxyXG5cdFx0dmFyIG1hcE1ldGEgPSBtYXBzTWV0YVttZXRhSW5kZXhbbWFwSW5kZXhdXTtcclxuXHRcdHZhciBtYXBOYW1lID0gbWFwTWV0YS5uYW1lO1xyXG5cdFx0dmFyIG1hcENvbG9yID0gbWFwTWV0YS5jb2xvcjtcclxuXHRcdHZhciBtYXBDb25maWcgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV9tYXBbbWFwSW5kZXhdO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJtYXBcIn0sIFxyXG5cclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwibWFwU2NvcmVzXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5oMih7Y2xhc3NOYW1lOiAndGVhbSAnICsgbWFwQ29sb3IsIG9uQ2xpY2s6IHRoaXMub25UaXRsZUNsaWNrfSwgXHJcblx0XHRcdFx0XHRcdG1hcE5hbWVcclxuXHRcdFx0XHRcdCksIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnVsKHtjbGFzc05hbWU6IFwibGlzdC1pbmxpbmVcIn0sIFxyXG5cdFx0XHRcdFx0XHRfLm1hcChzY29yZXMsIGZ1bmN0aW9uKHNjb3JlLCBzY29yZUluZGV4KSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7a2V5OiAnbWFwLXNjb3JlLScgKyBzY29yZUluZGV4LCBjbGFzc05hbWU6IGdldFNjb3JlQ2xhc3Moc2NvcmVJbmRleCl9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0c2NvcmVcclxuXHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdCksIFxyXG5cclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicm93XCJ9LCBcclxuXHRcdFx0XHRcdF8ubWFwKG1hcENvbmZpZy5zZWN0aW9ucywgZnVuY3Rpb24obWFwU2VjdGlvbiwgc2VjSW5kZXgpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBzZWN0aW9uQ2xhc3MgPSBbXHJcblx0XHRcdFx0XHRcdFx0J2NvbC1tZC0yNCcsXHJcblx0XHRcdFx0XHRcdFx0J21hcC1zZWN0aW9uJyxcclxuXHRcdFx0XHRcdFx0XTtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChtYXBDb25maWcua2V5ID09PSAnQ2VudGVyJykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChtYXBTZWN0aW9uLmxhYmVsID09PSAnQ2FzdGxlJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0c2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS0yNCcpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25DbGFzcy5wdXNoKCdjb2wtc20tOCcpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uQ2xhc3MucHVzaCgnY29sLXNtLTgnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IHNlY3Rpb25DbGFzcy5qb2luKCcgJyksIGtleTogbWFwQ29uZmlnLmtleSArICctJyArIG1hcFNlY3Rpb24ubGFiZWx9LCBcclxuXHRcdFx0XHRcdFx0XHRcdE1hcFNlY3Rpb24oe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRlTm93OiBkYXRlTm93LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwU2VjdGlvbjogbWFwU2VjdGlvbiwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdG93bmVyczogb3duZXJzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xhaW1lcnM6IGNsYWltZXJzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3VpbGRzOiBndWlsZHN9XHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHQpXHJcblxyXG5cclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG5cclxuXHRvblRpdGxlQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciAkbWFwcyA9ICQoJy5tYXAnKTtcclxuXHRcdHZhciAkbWFwID0gJChlLnRhcmdldCkuY2xvc2VzdCgnLm1hcCcsICRtYXBzKTtcclxuXHJcblx0XHR2YXIgaGFzRm9jdXMgPSAkbWFwLmhhc0NsYXNzKCdtYXAtZm9jdXMnKTtcclxuXHJcblxyXG5cdFx0aWYoIWhhc0ZvY3VzKSB7XHJcblx0XHRcdCRtYXBcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ21hcC1mb2N1cycpXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtYmx1cicpO1xyXG5cclxuXHRcdFx0JG1hcHMubm90KCRtYXApXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtZm9jdXMnKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnbWFwLWJsdXInKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQkbWFwc1xyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnbWFwLWZvY3VzJylcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ21hcC1ibHVyJyk7XHJcblxyXG5cdFx0fVxyXG5cdH0sXHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNjb3JlQ2xhc3Moc2NvcmVJbmRleCkge1xyXG5cdHJldHVybiBbJ3RlYW0nLCBjb2xvck1hcFtzY29yZUluZGV4XV0uam9pbignICcpO1xyXG59XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG52YXIgbW9tZW50ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cubW9tZW50IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5tb21lbnQgOiBudWxsKTtcclxuXHJcbiBcclxudmFyIFNwcml0ZSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9TcHJpdGUuanN4JykpO1xyXG52YXIgQXJyb3cgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vQXJyb3cuanN4JykpO1xyXG5cclxudmFyIHN0YXRpY0RhdGEgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcbnZhciBvYmplY3RpdmVzTmFtZXMgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV9uYW1lcztcclxudmFyIG9iamVjdGl2ZXNUeXBlcyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX3R5cGVzO1xyXG52YXIgb2JqZWN0aXZlc01ldGEgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV9tZXRhO1xyXG52YXIgb2JqZWN0aXZlc0xhYmVscyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX2xhYmVscztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYXBwU3RhdGUgPSB3aW5kb3cuYXBwLnN0YXRlO1xyXG5cclxuXHRcdHZhciBkYXRlTm93ID0gdGhpcy5wcm9wcy5kYXRlTm93O1xyXG5cdFx0dmFyIG9iamVjdGl2ZUlkID0gdGhpcy5wcm9wcy5vYmplY3RpdmVJZDtcclxuXHRcdHZhciBvd25lciA9IHRoaXMucHJvcHMub3duZXI7XHJcblx0XHR2YXIgY2xhaW1lciA9IHRoaXMucHJvcHMuY2xhaW1lcjtcclxuXHRcdHZhciBndWlsZHMgPSB0aGlzLnByb3BzLmd1aWxkcztcclxuXHJcblxyXG5cdFx0aWYgKCFfLmhhcyhvYmplY3RpdmVzTWV0YSwgb2JqZWN0aXZlSWQpKSB7XHJcblx0XHRcdC8vIHNob3J0IGNpcmN1aXRcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG9NZXRhID0gb2JqZWN0aXZlc01ldGFbb2JqZWN0aXZlSWRdO1xyXG5cdFx0dmFyIG9OYW1lID0gb2JqZWN0aXZlc05hbWVzW29iamVjdGl2ZUlkXTtcclxuXHRcdHZhciBvTGFiZWwgPSBvYmplY3RpdmVzTGFiZWxzW29iamVjdGl2ZUlkXTtcclxuXHRcdHZhciBvVHlwZSA9IG9iamVjdGl2ZXNUeXBlc1tvTWV0YS50eXBlXTtcclxuXHJcblx0XHR2YXIgZXhwaXJlcyA9IG93bmVyLnRpbWVzdGFtcCArICg1ICogNjApO1xyXG5cdFx0dmFyIHRpbWVyQWN0aXZlID0gKGV4cGlyZXMgPj0gZGF0ZU5vdyArIDUpOyAvLyBzaG93IGZvciA1IHNlY29uZHMgYWZ0ZXIgZXhwaXJpbmdcclxuXHRcdHZhciBzZWNvbmRzUmVtYWluaW5nID0gZXhwaXJlcyAtIGRhdGVOb3c7XHJcblx0XHR2YXIgZXhwaXJhdGlvbiA9IG1vbWVudChzZWNvbmRzUmVtYWluaW5nICogMTAwMCk7XHJcblxyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKG9iamVjdGl2ZS5sYXN0Q2FwLCBvYmplY3RpdmUuZXhwaXJlcywgbm93LCBvYmplY3RpdmUuZXhwaXJlcyA+IG5vdyk7XHJcblxyXG5cdFx0dmFyIGNsYXNzTmFtZSA9IFtcclxuXHRcdFx0J29iamVjdGl2ZScsXHJcblx0XHRcdCd0ZWFtJywgXHJcblx0XHRcdG93bmVyLndvcmxkLFxyXG5cdFx0XS5qb2luKCcgJyk7XHJcblxyXG5cdFx0dmFyIHRpbWVyQ2xhc3MgPSBbXHJcblx0XHRcdCd0aW1lcicsXHJcblx0XHRcdCh0aW1lckFjdGl2ZSkgPyAnYWN0aXZlJyA6ICdpbmFjdGl2ZScsXHJcblx0XHRdLmpvaW4oJyAnKTtcclxuXHJcblx0XHR2YXIgdGFnQ2xhc3MgPSBbXHJcblx0XHRcdCd0YWcnLFxyXG5cdFx0XS5qb2luKCcgJyk7XHJcblxyXG5cdFx0dmFyIHRpbWVySHRtbCA9ICh0aW1lckFjdGl2ZSkgPyBleHBpcmF0aW9uLmZvcm1hdCgnbTpzcycpIDogJzA6MDAnO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogY2xhc3NOYW1lfSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS1pY29uc1wifSwgXHJcblx0XHRcdFx0XHRBcnJvdyh7b01ldGE6IG9NZXRhfSksIFxyXG4gXHRcdFx0XHRcdFNwcml0ZSh7dHlwZTogb1R5cGUubmFtZSwgY29sb3I6IG93bmVyLndvcmxkfSlcclxuXHRcdFx0XHQpLCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwib2JqZWN0aXZlLWxhYmVsXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwsIG9MYWJlbFthcHBTdGF0ZS5sYW5nLnNsdWddKVxyXG5cdFx0XHRcdCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJvYmplY3RpdmUtc3RhdGVcIn0sIFxyXG5cdFx0XHRcdFx0cmVuZGVyR3VpbGQoY2xhaW1lciwgZ3VpbGRzKSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiB0aW1lckNsYXNzfSwgdGltZXJIdG1sKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHJlbmRlckd1aWxkKGNsYWltZXIsIGd1aWxkcyl7XHJcblx0aWYgKCFjbGFpbWVyKSB7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR2YXIgZ3VpbGQgPSBndWlsZHNbY2xhaW1lci5ndWlsZF07XHJcblxyXG5cdFx0dmFyIGd1aWxkQ2xhc3MgPSBbXHJcblx0XHRcdCdndWlsZCcsXHJcblx0XHRcdCd0YWcnLFxyXG5cdFx0XHQncGVuZGluZydcclxuXHRcdF0uam9pbignICcpO1xyXG5cclxuXHRcdGlmKCFndWlsZCkge1xyXG5cdFx0XHRyZXR1cm4gUmVhY3QuRE9NLnNwYW4oe2NsYXNzTmFtZTogZ3VpbGRDbGFzc30sIFJlYWN0LkRPTS5pKHtjbGFzc05hbWU6IFwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCJ9KSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIFJlYWN0LkRPTS5hKHtjbGFzc05hbWU6IGd1aWxkQ2xhc3MsIGhyZWY6ICcjJyArIGNsYWltZXIuZ3VpbGQsIHRpdGxlOiBndWlsZC5ndWlsZF9uYW1lfSwgZ3VpbGQudGFnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5fIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5fIDogbnVsbCk7XHJcblxyXG5cclxudmFyIE1hcE9iamVjdGl2ZSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9NYXBPYmplY3RpdmUuanN4JykpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGRhdGVOb3cgPSB0aGlzLnByb3BzLmRhdGVOb3c7XHJcblx0XHR2YXIgbWFwU2VjdGlvbiA9IHRoaXMucHJvcHMubWFwU2VjdGlvbjtcclxuXHRcdHZhciBvd25lcnMgPSB0aGlzLnByb3BzLm93bmVycztcclxuXHRcdHZhciBjbGFpbWVycyA9IHRoaXMucHJvcHMuY2xhaW1lcnM7XHJcblx0XHR2YXIgZ3VpbGRzID0gdGhpcy5wcm9wcy5ndWlsZHM7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0UmVhY3QuRE9NLnVsKHtjbGFzc05hbWU6IFwibGlzdC11bnN0eWxlZFwifSwgXHJcblx0XHRcdFx0Xy5tYXAobWFwU2VjdGlvbi5vYmplY3RpdmVzLCBmdW5jdGlvbihvYmplY3RpdmVJZCkge1xyXG5cclxuXHRcdFx0XHRcdHZhciBvd25lciA9IG93bmVyc1tvYmplY3RpdmVJZF07XHJcblx0XHRcdFx0XHR2YXIgY2xhaW1lciA9IGNsYWltZXJzW29iamVjdGl2ZUlkXTtcclxuXHRcdFx0XHRcdC8vIHZhciBjbGFpbWVyID0gKGNsYWltZXIgJiYgZ3VpbGRzW2d1aWxkSWRdKSA/IGd1aWxkc1tndWlsZElkXSA6IG51bGw7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmxpKHtrZXk6IG9iamVjdGl2ZUlkLCBpZDogJ29iamVjdGl2ZS0nICsgb2JqZWN0aXZlSWR9LCBcclxuXHRcdFx0XHRcdFx0XHRNYXBPYmplY3RpdmUoe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0ZU5vdzogZGF0ZU5vdywgXHJcblx0XHRcdFx0XHRcdFx0XHRvYmplY3RpdmVJZDogb2JqZWN0aXZlSWQsIFxyXG5cdFx0XHRcdFx0XHRcdFx0b3duZXI6IG93bmVyLCBcclxuXHRcdFx0XHRcdFx0XHRcdGNsYWltZXI6IGNsYWltZXIsIFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VpbGRzOiBndWlsZHN9XHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH0sXHJcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG52YXIgXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Ll8gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLl8gOiBudWxsKTtcclxuXHJcblxyXG52YXIgTWFwRGV0YWlscyA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9NYXBEZXRhaWxzLmpzeCcpKTtcclxudmFyIExvZyA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9sb2cvTG9nLmpzeCcpKTtcclxuXHJcbnZhciBsaWJEYXRlID0gcmVxdWlyZSgnLi4vLi4vbGliL2RhdGUuanMnKTtcclxuXHJcbnZhciBzdGF0aWNEYXRhID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG52YXIgbWFwc0NvbmZpZyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX21hcDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblxyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge2RhdGVOb3c6IGxpYkRhdGUuZGF0ZU5vdygpfTtcclxuXHR9LFxyXG5cdHRpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7ZGF0ZU5vdzogbGliRGF0ZS5kYXRlTm93KCl9KTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0aGlzLnRpY2ssIDEwMDApO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcclxuXHR9LFxyXG5cclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmICghdGhpcy5wcm9wcy5kZXRhaWxzLmluaXRpYWxpemVkKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBkYXRlTm93ID0gdGhpcy5zdGF0ZS5kYXRlTm93O1xyXG5cdFx0dmFyIGRldGFpbHMgPSB0aGlzLnByb3BzLmRldGFpbHM7XHJcblx0XHR2YXIgbWF0Y2hXb3JsZHMgPSB0aGlzLnByb3BzLm1hdGNoV29ybGRzO1xyXG5cdFx0dmFyIG1hcHNNZXRhID0gdGhpcy5wcm9wcy5tYXBzTWV0YTtcclxuXHRcdHZhciBndWlsZHMgPSB0aGlzLnByb3BzLmd1aWxkcztcclxuXHRcdFxyXG5cdFx0dmFyIGV2ZW50SGlzdG9yeSA9IGRldGFpbHMuaGlzdG9yeTtcclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0UmVhY3QuRE9NLmRpdih7aWQ6IFwibWFwc1wifSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInJvd1wifSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLW1kLTZcIn0sIFxyXG5cdFx0XHRcdFx0XHRNYXBEZXRhaWxzKHtcclxuXHRcdFx0XHRcdFx0XHRkYXRlTm93OiBkYXRlTm93LCBcclxuXHRcdFx0XHRcdFx0XHRkZXRhaWxzOiBkZXRhaWxzLCBcclxuXHRcdFx0XHRcdFx0XHRndWlsZHM6IGd1aWxkcywgXHJcblx0XHRcdFx0XHRcdFx0bWF0Y2hXb3JsZHM6IG1hdGNoV29ybGRzLCBcclxuXHRcdFx0XHRcdFx0XHRtYXBzTWV0YTogbWFwc01ldGEsIFxyXG5cdFx0XHRcdFx0XHRcdG1hcEluZGV4OiAwfVxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQpLCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJjb2wtbWQtMThcIn0sIFxyXG5cclxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInJvd1wifSwgXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImNvbC1tZC04XCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRcdE1hcERldGFpbHMoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRlTm93OiBkYXRlTm93LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGV0YWlsczogZGV0YWlscywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGd1aWxkczogZ3VpbGRzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWF0Y2hXb3JsZHM6IG1hdGNoV29ybGRzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwc01ldGE6IG1hcHNNZXRhLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwSW5kZXg6IDF9XHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImNvbC1tZC04XCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRcdE1hcERldGFpbHMoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRlTm93OiBkYXRlTm93LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGV0YWlsczogZGV0YWlscywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGd1aWxkczogZ3VpbGRzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWF0Y2hXb3JsZHM6IG1hdGNoV29ybGRzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwc01ldGE6IG1hcHNNZXRhLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwSW5kZXg6IDJ9XHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImNvbC1tZC04XCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRcdE1hcERldGFpbHMoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRlTm93OiBkYXRlTm93LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGV0YWlsczogZGV0YWlscywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGd1aWxkczogZ3VpbGRzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWF0Y2hXb3JsZHM6IG1hdGNoV29ybGRzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwc01ldGE6IG1hcHNNZXRhLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwSW5kZXg6IDN9XHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHQpLCBcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJyb3dcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJjb2wtbWQtMjRcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0TG9nKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0ZU5vdzogZGF0ZU5vdywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGd1aWxkczogZ3VpbGRzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZXZlbnRIaXN0b3J5OiBldmVudEhpc3RvcnksIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXRjaFdvcmxkczogbWF0Y2hXb3JsZHMsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBzTWV0YTogbWFwc01ldGF9XHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHQpXHJcblxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdCApXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fSxcclxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG52YXIgbnVtZXJhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Lm51bWVyYWwgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLm51bWVyYWwgOiBudWxsKTtcclxuXHJcbnZhciBTcHJpdGUgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vU3ByaXRlLmpzeCcpKTtcclxudmFyIHN0YXRpY0RhdGEgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcbnZhciBvYmplY3RpdmVUeXBlcyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX3R5cGVzO1xyXG5cclxudmFyIGNvbG9ycyA9IFsncmVkJywgJ2JsdWUnLCAnZ3JlZW4nXTtcclxudmFyIGNvbG9yTWFwID0ge1wicmVkXCI6IDAsIFwiZ3JlZW5cIjogMSwgXCJibHVlXCI6IDJ9O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbGFuZyA9IHdpbmRvdy5hcHAuc3RhdGUubGFuZztcclxuXHRcdHZhciBsYW5nU2x1ZyA9IGxhbmcuc2x1ZztcclxuXHJcblx0XHR2YXIgbWF0Y2ggPSB0aGlzLnByb3BzLm1hdGNoO1xyXG5cdFx0dmFyIHNjb3JlcyA9IF8ubWFwKG1hdGNoLnNjb3JlcywgZnVuY3Rpb24oc2NvcmUpe3JldHVybiBudW1lcmFsKHNjb3JlKS5mb3JtYXQoJzAsMCcpOyB9KTtcclxuXHRcdHZhciB0aWNrcyA9IG1hdGNoLnRpY2tzO1xyXG5cdFx0dmFyIGhvbGRpbmdzID0gbWF0Y2guaG9sZGluZ3M7XHJcblx0XHR2YXIgbWF0Y2hXb3JsZHMgPSB0aGlzLnByb3BzLm1hdGNoV29ybGRzO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJyb3dcIiwgaWQ6IFwic2NvcmVib2FyZHNcIn0sIFxyXG5cdFx0XHRcdF8ubWFwKHNjb3JlcywgZnVuY3Rpb24oc2NvcmUsIHNjb3JlSW5kZXgpIHtcclxuXHJcblx0XHRcdFx0XHR2YXIgc2NvcmVib2FyZENsYXNzID0gW1xyXG5cdFx0XHRcdFx0XHQnc2NvcmVib2FyZCcsXHJcblx0XHRcdFx0XHRcdCd0ZWFtLWJnJyxcclxuXHRcdFx0XHRcdFx0J3RlYW0nLFxyXG5cdFx0XHRcdFx0XHQndGV4dC1jZW50ZXInLFxyXG5cdFx0XHRcdFx0XHRjb2xvcnNbc2NvcmVJbmRleF1cclxuXHRcdFx0XHRcdF0uam9pbignICcpO1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJjb2wtc20tOFwiLCBrZXk6ICd0b3RhbC1zY29yZS0nICsgc2NvcmVJbmRleH0sIFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogc2NvcmVib2FyZENsYXNzfSwgXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmgxKG51bGwsIG1hdGNoV29ybGRzW3Njb3JlSW5kZXhdLm5hbWUpLCBcclxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5oMihudWxsLCBzY29yZSwgXCIgK1wiLCB0aWNrc1tzY29yZUluZGV4XSksIFxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS51bCh7Y2xhc3NOYW1lOiBcImxpc3QtaW5saW5lXCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0Xy5tYXAoaG9sZGluZ3Nbc2NvcmVJbmRleF0sIGZ1bmN0aW9uKGhvbGRpbmcsIGl4SG9sZGluZykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBvVHlwZSA9IG9iamVjdGl2ZVR5cGVzW2l4SG9sZGluZyArIDFdO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmxpKHtrZXk6IGl4SG9sZGluZ30sIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTcHJpdGUoe3R5cGU6IG9UeXBlLm5hbWUsIGNvbG9yOiBjb2xvcnNbc2NvcmVJbmRleF19KSwgXCIgeCBcIiwgaG9sZGluZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG4vKlxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQ8dWwgY2xhc3NOYW1lPVwibGlzdC1pbmxpbmVcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0e18ubWFwKGhvbGRpbmdzLCBmdW5jdGlvbihob2xkaW5nLCBpeEhvbGRpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgb3QgPSBvYmplY3RpdmVUeXBlc1tpeEhvbGRpbmcgKyAxXTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxsaSBrZXk9eyd0eXBlLWhvbGRpbmdzLScgKyBvdC5uYW1lfT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PFNwcml0ZSB0eXBlPXtvdC5uYW1lfSBjb2xvcj17Y29sb3JzW3Njb3JlSW5kZXhdfSAvPiB4IHtvdC5ob2xkaW5nc1tzY29yZUluZGV4XX1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSl9XHJcblx0XHRcdFx0XHRcdFx0XHQ8L3VsPlxyXG4qL1xufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqIEBqc3ggUmVhY3QuRE9NICovLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBSZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlJlYWN0IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5SZWFjdCA6IG51bGwpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHR5cGUgPSB0aGlzLnByb3BzLnR5cGU7XHJcblx0XHR2YXIgY29sb3IgPSB0aGlzLnByb3BzLmNvbG9yO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IFsnc3ByaXRlJywgdHlwZSwgY29sb3JdLmpvaW4oJyAnKX0pXHJcblx0XHQpO1xyXG5cdH1cclxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG5cclxuXHJcbnZhciBPYmplY3RpdmUgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vT2JqZWN0aXZlLmpzeCcpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGF0ZU5vdyA9IHRoaXMucHJvcHMuZGF0ZU5vdztcclxuXHRcdHZhciBldmVudEhpc3RvcnkgPSB0aGlzLnByb3BzLmV2ZW50SGlzdG9yeTtcclxuXHRcdHZhciBtYXBzTWV0YSA9IHRoaXMucHJvcHMubWFwc01ldGE7XHJcblxyXG5cdFx0dmFyIGd1aWxkcyA9IF9cclxuXHRcdFx0LmNoYWluKHRoaXMucHJvcHMuZ3VpbGRzKVxyXG5cdFx0XHQubWFwKGZ1bmN0aW9uKGd1aWxkKXtcclxuXHRcdFx0XHRndWlsZC5jbGFpbXMgPSBfLmNoYWluKGV2ZW50SGlzdG9yeSlcclxuXHRcdFx0XHRcdC5maWx0ZXIoZnVuY3Rpb24oZW50cnkpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gKGVudHJ5LnR5cGUgPT09ICdjbGFpbScgJiYgZW50cnkuZ3VpbGQgPT09IGd1aWxkLmd1aWxkX2lkKTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQuc29ydEJ5KCd0aW1lc3RhbXAnKVxyXG5cdFx0XHRcdFx0LnJldmVyc2UoKVxyXG5cdFx0XHRcdFx0LnZhbHVlKCk7XHJcblxyXG5cdFx0XHRcdGd1aWxkLmxhc3RDbGFpbSA9IChndWlsZC5jbGFpbXMgJiYgZ3VpbGQuY2xhaW1zLmxlbmd0aCkgPyBndWlsZC5jbGFpbXNbMF0udGltZXN0YW1wIDogMDtcclxuXHRcdFx0XHRyZXR1cm4gZ3VpbGQ7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5zb3J0QnkoJ2d1aWxkX25hbWUnKVxyXG5cdFx0XHQuc29ydEJ5KGZ1bmN0aW9uKGd1aWxkKXtcclxuXHRcdFx0XHRyZXR1cm4gLWd1aWxkLmxhc3RDbGFpbTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LnZhbHVlKCk7XHJcblxyXG5cclxuXHRcdHZhciBndWlsZHNMaXN0ID0gXy5tYXAoZ3VpbGRzLCBmdW5jdGlvbihndWlsZCwgZ3VpbGRJZCkge1xyXG5cdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2tleTogZ3VpbGQuZ3VpbGRfaWQsIGlkOiBndWlsZC5ndWlsZF9pZCwgY2xhc3NOYW1lOiBcImd1aWxkXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJyb3dcIn0sIFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLXNtLTRcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5pbWcoe2NsYXNzTmFtZTogXCJlbWJsZW1cIiwgc3JjOiBnZXRFbWJsZW1TcmMoZ3VpbGQuZ3VpbGRfbmFtZSl9KVxyXG5cdFx0XHRcdFx0XHQpLCBcclxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImNvbC1zbS0yMFwifSwgXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmgxKG51bGwsIGd1aWxkLmd1aWxkX25hbWUsIFwiIFtcIiwgZ3VpbGQudGFnLCBcIl1cIiksIFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS51bCh7Y2xhc3NOYW1lOiBcImxpc3QtdW5zdHlsZWRcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0Xy5tYXAoZ3VpbGQuY2xhaW1zLCBmdW5jdGlvbihlbnRyeSwgaXhFbnRyeSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7a2V5OiBndWlsZC5ndWlsZF9pZCArICctJyArIGl4RW50cnl9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdE9iamVjdGl2ZSh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVudHJ5OiBlbnRyeSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl4RW50cnk6IGl4RW50cnksIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtYXBzTWV0YTogbWFwc01ldGF9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHQpXHJcblx0XHRcdCk7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImxpc3QtdW5zdHlsZWRcIiwgaWQ6IFwiZ3VpbGRzXCJ9LCBcclxuXHRcdFx0XHRndWlsZHNMaXN0XHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fSxcclxufSk7XHJcblxyXG5mdW5jdGlvbiBnZXRFbWJsZW1TcmMoZ3VpbGROYW1lKSB7XHJcblx0cmV0dXJuICdodHRwOi8vZ3VpbGRzLmd3Mncydy5jb20vZ3VpbGRzLycgKyBlbmNvZGVVUklDb21wb25lbnQoZ3VpbGROYW1lLnJlcGxhY2UoLyAvZywgJy0nKSkgKyAnLzY0LnN2Zyc7XHJcbn1cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5fIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5fIDogbnVsbCk7XHJcbnZhciBtb21lbnQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5tb21lbnQgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLm1vbWVudCA6IG51bGwpO1xyXG5cclxuXHJcbnZhciBTcHJpdGUgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4uL1Nwcml0ZS5qc3gnKSk7XHJcbnZhciBBcnJvdyA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi4vQXJyb3cuanN4JykpO1xyXG5cclxuXHJcbnZhciBzdGF0aWNEYXRhID0gcmVxdWlyZSgnZ3cydzJ3LXN0YXRpYycpO1xyXG52YXIgb2JqZWN0aXZlc05hbWVzID0gc3RhdGljRGF0YS5vYmplY3RpdmVfbmFtZXM7XHJcbnZhciBvYmplY3RpdmVzVHlwZXMgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV90eXBlcztcclxudmFyIG9iamVjdGl2ZXNNZXRhID0gc3RhdGljRGF0YS5vYmplY3RpdmVfbWV0YTtcclxudmFyIG9iamVjdGl2ZXNMYWJlbHMgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV9sYWJlbHM7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGFwcFN0YXRlID0gd2luZG93LmFwcC5zdGF0ZTtcclxuXHJcblx0XHR2YXIgZW50cnkgPSB0aGlzLnByb3BzLmVudHJ5O1xyXG5cdFx0dmFyIGl4RW50cnkgPSB0aGlzLnByb3BzLml4RW50cnk7XHJcblx0XHR2YXIgZ3VpbGRzID0gdGhpcy5wcm9wcy5ndWlsZHM7XHJcblx0XHR2YXIgbWFwc01ldGEgPSB0aGlzLnByb3BzLm1hcHNNZXRhO1xyXG5cclxuXHJcblx0XHRpZiAoIV8uaGFzKG9iamVjdGl2ZXNNZXRhLCBlbnRyeS5vYmplY3RpdmVJZCkpIHtcclxuXHRcdFx0Ly8gc2hvcnQgY2lyY3VpdFxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgb01ldGEgPSBvYmplY3RpdmVzTWV0YVtlbnRyeS5vYmplY3RpdmVJZF07XHJcblx0XHR2YXIgb05hbWUgPSBvYmplY3RpdmVzTmFtZXNbZW50cnkub2JqZWN0aXZlSWRdO1xyXG5cdFx0dmFyIG9MYWJlbCA9IG9iamVjdGl2ZXNMYWJlbHNbZW50cnkub2JqZWN0aXZlSWRdO1xyXG5cdFx0dmFyIG9UeXBlID0gb2JqZWN0aXZlc1R5cGVzW29NZXRhLnR5cGVdO1xyXG5cdFx0XHJcblx0XHR2YXIgdGltZXN0YW1wID0gbW9tZW50KGVudHJ5LnRpbWVzdGFtcCAqIDEwMDApO1xyXG5cclxuXHJcblx0XHR2YXIgY2xhc3NOYW1lID0gW1xyXG5cdFx0XHQnb2JqZWN0aXZlJyxcclxuXHRcdFx0J3RlYW0nLCBcclxuXHRcdFx0ZW50cnkud29ybGQsXHJcblx0XHRdLmpvaW4oJyAnKTtcclxuXHJcblx0XHR2YXIgbWFwTWV0YSA9IG1hcHNNZXRhW29NZXRhLm1hcF07XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogY2xhc3NOYW1lLCBrZXk6IGl4RW50cnl9LCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwib2JqZWN0aXZlLXJlbGF0aXZlXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwsIHRpbWVzdGFtcC50d2l0dGVyU2hvcnQoKSlcclxuXHRcdFx0XHQpLCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwib2JqZWN0aXZlLXRpbWVzdGFtcFwifSwgXHJcblx0XHRcdFx0XHR0aW1lc3RhbXAuZm9ybWF0KCdoaDptbTpzcycpXHJcblx0XHRcdFx0KSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS1tYXBcIn0sIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnNwYW4oe3RpdGxlOiBtYXBNZXRhLm5hbWV9LCBtYXBNZXRhLmFiYnIpXHJcblx0XHRcdFx0KSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS1pY29uc1wifSwgXHJcblx0XHRcdFx0XHRBcnJvdyh7b01ldGE6IG9NZXRhfSksIFxyXG4gXHRcdFx0XHRcdFNwcml0ZSh7dHlwZTogb1R5cGUubmFtZSwgY29sb3I6IGVudHJ5LndvcmxkfSlcclxuXHRcdFx0XHQpLCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwib2JqZWN0aXZlLWxhYmVsXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwsIG9MYWJlbFthcHBTdGF0ZS5sYW5nLnNsdWddKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxudmFyIF8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5fIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5fIDogbnVsbCk7XHJcbnZhciAkID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuJCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuJCA6IG51bGwpO1xyXG5cclxudmFyIE9iamVjdGl2ZSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9PYmplY3RpdmUuanN4JykpO1xyXG5cclxudmFyIHN0YXRpY0RhdGEgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcbnZhciBvYmplY3RpdmVzTWV0YSA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX21ldGE7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bWFwRmlsdGVyOiAnYWxsJyxcclxuXHRcdFx0ZXZlbnRGaWx0ZXI6ICdhbGwnLFxyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhdGVOb3cgPSB0aGlzLnByb3BzLmRhdGVOb3c7XHJcblx0XHR2YXIgZ3VpbGRzID0gdGhpcy5wcm9wcy5ndWlsZHM7XHJcblx0XHR2YXIgbWF0Y2hXb3JsZHMgPSB0aGlzLnByb3BzLm1hdGNoV29ybGRzO1xyXG5cdFx0dmFyIG1hcHNNZXRhID0gdGhpcy5wcm9wcy5tYXBzTWV0YTtcclxuXHJcblx0XHR2YXIgc2V0V29ybGQgPSB0aGlzLnNldFdvcmxkO1xyXG5cdFx0dmFyIHNldEV2ZW50ID0gdGhpcy5zZXRFdmVudDtcclxuXHJcblx0XHR2YXIgZXZlbnRGaWx0ZXIgPSB0aGlzLnN0YXRlLmV2ZW50RmlsdGVyO1xyXG5cdFx0dmFyIG1hcEZpbHRlciA9IHRoaXMuc3RhdGUubWFwRmlsdGVyO1xyXG5cclxuXHRcdHZhciBldmVudEhpc3RvcnkgPSBfLmNoYWluKHRoaXMucHJvcHMuZXZlbnRIaXN0b3J5KVxyXG5cdFx0XHQuZmlsdGVyKGZ1bmN0aW9uKGVudHJ5KSB7XHJcblx0XHRcdFx0cmV0dXJuIChldmVudEZpbHRlciA9PSAnYWxsJyB8fCBlbnRyeS50eXBlID09IGV2ZW50RmlsdGVyKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmZpbHRlcihmdW5jdGlvbihlbnRyeSkge1xyXG5cdFx0XHRcdHZhciBvTWV0YSA9IG9iamVjdGl2ZXNNZXRhW2VudHJ5Lm9iamVjdGl2ZUlkXTtcclxuXHRcdFx0XHRyZXR1cm4gKG1hcEZpbHRlciA9PSAnYWxsJyB8fCBvTWV0YS5tYXAgPT0gbWFwRmlsdGVyKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LnNvcnRCeSgndGltZXN0YW1wJylcclxuXHRcdFx0LnJldmVyc2UoKVxyXG5cdFx0XHQubWFwKGZ1bmN0aW9uKGVudHJ5LCBpeEVudHJ5KSB7XHJcblx0XHRcdFx0dmFyIGtleSA9IGVudHJ5LnRpbWVzdGFtcCArICctJyArIGVudHJ5Lm9iamVjdGl2ZUlkICArICctJyArIGVudHJ5LnR5cGU7IFxyXG5cdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRSZWFjdC5ET00ubGkoe2tleToga2V5LCBjbGFzc05hbWU6IFwidHJhbnNpdGlvblwifSwgXHJcblx0XHRcdFx0XHRcdE9iamVjdGl2ZSh7XHJcblx0XHRcdFx0XHRcdFx0ZGF0ZU5vdzogZGF0ZU5vdywgXHJcblx0XHRcdFx0XHRcdFx0ZW50cnk6IGVudHJ5LCBcclxuXHRcdFx0XHRcdFx0XHRndWlsZHM6IGd1aWxkcywgXHJcblx0XHRcdFx0XHRcdFx0aXhFbnRyeTogaXhFbnRyeSwgXHJcblx0XHRcdFx0XHRcdFx0bWF0Y2hXb3JsZHM6IG1hdGNoV29ybGRzLCBcclxuXHRcdFx0XHRcdFx0XHRtYXBzTWV0YTogbWFwc01ldGF9XHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQudmFsdWUoKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00uZGl2KHtpZDogXCJsb2ctY29udGFpbmVyXCJ9LCBcclxuXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImxvZy10YWJzXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJyb3dcIn0sIFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLXNtLTE2XCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00udWwoe2lkOiBcImxvZy1tYXAtZmlsdGVyc1wiLCBjbGFzc05hbWU6IFwibmF2IG5hdi1waWxsc1wifSwgXHJcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00ubGkoe2NsYXNzTmFtZTogKG1hcEZpbHRlciA9PSAnYWxsJykgPyAnYWN0aXZlJzogJ251bGwnfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5hKHtvbkNsaWNrOiBzZXRXb3JsZCwgJ2RhdGEtZmlsdGVyJzogXCJhbGxcIn0sIFwiQWxsXCIpXHJcblx0XHRcdFx0XHRcdFx0XHQpLCBcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRfLm1hcChbXHJcblx0XHRcdFx0XHRcdFx0XHRcdG1hcHNNZXRhWzNdLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBzTWV0YVswXSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwc01ldGFbMl0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdG1hcHNNZXRhWzFdLFxyXG5cdFx0XHRcdFx0XHRcdFx0XSwgZnVuY3Rpb24obWFwTWV0YSwgaSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7a2V5OiBtYXBNZXRhLmluZGV4LCBjbGFzc05hbWU6IChtYXBGaWx0ZXIgPT09IG1hcE1ldGEuaW5kZXgpID8gJ2FjdGl2ZSc6ICdudWxsJ30sIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe29uQ2xpY2s6IHNldFdvcmxkLCAnZGF0YS1maWx0ZXInOiBtYXBNZXRhLmluZGV4fSwgbWFwTWV0YS5uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHQpLCBcclxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImNvbC1zbS04XCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00udWwoe2lkOiBcImxvZy1ldmVudC1maWx0ZXJzXCIsIGNsYXNzTmFtZTogXCJuYXYgbmF2LXBpbGxzXCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7Y2xhc3NOYW1lOiAoZXZlbnRGaWx0ZXIgPT09ICdjbGFpbScpID8gJ2FjdGl2ZSc6ICdudWxsJ30sIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uYSh7b25DbGljazogc2V0RXZlbnQsICdkYXRhLWZpbHRlcic6IFwiY2xhaW1cIn0sIFwiQ2xhaW1zXCIpXHJcblx0XHRcdFx0XHRcdFx0XHQpLCBcclxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7Y2xhc3NOYW1lOiAoZXZlbnRGaWx0ZXIgPT09ICdjYXB0dXJlJykgPyAnYWN0aXZlJzogJ251bGwnfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5hKHtvbkNsaWNrOiBzZXRFdmVudCwgJ2RhdGEtZmlsdGVyJzogXCJjYXB0dXJlXCJ9LCBcIkNhcHR1cmVzXCIpXHJcblx0XHRcdFx0XHRcdFx0XHQpLCBcclxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7Y2xhc3NOYW1lOiAoZXZlbnRGaWx0ZXIgPT09ICdhbGwnKSA/ICdhY3RpdmUnOiAnbnVsbCd9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmEoe29uQ2xpY2s6IHNldEV2ZW50LCAnZGF0YS1maWx0ZXInOiBcImFsbFwifSwgXCJBbGxcIilcclxuXHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHQpLCBcclxuXHJcblx0XHRcdFx0UmVhY3QuRE9NLnVsKHtjbGFzc05hbWU6IFwibGlzdC11bnN0eWxlZFwiLCBpZDogXCJsb2dcIn0sIFxyXG5cdFx0XHRcdFx0ZXZlbnRIaXN0b3J5XHJcblx0XHRcdFx0KVxyXG5cclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG5cclxuXHRzZXRXb3JsZDogZnVuY3Rpb24oZSkge1xyXG5cdFx0dmFyIGZpbHRlciA9ICQoZS50YXJnZXQpLmRhdGEoJ2ZpbHRlcicpO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7bWFwRmlsdGVyOiBmaWx0ZXJ9KTtcclxuXHR9LFxyXG5cdHNldEV2ZW50OiBmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgZmlsdGVyID0gJChlLnRhcmdldCkuZGF0YSgnZmlsdGVyJyk7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtldmVudEZpbHRlcjogZmlsdGVyfSk7XHJcblx0fSxcclxufSk7XHJcblxyXG4vKlxyXG5cclxuKi9cclxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG52YXIgbW9tZW50ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cubW9tZW50IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5tb21lbnQgOiBudWxsKTtcclxuXHJcbnZhciBTcHJpdGUgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4uL1Nwcml0ZS5qc3gnKSk7XHJcbnZhciBBcnJvdyA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi4vQXJyb3cuanN4JykpO1xyXG5cclxudmFyIGxpYkRhdGUgPSByZXF1aXJlKCcuLi8uLi8uLi9saWIvZGF0ZS5qcycpO1xyXG5cclxudmFyIHN0YXRpY0RhdGEgPSByZXF1aXJlKCdndzJ3Mnctc3RhdGljJyk7XHJcbnZhciBvYmplY3RpdmVzTmFtZXMgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV9uYW1lcztcclxudmFyIG9iamVjdGl2ZXNUeXBlcyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX3R5cGVzO1xyXG52YXIgb2JqZWN0aXZlc01ldGEgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZV9tZXRhO1xyXG52YXIgb2JqZWN0aXZlc0xhYmVscyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlX2xhYmVscztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBhcHBTdGF0ZSA9IHdpbmRvdy5hcHAuc3RhdGU7XHJcblxyXG5cdFx0dmFyIGRhdGVOb3cgPSB0aGlzLnByb3BzLmRhdGVOb3c7XHJcblx0XHR2YXIgZW50cnkgPSB0aGlzLnByb3BzLmVudHJ5O1xyXG5cdFx0dmFyIGl4RW50cnkgPSB0aGlzLnByb3BzLml4RW50cnk7XHJcblx0XHR2YXIgZ3VpbGRzID0gdGhpcy5wcm9wcy5ndWlsZHM7XHJcblx0XHR2YXIgbWF0Y2hXb3JsZHMgPSB0aGlzLnByb3BzLm1hdGNoV29ybGRzO1xyXG5cdFx0dmFyIG1hcHNNZXRhID0gdGhpcy5wcm9wcy5tYXBzTWV0YTtcclxuXHJcblxyXG5cdFx0aWYgKCFfLmhhcyhvYmplY3RpdmVzTWV0YSwgZW50cnkub2JqZWN0aXZlSWQpKSB7XHJcblx0XHRcdC8vIHNob3J0IGNpcmN1aXRcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG9NZXRhID0gb2JqZWN0aXZlc01ldGFbZW50cnkub2JqZWN0aXZlSWRdO1xyXG5cdFx0dmFyIG9OYW1lID0gb2JqZWN0aXZlc05hbWVzW2VudHJ5Lm9iamVjdGl2ZUlkXTtcclxuXHRcdHZhciBvTGFiZWwgPSBvYmplY3RpdmVzTGFiZWxzW2VudHJ5Lm9iamVjdGl2ZUlkXTtcclxuXHRcdHZhciBvVHlwZSA9IG9iamVjdGl2ZXNUeXBlc1tvTWV0YS50eXBlXTtcclxuXHJcblx0XHR2YXIgZXhwaXJlcyA9IGVudHJ5LnRpbWVzdGFtcCArICg1ICogNjApO1xyXG5cdFx0dmFyIHRpbWVyQWN0aXZlID0gKGV4cGlyZXMgPj0gZGF0ZU5vdyArIDUpOyAvLyBzaG93IGZvciA1IHNlY29uZHMgYWZ0ZXIgZXhwaXJpbmdcclxuXHRcdHZhciBzZWNvbmRzUmVtYWluaW5nID0gZXhwaXJlcyAtIGRhdGVOb3c7XHJcblx0XHR2YXIgZXhwaXJhdGlvbiA9IG1vbWVudChzZWNvbmRzUmVtYWluaW5nICogMTAwMCk7XHJcblxyXG5cdFx0dmFyIHRpbWVzdGFtcCA9IG1vbWVudChlbnRyeS50aW1lc3RhbXAgKiAxMDAwKTtcclxuXHJcblxyXG5cdFx0dmFyIGNsYXNzTmFtZSA9IFtcclxuXHRcdFx0J29iamVjdGl2ZScsXHJcblx0XHRcdCd0ZWFtJywgXHJcblx0XHRcdGVudHJ5LndvcmxkLFxyXG5cdFx0XS5qb2luKCcgJyk7XHJcblxyXG5cdFx0dmFyIG1hcE1ldGEgPSBtYXBzTWV0YVtvTWV0YS5tYXBdO1xyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IGNsYXNzTmFtZSwga2V5OiBpeEVudHJ5fSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS1yZWxhdGl2ZVwifSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uc3BhbihudWxsLCB0aW1lc3RhbXAudHdpdHRlclNob3J0KCkpXHJcblx0XHRcdFx0KSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS10aW1lc3RhbXBcIn0sIFxyXG5cdFx0XHRcdFx0dGltZXN0YW1wLmZvcm1hdCgnaGg6bW06c3MnKVxyXG5cdFx0XHRcdCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJvYmplY3RpdmUtbWFwXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5zcGFuKHt0aXRsZTogbWFwTWV0YS5uYW1lfSwgbWFwTWV0YS5hYmJyKVxyXG5cdFx0XHRcdCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJvYmplY3RpdmUtaWNvbnNcIn0sIFxyXG5cdFx0XHRcdFx0QXJyb3coe29NZXRhOiBvTWV0YX0pLCBcclxuIFx0XHRcdFx0XHRTcHJpdGUoe3R5cGU6IG9UeXBlLm5hbWUsIGNvbG9yOiBlbnRyeS53b3JsZH0pXHJcblx0XHRcdFx0KSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS1sYWJlbFwifSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uc3BhbihudWxsLCBvTGFiZWxbYXBwU3RhdGUubGFuZy5zbHVnXSlcclxuXHRcdFx0XHQpLCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwib2JqZWN0aXZlLWd1aWxkXCJ9LCBcclxuXHRcdFx0XHRcdHJlbmRlckd1aWxkKGVudHJ5Lmd1aWxkLCBndWlsZHMpXHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckd1aWxkKGd1aWxkSWQsIGd1aWxkcykge1xyXG5cdGlmICghZ3VpbGRJZCkge1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0dmFyIGd1aWxkID0gZ3VpbGRzW2d1aWxkSWRdO1xyXG5cclxuXHRcdHZhciBndWlsZENsYXNzID0gW1xyXG5cdFx0XHQnZ3VpbGQnLFxyXG5cdFx0XHQnbmFtZScsXHJcblx0XHRcdCdwZW5kaW5nJ1xyXG5cdFx0XS5qb2luKCcgJyk7XHJcblxyXG5cdFx0aWYoIWd1aWxkKSB7XHJcblx0XHRcdHJldHVybiBSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiBndWlsZENsYXNzfSwgUmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIn0pKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gUmVhY3QuRE9NLnNwYW4obnVsbCwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmEoe2NsYXNzTmFtZTogZ3VpbGRDbGFzcywgaHJlZjogJyMnICsgZ3VpbGRJZCwgdGl0bGU6IGd1aWxkLmd1aWxkX25hbWV9LCBndWlsZC5ndWlsZF9uYW1lLCBcIiBbXCIsIGd1aWxkLnRhZywgXCJdXCIpXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fVxyXG59XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGRhdGVOb3c6IGRhdGVOb3csXHJcblx0YWRkNTogYWRkNSxcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBkYXRlTm93KCkge1xyXG5cdHJldHVybiBNYXRoLmZsb29yKF8ubm93KCkgLyAxMDAwKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGFkZDUoaW5EYXRlKSB7XHJcblx0dmFyIF9iYXNlRGF0ZSA9IGluRGF0ZSB8fCBkYXRlTm93KCk7XHJcblxyXG5cdHJldHVybiAoX2Jhc2VEYXRlICsgKDUgKiA2MCkpO1xyXG59XHJcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBAanN4IFJlYWN0LkRPTSAqLy8qanNsaW50IG5vZGU6IHRydWUgKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgUmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5SZWFjdCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUmVhY3QgOiBudWxsKTtcclxuXHJcbnZhciBPdmVydmlldyA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9qc3gvT3ZlcnZpZXcuanN4JykpO1xyXG5cclxudmFyIExhbmdzID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL2pzeC9MYW5ncy5qc3gnKSk7XHJcbnZhciBsYW5ncyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKS5sYW5ncztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb3ZlcnZpZXcoY3R4KSB7XHJcblx0dmFyIGxhbmdTbHVnID0gY3R4LnBhcmFtcy5sYW5nU2x1ZyB8fCAnZW4nO1xyXG5cclxuXHR2YXIgYXBwU3RhdGUgPSB3aW5kb3cuYXBwLnN0YXRlO1xyXG5cdGFwcFN0YXRlLmxhbmcgPSBsYW5nc1tsYW5nU2x1Z107XHJcblxyXG5cdFJlYWN0LnJlbmRlcihMYW5ncyh7bGFuZ1NsdWc6IGxhbmdTbHVnfSksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtbGFuZ3MnKSk7XHJcblx0UmVhY3QucmVuZGVyKE92ZXJ2aWV3KG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpKTtcclxufTtcclxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogQGpzeCBSZWFjdC5ET00gKi8vKmpzbGludCBub2RlOiB0cnVlICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUmVhY3QgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlJlYWN0IDogbnVsbCk7XHJcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuXyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuXyA6IG51bGwpO1xyXG5cclxudmFyIFRyYWNrZXIgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vanN4L1RyYWNrZXIuanN4JykpO1xyXG5cclxudmFyIExhbmdzID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL2pzeC9MYW5ncy5qc3gnKSk7XHJcbnZhciBsYW5ncyA9IHJlcXVpcmUoJ2d3Mncydy1zdGF0aWMnKS5sYW5ncztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb3ZlcnZpZXcoY3R4KSB7XHJcblx0dmFyIGxhbmdTbHVnID0gY3R4LnBhcmFtcy5sYW5nU2x1ZztcclxuXHR2YXIgd29ybGRTbHVnID0gY3R4LnBhcmFtcy53b3JsZFNsdWc7XHJcblxyXG5cdHZhciBhcHBTdGF0ZSA9IHdpbmRvdy5hcHAuc3RhdGU7XHJcblx0YXBwU3RhdGUubGFuZyA9IGxhbmdzW2xhbmdTbHVnXTtcclxuXHJcblx0UmVhY3QucmVuZGVyKExhbmdzKHtsYW5nU2x1ZzogbGFuZ1NsdWcsIHdvcmxkU2x1Zzogd29ybGRTbHVnfSksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtbGFuZ3MnKSk7XHJcblx0UmVhY3QucmVuZGVyKFRyYWNrZXIoe3dvcmxkU2x1Zzogd29ybGRTbHVnfSksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykpO1xyXG59O1xyXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSJdfQ==
