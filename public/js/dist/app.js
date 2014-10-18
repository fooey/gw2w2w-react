(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
*
*	config
*
*/

 var app = window.app = {
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
page('/:langSlug(en|de|es|fr)?', require('./overview'));
page('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)', require('./tracker'));

$(function() {
	page.start({
		click: true,
		popstate: false,
		dispatch: true,
	});
});

},{"./overview":30,"./tracker":32,"page":3}],2:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports={
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
	},
}
},{}],5:[function(require,module,exports){
module.exports={
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
	"76": {"id": "76", "en": "Temple of Lost Prayers", "fr": "Temple des prières perdues", "es": "Templo de las Pelgarias", "de": "Tempel der Verlorenen Gebete"}
}
},{}],6:[function(require,module,exports){
module.exports=[
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
				"objectives": [37, 33, 32] 			// keep, bay, hills, longview, cliffside, godsword, hopes, astral
			}, {	
				"label": "North",
				"groupType": "red",
				"objectives": [38, 40, 39, 52, 51] 	// keep, bay, hills, longview, cliffside, godsword, hopes, astral
			}, {
				"label": "South",
				"groupType": "neutral",
				"objectives": [35, 36, 34, 53, 50] 	// briar, lake, lodge, vale, water
			// }, {
			// 	"label": "Ruins",
			// 	"groupType": "ruins",
			// 	"objectives": [62, 63, 64, 65, 66] 	// temple, hollow, estate, orchard, ascent
			},],
	}, {
		"key": "BlueHome",
		"mapIndex": 2,
		"sections": [{
				"label": "Keeps",
				"groupType": "blue",
				"objectives": [23, 27, 31] 			// keep, bay, hills, woodhaven, dawns, spirit, gods, star
			}, {
				"label": "North",
				"groupType": "blue",
				"objectives": [30, 28, 29, 58, 60] 	// keep, bay, hills, woodhaven, dawns, spirit, gods, star
			}, {
				"label": "South",
				"groupType": "neutral",
				"objectives": [25, 26, 24, 59, 61] 	// briar, lake, champ, vale, water
			// }, {
			// 	"label": "Ruins",
			// 	"groupType": "ruins",
			// 	"objectives": [71, 70, 69, 68, 67] 	// temple, hollow, estate, orchard, ascent
			},],
	}, {
		"key": "GreenHome",
		"mapIndex": 1,
		"sections": [{
				"label": "Keeps",
				"groupType": "green",
				"objectives": [46, 44, 41] 			// keep, bay, hills, sunny, crag, titan, faith, fog
			}, {
				"label": "North",
				"groupType": "green",
				"objectives": [47, 57, 56, 48, 54] 	// keep, bay, hills, sunny, crag, titan, faith, fog
			}, {
				"label": "South",
				"groupType": "neutral",
				"objectives": [45, 42, 43, 49, 55] 	// briar, lake, lodge, vale, water
			// }, {
			// 	"label": "Ruins",
			// 	"groupType": "ruins",
			// 	"objectives": [76 , 75 , 74 , 73 , 72 ] 		// temple, hollow, estate, orchard, ascent
			},]
	},
]
},{}],7:[function(require,module,exports){
module.exports={
	//	EBG
	"9": {"type": 1, "timer": 1, "d": 0, "n": 0, "s": 0, "w": 0, "e": 0},	// Stonemist Castle

	//	Red Corner
	"1": {"type": 2, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Red Keep - Overlook
	"17": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// Red Tower - Mendon's Gap
	"20": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// Red Tower - Veloka Slope
	"18": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// Red Tower - Anzalias Pass
	"19": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Red Tower - Ogrewatch Cut
	"6": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Red Camp - Mill - Speldan
	"5": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Red Camp - Mine - Pangloss

	//	Blue Corner
	"2": {"type": 2, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Blue Keep - Valley
	"15": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// Blue Tower - Langor Gulch
	"22": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Blue Tower - Bravost Escarpment
	"16": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// Blue Tower - Quentin Lake
	"21": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// Blue Tower - Durios Gulch
	"7": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// Blue Camp - Mine - Danelon
	"8": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Blue Camp - Mill - Umberglade

	//	Green Corner
	"3": {"type": 2, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Green Keep - Lowlands
	"11": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// Green Tower - Aldons
	"13": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// Green Tower - Jerrifer's Slough
	"12": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// Green Tower - Wildcreek
	"14": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// Green Tower - Klovan Gully
	"10": {"type": 4, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Green Camp - Mine - Rogues Quarry
	"4": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Green Camp - Mill - Golanta


	//	BlueHome
	"23": {"type": 2, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Garrison
	"27": {"type": 2, "timer": 1, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Bay - Ascension Bay
	"31": {"type": 2, "timer": 1, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Hills - Askalion Hills
	"30": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Tower - Woodhaven
	"28": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Tower - Dawn's Eyrie
	"29": {"type": 4, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// North Camp - Crossroads - The Spiritholme
	"58": {"type": 4, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Camp - Mine - Godslore
	"60": {"type": 4, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Camp - Mill - Stargrove

	"25": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Tower - Redbriar
	"26": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Tower - Greenlake
	"24": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// South Camp - Orchard - Champion's Demense
	"59": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Camp - Workshop - Redvale Refuge
	"61": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Camp - Fishing Village - Greenwater Lowlands


	//	RedHome
	"37": {"type": 2, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Garrison
	"33": {"type": 2, "timer": 1, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Bay - Dreaming Bay
	"32": {"type": 2, "timer": 1, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Hills - Etheron Hills
	"38": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Tower - Longview
	"40": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Tower - Cliffside
	"39": {"type": 4, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// North Camp - Crossroads - The Godsword
	"52": {"type": 4, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Camp - Mine - Arah's Hope
	"51": {"type": 4, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Camp - Mill - Astralholme

	"35": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Tower - Greenbriar
	"36": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Tower - Bluelake
	"34": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// South Camp - Orchard - Victor's Lodge
	"53": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Camp - Workshop - Greenvale Refuge
	"50": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Camp - Fishing Village - Bluewater Lowlands


	//	GreenHome
	"46": {"type": 2, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// Garrison
	"44": {"type": 2, "timer": 1, "d": 1, "n": 0, "s": 0, "w": 1, "e": 0},	// Bay - Dreadfall Bay
	"41": {"type": 2, "timer": 1, "d": 1, "n": 0, "s": 0, "w": 0, "e": 1},	// Hills - Shadaran Hills
	"47": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Tower - Sunnyhill
	"57": {"type": 3, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Tower - Cragtop
	"56": {"type": 4, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 0},	// North Camp - Crossroads - The Titanpaw
	"48": {"type": 4, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 1, "e": 0},	// NW Camp - Mine - Faithleap
	"54": {"type": 4, "timer": 1, "d": 1, "n": 1, "s": 0, "w": 0, "e": 1},	// NE Camp - Mill - Foghaven

	"45": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Tower - Bluebriar
	"42": {"type": 3, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Tower - Redlake
	"43": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 0},	// South Camp - Orchard - Hero's Lodge
	"49": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 1, "e": 0},	// SW Camp - Workshop - Bluevale Refuge
	"55": {"type": 4, "timer": 1, "d": 1, "n": 0, "s": 1, "w": 0, "e": 1},	// SE Camp - Fishing Village - Redwater Lowlands
}
},{}],8:[function(require,module,exports){
module.exports={
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
	"76": {"id": 76, "name": "((Temple of Lost Prayers))"},
}
},{}],9:[function(require,module,exports){
module.exports={
	"1": {"timer": 1, "value": 35, "name": "castle"},
	"2": {"timer": 1, "value": 25, "name": "keep"},
	"3": {"timer": 1, "value": 10, "name": "tower"},
	"4": {"timer": 1, "value": 5, "name": "camp"},
	"5": {"timer": 0, "value": 0, "name": "temple"},
	"6": {"timer": 0, "value": 0, "name": "hollow"},
	"7": {"timer": 0, "value": 0, "name": "estate"},
	"8": {"timer": 0, "value": 0, "name": "overlook"},
	"9": {"timer": 0, "value": 0, "name": "ascent"},
}
},{}],10:[function(require,module,exports){
module.exports = {
	"objective_names": require('./objective_names.json'),
	"objective_types": require('./objective_types.json'),
	"objective_meta": require('./objective_meta.json'),
	"objective_labels": require('./objective_labels.json'),
	"objective_map": require('./objective_map.json'),
};

},{"./objective_labels.json":5,"./objective_map.json":6,"./objective_meta.json":7,"./objective_names.json":8,"./objective_types.json":9}],11:[function(require,module,exports){
module.exports={
	"1001": {
		"id": "1001",
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
	}
}
},{}],12:[function(require,module,exports){

module.exports = {
	getGuildDetails: getGuildDetails,
	getMatches: getMatches,
	getMatchDetails: getMatchDetails,
};



function getGuildDetails(guildId, onSuccess, onError, onComplete) {
	var requestUrl = 'https://api.guildwars2.com/v1/guild_details.json?guild_id=' + guildId;
	get(requestUrl, onSuccess, onError, onComplete);
}



function getMatches(onSuccess, onError, onComplete) {
	var requestUrl = 'https://api.guildwars2.com/v1/wvw/matches.json';
	get(requestUrl, onSuccess, onError, onComplete);
}



function getMatchDetails(matchId, onSuccess, onError, onComplete) {
	var requestUrl = 'https://api.guildwars2.com/v1/wvw/match_details.json?match_id=' + matchId;
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
/**
 * @jsx React.DOM
 */

var RegionMatches = require('./overview/RegionMatches.jsx');
var RegionWorlds = require('./overview/RegionWorlds.jsx');

module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {matches: {}};
	},

	componentDidMount: function() {
		this.updateTimer = null;
		this.getMatches();
	},

	componentWillUnmount: function() {
		clearTimeout(this.updateTimer);
	},
	
	render: function() {
		// var appState = window.app.state;
		var staticData = require('../staticData');

		var regionMatches = [
			{"label": "NA Matchups", "matches": _.filter(this.state.matches, function(match){return match.wvw_match_id.charAt(0) === '1'; })},
			{"label": "EU Matchups", "matches": _.filter(this.state.matches, function(match){return match.wvw_match_id.charAt(0) === '2'; })},
		];
		var regionWorlds = [
			{"label": "NA Worlds", "worlds": _.filter(staticData.worlds, function(world){return world.id.charAt(0) === '1'; })},
			{"label": "EU Worlds", "worlds": _.filter(staticData.worlds, function(world){return world.id.charAt(0) === '2'; })},
		];

		return (
			React.DOM.div({id: "overview"}, 
				React.DOM.div({className: "row"}, 
					_.map(regionMatches, function(region){
						return (
							React.DOM.div({className: "col-sm-12", key: region.label}, 
								RegionMatches({data: region})
							)
						);
					})
				), 

				React.DOM.hr(null), 

				React.DOM.div({className: "row"}, 
					_.map(regionWorlds, function(region){
						return (
							React.DOM.div({className: "col-sm-12", key: region.label}, 
								RegionWorlds({data: region})
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
		this.setState({matches: _.sortBy(data.wvw_matches, 'wvw_match_id')});
	},
	getMatchesError: function(xhr, status, err) {
		console.log('Overview::getMatches:data error', status, err.toString()); 
	},
	getMatchesComplete: _.noop,
});
},{"../api":12,"../staticData":31,"./overview/RegionMatches.jsx":17,"./overview/RegionWorlds.jsx":18}],14:[function(require,module,exports){
(function (process){
/**
 * @jsx React.DOM
 */

var Scoreboard = require('./tracker/Scoreboard.jsx');
var Maps = require('./tracker/Maps.jsx');
var Guilds = require('./tracker/guilds/Guilds.jsx');

var libDate = require('../lib/date.js');

module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {
			matchDetails: {},
			scores: [],
			mapsScores: [],
			objectives: {},
			guilds: {},
		};
	},

	componentDidMount: function() {
		this.updateTimer = null;

		this.getMatchDetails();
	},

	componentWillUnmount: function() {
		clearTimeout(this.updateTimer);
		clearTimeout(this.buffTimers);
	},

	componentDidUpdate: function() {
		// console.log(this.state);
		// console.log(_.filter(this.state.objectives, function(o){ return o.lastCap !== 0; }));
	},
	
	render: function() {
		var staticData = require('../staticData');
		var appState = window.app.state;
		var matchData = this.props.data;

		var matchWorlds = [
			staticData.worlds[matchData.red_world_id],
			staticData.worlds[matchData.blue_world_id],
			staticData.worlds[matchData.green_world_id],
		];

		var matchDetails = this.state.matchDetails;

		// console.log('matchWorlds', matchWorlds);
		// console.log('matchData', matchData);
		// console.log('this.state.objectives', this.state.objectives);

		if (_.isEmpty(this.state.objectives)) {
			console.log('Objective data not ready');
			return null;
		}
		else {
			return (
				React.DOM.div({id: "tracker"}, 
					Scoreboard({
						scores: this.state.scores, 
						objectives: this.state.objectives, 
						matchWorlds: matchWorlds}
					), 


					Maps({
						matchData: matchData, 
						mapsScores: this.state.mapsScores, 
						objectives: this.state.objectives, 
						guilds: this.state.guilds, 
						matchWorlds: matchWorlds}
					), 


					Guilds({
						guilds: this.state.guilds, 
						objectives: this.state.objectives}
					)
				)
			);
		}

	},








	getMatchDetails: function() {
		var api = require('../api');
		
		api.getMatchDetails(
			this.props.data.wvw_match_id,
			this.onMatchDetailsSuccess, 
			this.onMatchDetailsError, 
			this.onMatchDetailsComplete
		);
	},

	onMatchDetailsSuccess: function(data) {
		// console.log('Match::onMatchDetailsSuccess', this.props.data.wvw_match_id, data);
		var component = this;

		var objectives = getObjectives(component, data);
		// var guilds = getGuilds(component, objectives);

		this.setState({
			matchDetails: data,
			scores: data.scores,
			mapsScores: getMapsScores(data),
			objectives: objectives,
			// guilds: guilds,
		});
		
		if(!_.isEmpty(this.state.objectives)) {
			process.nextTick(queueGuildLookups.bind(this, this.state.objectives));
		}
	},

	onMatchDetailsError: function(xhr, status, err) {
		console.log('Overview::getMatchDetails:data error', status, err.toString()); 
	},

	onMatchDetailsComplete: function(xhr, status, err) {
		var refreshTime = _.random(1000*1, 1000*4);
		this.updateTimer = setTimeout(this.getMatchDetails, refreshTime);
	},
});


function getMapsScores(md) {
	return _.pluck(md.maps, 'scores');
}


function getObjectives(component, md) {
	var objectives = _
		.chain(md.maps)
		.pluck('objectives')
		.flatten()
		.map(setObjectiveLastCap.bind(component))
		.indexBy('id')
		.value();

	return objectives;
}


function setObjectiveLastCap(o) {
	var so = this.state.objectives[o.id];

	if (!so) {
		o.lastCap = window.app.state.start;
	}
	else if (o.owner === so.owner) {
		o.lastCap = so.lastCap;
	}
	else {
		o.lastCap = libDate.dateNow();
	}

	o.expires = libDate.add5(o.lastCap);

	return o;
}



function queueGuildLookups(objectives){
	var knownGuilds = _.keys(this.state.guilds);

	var newGuilds = _
		.chain(objectives)
		.pluck('owner_guild')
		.uniq()
		.without(undefined)
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
			data.objectives = _.filter(component.state.objectives, {"owner_guild": guildId});
			component.state.guilds[guildId] = data;
			component.setState({guilds: component.state.guilds});
		}, 
		_.noop,
		onComplete.bind(null, null) // so no error is returned
	);
}
}).call(this,require('_process'))
},{"../api":12,"../lib/date.js":29,"../staticData":31,"./tracker/Maps.jsx":24,"./tracker/Scoreboard.jsx":25,"./tracker/guilds/Guilds.jsx":27,"_process":2}],15:[function(require,module,exports){
/** @jsx React.DOM *//**
 * @jxs React.DOM
 */

var Score = require('./Score.jsx');
var Pie = require('./Pie.jsx');

module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {
			scores: [NaN,NaN,NaN], 
			diff: [0,0,0]
		};
	},

	componentDidMount: function() {
		// console.log('Match::componentDidMount', this.props.data.wvw_match_id);

		this.updateTimer = null;
		this.getMatchDetails();

	},

	// componentWillUpdate: function(nextProps, nextState){
	// 	// console.log('Match::componentWillUpdate', this.props.data.wvw_match_id, nextState, this.state);

	// 	if (this.state.scores.length) {
	// 		$(this.getDOMNode()).addClass('highlight');
	// 	}

	// 	return;
	// },

	componentWillUnmount: function() {
		clearTimeout(this.updateTimer);
	},
	
	render: function() {
		// console.log('Match:render', this.props.data.wvw_match_id);

		var data = this.props.data;
		var worlds = require('../../staticData').worlds;

		var redWorld = worlds[data.red_world_id];
		var blueWorld = worlds[data.blue_world_id];
		var greenWorld = worlds[data.green_world_id];

		return (
			React.DOM.div({className: "matchContainer"}, 
				React.DOM.table({className: "match"}, 
					React.DOM.tr(null, 
						React.DOM.td({className: "team red name"}, React.DOM.a({href: redWorld.link}, redWorld.name)), 
						React.DOM.td({className: "team red score"}, 
							Score({
								key: 'red-score-' + data.wvw_match_id, 
								matchId: data.wvw_match_id, 
								team: "red", 
								score: this.state.scores[0], 
								diff: this.state.diff[0]}
							)
						), 
						React.DOM.td({rowSpan: "3", className: "pie"}, 
							Pie({scores: this.state.scores, size: "60", matchId: data.wvw_match_id})
						)
					), 
					React.DOM.tr(null, 
						React.DOM.td({className: "team blue name"}, React.DOM.a({href: blueWorld.link}, blueWorld.name)), 
						React.DOM.td({className: "team blue score"}, 
							Score({
								key: 'blue-score-' + data.wvw_match_id, 
								matchId: data.wvw_match_id, 
								team: "blue", 
								score: this.state.scores[1], 
								diff: this.state.diff[1]}
							)
						)
					), 
					React.DOM.tr(null, 
						React.DOM.td({className: "team green name"}, React.DOM.a({href: greenWorld.link}, greenWorld.name)), 
						React.DOM.td({className: "team green score"}, 
							Score({
								key: 'green-score-' + data.wvw_match_id, 
								matchId: data.wvw_match_id, 
								team: "green", 
								score: this.state.scores[2], 
								diff: this.state.diff[2]}
							)
						)
					)
				)
			)
		);
	},



	getMatchDetails: function() {
		var api = require('../../api');
		
		api.getMatchDetails(
			this.props.data.wvw_match_id,
			this.onMatchDetailsSuccess, 
			this.onMatchDetailsError, 
			this.onMatchDetailsComplete
		);
	},

	onMatchDetailsSuccess: function(data) {
		// console.log('Match::onMatchDetailsSuccess', this.props.data.wvw_match_id, data);
		this.setState({
			scores: data.scores,
			diff: [
				data.scores[0] - this.state.scores[0],
				data.scores[1] - this.state.scores[1],
				data.scores[2] - this.state.scores[2],
			]
		});
	},

	onMatchDetailsError: function(xhr, status, err) {
		console.log('Overview::getMatchDetails:data error', status, err.toString()); 
	},

	onMatchDetailsComplete: function(xhr, status, err) {
		var refreshTime = _.random(1000*16, 1000*32);
		this.updateTimer = setTimeout(this.getMatchDetails, refreshTime);
	},
});
},{"../../api":12,"../../staticData":31,"./Pie.jsx":16,"./Score.jsx":19}],16:[function(require,module,exports){
/** @jsx React.DOM *//**
 * @jxs React.DOM
 */

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
},{}],17:[function(require,module,exports){
/** @jsx React.DOM *//**
 * @jxs React.DOM
 */

var Match = require('./Match.jsx');

module.exports = React.createClass({displayName: 'exports',
	render: function() {

		return (
			React.DOM.div({className: "RegionMatches"}, 
				React.DOM.h2(null, this.props.data.label), 
				_.map(this.props.data.matches, function(match){
					return (
						Match({
							className: "match", 
							key: 'match-' + match.wvw_match_id, 
							data: match}
						)
					);
				})
			)
		);
	}
});
},{"./Match.jsx":15}],18:[function(require,module,exports){
/** @jsx React.DOM *//**
 * @jxs React.DOM
 */


module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var label = this.props.data.label;
		var worlds = _.sortBy(this.props.data.worlds, 'name');

		return (
			React.DOM.div({className: "RegionWorlds"}, 
				React.DOM.h2(null, label), 
				React.DOM.ul({className: "list-unstyled"}, 
					_.map(worlds, function(world){
						return (
							React.DOM.li({key: 'world' + world.id}, React.DOM.a({href: world.link}, world.name))
						);
					})
				)
			)
		);
	}
});
},{}],19:[function(require,module,exports){
/** @jsx React.DOM *//**
 * @jxs React.DOM
 */

module.exports = React.createClass({displayName: 'exports',

	componentDidMount: function() {
	},

	componentDidUpdate: function(prevProps, prevState){
		// console.log('Score::componentWillUpdate', prevProps, this.props);

		if (_.isNumber(this.props.diff) && this.props.diff > 0) {
			var $diff = $('.diff', this.getDOMNode());

			// $diff
			// 	.fadeIn('fast')
			// 	.delay(2000)
			// 	.fadeOut('slow');
			$diff
				.velocity('fadeOut', {duration: 0})
				.velocity('fadeIn', {duration: 400})
				.velocity('fadeOut', {duration: 2000, delay: 4000});
		}
	},

	render: function() {
		var matchId = this.props.matchId;
		var team = this.props.team;
		var score = this.props.score || 0;
		var diff = this.props.diff || 0;

		return (
			React.DOM.span(null, 
				(diff) ?
					React.DOM.span({className: "diff"}, numeral(diff).format('0,0'))
					: React.DOM.span(null), 
				
				React.DOM.span({className: "value"}, numeral(score).format('0,0'))
			)
		);
	}
});
},{}],20:[function(require,module,exports){
/** @jsx React.DOM *//**
 * @jxs React.DOM
 */

module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var meta = this.props.objectiveMeta;

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
},{}],21:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var MapSection = require('./MapSection.jsx');
var libDate = require('../../lib/date.js');

module.exports = React.createClass({displayName: 'exports',

	render: function() {
		var staticData = require('../../staticData');
		var objectivesData = staticData.objectives;

		var mapConfig = this.props.mapConfig;
		var mapScores = this.props.mapScores;
		var objectives = this.props.objectives;
		var guilds = this.props.guilds;
		var mapName = this.props.mapName;
		var mapColor = this.props.mapColor;
		var dateNow = this.props.dateNow;

		var colorMap = ['red', 'green', 'blue'];

		return (
			React.DOM.div({className: "map"}, 
				React.DOM.div({className: "mapScores"}, 
					React.DOM.h2({className: 'team ' + mapColor, onClick: this.onTitleClick}, 
						mapName
					), 
					React.DOM.ul({className: "list-inline"}, 
						_.map(mapScores, function(score, scoreIndex) {

							var className = ['team', colorMap[scoreIndex]].join(' ');

							return (
								React.DOM.li({key: 'map-score-' + scoreIndex, className: className}, 
									numeral(score).format('0,0')
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
									objectives: objectives, 
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


/*


				<ul className="objectives list-unstyled">
					{_.map(mapDetails.objectives, function(o, oIndex) {
						var objectiveMeta = objectivesData.objective_meta[o.id];
						var objectiveName = objectivesData.objective_names[o.id];
						var objectiveLabels = objectivesData.objective_labels[o.id];

						var timerActive = (o.expires >= dateNow);
						var timerUnknown = (o.lastCap === window.app.state.start);
						var expiration = moment((o.expires - dateNow) * 1000);

						// console.log(o.lastCap, o.expires, now, o.expires > now);

						var className = [
							'objective',
							'team', 
							o.owner.toLowerCase(),
						].join(' ');

						var timerClass = [
							'timer',
							(timerActive) ? 'active' : 'inactive',
							(timerUnknown) ? 'unknown' : '',
						].join(' ');

						if (objectiveMeta) {
							return (
								<li className={className} key={'objective-' + o.id} id={'objective-' + o.id}>
									<span className="objective-label">{objectiveLabels[appState.lang.slug]} </span>

									<span className={timerClass} title={'Expires at ' + o.expires}>{expiration.format('m:ss')}</span>
								</li>
							);
						}
					})}
				</ul>



				<ul className="objectives list-unstyled">
					{_.map(mapDetails.objectives, function(o, oIndex) {
						var objectiveMeta = objectivesData.objective_meta[o.id];
						var objectiveName = objectivesData.objective_names[o.id];
						var objectiveLabels = objectivesData.objective_labels[o.id];

						var timerActive = (o.expires >= dateNow);
						var timerUnknown = (o.lastCap === window.app.state.start);
						var expiration = moment((o.expires - dateNow) * 1000);

						// console.log(o.lastCap, o.expires, now, o.expires > now);

						var className = [
							'objective',
							'team', 
							o.owner.toLowerCase(),
						].join(' ');

						var timerClass = [
							'timer',
							(timerActive) ? 'active' : 'inactive',
							(timerUnknown) ? 'unknown' : '',
						].join(' ');

						if (objectiveMeta) {
							return (
								<li className={className} key={'objective-' + o.id} id={'objective-' + o.id}>
									<span className="objective-label">{objectiveLabels[appState.lang.slug]} </span>

									<span className={timerClass} title={'Expires at ' + o.expires}>{expiration.format('m:ss')}</span>
								</li>
							);
						}
					})}
				</ul>
													<div>
														<div>now: {now}</div>
														<div>cap: {o.lastCap}</div>
														<div>exp: {o.expires}</div>
													</div>
													<div>
														<div> {o.lastCap.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {o.expires.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {o.expires.diff(now, 's')}</div>
													</div>
*/
},{"../../lib/date.js":29,"../../staticData":31,"./MapSection.jsx":23}],22:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
var Sprite = require('./Sprite.jsx');
var Arrow = require('./Arrow.jsx');

module.exports = React.createClass({displayName: 'exports',

	render: function() {
		var staticData = require('../../staticData');
		var objectivesData = staticData.objectives;

		var appState = window.app.state;

		var objectiveId = this.props.objectiveId;
		var dateNow = this.props.dateNow;
		var objectives = this.props.objectives;
		var guilds = this.props.guilds;


		if (!_.has(objectivesData.objective_meta, objectiveId)) {
			// short circuit
			return null;
		}


		var objective = objectives[objectiveId];
		var objectiveMeta = objectivesData.objective_meta[objective.id];
		var objectiveName = objectivesData.objective_names[objective.id];
		var objectiveLabels = objectivesData.objective_labels[objective.id];
		var objectiveType = objectivesData.objective_types[objectiveMeta.type];

		var timerActive = (objective.expires >= dateNow + 5); // show for 5 seconds after expiring
		var timerUnknown = (objective.lastCap === window.app.state.start);
		var secondsRemaining = objective.expires - dateNow;
		var expiration = moment(secondsRemaining * 1000);


		// console.log(objective.lastCap, objective.expires, now, objective.expires > now);

		var className = [
			'objective',
			'team', 
			objective.owner.toLowerCase(),
		].join(' ');

		var timerClass = [
			'timer',
			(timerActive) ? 'active' : 'inactive',
			(timerUnknown) ? 'unknown' : '',
		].join(' ');

		var tagClass = [
			'tag',
		].join(' ');

		var timerHtml = (timerActive) ? expiration.format('m:ss') : '0:00';

		return (
			React.DOM.div({className: className}, 
				React.DOM.div({className: "objective-icons"}, 
					Arrow({objectiveMeta: objectiveMeta}), 
 					Sprite({type: objectiveType.name, color: objective.owner.toLowerCase()})
				), 
				React.DOM.div({className: "objective-label"}, 
					React.DOM.span(null, objectiveLabels[appState.lang.slug])
				), 
				React.DOM.div({className: "objective-state"}, 
					function(){
						var guildId = objective.owner_guild;

						if (!guildId) {
							return null;
						}
						else {
							var guild = guilds[guildId];

							var guildClass = [
								'guild',
								'tag',
								'pending'
							].join(' ');

							if(!guild) {
								return React.DOM.span({className: guildClass}, React.DOM.i({className: "fa fa-spinner fa-spin"}), ";");
							}
							else {
	 							return React.DOM.a({className: guildClass, title: guild.guild_name}, guild.tag);
							}
						}
					}(), 
					React.DOM.span({className: timerClass, title: 'Expires at ' + objective.expires}, timerHtml)
				)
			)
		);
	},
});


function getArrow(meta) {
	if (!meta.d) {
		return null;
	}
	else {
		var src = ['/img/icons/dist/arrow'];

		if (meta.n) {src.push('north'); }
		else if (meta.s) {src.push('south'); }

		if (meta.w) {src.push('west'); }
		else if (meta.e) {src.push('east'); }

		return React.DOM.img({src: src.join('-') + '.svg'});

	}
}


/*

													<div>
														<div>now: {now}</div>
														<div>cap: {objective.lastCap}</div>
														<div>exp: {objective.expires}</div>
													</div>
													<div>
														<div> {objective.lastCap.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {objective.expires.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {objective.expires.diff(now, 's')}</div>
													</div>
*/
},{"../../staticData":31,"./Arrow.jsx":20,"./Sprite.jsx":26}],23:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var MapObjective = require('./MapObjective.jsx');

module.exports = React.createClass({displayName: 'exports',

	render: function() {
		var staticData = require('../../staticData');

		var mapSection = this.props.mapSection;
		var objectives = this.props.objectives;
		var guilds = this.props.guilds;
		var dateNow = this.props.dateNow;

		return (
			React.DOM.ul({className: "list-unstyled"}, 
				_.map(mapSection.objectives, function(objectiveId) {
					return (
						React.DOM.li({key: 'objective-' + objectiveId, id: 'objective-' + objectiveId}, 
							MapObjective({
								objectiveId: objectiveId, 
								dateNow: dateNow, 
								objectives: objectives, 
								guilds: guilds}
							)
						)
					);
				})
			)
		);
	},
});


/*

													<div>
														<div>now: {now}</div>
														<div>cap: {o.lastCap}</div>
														<div>exp: {o.expires}</div>
													</div>
													<div>
														<div> {o.lastCap.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {o.expires.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {o.expires.diff(now, 's')}</div>
													</div>
*/
},{"../../staticData":31,"./MapObjective.jsx":22}],24:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var MapDetails = require('./MapDetails.jsx');
var libDate = require('../../lib/date.js');

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
		var staticData = require('../../staticData');
		var mapsConfig = staticData.objectives.objective_map;

		var matchData = this.props.data;
		var objectives = this.props.objectives;
		var guilds = this.props.guilds;
		var mapsScores = this.props.mapsScores;
		var matchWorlds = this.props.matchWorlds;

		if (!objectives) {
			return null;
		}


		var mapNames = ['Eternal Battlegrounds', matchWorlds[0].name, matchWorlds[1].name, matchWorlds[2].name];
		var mapColors = ['default', 'red', 'blue', 'green'];

		var dateNow = this.state.dateNow;

		return (
			React.DOM.div({id: "maps"}, 
				React.DOM.div({className: "row"}, 
					_.map(mapsConfig, function(mapConfig, outputIndex) {

						var mapName = mapNames[outputIndex];
						var mapColor = mapColors[outputIndex];

						return (
							React.DOM.div({className: "col-md-6", key: 'map-' + mapConfig.mapIndex}, 
								MapDetails({
									mapsScores: mapsScores[mapConfig.mapIndex], 
									objectives: objectives, 
									guilds: guilds, 
									mapConfig: mapConfig, 
									mapName: mapName, 
									mapColor: mapColor, 
									dateNow: dateNow}
								)
							)
						);
					})
				)
			)
		);
	},
});


/*

													<div>
														<div>now: {now}</div>
														<div>cap: {o.lastCap}</div>
														<div>exp: {o.expires}</div>
													</div>
													<div>
														<div> {o.lastCap.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {o.expires.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {o.expires.diff(now, 's')}</div>
													</div>
*/
},{"../../lib/date.js":29,"../../staticData":31,"./MapDetails.jsx":21}],25:[function(require,module,exports){
/** @jsx React.DOM *//**
 * @jxs React.DOM
 */

var Sprite = require('./Sprite.jsx');

module.exports = React.createClass({displayName: 'exports',

	componentDidMount: function() {
	},

	render: function() {
		var matchDetails = this.props.matchDetails;
		var worlds = this.props.matchWorlds;

		var scores = this.props.scores;
		var objectives = this.props.objectives;

		var staticData = require('../../staticData');
		var objectiveTypes = staticData.objectives.objective_types;
		var objectivesMeta = staticData.objectives.objective_meta;

		_.map(objectiveTypes, function(ot) {
			if (ot && ot.value > 0) {
				ot.holdings = [0,0,0];
			}
		});

		var colors = ['red', 'blue', 'green'];
		var colorMap = {"red": 0, "green": 1, "blue": 2};

		// var objectives = matchDetails.maps && _.reduce(matchDetails.maps, function(acc, mapData) {
		// 	return acc.concat(mapData.objectives);
		// }, []);

		_.each(objectives, function(os) {
			var oMeta = objectivesMeta[os.id];
			var oType = oMeta && objectiveTypes[oMeta.type];

			if (oType) {
				var color = os.owner.toLowerCase();
				var colorIndex = colorMap[color];

				oType.holdings[colorIndex]++;
			}

		});

		var tick = _.reduce(objectiveTypes, function(acc, ot) {
			if (ot && ot.value) {
				acc[0] += (ot.holdings[0] * ot.value);
				acc[1] += (ot.holdings[1] * ot.value);
				acc[2] += (ot.holdings[2] * ot.value);
			}
			return acc;
		}, [0,0,0]);


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
								React.DOM.h1(null, worlds[scoreIndex].name), 
								React.DOM.h2(null, 
									numeral(score).format('0,0'), " +", numeral(tick[scoreIndex]).format('0,0')
								), 

								React.DOM.ul({className: "list-inline"}, 
									_.map(objectiveTypes, function(ot) {
										if(ot === null || ot.value === 0) return null;

										return (
											React.DOM.li({key: 'type-holdings-' + ot.name}, 
												Sprite({type: ot.name, color: colors[scoreIndex]}), " x ", ot.holdings[scoreIndex]
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
},{"../../staticData":31,"./Sprite.jsx":26}],26:[function(require,module,exports){
/** @jsx React.DOM *//**
 * @jxs React.DOM
 */

module.exports = React.createClass({displayName: 'exports',

	render: function() {
		var type = this.props.type;
		var color = this.props.color;

		return (
			React.DOM.span({className: ['sprite', type, color].join(' ')})
		);
	}
});
},{}],27:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
var Objective = require('./Objective.jsx');

module.exports = React.createClass({displayName: 'exports',

	render: function() {
		var objectives = this.props.objectives;

		var guilds = _
			.chain(this.props.guilds)
			.sortBy('guild_name')
			.sortBy(function(guild){
				return -_.max(guild.objectives, 'lastCap');
			})
			.value();

		return (
			React.DOM.div({id: "guilds"}, 
				_.map(guilds, function(guild, guildId) {
					var emblemSrc = 'http://guilds.gw2w2w.com/guilds/' + encodeURIComponent(guild.guild_name.replace(/ /g, '-')) + '/64.svg';
					return (
						React.DOM.div({key: 'guild-' + guildId, id: 'guild-' + guildId, className: "row"}, 
							React.DOM.div({className: "col-sm-4"}, 
								React.DOM.img({className: "emblem", src: emblemSrc})
							), 
							React.DOM.div({className: "col-sm-20"}, 
								React.DOM.h1(null, guild.guild_name, " [", guild.tag, "]"), 
								React.DOM.ul({className: "list-unstyled"}, 
									_.map(guild.objectives, function(objective) {
										return (
											React.DOM.li({key: 'objective-' + objective.id}, 
												Objective({
													objective: objective, 
													objectives: objectives, 
													guilds: guilds}
												)
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
	},
});

},{"./Objective.jsx":28}],28:[function(require,module,exports){
/**
 * @jsx React.DOM
 */
var Sprite = require('../Sprite.jsx');
var Arrow = require('../Arrow.jsx');

module.exports = React.createClass({displayName: 'exports',

	render: function() {
		var staticData = require('../../../staticData');
		var objectivesData = staticData.objectives;

		var appState = window.app.state;

		var objective = this.props.objective;
		var objectives = this.props.objectives;


		if (!objectivesData.objective_meta[objective.id]) {
			console.log(objective.id, 'not in', objectivesData.objective_meta);
			// short circuit
			return null;
		}


		// var objective = objectives[objective];
		var objectiveMeta = objectivesData.objective_meta[objective.id];
		var objectiveName = objectivesData.objective_names[objective.id];
		var objectiveLabels = objectivesData.objective_labels[objective.id];
		var objectiveType = objectivesData.objective_types[objectiveMeta.type];

		var className = [
			'objective',
			'team', 
			objective.owner.toLowerCase(),
		].join(' ');

		return (
			React.DOM.div({className: className}, 
				React.DOM.div({className: "objective-icons"}, 
					Arrow({objectiveMeta: objectiveMeta}), 
 					Sprite({type: objectiveType.name, color: objective.owner.toLowerCase()})
				), 
				React.DOM.div({className: "objective-timestamp"}, 
					moment(objective.lastCap * 1000).format('hh:mm:ss')
				), 
				React.DOM.div({className: "objective-label"}, 
					React.DOM.span(null, objectiveLabels[appState.lang.slug])
				)
			)
		);
	},
});


function getArrow(meta) {
	if (!meta.d) {
		return null;
	}
	else {
		var src = ['/img/icons/dist/arrow'];

		if (meta.n) {src.push('north'); }
		else if (meta.s) {src.push('south'); }

		if (meta.w) {src.push('west'); }
		else if (meta.e) {src.push('east'); }

		return React.DOM.img({src: src.join('-') + '.svg'});

	}
}


/*

													<div>
														<div>now: {now}</div>
														<div>cap: {objective.lastCap}</div>
														<div>exp: {objective.expires}</div>
													</div>
													<div>
														<div> {objective.lastCap.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {objective.expires.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {objective.expires.diff(now, 's')}</div>
													</div>
*/
},{"../../../staticData":31,"../Arrow.jsx":20,"../Sprite.jsx":26}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
/**
 * @jsx React.DOM
 */


module.exports = function overview(ctx){
	var langSlug = ctx.params.langSlug || 'en';

	var appState = window.app.state;
	var staticData = require('./staticData');

	appState.lang = staticData.langs[langSlug];

	_.map(staticData.worlds, function(world) {
		// world.de.slug = slugify(world.de.name);
		// world.en.slug = slugify(world.en.name);
		// world.es.slug = slugify(world.es.name);
		// world.fr.slug = slugify(world.fr.name);
		world.name = world[appState.lang.slug].name;
		world.slug = world[appState.lang.slug].slug;
		world.link = '/' + appState.lang.slug + '/' + world.slug;
		return world;
	});
	// console.log(JSON.stringify(window.app.data.static.worlds));


	var Overview = require('./jsx/Overview.jsx')
	React.renderComponent(Overview(null), document.getElementById('content'));
}


// function slugify(inStr) {
// 	return _.str.slugify(inStr.replace('ß', 'ss'));
// }
},{"./jsx/Overview.jsx":13,"./staticData":31}],31:[function(require,module,exports){
module.exports = {
	langs: require('../../data/langs.json'),
	worlds: require('../../data/world_names.json'),
	objectives: require('../../data/objectives'),
};

},{"../../data/langs.json":4,"../../data/objectives":10,"../../data/world_names.json":11}],32:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug;
	var worldSlug = ctx.params.worldSlug;

	var appState = window.app.state;
	appState.start = Math.floor(Date.now() / 1000);

	var staticData = require('./staticData');

	appState.lang = staticData.langs[langSlug];

	_.map(staticData.worlds, function(world) {
		// world.de.slug = slugify(world.de.name);
		// world.en.slug = slugify(world.en.name);
		// world.es.slug = slugify(world.es.name);
		// world.fr.slug = slugify(world.fr.name);
		world.name = world[appState.lang.slug].name;
		world.slug = world[appState.lang.slug].slug;
		world.link = '/' + appState.lang.slug + '/' + world.slug;
		return world;
	});

	appState.world = _.find(staticData.worlds, {slug: worldSlug});


 	var api = require('./api');
	api.getMatches(
		getMatchesSuccess,
		getMatchesError,
		_.noop
	);

};

function getMatchesSuccess(data) {
	var appState = window.app.state;

	var match = _.find(data.wvw_matches, function(m) {
		return (
			appState.world.id == m.blue_world_id
			|| appState.world.id == m.green_world_id
			|| appState.world.id == m.red_world_id
		);
	});

	var Tracker = require('./jsx/Tracker.jsx');
	React.renderComponent(Tracker({data: match}), document.getElementById('content'));
};

function getMatchesError(xhr, status, err) {
	console.log('Overview::getMatches:data error', status, err.toString()); 
};

},{"./api":12,"./jsx/Tracker.jsx":14,"./staticData":31}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi9wdWJsaWMvanMvc3JjL2FwcC5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L25vZGVfbW9kdWxlcy9wYWdlL2luZGV4LmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9kYXRhL2xhbmdzLmpzb24iLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2RhdGEvb2JqZWN0aXZlX2xhYmVscy5qc29uIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9kYXRhL29iamVjdGl2ZV9tYXAuanNvbiIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvZGF0YS9vYmplY3RpdmVfbWV0YS5qc29uIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9kYXRhL29iamVjdGl2ZV9uYW1lcy5qc29uIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9kYXRhL29iamVjdGl2ZV90eXBlcy5qc29uIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9kYXRhL29iamVjdGl2ZXMuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2RhdGEvd29ybGRfbmFtZXMuanNvbiIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2FwaS5qcyIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC9PdmVydmlldy5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvVHJhY2tlci5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvb3ZlcnZpZXcvTWF0Y2guanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L292ZXJ2aWV3L1BpZS5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvb3ZlcnZpZXcvUmVnaW9uTWF0Y2hlcy5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvb3ZlcnZpZXcvUmVnaW9uV29ybGRzLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC9vdmVydmlldy9TY29yZS5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9BcnJvdy5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9NYXBEZXRhaWxzLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC90cmFja2VyL01hcE9iamVjdGl2ZS5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9NYXBTZWN0aW9uLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2pzeC90cmFja2VyL01hcHMuanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L3RyYWNrZXIvU2NvcmVib2FyZC5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9TcHJpdGUuanN4IiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvanN4L3RyYWNrZXIvZ3VpbGRzL0d1aWxkcy5qc3giLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9qc3gvdHJhY2tlci9ndWlsZHMvT2JqZWN0aXZlLmpzeCIsIkQ6L2luZXQvaGVyb2t1L2d3Mncydy1yZWFjdC9wdWJsaWMvanMvc3JjL2xpYi9kYXRlLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvb3ZlcnZpZXcuanMiLCJEOi9pbmV0L2hlcm9rdS9ndzJ3MnctcmVhY3QvcHVibGljL2pzL3NyYy9zdGF0aWNEYXRhLmpzIiwiRDovaW5ldC9oZXJva3UvZ3cydzJ3LXJlYWN0L3B1YmxpYy9qcy9zcmMvdHJhY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzViQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMThCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxyXG4qXHJcbipcdGNvbmZpZ1xyXG4qXHJcbiovXHJcblxyXG4gdmFyIGFwcCA9IHdpbmRvdy5hcHAgPSB7XHJcblx0c3RhdGU6IHtcclxuXHRcdGxhbmc6ICdlbicsXHJcblx0fSxcclxuXHRndWlsZHM6IHt9LFxyXG4gfTtcclxuXHJcblxyXG5cclxuLypcclxuKlxyXG4qXHRSb3V0aW5nXHJcbipcclxuKi9cclxuXHJcbnZhciBwYWdlID0gcmVxdWlyZSgncGFnZScpO1xyXG5wYWdlKCcvOmxhbmdTbHVnKGVufGRlfGVzfGZyKT8nLCByZXF1aXJlKCcuL292ZXJ2aWV3JykpO1xyXG5wYWdlKCcvOmxhbmdTbHVnKGVufGRlfGVzfGZyKS86d29ybGRTbHVnKFthLXotXSspJywgcmVxdWlyZSgnLi90cmFja2VyJykpO1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuXHRwYWdlLnN0YXJ0KHtcclxuXHRcdGNsaWNrOiB0cnVlLFxyXG5cdFx0cG9wc3RhdGU6IGZhbHNlLFxyXG5cdFx0ZGlzcGF0Y2g6IHRydWUsXHJcblx0fSk7XHJcbn0pO1xyXG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIlxuOyhmdW5jdGlvbigpe1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGluaXRpYWwgZGlzcGF0Y2guXG4gICAqL1xuXG4gIHZhciBkaXNwYXRjaCA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEJhc2UgcGF0aC5cbiAgICovXG5cbiAgdmFyIGJhc2UgPSAnJztcblxuICAvKipcbiAgICogUnVubmluZyBmbGFnLlxuICAgKi9cblxuICB2YXIgcnVubmluZztcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYHBhdGhgIHdpdGggY2FsbGJhY2sgYGZuKClgLFxuICAgKiBvciByb3V0ZSBgcGF0aGAsIG9yIGBwYWdlLnN0YXJ0KClgLlxuICAgKlxuICAgKiAgIHBhZ2UoZm4pO1xuICAgKiAgIHBhZ2UoJyonLCBmbik7XG4gICAqICAgcGFnZSgnL3VzZXIvOmlkJywgbG9hZCwgdXNlcik7XG4gICAqICAgcGFnZSgnL3VzZXIvJyArIHVzZXIuaWQsIHsgc29tZTogJ3RoaW5nJyB9KTtcbiAgICogICBwYWdlKCcvdXNlci8nICsgdXNlci5pZCk7XG4gICAqICAgcGFnZSgpO1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gcGF0aFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbi4uLlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBwYWdlKHBhdGgsIGZuKSB7XG4gICAgLy8gPGNhbGxiYWNrPlxuICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBwYXRoKSB7XG4gICAgICByZXR1cm4gcGFnZSgnKicsIHBhdGgpO1xuICAgIH1cblxuICAgIC8vIHJvdXRlIDxwYXRoPiB0byA8Y2FsbGJhY2sgLi4uPlxuICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBmbikge1xuICAgICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHBhdGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcGFnZS5jYWxsYmFja3MucHVzaChyb3V0ZS5taWRkbGV3YXJlKGFyZ3VtZW50c1tpXSkpO1xuICAgICAgfVxuICAgIC8vIHNob3cgPHBhdGg+IHdpdGggW3N0YXRlXVxuICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHBhdGgpIHtcbiAgICAgIHBhZ2Uuc2hvdyhwYXRoLCBmbik7XG4gICAgLy8gc3RhcnQgW29wdGlvbnNdXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhZ2Uuc3RhcnQocGF0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZ1bmN0aW9ucy5cbiAgICovXG5cbiAgcGFnZS5jYWxsYmFja3MgPSBbXTtcblxuICAvKipcbiAgICogR2V0IG9yIHNldCBiYXNlcGF0aCB0byBgcGF0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UuYmFzZSA9IGZ1bmN0aW9uKHBhdGgpe1xuICAgIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBiYXNlO1xuICAgIGJhc2UgPSBwYXRoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBCaW5kIHdpdGggdGhlIGdpdmVuIGBvcHRpb25zYC5cbiAgICpcbiAgICogT3B0aW9uczpcbiAgICpcbiAgICogICAgLSBgY2xpY2tgIGJpbmQgdG8gY2xpY2sgZXZlbnRzIFt0cnVlXVxuICAgKiAgICAtIGBwb3BzdGF0ZWAgYmluZCB0byBwb3BzdGF0ZSBbdHJ1ZV1cbiAgICogICAgLSBgZGlzcGF0Y2hgIHBlcmZvcm0gaW5pdGlhbCBkaXNwYXRjaCBbdHJ1ZV1cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdGFydCA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChydW5uaW5nKSByZXR1cm47XG4gICAgcnVubmluZyA9IHRydWU7XG4gICAgaWYgKGZhbHNlID09PSBvcHRpb25zLmRpc3BhdGNoKSBkaXNwYXRjaCA9IGZhbHNlO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5wb3BzdGF0ZSkgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25wb3BzdGF0ZSwgZmFsc2UpO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5jbGljaykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jbGljaywgZmFsc2UpO1xuICAgIGlmICghZGlzcGF0Y2gpIHJldHVybjtcbiAgICB2YXIgdXJsID0gbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2ggKyBsb2NhdGlvbi5oYXNoO1xuICAgIHBhZ2UucmVwbGFjZSh1cmwsIG51bGwsIHRydWUsIGRpc3BhdGNoKTtcbiAgfTtcblxuICAvKipcbiAgICogVW5iaW5kIGNsaWNrIGFuZCBwb3BzdGF0ZSBldmVudCBoYW5kbGVycy5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdG9wID0gZnVuY3Rpb24oKXtcbiAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNsaWNrLCBmYWxzZSk7XG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3cgYHBhdGhgIHdpdGggb3B0aW9uYWwgYHN0YXRlYCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRpc3BhdGNoXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc2hvdyA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBkaXNwYXRjaCl7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBpZiAoZmFsc2UgIT09IGRpc3BhdGNoKSBwYWdlLmRpc3BhdGNoKGN0eCk7XG4gICAgaWYgKCFjdHgudW5oYW5kbGVkKSBjdHgucHVzaFN0YXRlKCk7XG4gICAgcmV0dXJuIGN0eDtcbiAgfTtcblxuICAvKipcbiAgICogUmVwbGFjZSBgcGF0aGAgd2l0aCBvcHRpb25hbCBgc3RhdGVgIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UucmVwbGFjZSA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBpbml0LCBkaXNwYXRjaCl7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBjdHguaW5pdCA9IGluaXQ7XG4gICAgaWYgKG51bGwgPT0gZGlzcGF0Y2gpIGRpc3BhdGNoID0gdHJ1ZTtcbiAgICBpZiAoZGlzcGF0Y2gpIHBhZ2UuZGlzcGF0Y2goY3R4KTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIHRoZSBnaXZlbiBgY3R4YC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgcGFnZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKGN0eCl7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHZhciBmbiA9IHBhZ2UuY2FsbGJhY2tzW2krK107XG4gICAgICBpZiAoIWZuKSByZXR1cm4gdW5oYW5kbGVkKGN0eCk7XG4gICAgICBmbihjdHgsIG5leHQpO1xuICAgIH1cblxuICAgIG5leHQoKTtcbiAgfTtcblxuICAvKipcbiAgICogVW5oYW5kbGVkIGBjdHhgLiBXaGVuIGl0J3Mgbm90IHRoZSBpbml0aWFsXG4gICAqIHBvcHN0YXRlIHRoZW4gcmVkaXJlY3QuIElmIHlvdSB3aXNoIHRvIGhhbmRsZVxuICAgKiA0MDRzIG9uIHlvdXIgb3duIHVzZSBgcGFnZSgnKicsIGNhbGxiYWNrKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29udGV4dH0gY3R4XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiB1bmhhbmRsZWQoY3R4KSB7XG4gICAgdmFyIGN1cnJlbnQgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuICAgIGlmIChjdXJyZW50ID09IGN0eC5jYW5vbmljYWxQYXRoKSByZXR1cm47XG4gICAgcGFnZS5zdG9wKCk7XG4gICAgY3R4LnVuaGFuZGxlZCA9IHRydWU7XG4gICAgd2luZG93LmxvY2F0aW9uID0gY3R4LmNhbm9uaWNhbFBhdGg7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5ldyBcInJlcXVlc3RcIiBgQ29udGV4dGBcbiAgICogd2l0aCB0aGUgZ2l2ZW4gYHBhdGhgIGFuZCBvcHRpb25hbCBpbml0aWFsIGBzdGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBDb250ZXh0KHBhdGgsIHN0YXRlKSB7XG4gICAgaWYgKCcvJyA9PSBwYXRoWzBdICYmIDAgIT0gcGF0aC5pbmRleE9mKGJhc2UpKSBwYXRoID0gYmFzZSArIHBhdGg7XG4gICAgdmFyIGkgPSBwYXRoLmluZGV4T2YoJz8nKTtcblxuICAgIHRoaXMuY2Fub25pY2FsUGF0aCA9IHBhdGg7XG4gICAgdGhpcy5wYXRoID0gcGF0aC5yZXBsYWNlKGJhc2UsICcnKSB8fCAnLyc7XG5cbiAgICB0aGlzLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlIHx8IHt9O1xuICAgIHRoaXMuc3RhdGUucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5xdWVyeXN0cmluZyA9IH5pID8gcGF0aC5zbGljZShpICsgMSkgOiAnJztcbiAgICB0aGlzLnBhdGhuYW1lID0gfmkgPyBwYXRoLnNsaWNlKDAsIGkpIDogcGF0aDtcbiAgICB0aGlzLnBhcmFtcyA9IFtdO1xuXG4gICAgLy8gZnJhZ21lbnRcbiAgICB0aGlzLmhhc2ggPSAnJztcbiAgICBpZiAoIX50aGlzLnBhdGguaW5kZXhPZignIycpKSByZXR1cm47XG4gICAgdmFyIHBhcnRzID0gdGhpcy5wYXRoLnNwbGl0KCcjJyk7XG4gICAgdGhpcy5wYXRoID0gcGFydHNbMF07XG4gICAgdGhpcy5oYXNoID0gcGFydHNbMV0gfHwgJyc7XG4gICAgdGhpcy5xdWVyeXN0cmluZyA9IHRoaXMucXVlcnlzdHJpbmcuc3BsaXQoJyMnKVswXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgYENvbnRleHRgLlxuICAgKi9cblxuICBwYWdlLkNvbnRleHQgPSBDb250ZXh0O1xuXG4gIC8qKlxuICAgKiBQdXNoIHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgQ29udGV4dC5wcm90b3R5cGUucHVzaFN0YXRlID0gZnVuY3Rpb24oKXtcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBjb250ZXh0IHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGBSb3V0ZWAgd2l0aCB0aGUgZ2l2ZW4gSFRUUCBgcGF0aGAsXG4gICAqIGFuZCBhbiBhcnJheSBvZiBgY2FsbGJhY2tzYCBhbmQgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgIC0gYHNlbnNpdGl2ZWAgICAgZW5hYmxlIGNhc2Utc2Vuc2l0aXZlIHJvdXRlc1xuICAgKiAgIC0gYHN0cmljdGAgICAgICAgZW5hYmxlIHN0cmljdCBtYXRjaGluZyBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFJvdXRlKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMubWV0aG9kID0gJ0dFVCc7XG4gICAgdGhpcy5yZWdleHAgPSBwYXRodG9SZWdleHAocGF0aFxuICAgICAgLCB0aGlzLmtleXMgPSBbXVxuICAgICAgLCBvcHRpb25zLnNlbnNpdGl2ZVxuICAgICAgLCBvcHRpb25zLnN0cmljdCk7XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIGBSb3V0ZWAuXG4gICAqL1xuXG4gIHBhZ2UuUm91dGUgPSBSb3V0ZTtcblxuICAvKipcbiAgICogUmV0dXJuIHJvdXRlIG1pZGRsZXdhcmUgd2l0aFxuICAgKiB0aGUgZ2l2ZW4gY2FsbGJhY2sgYGZuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLm1pZGRsZXdhcmUgPSBmdW5jdGlvbihmbil7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBmdW5jdGlvbihjdHgsIG5leHQpe1xuICAgICAgaWYgKHNlbGYubWF0Y2goY3R4LnBhdGgsIGN0eC5wYXJhbXMpKSByZXR1cm4gZm4oY3R4LCBuZXh0KTtcbiAgICAgIG5leHQoKTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIHJvdXRlIG1hdGNoZXMgYHBhdGhgLCBpZiBzb1xuICAgKiBwb3B1bGF0ZSBgcGFyYW1zYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtBcnJheX0gcGFyYW1zXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihwYXRoLCBwYXJhbXMpe1xuICAgIHZhciBrZXlzID0gdGhpcy5rZXlzXG4gICAgICAsIHFzSW5kZXggPSBwYXRoLmluZGV4T2YoJz8nKVxuICAgICAgLCBwYXRobmFtZSA9IH5xc0luZGV4ID8gcGF0aC5zbGljZSgwLCBxc0luZGV4KSA6IHBhdGhcbiAgICAgICwgbSA9IHRoaXMucmVnZXhwLmV4ZWMocGF0aG5hbWUpO1xuXG4gICAgaWYgKCFtKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMSwgbGVuID0gbS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaSAtIDFdO1xuXG4gICAgICB2YXIgdmFsID0gJ3N0cmluZycgPT0gdHlwZW9mIG1baV1cbiAgICAgICAgPyBkZWNvZGVVUklDb21wb25lbnQobVtpXSlcbiAgICAgICAgOiBtW2ldO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHBhcmFtc1trZXkubmFtZV0gPSB1bmRlZmluZWQgIT09IHBhcmFtc1trZXkubmFtZV1cbiAgICAgICAgICA/IHBhcmFtc1trZXkubmFtZV1cbiAgICAgICAgICA6IHZhbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmFtcy5wdXNoKHZhbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZSB0aGUgZ2l2ZW4gcGF0aCBzdHJpbmcsXG4gICAqIHJldHVybmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQW4gZW1wdHkgYXJyYXkgc2hvdWxkIGJlIHBhc3NlZCxcbiAgICogd2hpY2ggd2lsbCBjb250YWluIHRoZSBwbGFjZWhvbGRlclxuICAgKiBrZXkgbmFtZXMuIEZvciBleGFtcGxlIFwiL3VzZXIvOmlkXCIgd2lsbFxuICAgKiB0aGVuIGNvbnRhaW4gW1wiaWRcIl0uXG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ3xSZWdFeHB8QXJyYXl9IHBhdGhcbiAgICogQHBhcmFtICB7QXJyYXl9IGtleXNcbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gc2Vuc2l0aXZlXG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IHN0cmljdFxuICAgKiBAcmV0dXJuIHtSZWdFeHB9XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiBwYXRodG9SZWdleHAocGF0aCwga2V5cywgc2Vuc2l0aXZlLCBzdHJpY3QpIHtcbiAgICBpZiAocGF0aCBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHBhdGg7XG4gICAgaWYgKHBhdGggaW5zdGFuY2VvZiBBcnJheSkgcGF0aCA9ICcoJyArIHBhdGguam9pbignfCcpICsgJyknO1xuICAgIHBhdGggPSBwYXRoXG4gICAgICAuY29uY2F0KHN0cmljdCA/ICcnIDogJy8/JylcbiAgICAgIC5yZXBsYWNlKC9cXC9cXCgvZywgJyg/Oi8nKVxuICAgICAgLnJlcGxhY2UoLyhcXC8pPyhcXC4pPzooXFx3KykoPzooXFwoLio/XFwpKSk/KFxcPyk/L2csIGZ1bmN0aW9uKF8sIHNsYXNoLCBmb3JtYXQsIGtleSwgY2FwdHVyZSwgb3B0aW9uYWwpe1xuICAgICAgICBrZXlzLnB1c2goeyBuYW1lOiBrZXksIG9wdGlvbmFsOiAhISBvcHRpb25hbCB9KTtcbiAgICAgICAgc2xhc2ggPSBzbGFzaCB8fCAnJztcbiAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgKyAob3B0aW9uYWwgPyAnJyA6IHNsYXNoKVxuICAgICAgICAgICsgJyg/OidcbiAgICAgICAgICArIChvcHRpb25hbCA/IHNsYXNoIDogJycpXG4gICAgICAgICAgKyAoZm9ybWF0IHx8ICcnKSArIChjYXB0dXJlIHx8IChmb3JtYXQgJiYgJyhbXi8uXSs/KScgfHwgJyhbXi9dKz8pJykpICsgJyknXG4gICAgICAgICAgKyAob3B0aW9uYWwgfHwgJycpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8oW1xcLy5dKS9nLCAnXFxcXCQxJylcbiAgICAgIC5yZXBsYWNlKC9cXCovZywgJyguKiknKTtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXicgKyBwYXRoICsgJyQnLCBzZW5zaXRpdmUgPyAnJyA6ICdpJyk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFwicG9wdWxhdGVcIiBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9ucG9wc3RhdGUoZSkge1xuICAgIGlmIChlLnN0YXRlKSB7XG4gICAgICB2YXIgcGF0aCA9IGUuc3RhdGUucGF0aDtcbiAgICAgIHBhZ2UucmVwbGFjZShwYXRoLCBlLnN0YXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFwiY2xpY2tcIiBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uY2xpY2soZSkge1xuICAgIGlmICgxICE9IHdoaWNoKGUpKSByZXR1cm47XG4gICAgaWYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5zaGlmdEtleSkgcmV0dXJuO1xuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcblxuICAgIC8vIGVuc3VyZSBsaW5rXG4gICAgdmFyIGVsID0gZS50YXJnZXQ7XG4gICAgd2hpbGUgKGVsICYmICdBJyAhPSBlbC5ub2RlTmFtZSkgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIGlmICghZWwgfHwgJ0EnICE9IGVsLm5vZGVOYW1lKSByZXR1cm47XG5cbiAgICAvLyBlbnN1cmUgbm9uLWhhc2ggZm9yIHRoZSBzYW1lIHBhdGhcbiAgICB2YXIgbGluayA9IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGlmIChlbC5wYXRobmFtZSA9PSBsb2NhdGlvbi5wYXRobmFtZSAmJiAoZWwuaGFzaCB8fCAnIycgPT0gbGluaykpIHJldHVybjtcblxuICAgIC8vIGNoZWNrIHRhcmdldFxuICAgIGlmIChlbC50YXJnZXQpIHJldHVybjtcblxuICAgIC8vIHgtb3JpZ2luXG4gICAgaWYgKCFzYW1lT3JpZ2luKGVsLmhyZWYpKSByZXR1cm47XG5cbiAgICAvLyByZWJ1aWxkIHBhdGhcbiAgICB2YXIgcGF0aCA9IGVsLnBhdGhuYW1lICsgZWwuc2VhcmNoICsgKGVsLmhhc2ggfHwgJycpO1xuXG4gICAgLy8gc2FtZSBwYWdlXG4gICAgdmFyIG9yaWcgPSBwYXRoICsgZWwuaGFzaDtcblxuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoYmFzZSwgJycpO1xuICAgIGlmIChiYXNlICYmIG9yaWcgPT0gcGF0aCkgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBhZ2Uuc2hvdyhvcmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBidXR0b24uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHdoaWNoKGUpIHtcbiAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgcmV0dXJuIG51bGwgPT0gZS53aGljaFxuICAgICAgPyBlLmJ1dHRvblxuICAgICAgOiBlLndoaWNoO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGBocmVmYCBpcyB0aGUgc2FtZSBvcmlnaW4uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNhbWVPcmlnaW4oaHJlZikge1xuICAgIHZhciBvcmlnaW4gPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0bmFtZTtcbiAgICBpZiAobG9jYXRpb24ucG9ydCkgb3JpZ2luICs9ICc6JyArIGxvY2F0aW9uLnBvcnQ7XG4gICAgcmV0dXJuIDAgPT0gaHJlZi5pbmRleE9mKG9yaWdpbik7XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIGBwYWdlYC5cbiAgICovXG5cbiAgaWYgKCd1bmRlZmluZWQnID09IHR5cGVvZiBtb2R1bGUpIHtcbiAgICB3aW5kb3cucGFnZSA9IHBhZ2U7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuICB9XG5cbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cz17XHJcblx0XCJlblwiOiB7XHJcblx0XHRcInNvcnRcIjogMSxcclxuXHRcdFwic2x1Z1wiOiBcImVuXCIsXHJcblx0XHRcImxhYmVsXCI6IFwiRU5cIixcclxuXHRcdFwibGlua1wiOiBcIi9lblwiLFxyXG5cdFx0XCJuYW1lXCI6IFwiRW5nbGlzaFwiXHJcblx0fSxcclxuXHRcImRlXCI6IHtcclxuXHRcdFwic29ydFwiOiAyLFxyXG5cdFx0XCJzbHVnXCI6IFwiZGVcIixcclxuXHRcdFwibGFiZWxcIjogXCJERVwiLFxyXG5cdFx0XCJsaW5rXCI6IFwiL2RlXCIsXHJcblx0XHRcIm5hbWVcIjogXCJEZXV0c2NoXCJcclxuXHR9LFxyXG5cdFwiZXNcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDMsXHJcblx0XHRcInNsdWdcIjogXCJlc1wiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkVTXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZXNcIixcclxuXHRcdFwibmFtZVwiOiBcIkVzcGHDsW9sXCJcclxuXHR9LFxyXG5cdFwiZnJcIjoge1xyXG5cdFx0XCJzb3J0XCI6IDQsXHJcblx0XHRcInNsdWdcIjogXCJmclwiLFxyXG5cdFx0XCJsYWJlbFwiOiBcIkZSXCIsXHJcblx0XHRcImxpbmtcIjogXCIvZnJcIixcclxuXHRcdFwibmFtZVwiOiBcIkZyYW7Dp2Fpc1wiXHJcblx0fSxcclxufSIsIm1vZHVsZS5leHBvcnRzPXtcclxuXHRcIjFcIjoge1wiaWRcIjogXCIxXCIsIFwiZW5cIjogXCJPdmVybG9va1wiLCBcImZyXCI6IFwiQmVsdsOpZMOocmVcIiwgXCJlc1wiOiBcIk1pcmFkb3JcIiwgXCJkZVwiOiBcIkF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiBcIjJcIiwgXCJlblwiOiBcIlZhbGxleVwiLCBcImZyXCI6IFwiVmFsbMOpZVwiLCBcImVzXCI6IFwiVmFsbGVcIiwgXCJkZVwiOiBcIlRhbFwifSxcclxuXHRcIjNcIjoge1wiaWRcIjogXCIzXCIsIFwiZW5cIjogXCJMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlc1wiLCBcImVzXCI6IFwiVmVnYVwiLCBcImRlXCI6IFwiVGllZmxhbmRcIn0sXHJcblx0XCI0XCI6IHtcImlkXCI6IFwiNFwiLCBcImVuXCI6IFwiR29sYW50YSBDbGVhcmluZ1wiLCBcImZyXCI6IFwiQ2xhaXJpw6hyZSBkZSBHb2xhbnRhXCIsIFwiZXNcIjogXCJDbGFybyBHb2xhbnRhXCIsIFwiZGVcIjogXCJHb2xhbnRhLUxpY2h0dW5nXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiBcIjVcIiwgXCJlblwiOiBcIlBhbmdsb3NzIFJpc2VcIiwgXCJmclwiOiBcIk1vbnTDqWUgZGUgUGFuZ2xvc3NcIiwgXCJlc1wiOiBcIkNvbGluYSBQYW5nbG9zc1wiLCBcImRlXCI6IFwiUGFuZ2xvc3MtQW5ow7ZoZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogXCI2XCIsIFwiZW5cIjogXCJTcGVsZGFuIENsZWFyY3V0XCIsIFwiZnJcIjogXCJGb3LDqnQgcmFzw6llIGRlIFNwZWxkYW5cIiwgXCJlc1wiOiBcIkNsYXJvIEVzcGVsZGlhXCIsIFwiZGVcIjogXCJTcGVsZGFuIEthaGxzY2hsYWdcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IFwiN1wiLCBcImVuXCI6IFwiRGFuZWxvbiBQYXNzYWdlXCIsIFwiZnJcIjogXCJQYXNzYWdlIERhbmVsb25cIiwgXCJlc1wiOiBcIlBhc2FqZSBEYW5lbG9uXCIsIFwiZGVcIjogXCJEYW5lbG9uLVBhc3NhZ2VcIn0sXHJcblx0XCI4XCI6IHtcImlkXCI6IFwiOFwiLCBcImVuXCI6IFwiVW1iZXJnbGFkZSBXb29kc1wiLCBcImZyXCI6IFwiQm9pcyBkJ09tYnJlY2xhaXJcIiwgXCJlc1wiOiBcIkJvc3F1ZXMgQ2xhcm9zb21icmFcIiwgXCJkZVwiOiBcIlVtYmVybGljaHR1bmctRm9yc3RcIn0sXHJcblx0XCI5XCI6IHtcImlkXCI6IFwiOVwiLCBcImVuXCI6IFwiU3RvbmVtaXN0IENhc3RsZVwiLCBcImZyXCI6IFwiQ2jDonRlYXUgQnJ1bWVwaWVycmVcIiwgXCJlc1wiOiBcIkNhc3RpbGxvIFBpZWRyYW5pZWJsYVwiLCBcImRlXCI6IFwiU2NobG9zcyBTdGVpbm5lYmVsXCJ9LFxyXG5cdFwiMTBcIjoge1wiaWRcIjogXCIxMFwiLCBcImVuXCI6IFwiUm9ndWUncyBRdWFycnlcIiwgXCJmclwiOiBcIkNhcnJpw6hyZSBkZXMgdm9sZXVyc1wiLCBcImVzXCI6IFwiQ2FudGVyYSBkZWwgUMOtY2Fyb1wiLCBcImRlXCI6IFwiU2NodXJrZW5icnVjaFwifSxcclxuXHRcIjExXCI6IHtcImlkXCI6IFwiMTFcIiwgXCJlblwiOiBcIkFsZG9uJ3MgTGVkZ2VcIiwgXCJmclwiOiBcIkNvcm5pY2hlIGQnQWxkb25cIiwgXCJlc1wiOiBcIkNvcm5pc2EgZGUgQWxkb25cIiwgXCJkZVwiOiBcIkFsZG9ucyBWb3JzcHJ1bmdcIn0sXHJcblx0XCIxMlwiOiB7XCJpZFwiOiBcIjEyXCIsIFwiZW5cIjogXCJXaWxkY3JlZWsgUnVuXCIsIFwiZnJcIjogXCJQaXN0ZSBkdSBSdWlzc2VhdSBzYXV2YWdlXCIsIFwiZXNcIjogXCJQaXN0YSBBcnJveW9zYWx2YWplXCIsIFwiZGVcIjogXCJXaWxkYmFjaHN0cmVja2VcIn0sXHJcblx0XCIxM1wiOiB7XCJpZFwiOiBcIjEzXCIsIFwiZW5cIjogXCJKZXJyaWZlcidzIFNsb3VnaFwiLCBcImZyXCI6IFwiQm91cmJpZXIgZGUgSmVycmlmZXJcIiwgXCJlc1wiOiBcIkNlbmFnYWwgZGUgSmVycmlmZXJcIiwgXCJkZVwiOiBcIkplcnJpZmVycyBTdW1wZmxvY2hcIn0sXHJcblx0XCIxNFwiOiB7XCJpZFwiOiBcIjE0XCIsIFwiZW5cIjogXCJLbG92YW4gR3VsbHlcIiwgXCJmclwiOiBcIlBldGl0IHJhdmluIGRlIEtsb3ZhblwiLCBcImVzXCI6IFwiQmFycmFuY28gS2xvdmFuXCIsIFwiZGVcIjogXCJLbG92YW4tU2Vua2VcIn0sXHJcblx0XCIxNVwiOiB7XCJpZFwiOiBcIjE1XCIsIFwiZW5cIjogXCJMYW5nb3IgR3VsY2hcIiwgXCJmclwiOiBcIlJhdmluIGRlIExhbmdvclwiLCBcImVzXCI6IFwiQmFycmFuY28gTGFuZ29yXCIsIFwiZGVcIjogXCJMYW5nb3IgLSBTY2hsdWNodFwifSxcclxuXHRcIjE2XCI6IHtcImlkXCI6IFwiMTZcIiwgXCJlblwiOiBcIlF1ZW50aW4gTGFrZVwiLCBcImZyXCI6IFwiTGFjIFF1ZW50aW5cIiwgXCJlc1wiOiBcIkxhZ28gUXVlbnRpblwiLCBcImRlXCI6IFwiUXVlbnRpbnNlZVwifSxcclxuXHRcIjE3XCI6IHtcImlkXCI6IFwiMTdcIiwgXCJlblwiOiBcIk1lbmRvbidzIEdhcFwiLCBcImZyXCI6IFwiRmFpbGxlIGRlIE1lbmRvblwiLCBcImVzXCI6IFwiWmFuamEgZGUgTWVuZG9uXCIsIFwiZGVcIjogXCJNZW5kb25zIFNwYWx0XCJ9LFxyXG5cdFwiMThcIjoge1wiaWRcIjogXCIxOFwiLCBcImVuXCI6IFwiQW56YWxpYXMgUGFzc1wiLCBcImZyXCI6IFwiQ29sIGQnQW56YWxpYXNcIiwgXCJlc1wiOiBcIlBhc28gQW56YWxpYXNcIiwgXCJkZVwiOiBcIkFuemFsaWFzLVBhc3NcIn0sXHJcblx0XCIxOVwiOiB7XCJpZFwiOiBcIjE5XCIsIFwiZW5cIjogXCJPZ3Jld2F0Y2ggQ3V0XCIsIFwiZnJcIjogXCJQZXJjw6llIGRlIEdhcmRvZ3JlXCIsIFwiZXNcIjogXCJUYWpvIGRlIGxhIEd1YXJkaWEgZGVsIE9ncm9cIiwgXCJkZVwiOiBcIk9nZXJ3YWNodC1LYW5hbFwifSxcclxuXHRcIjIwXCI6IHtcImlkXCI6IFwiMjBcIiwgXCJlblwiOiBcIlZlbG9rYSBTbG9wZVwiLCBcImZyXCI6IFwiRmxhbmMgZGUgVmVsb2thXCIsIFwiZXNcIjogXCJQZW5kaWVudGUgVmVsb2thXCIsIFwiZGVcIjogXCJWZWxva2EtSGFuZ1wifSxcclxuXHRcIjIxXCI6IHtcImlkXCI6IFwiMjFcIiwgXCJlblwiOiBcIkR1cmlvcyBHdWxjaFwiLCBcImZyXCI6IFwiUmF2aW4gZGUgRHVyaW9zXCIsIFwiZXNcIjogXCJCYXJyYW5jbyBEdXJpb3NcIiwgXCJkZVwiOiBcIkR1cmlvcy1TY2hsdWNodFwifSxcclxuXHRcIjIyXCI6IHtcImlkXCI6IFwiMjJcIiwgXCJlblwiOiBcIkJyYXZvc3QgRXNjYXJwbWVudFwiLCBcImZyXCI6IFwiRmFsYWlzZSBkZSBCcmF2b3N0XCIsIFwiZXNcIjogXCJFc2NhcnBhZHVyYSBCcmF2b3N0XCIsIFwiZGVcIjogXCJCcmF2b3N0LUFiaGFuZ1wifSxcclxuXHRcIjIzXCI6IHtcImlkXCI6IFwiMjNcIiwgXCJlblwiOiBcIkdhcnJpc29uXCIsIFwiZnJcIjogXCJHYXJuaXNvblwiLCBcImVzXCI6IFwiRnVlcnRlXCIsIFwiZGVcIjogXCJGZXN0dW5nXCJ9LFxyXG5cdFwiMjRcIjoge1wiaWRcIjogXCIyNFwiLCBcImVuXCI6IFwiQ2hhbXBpb24ncyBEZW1lbnNlXCIsIFwiZnJcIjogXCJGaWVmIGR1IGNoYW1waW9uXCIsIFwiZXNcIjogXCJEb21pbmlvIGRlbCBDYW1wZcOzblwiLCBcImRlXCI6IFwiTGFuZGd1dCBkZXMgQ2hhbXBpb25zXCJ9LFxyXG5cdFwiMjVcIjoge1wiaWRcIjogXCIyNVwiLCBcImVuXCI6IFwiUmVkYnJpYXJcIiwgXCJmclwiOiBcIkJydXllcm91Z2VcIiwgXCJlc1wiOiBcIlphcnphcnJvamFcIiwgXCJkZVwiOiBcIlJvdGRvcm5zdHJhdWNoXCJ9LFxyXG5cdFwiMjZcIjoge1wiaWRcIjogXCIyNlwiLCBcImVuXCI6IFwiR3JlZW5sYWtlXCIsIFwiZnJcIjogXCJMYWMgVmVydFwiLCBcImVzXCI6IFwiTGFnb3ZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnNlZVwifSxcclxuXHRcIjI3XCI6IHtcImlkXCI6IFwiMjdcIiwgXCJlblwiOiBcIkFzY2Vuc2lvbiBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZGUgbCdBc2NlbnNpb25cIiwgXCJlc1wiOiBcIkJhaMOtYSBkZSBsYSBBc2NlbnNpw7NuXCIsIFwiZGVcIjogXCJCdWNodCBkZXMgQXVmc3RpZWdzXCJ9LFxyXG5cdFwiMjhcIjoge1wiaWRcIjogXCIyOFwiLCBcImVuXCI6IFwiRGF3bidzIEV5cmllXCIsIFwiZnJcIjogXCJQcm9tb250b2lyZSBkZSBsJ2F1YmVcIiwgXCJlc1wiOiBcIkFndWlsZXJhIGRlbCBBbGJhXCIsIFwiZGVcIjogXCJIb3JzdCBkZXIgTW9yZ2VuZGFtbWVydW5nXCJ9LFxyXG5cdFwiMjlcIjoge1wiaWRcIjogXCIyOVwiLCBcImVuXCI6IFwiVGhlIFNwaXJpdGhvbG1lXCIsIFwiZnJcIjogXCJMJ2FudHJlIGRlcyBlc3ByaXRzXCIsIFwiZXNcIjogXCJMYSBJc2xldGEgRXNwaXJpdHVhbFwiLCBcImRlXCI6IFwiRGVyIEdlaXN0ZXJob2xtXCJ9LFxyXG5cdFwiMzBcIjoge1wiaWRcIjogXCIzMFwiLCBcImVuXCI6IFwiV29vZGhhdmVuXCIsIFwiZnJcIjogXCJHZW50ZXN5bHZlXCIsIFwiZXNcIjogXCJSZWZ1Z2lvIEZvcmVzdGFsXCIsIFwiZGVcIjogXCJXYWxkIC0gRnJlaXN0YXR0XCJ9LFxyXG5cdFwiMzFcIjoge1wiaWRcIjogXCIzMVwiLCBcImVuXCI6IFwiQXNrYWxpb24gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGQnQXNrYWxpb25cIiwgXCJlc1wiOiBcIkNvbGluYXMgQXNrYWxpb25cIiwgXCJkZVwiOiBcIkFza2FsaW9uIC0gSMO8Z2VsXCJ9LFxyXG5cdFwiMzJcIjoge1wiaWRcIjogXCIzMlwiLCBcImVuXCI6IFwiRXRoZXJvbiBIaWxsc1wiLCBcImZyXCI6IFwiQ29sbGluZXMgZCdFdGhlcm9uXCIsIFwiZXNcIjogXCJDb2xpbmFzIEV0aGVyb25cIiwgXCJkZVwiOiBcIkV0aGVyb24gLSBIw7xnZWxcIn0sXHJcblx0XCIzM1wiOiB7XCJpZFwiOiBcIjMzXCIsIFwiZW5cIjogXCJEcmVhbWluZyBCYXlcIiwgXCJmclwiOiBcIkJhaWUgZGVzIHLDqnZlc1wiLCBcImVzXCI6IFwiQmFow61hIE9uw61yaWNhXCIsIFwiZGVcIjogXCJUcmF1bWJ1Y2h0XCJ9LFxyXG5cdFwiMzRcIjoge1wiaWRcIjogXCIzNFwiLCBcImVuXCI6IFwiVmljdG9yJ3MgTG9kZ2VcIiwgXCJmclwiOiBcIlBhdmlsbG9uIGR1IHZhaW5xdWV1clwiLCBcImVzXCI6IFwiQWxiZXJndWUgZGVsIFZlbmNlZG9yXCIsIFwiZGVcIjogXCJTaWVnZXIgLSBIw7x0dGVcIn0sXHJcblx0XCIzNVwiOiB7XCJpZFwiOiBcIjM1XCIsIFwiZW5cIjogXCJHcmVlbmJyaWFyXCIsIFwiZnJcIjogXCJWZXJ0ZWJyYW5jaGVcIiwgXCJlc1wiOiBcIlphcnphdmVyZGVcIiwgXCJkZVwiOiBcIkdyw7xuc3RyYXVjaFwifSxcclxuXHRcIjM2XCI6IHtcImlkXCI6IFwiMzZcIiwgXCJlblwiOiBcIkJsdWVsYWtlXCIsIFwiZnJcIjogXCJMYWMgYmxldVwiLCBcImVzXCI6IFwiTGFnb2F6dWxcIiwgXCJkZVwiOiBcIkJsYXVzZWVcIn0sXHJcblx0XCIzN1wiOiB7XCJpZFwiOiBcIjM3XCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjM4XCI6IHtcImlkXCI6IFwiMzhcIiwgXCJlblwiOiBcIkxvbmd2aWV3XCIsIFwiZnJcIjogXCJMb25ndWV2dWVcIiwgXCJlc1wiOiBcIlZpc3RhbHVlbmdhXCIsIFwiZGVcIjogXCJXZWl0c2ljaHRcIn0sXHJcblx0XCIzOVwiOiB7XCJpZFwiOiBcIjM5XCIsIFwiZW5cIjogXCJUaGUgR29kc3dvcmRcIiwgXCJmclwiOiBcIkwnRXDDqWUgZGl2aW5lXCIsIFwiZXNcIjogXCJMYSBIb2phIERpdmluYVwiLCBcImRlXCI6IFwiRGFzIEdvdHRzY2h3ZXJ0XCJ9LFxyXG5cdFwiNDBcIjoge1wiaWRcIjogXCI0MFwiLCBcImVuXCI6IFwiQ2xpZmZzaWRlXCIsIFwiZnJcIjogXCJGbGFuYyBkZSBmYWxhaXNlXCIsIFwiZXNcIjogXCJEZXNwZcOxYWRlcm9cIiwgXCJkZVwiOiBcIkZlbHN3YW5kXCJ9LFxyXG5cdFwiNDFcIjoge1wiaWRcIjogXCI0MVwiLCBcImVuXCI6IFwiU2hhZGFyYW4gSGlsbHNcIiwgXCJmclwiOiBcIkNvbGxpbmVzIGRlIFNoYWRhcmFuXCIsIFwiZXNcIjogXCJDb2xpbmFzIFNoYWRhcmFuXCIsIFwiZGVcIjogXCJTaGFkYXJhbiBIw7xnZWxcIn0sXHJcblx0XCI0MlwiOiB7XCJpZFwiOiBcIjQyXCIsIFwiZW5cIjogXCJSZWRsYWtlXCIsIFwiZnJcIjogXCJSb3VnZWxhY1wiLCBcImVzXCI6IFwiTGFnb3Jyb2pvXCIsIFwiZGVcIjogXCJSb3RzZWVcIn0sXHJcblx0XCI0M1wiOiB7XCJpZFwiOiBcIjQzXCIsIFwiZW5cIjogXCJIZXJvJ3MgTG9kZ2VcIiwgXCJmclwiOiBcIlBhdmlsbG9uIGR1IEjDqXJvc1wiLCBcImVzXCI6IFwiQWxiZXJndWUgZGVsIEjDqXJvZVwiLCBcImRlXCI6IFwiSMO8dHRlIGRlcyBIZWxkZW5cIn0sXHJcblx0XCI0NFwiOiB7XCJpZFwiOiBcIjQ0XCIsIFwiZW5cIjogXCJEcmVhZGZhbGwgQmF5XCIsIFwiZnJcIjogXCJCYWllIGR1IE5vaXIgZMOpY2xpblwiLCBcImVzXCI6IFwiQmFow61hIFNhbHRvIEFjaWFnb1wiLCBcImRlXCI6IFwiU2NocmVja2Vuc2ZhbGwgLSBCdWNodFwifSxcclxuXHRcIjQ1XCI6IHtcImlkXCI6IFwiNDVcIiwgXCJlblwiOiBcIkJsdWVicmlhclwiLCBcImZyXCI6IFwiQnJ1eWF6dXJcIiwgXCJlc1wiOiBcIlphcnphenVsXCIsIFwiZGVcIjogXCJCbGF1ZG9ybnN0cmF1Y2hcIn0sXHJcblx0XCI0NlwiOiB7XCJpZFwiOiBcIjQ2XCIsIFwiZW5cIjogXCJHYXJyaXNvblwiLCBcImZyXCI6IFwiR2Fybmlzb25cIiwgXCJlc1wiOiBcIkZ1ZXJ0ZVwiLCBcImRlXCI6IFwiRmVzdHVuZ1wifSxcclxuXHRcIjQ3XCI6IHtcImlkXCI6IFwiNDdcIiwgXCJlblwiOiBcIlN1bm55aGlsbFwiLCBcImZyXCI6IFwiQ29sbGluZSBlbnNvbGVpbGzDqWVcIiwgXCJlc1wiOiBcIkNvbGluYSBTb2xlYWRhXCIsIFwiZGVcIjogXCJTb25uZW5saWNodGjDvGdlbFwifSxcclxuXHRcIjQ4XCI6IHtcImlkXCI6IFwiNDhcIiwgXCJlblwiOiBcIkZhaXRobGVhcFwiLCBcImZyXCI6IFwiRmVydmV1clwiLCBcImVzXCI6IFwiU2FsdG8gZGUgRmVcIiwgXCJkZVwiOiBcIkdsYXViZW5zc3BydW5nXCJ9LFxyXG5cdFwiNDlcIjoge1wiaWRcIjogXCI0OVwiLCBcImVuXCI6IFwiQmx1ZXZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgYmxldXZhbFwiLCBcImVzXCI6IFwiUmVmdWdpbyBWYWxsZWF6dWxcIiwgXCJkZVwiOiBcIkJsYXV0YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjUwXCI6IHtcImlkXCI6IFwiNTBcIiwgXCJlblwiOiBcIkJsdWV3YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1BenVyXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF6dWxcIiwgXCJkZVwiOiBcIkJsYXV3YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjUxXCI6IHtcImlkXCI6IFwiNTFcIiwgXCJlblwiOiBcIkFzdHJhbGhvbG1lXCIsIFwiZnJcIjogXCJBc3RyYWxob2xtZVwiLCBcImVzXCI6IFwiSXNsZXRhIEFzdHJhbFwiLCBcImRlXCI6IFwiQXN0cmFsaG9sbVwifSxcclxuXHRcIjUyXCI6IHtcImlkXCI6IFwiNTJcIiwgXCJlblwiOiBcIkFyYWgncyBIb3BlXCIsIFwiZnJcIjogXCJFc3BvaXIgZCdBcmFoXCIsIFwiZXNcIjogXCJFc3BlcmFuemEgZGUgQXJhaFwiLCBcImRlXCI6IFwiQXJhaHMgSG9mZm51bmdcIn0sXHJcblx0XCI1M1wiOiB7XCJpZFwiOiBcIjUzXCIsIFwiZW5cIjogXCJHcmVlbnZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFsdmVydFwiLCBcImVzXCI6IFwiUmVmdWdpbyBkZSBWYWxsZXZlcmRlXCIsIFwiZGVcIjogXCJHcsO8bnRhbCAtIFp1Zmx1Y2h0XCJ9LFxyXG5cdFwiNTRcIjoge1wiaWRcIjogXCI1NFwiLCBcImVuXCI6IFwiRm9naGF2ZW5cIiwgXCJmclwiOiBcIkhhdnJlIGdyaXNcIiwgXCJlc1wiOiBcIlJlZnVnaW8gTmVibGlub3NvXCIsIFwiZGVcIjogXCJOZWJlbCAtIEZyZWlzdGF0dFwifSxcclxuXHRcIjU1XCI6IHtcImlkXCI6IFwiNTVcIiwgXCJlblwiOiBcIlJlZHdhdGVyIExvd2xhbmRzXCIsIFwiZnJcIjogXCJCYXNzZXMgdGVycmVzIGRlIFJ1Ymljb25cIiwgXCJlc1wiOiBcIlRpZXJyYXMgQmFqYXMgZGUgQWd1YXJyb2phXCIsIFwiZGVcIjogXCJSb3R3YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjU2XCI6IHtcImlkXCI6IFwiNTZcIiwgXCJlblwiOiBcIlRoZSBUaXRhbnBhd1wiLCBcImZyXCI6IFwiQnJhcyBkdSB0aXRhblwiLCBcImVzXCI6IFwiTGEgR2FycmEgZGVsIFRpdMOhblwiLCBcImRlXCI6IFwiRGllIFRpdGFuZW5wcmFua2VcIn0sXHJcblx0XCI1N1wiOiB7XCJpZFwiOiBcIjU3XCIsIFwiZW5cIjogXCJDcmFndG9wXCIsIFwiZnJcIjogXCJTb21tZXQgZGUgbCdlc2NhcnBlbWVudFwiLCBcImVzXCI6IFwiQ3VtYnJlcGXDsWFzY29cIiwgXCJkZVwiOiBcIkZlbHNlbnNwaXR6ZVwifSxcclxuXHRcIjU4XCI6IHtcImlkXCI6IFwiNThcIiwgXCJlblwiOiBcIkdvZHNsb3JlXCIsIFwiZnJcIjogXCJEaXZpbmF0aW9uXCIsIFwiZXNcIjogXCJTYWJpZHVyw61hIGRlIGxvcyBEaW9zZXNcIiwgXCJkZVwiOiBcIkfDtnR0ZXJrdW5kZVwifSxcclxuXHRcIjU5XCI6IHtcImlkXCI6IFwiNTlcIiwgXCJlblwiOiBcIlJlZHZhbGUgUmVmdWdlXCIsIFwiZnJcIjogXCJSZWZ1Z2UgZGUgVmFscm91Z2VcIiwgXCJlc1wiOiBcIlJlZnVnaW8gVmFsbGVyb2pvXCIsIFwiZGVcIjogXCJSb3R0YWwgLSBadWZsdWNodFwifSxcclxuXHRcIjYwXCI6IHtcImlkXCI6IFwiNjBcIiwgXCJlblwiOiBcIlN0YXJncm92ZVwiLCBcImZyXCI6IFwiQm9zcXVldCBzdGVsbGFpcmVcIiwgXCJlc1wiOiBcIkFyYm9sZWRhIGRlIGxhcyBFc3RyZWxsYXNcIiwgXCJkZVwiOiBcIlN0ZXJuZW5oYWluXCJ9LFxyXG5cdFwiNjFcIjoge1wiaWRcIjogXCI2MVwiLCBcImVuXCI6IFwiR3JlZW53YXRlciBMb3dsYW5kc1wiLCBcImZyXCI6IFwiQmFzc2VzIHRlcnJlcyBkJ0VhdS1WZXJkb3lhbnRlXCIsIFwiZXNcIjogXCJUaWVycmFzIEJhamFzIGRlIEFndWF2ZXJkZVwiLCBcImRlXCI6IFwiR3LDvG53YXNzZXIgLSBUaWVmbGFuZFwifSxcclxuXHRcIjYyXCI6IHtcImlkXCI6IFwiNjJcIiwgXCJlblwiOiBcIlRlbXBsZSBvZiBMb3N0IFByYXllcnNcIiwgXCJmclwiOiBcIlRlbXBsZSBkZXMgcHJpw6hyZXMgcGVyZHVlc1wiLCBcImVzXCI6IFwiVGVtcGxvIGRlIGxhcyBQZWxnYXJpYXNcIiwgXCJkZVwiOiBcIlRlbXBlbCBkZXIgVmVybG9yZW5lbiBHZWJldGVcIn0sXHJcblx0XCI2M1wiOiB7XCJpZFwiOiBcIjYzXCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNjRcIjoge1wiaWRcIjogXCI2NFwiLCBcImVuXCI6IFwiQmF1ZXIncyBFc3RhdGVcIiwgXCJmclwiOiBcIkRvbWFpbmUgZGUgQmF1ZXJcIiwgXCJlc1wiOiBcIkhhY2llbmRhIGRlIEJhdWVyXCIsIFwiZGVcIjogXCJCYXVlcnMgQW53ZXNlblwifSxcclxuXHRcIjY1XCI6IHtcImlkXCI6IFwiNjVcIiwgXCJlblwiOiBcIk9yY2hhcmQgT3Zlcmxvb2tcIiwgXCJmclwiOiBcIkJlbHbDqWTDqHJlIGR1IFZlcmdlclwiLCBcImVzXCI6IFwiTWlyYWRvciBkZWwgSHVlcnRvXCIsIFwiZGVcIjogXCJPYnN0Z2FydGVuIEF1c3NpY2h0c3B1bmt0XCJ9LFxyXG5cdFwiNjZcIjoge1wiaWRcIjogXCI2NlwiLCBcImVuXCI6IFwiQ2FydmVyJ3MgQXNjZW50XCIsIFwiZnJcIjogXCJDw7R0ZSBkdSBjb3V0ZWF1XCIsIFwiZXNcIjogXCJBc2NlbnNvIGRlbCBUcmluY2hhZG9yXCIsIFwiZGVcIjogXCJBdWZzdGllZyBkZXMgU2Nobml0emVyc1wifSxcclxuXHRcIjY3XCI6IHtcImlkXCI6IFwiNjdcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI2OFwiOiB7XCJpZFwiOiBcIjY4XCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjY5XCI6IHtcImlkXCI6IFwiNjlcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI3MFwiOiB7XCJpZFwiOiBcIjcwXCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNzFcIjoge1wiaWRcIjogXCI3MVwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifSxcclxuXHRcIjcyXCI6IHtcImlkXCI6IFwiNzJcIiwgXCJlblwiOiBcIkNhcnZlcidzIEFzY2VudFwiLCBcImZyXCI6IFwiQ8O0dGUgZHUgY291dGVhdVwiLCBcImVzXCI6IFwiQXNjZW5zbyBkZWwgVHJpbmNoYWRvclwiLCBcImRlXCI6IFwiQXVmc3RpZWcgZGVzIFNjaG5pdHplcnNcIn0sXHJcblx0XCI3M1wiOiB7XCJpZFwiOiBcIjczXCIsIFwiZW5cIjogXCJPcmNoYXJkIE92ZXJsb29rXCIsIFwiZnJcIjogXCJCZWx2w6lkw6hyZSBkdSBWZXJnZXJcIiwgXCJlc1wiOiBcIk1pcmFkb3IgZGVsIEh1ZXJ0b1wiLCBcImRlXCI6IFwiT2JzdGdhcnRlbiBBdXNzaWNodHNwdW5rdFwifSxcclxuXHRcIjc0XCI6IHtcImlkXCI6IFwiNzRcIiwgXCJlblwiOiBcIkJhdWVyJ3MgRXN0YXRlXCIsIFwiZnJcIjogXCJEb21haW5lIGRlIEJhdWVyXCIsIFwiZXNcIjogXCJIYWNpZW5kYSBkZSBCYXVlclwiLCBcImRlXCI6IFwiQmF1ZXJzIEFud2VzZW5cIn0sXHJcblx0XCI3NVwiOiB7XCJpZFwiOiBcIjc1XCIsIFwiZW5cIjogXCJCYXR0bGUncyBIb2xsb3dcIiwgXCJmclwiOiBcIlZhbGxvbiBkZSBiYXRhaWxsZVwiLCBcImVzXCI6IFwiSG9uZG9uYWRhIGRlIGxhIEJhdHRhbGxhXCIsIFwiZGVcIjogXCJTY2hsYWNodGVuLVNlbmtlXCJ9LFxyXG5cdFwiNzZcIjoge1wiaWRcIjogXCI3NlwiLCBcImVuXCI6IFwiVGVtcGxlIG9mIExvc3QgUHJheWVyc1wiLCBcImZyXCI6IFwiVGVtcGxlIGRlcyBwcmnDqHJlcyBwZXJkdWVzXCIsIFwiZXNcIjogXCJUZW1wbG8gZGUgbGFzIFBlbGdhcmlhc1wiLCBcImRlXCI6IFwiVGVtcGVsIGRlciBWZXJsb3JlbmVuIEdlYmV0ZVwifVxyXG59IiwibW9kdWxlLmV4cG9ydHM9W1xyXG5cdHtcclxuXHRcdFwia2V5XCI6IFwiQ2VudGVyXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDMsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIkNhc3RsZVwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbOV0sIFx0XHRcdFx0XHRcdFx0XHQvLyBzbVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlJlZCBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcInJlZFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMSwgMTcsIDIwLCAxOCwgMTksIDYsIDVdLFx0XHQvLyBvdmVybG9vaywgbWVuZG9ucywgdmVsb2thLCBhbnosIG9ncmUsIHNwZWxkYW4sIHBhbmdcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJCbHVlIENvcm5lclwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiYmx1ZVwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMiwgMTUsIDIyLCAxNiwgMjEsIDcsIDhdXHRcdFx0Ly8gdmFsbGV5LCBsYW5nb3IsIGJyYXZvc3QsIHF1ZW50aW4sIGR1cmlvcywgZGFuZSwgdW1iZXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJHcmVlbiBDb3JuZXJcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImdyZWVuXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszLCAxMSwgMTMsIDEyLCAxNCwgMTAsIDRdIFx0XHQvLyBsb3dsYW5kcywgYWxkb25zLCBqZXJyaWZlciwgd2lsZGNyZWVrLCBrbG92YW4sIHJvZ3VlcywgZ29sYW50YVxyXG5cdFx0XHR9LF0sXHJcblx0fSwge1xyXG5cdFx0XCJrZXlcIjogXCJSZWRIb21lXCIsXHJcblx0XHRcIm1hcEluZGV4XCI6IDAsXHJcblx0XHRcInNlY3Rpb25zXCI6IFt7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIktlZXBzXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJyZWRcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzM3LCAzMywgMzJdIFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIGxvbmd2aWV3LCBjbGlmZnNpZGUsIGdvZHN3b3JkLCBob3BlcywgYXN0cmFsXHJcblx0XHRcdH0sIHtcdFxyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJOb3J0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwicmVkXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszOCwgNDAsIDM5LCA1MiwgNTFdIFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgbG9uZ3ZpZXcsIGNsaWZmc2lkZSwgZ29kc3dvcmQsIGhvcGVzLCBhc3RyYWxcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJTb3V0aFwiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwibmV1dHJhbFwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbMzUsIDM2LCAzNCwgNTMsIDUwXSBcdC8vIGJyaWFyLCBsYWtlLCBsb2RnZSwgdmFsZSwgd2F0ZXJcclxuXHRcdFx0Ly8gfSwge1xyXG5cdFx0XHQvLyBcdFwibGFiZWxcIjogXCJSdWluc1wiLFxyXG5cdFx0XHQvLyBcdFwiZ3JvdXBUeXBlXCI6IFwicnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcIm9iamVjdGl2ZXNcIjogWzYyLCA2MywgNjQsIDY1LCA2Nl0gXHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdLFxyXG5cdH0sIHtcclxuXHRcdFwia2V5XCI6IFwiQmx1ZUhvbWVcIixcclxuXHRcdFwibWFwSW5kZXhcIjogMixcclxuXHRcdFwic2VjdGlvbnNcIjogW3tcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiS2VlcHNcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcImJsdWVcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzIzLCAyNywgMzFdIFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHdvb2RoYXZlbiwgZGF3bnMsIHNwaXJpdCwgZ29kcywgc3RhclxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIk5vcnRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJibHVlXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFszMCwgMjgsIDI5LCA1OCwgNjBdIFx0Ly8ga2VlcCwgYmF5LCBoaWxscywgd29vZGhhdmVuLCBkYXducywgc3Bpcml0LCBnb2RzLCBzdGFyXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRcImxhYmVsXCI6IFwiU291dGhcIixcclxuXHRcdFx0XHRcImdyb3VwVHlwZVwiOiBcIm5ldXRyYWxcIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzI1LCAyNiwgMjQsIDU5LCA2MV0gXHQvLyBicmlhciwgbGFrZSwgY2hhbXAsIHZhbGUsIHdhdGVyXHJcblx0XHRcdC8vIH0sIHtcclxuXHRcdFx0Ly8gXHRcImxhYmVsXCI6IFwiUnVpbnNcIixcclxuXHRcdFx0Ly8gXHRcImdyb3VwVHlwZVwiOiBcInJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJvYmplY3RpdmVzXCI6IFs3MSwgNzAsIDY5LCA2OCwgNjddIFx0Ly8gdGVtcGxlLCBob2xsb3csIGVzdGF0ZSwgb3JjaGFyZCwgYXNjZW50XHJcblx0XHRcdH0sXSxcclxuXHR9LCB7XHJcblx0XHRcImtleVwiOiBcIkdyZWVuSG9tZVwiLFxyXG5cdFx0XCJtYXBJbmRleFwiOiAxLFxyXG5cdFx0XCJzZWN0aW9uc1wiOiBbe1xyXG5cdFx0XHRcdFwibGFiZWxcIjogXCJLZWVwc1wiLFxyXG5cdFx0XHRcdFwiZ3JvdXBUeXBlXCI6IFwiZ3JlZW5cIixcclxuXHRcdFx0XHRcIm9iamVjdGl2ZXNcIjogWzQ2LCA0NCwgNDFdIFx0XHRcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHN1bm55LCBjcmFnLCB0aXRhbiwgZmFpdGgsIGZvZ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIk5vcnRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJncmVlblwiLFxyXG5cdFx0XHRcdFwib2JqZWN0aXZlc1wiOiBbNDcsIDU3LCA1NiwgNDgsIDU0XSBcdC8vIGtlZXAsIGJheSwgaGlsbHMsIHN1bm55LCBjcmFnLCB0aXRhbiwgZmFpdGgsIGZvZ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0XCJsYWJlbFwiOiBcIlNvdXRoXCIsXHJcblx0XHRcdFx0XCJncm91cFR5cGVcIjogXCJuZXV0cmFsXCIsXHJcblx0XHRcdFx0XCJvYmplY3RpdmVzXCI6IFs0NSwgNDIsIDQzLCA0OSwgNTVdIFx0Ly8gYnJpYXIsIGxha2UsIGxvZGdlLCB2YWxlLCB3YXRlclxyXG5cdFx0XHQvLyB9LCB7XHJcblx0XHRcdC8vIFx0XCJsYWJlbFwiOiBcIlJ1aW5zXCIsXHJcblx0XHRcdC8vIFx0XCJncm91cFR5cGVcIjogXCJydWluc1wiLFxyXG5cdFx0XHQvLyBcdFwib2JqZWN0aXZlc1wiOiBbNzYgLCA3NSAsIDc0ICwgNzMgLCA3MiBdIFx0XHQvLyB0ZW1wbGUsIGhvbGxvdywgZXN0YXRlLCBvcmNoYXJkLCBhc2NlbnRcclxuXHRcdFx0fSxdXHJcblx0fSxcclxuXSIsIm1vZHVsZS5leHBvcnRzPXtcclxuXHQvL1x0RUJHXHJcblx0XCI5XCI6IHtcInR5cGVcIjogMSwgXCJ0aW1lclwiOiAxLCBcImRcIjogMCwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU3RvbmVtaXN0IENhc3RsZVxyXG5cclxuXHQvL1x0UmVkIENvcm5lclxyXG5cdFwiMVwiOiB7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIFJlZCBLZWVwIC0gT3Zlcmxvb2tcclxuXHRcIjE3XCI6IHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gUmVkIFRvd2VyIC0gTWVuZG9uJ3MgR2FwXHJcblx0XCIyMFwiOiB7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBUb3dlciAtIFZlbG9rYSBTbG9wZVxyXG5cdFwiMThcIjoge1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBSZWQgVG93ZXIgLSBBbnphbGlhcyBQYXNzXHJcblx0XCIxOVwiOiB7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFJlZCBUb3dlciAtIE9ncmV3YXRjaCBDdXRcclxuXHRcIjZcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBSZWQgQ2FtcCAtIE1pbGwgLSBTcGVsZGFuXHJcblx0XCI1XCI6IHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gUmVkIENhbXAgLSBNaW5lIC0gUGFuZ2xvc3NcclxuXHJcblx0Ly9cdEJsdWUgQ29ybmVyXHJcblx0XCIyXCI6IHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBLZWVwIC0gVmFsbGV5XHJcblx0XCIxNVwiOiB7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIEJsdWUgVG93ZXIgLSBMYW5nb3IgR3VsY2hcclxuXHRcIjIyXCI6IHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gQmx1ZSBUb3dlciAtIEJyYXZvc3QgRXNjYXJwbWVudFxyXG5cdFwiMTZcIjoge1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCbHVlIFRvd2VyIC0gUXVlbnRpbiBMYWtlXHJcblx0XCIyMVwiOiB7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgVG93ZXIgLSBEdXJpb3MgR3VsY2hcclxuXHRcIjdcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBCbHVlIENhbXAgLSBNaW5lIC0gRGFuZWxvblxyXG5cdFwiOFwiOiB7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEJsdWUgQ2FtcCAtIE1pbGwgLSBVbWJlcmdsYWRlXHJcblxyXG5cdC8vXHRHcmVlbiBDb3JuZXJcclxuXHRcIjNcIjoge1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHcmVlbiBLZWVwIC0gTG93bGFuZHNcclxuXHRcIjExXCI6IHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gR3JlZW4gVG93ZXIgLSBBbGRvbnNcclxuXHRcIjEzXCI6IHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gR3JlZW4gVG93ZXIgLSBKZXJyaWZlcidzIFNsb3VnaFxyXG5cdFwiMTJcIjoge1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBHcmVlbiBUb3dlciAtIFdpbGRjcmVla1xyXG5cdFwiMTRcIjoge1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBHcmVlbiBUb3dlciAtIEtsb3ZhbiBHdWxseVxyXG5cdFwiMTBcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHcmVlbiBDYW1wIC0gTWluZSAtIFJvZ3VlcyBRdWFycnlcclxuXHRcIjRcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBHcmVlbiBDYW1wIC0gTWlsbCAtIEdvbGFudGFcclxuXHJcblxyXG5cdC8vXHRCbHVlSG9tZVxyXG5cdFwiMjNcIjoge1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBHYXJyaXNvblxyXG5cdFwiMjdcIjoge1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBCYXkgLSBBc2NlbnNpb24gQmF5XHJcblx0XCIzMVwiOiB7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gQXNrYWxpb24gSGlsbHNcclxuXHRcIjMwXCI6IHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgVG93ZXIgLSBXb29kaGF2ZW5cclxuXHRcIjI4XCI6IHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgVG93ZXIgLSBEYXduJ3MgRXlyaWVcclxuXHRcIjI5XCI6IHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gTm9ydGggQ2FtcCAtIENyb3Nzcm9hZHMgLSBUaGUgU3Bpcml0aG9sbWVcclxuXHRcIjU4XCI6IHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gTlcgQ2FtcCAtIE1pbmUgLSBHb2RzbG9yZVxyXG5cdFwiNjBcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBDYW1wIC0gTWlsbCAtIFN0YXJncm92ZVxyXG5cclxuXHRcIjI1XCI6IHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBSZWRicmlhclxyXG5cdFwiMjZcIjoge1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBUb3dlciAtIEdyZWVubGFrZVxyXG5cdFwiMjRcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBTb3V0aCBDYW1wIC0gT3JjaGFyZCAtIENoYW1waW9uJ3MgRGVtZW5zZVxyXG5cdFwiNTlcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBSZWR2YWxlIFJlZnVnZVxyXG5cdFwiNjFcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBDYW1wIC0gRmlzaGluZyBWaWxsYWdlIC0gR3JlZW53YXRlciBMb3dsYW5kc1xyXG5cclxuXHJcblx0Ly9cdFJlZEhvbWVcclxuXHRcIjM3XCI6IHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjMzXCI6IHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmF5IC0gRHJlYW1pbmcgQmF5XHJcblx0XCIzMlwiOiB7XCJ0eXBlXCI6IDIsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIEhpbGxzIC0gRXRoZXJvbiBIaWxsc1xyXG5cdFwiMzhcIjoge1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBUb3dlciAtIExvbmd2aWV3XHJcblx0XCI0MFwiOiB7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIFRvd2VyIC0gQ2xpZmZzaWRlXHJcblx0XCIzOVwiOiB7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAwfSxcdC8vIE5vcnRoIENhbXAgLSBDcm9zc3JvYWRzIC0gVGhlIEdvZHN3b3JkXHJcblx0XCI1MlwiOiB7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIENhbXAgLSBNaW5lIC0gQXJhaCdzIEhvcGVcclxuXHRcIjUxXCI6IHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDF9LFx0Ly8gTkUgQ2FtcCAtIE1pbGwgLSBBc3RyYWxob2xtZVxyXG5cclxuXHRcIjM1XCI6IHtcInR5cGVcIjogMywgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgVG93ZXIgLSBHcmVlbmJyaWFyXHJcblx0XCIzNlwiOiB7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIFRvd2VyIC0gQmx1ZWxha2VcclxuXHRcIjM0XCI6IHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU291dGggQ2FtcCAtIE9yY2hhcmQgLSBWaWN0b3IncyBMb2RnZVxyXG5cdFwiNTNcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBDYW1wIC0gV29ya3Nob3AgLSBHcmVlbnZhbGUgUmVmdWdlXHJcblx0XCI1MFwiOiB7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBCbHVld2F0ZXIgTG93bGFuZHNcclxuXHJcblxyXG5cdC8vXHRHcmVlbkhvbWVcclxuXHRcIjQ2XCI6IHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDEsIFwic1wiOiAwLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gR2Fycmlzb25cclxuXHRcIjQ0XCI6IHtcInR5cGVcIjogMiwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAwLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gQmF5IC0gRHJlYWRmYWxsIEJheVxyXG5cdFwiNDFcIjoge1widHlwZVwiOiAyLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBIaWxscyAtIFNoYWRhcmFuIEhpbGxzXHJcblx0XCI0N1wiOiB7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDEsIFwiZVwiOiAwfSxcdC8vIE5XIFRvd2VyIC0gU3VubnloaWxsXHJcblx0XCI1N1wiOiB7XCJ0eXBlXCI6IDMsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAxLCBcInNcIjogMCwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIE5FIFRvd2VyIC0gQ3JhZ3RvcFxyXG5cdFwiNTZcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMH0sXHQvLyBOb3J0aCBDYW1wIC0gQ3Jvc3Nyb2FkcyAtIFRoZSBUaXRhbnBhd1xyXG5cdFwiNDhcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBOVyBDYW1wIC0gTWluZSAtIEZhaXRobGVhcFxyXG5cdFwiNTRcIjoge1widHlwZVwiOiA0LCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMSwgXCJzXCI6IDAsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBORSBDYW1wIC0gTWlsbCAtIEZvZ2hhdmVuXHJcblxyXG5cdFwiNDVcIjoge1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAxLCBcImVcIjogMH0sXHQvLyBTVyBUb3dlciAtIEJsdWVicmlhclxyXG5cdFwiNDJcIjoge1widHlwZVwiOiAzLCBcInRpbWVyXCI6IDEsIFwiZFwiOiAxLCBcIm5cIjogMCwgXCJzXCI6IDEsIFwid1wiOiAwLCBcImVcIjogMX0sXHQvLyBTRSBUb3dlciAtIFJlZGxha2VcclxuXHRcIjQzXCI6IHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMCwgXCJlXCI6IDB9LFx0Ly8gU291dGggQ2FtcCAtIE9yY2hhcmQgLSBIZXJvJ3MgTG9kZ2VcclxuXHRcIjQ5XCI6IHtcInR5cGVcIjogNCwgXCJ0aW1lclwiOiAxLCBcImRcIjogMSwgXCJuXCI6IDAsIFwic1wiOiAxLCBcIndcIjogMSwgXCJlXCI6IDB9LFx0Ly8gU1cgQ2FtcCAtIFdvcmtzaG9wIC0gQmx1ZXZhbGUgUmVmdWdlXHJcblx0XCI1NVwiOiB7XCJ0eXBlXCI6IDQsIFwidGltZXJcIjogMSwgXCJkXCI6IDEsIFwiblwiOiAwLCBcInNcIjogMSwgXCJ3XCI6IDAsIFwiZVwiOiAxfSxcdC8vIFNFIENhbXAgLSBGaXNoaW5nIFZpbGxhZ2UgLSBSZWR3YXRlciBMb3dsYW5kc1xyXG59IiwibW9kdWxlLmV4cG9ydHM9e1xyXG5cdFwiMVwiOiB7XCJpZFwiOiAxLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMlwiOiB7XCJpZFwiOiAyLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiM1wiOiB7XCJpZFwiOiAzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNFwiOiB7XCJpZFwiOiA0LCBcIm5hbWVcIjogXCJHcmVlbiBNaWxsXCJ9LFxyXG5cdFwiNVwiOiB7XCJpZFwiOiA1LCBcIm5hbWVcIjogXCJSZWQgTWluZVwifSxcclxuXHRcIjZcIjoge1wiaWRcIjogNiwgXCJuYW1lXCI6IFwiUmVkIE1pbGxcIn0sXHJcblx0XCI3XCI6IHtcImlkXCI6IDcsIFwibmFtZVwiOiBcIkJsdWUgTWluZVwifSxcclxuXHRcIjhcIjoge1wiaWRcIjogOCwgXCJuYW1lXCI6IFwiQmx1ZSBNaWxsXCJ9LFxyXG5cdFwiOVwiOiB7XCJpZFwiOiA5LCBcIm5hbWVcIjogXCJDYXN0bGVcIn0sXHJcblx0XCIxMFwiOiB7XCJpZFwiOiAxMCwgXCJuYW1lXCI6IFwiR3JlZW4gTWluZVwifSxcclxuXHRcIjExXCI6IHtcImlkXCI6IDExLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjEyXCI6IHtcImlkXCI6IDEyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjEzXCI6IHtcImlkXCI6IDEzLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE0XCI6IHtcImlkXCI6IDE0LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE1XCI6IHtcImlkXCI6IDE1LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE2XCI6IHtcImlkXCI6IDE2LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE3XCI6IHtcImlkXCI6IDE3LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE4XCI6IHtcImlkXCI6IDE4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjE5XCI6IHtcImlkXCI6IDE5LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIwXCI6IHtcImlkXCI6IDIwLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIxXCI6IHtcImlkXCI6IDIxLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIyXCI6IHtcImlkXCI6IDIyLCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjIzXCI6IHtcImlkXCI6IDIzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMjVcIjoge1wiaWRcIjogMjUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMjRcIjoge1wiaWRcIjogMjQsIFwibmFtZVwiOiBcIk9yY2hhcmRcIn0sXHJcblx0XCIyNlwiOiB7XCJpZFwiOiAyNiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIyN1wiOiB7XCJpZFwiOiAyNywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjI4XCI6IHtcImlkXCI6IDI4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjI5XCI6IHtcImlkXCI6IDI5LCBcIm5hbWVcIjogXCJDcm9zc3JvYWRzXCJ9LFxyXG5cdFwiMzBcIjoge1wiaWRcIjogMzAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiMzFcIjoge1wiaWRcIjogMzEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCIzMlwiOiB7XCJpZFwiOiAzMiwgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjMzXCI6IHtcImlkXCI6IDMzLCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiMzRcIjoge1wiaWRcIjogMzQsIFwibmFtZVwiOiBcIk9yY2hhcmRcIn0sXHJcblx0XCIzNVwiOiB7XCJpZFwiOiAzNSwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzNlwiOiB7XCJpZFwiOiAzNiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCIzN1wiOiB7XCJpZFwiOiAzNywgXCJuYW1lXCI6IFwiS2VlcFwifSxcclxuXHRcIjM4XCI6IHtcImlkXCI6IDM4LCBcIm5hbWVcIjogXCJUb3dlclwifSxcclxuXHRcIjM5XCI6IHtcImlkXCI6IDM5LCBcIm5hbWVcIjogXCJDcm9zc3JvYWRzXCJ9LFxyXG5cdFwiNDBcIjoge1wiaWRcIjogNDAsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDFcIjoge1wiaWRcIjogNDEsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0MlwiOiB7XCJpZFwiOiA0MiwgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0M1wiOiB7XCJpZFwiOiA0MywgXCJuYW1lXCI6IFwiT3JjaGFyZFwifSxcclxuXHRcIjQ0XCI6IHtcImlkXCI6IDQ0LCBcIm5hbWVcIjogXCJLZWVwXCJ9LFxyXG5cdFwiNDVcIjoge1wiaWRcIjogNDUsIFwibmFtZVwiOiBcIlRvd2VyXCJ9LFxyXG5cdFwiNDZcIjoge1wiaWRcIjogNDYsIFwibmFtZVwiOiBcIktlZXBcIn0sXHJcblx0XCI0N1wiOiB7XCJpZFwiOiA0NywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI0OFwiOiB7XCJpZFwiOiA0OCwgXCJuYW1lXCI6IFwiUXVhcnJ5XCJ9LFxyXG5cdFwiNDlcIjoge1wiaWRcIjogNDksIFwibmFtZVwiOiBcIldvcmtzaG9wXCJ9LFxyXG5cdFwiNTBcIjoge1wiaWRcIjogNTAsIFwibmFtZVwiOiBcIkZpc2hpbmcgVmlsbGFnZVwifSxcclxuXHRcIjUxXCI6IHtcImlkXCI6IDUxLCBcIm5hbWVcIjogXCJMdW1iZXIgTWlsbFwifSxcclxuXHRcIjUyXCI6IHtcImlkXCI6IDUyLCBcIm5hbWVcIjogXCJRdWFycnlcIn0sXHJcblx0XCI1M1wiOiB7XCJpZFwiOiA1MywgXCJuYW1lXCI6IFwiV29ya3Nob3BcIn0sXHJcblx0XCI1NFwiOiB7XCJpZFwiOiA1NCwgXCJuYW1lXCI6IFwiTHVtYmVyIE1pbGxcIn0sXHJcblx0XCI1NVwiOiB7XCJpZFwiOiA1NSwgXCJuYW1lXCI6IFwiRmlzaGluZyBWaWxsYWdlXCJ9LFxyXG5cdFwiNTZcIjoge1wiaWRcIjogNTYsIFwibmFtZVwiOiBcIkNyb3Nzcm9hZHNcIn0sXHJcblx0XCI1N1wiOiB7XCJpZFwiOiA1NywgXCJuYW1lXCI6IFwiVG93ZXJcIn0sXHJcblx0XCI1OFwiOiB7XCJpZFwiOiA1OCwgXCJuYW1lXCI6IFwiUXVhcnJ5XCJ9LFxyXG5cdFwiNTlcIjoge1wiaWRcIjogNTksIFwibmFtZVwiOiBcIldvcmtzaG9wXCJ9LFxyXG5cdFwiNjBcIjoge1wiaWRcIjogNjAsIFwibmFtZVwiOiBcIkx1bWJlciBNaWxsXCJ9LFxyXG5cdFwiNjFcIjoge1wiaWRcIjogNjEsIFwibmFtZVwiOiBcIkZpc2hpbmcgVmlsbGFnZVwifSxcclxuXHRcIjYyXCI6IHtcImlkXCI6IDYyLCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifSxcclxuXHRcIjYzXCI6IHtcImlkXCI6IDYzLCBcIm5hbWVcIjogXCIoKEJhdHRsZSdzIEhvbGxvdykpXCJ9LFxyXG5cdFwiNjRcIjoge1wiaWRcIjogNjQsIFwibmFtZVwiOiBcIigoQmF1ZXIncyBFc3RhdGUpKVwifSxcclxuXHRcIjY1XCI6IHtcImlkXCI6IDY1LCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjY2XCI6IHtcImlkXCI6IDY2LCBcIm5hbWVcIjogXCIoKENhcnZlcidzIEFzY2VudCkpXCJ9LFxyXG5cdFwiNjdcIjoge1wiaWRcIjogNjcsIFwibmFtZVwiOiBcIigoQ2FydmVyJ3MgQXNjZW50KSlcIn0sXHJcblx0XCI2OFwiOiB7XCJpZFwiOiA2OCwgXCJuYW1lXCI6IFwiKChPcmNoYXJkIE92ZXJsb29rKSlcIn0sXHJcblx0XCI2OVwiOiB7XCJpZFwiOiA2OSwgXCJuYW1lXCI6IFwiKChCYXVlcidzIEVzdGF0ZSkpXCJ9LFxyXG5cdFwiNzBcIjoge1wiaWRcIjogNzAsIFwibmFtZVwiOiBcIigoQmF0dGxlJ3MgSG9sbG93KSlcIn0sXHJcblx0XCI3MVwiOiB7XCJpZFwiOiA3MSwgXCJuYW1lXCI6IFwiKChUZW1wbGUgb2YgTG9zdCBQcmF5ZXJzKSlcIn0sXHJcblx0XCI3MlwiOiB7XCJpZFwiOiA3MiwgXCJuYW1lXCI6IFwiKChDYXJ2ZXIncyBBc2NlbnQpKVwifSxcclxuXHRcIjczXCI6IHtcImlkXCI6IDczLCBcIm5hbWVcIjogXCIoKE9yY2hhcmQgT3Zlcmxvb2spKVwifSxcclxuXHRcIjc0XCI6IHtcImlkXCI6IDc0LCBcIm5hbWVcIjogXCIoKEJhdWVyJ3MgRXN0YXRlKSlcIn0sXHJcblx0XCI3NVwiOiB7XCJpZFwiOiA3NSwgXCJuYW1lXCI6IFwiKChCYXR0bGUncyBIb2xsb3cpKVwifSxcclxuXHRcIjc2XCI6IHtcImlkXCI6IDc2LCBcIm5hbWVcIjogXCIoKFRlbXBsZSBvZiBMb3N0IFByYXllcnMpKVwifSxcclxufSIsIm1vZHVsZS5leHBvcnRzPXtcclxuXHRcIjFcIjoge1widGltZXJcIjogMSwgXCJ2YWx1ZVwiOiAzNSwgXCJuYW1lXCI6IFwiY2FzdGxlXCJ9LFxyXG5cdFwiMlwiOiB7XCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDI1LCBcIm5hbWVcIjogXCJrZWVwXCJ9LFxyXG5cdFwiM1wiOiB7XCJ0aW1lclwiOiAxLCBcInZhbHVlXCI6IDEwLCBcIm5hbWVcIjogXCJ0b3dlclwifSxcclxuXHRcIjRcIjoge1widGltZXJcIjogMSwgXCJ2YWx1ZVwiOiA1LCBcIm5hbWVcIjogXCJjYW1wXCJ9LFxyXG5cdFwiNVwiOiB7XCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcInRlbXBsZVwifSxcclxuXHRcIjZcIjoge1widGltZXJcIjogMCwgXCJ2YWx1ZVwiOiAwLCBcIm5hbWVcIjogXCJob2xsb3dcIn0sXHJcblx0XCI3XCI6IHtcInRpbWVyXCI6IDAsIFwidmFsdWVcIjogMCwgXCJuYW1lXCI6IFwiZXN0YXRlXCJ9LFxyXG5cdFwiOFwiOiB7XCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcIm92ZXJsb29rXCJ9LFxyXG5cdFwiOVwiOiB7XCJ0aW1lclwiOiAwLCBcInZhbHVlXCI6IDAsIFwibmFtZVwiOiBcImFzY2VudFwifSxcclxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwib2JqZWN0aXZlX25hbWVzXCI6IHJlcXVpcmUoJy4vb2JqZWN0aXZlX25hbWVzLmpzb24nKSxcclxuXHRcIm9iamVjdGl2ZV90eXBlc1wiOiByZXF1aXJlKCcuL29iamVjdGl2ZV90eXBlcy5qc29uJyksXHJcblx0XCJvYmplY3RpdmVfbWV0YVwiOiByZXF1aXJlKCcuL29iamVjdGl2ZV9tZXRhLmpzb24nKSxcclxuXHRcIm9iamVjdGl2ZV9sYWJlbHNcIjogcmVxdWlyZSgnLi9vYmplY3RpdmVfbGFiZWxzLmpzb24nKSxcclxuXHRcIm9iamVjdGl2ZV9tYXBcIjogcmVxdWlyZSgnLi9vYmplY3RpdmVfbWFwLmpzb24nKSxcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHM9e1xyXG5cdFwiMTAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFtYm9zc2ZlbHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW1ib3NzZmVsc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFudmlsIFJvY2tcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW52aWwtcm9ja1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIFl1bnF1ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC15dW5xdWVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSb2NoZXIgZGUgbCdlbmNsdW1lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJvY2hlci1kZS1sZW5jbHVtZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCb3JsaXMtUGFzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJib3JsaXMtcGFzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJvcmxpcyBQYXNzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvcmxpcy1wYXNzXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGFzbyBkZSBCb3JsaXNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGFzby1kZS1ib3JsaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQYXNzYWdlIGRlIEJvcmxpc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwYXNzYWdlLWRlLWJvcmxpc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDNcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWtiaWVndW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImpha2JpZWd1bmdcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJZYWsncyBCZW5kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInlha3MtYmVuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRlY2xpdmUgZGVsIFlha1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZWNsaXZlLWRlbC15YWtcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3VyYmUgZHUgWWFrXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdXJiZS1kdS15YWtcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA0XCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVucmF2aXMgRXJkd2Vya1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZW5yYXZpcy1lcmR3ZXJrXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVuZ2Ugb2YgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZW5nZS1vZi1kZW5yYXZpXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8OtcmN1bG8gZGUgRGVucmF2aVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjaXJjdWxvLWRlLWRlbnJhdmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9tbGVjaCBkZSBEZW5yYXZpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyb21sZWNoLWRlLWRlbnJhdmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDA1XCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWFndXVtYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtYWd1dW1hXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwNlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkhvY2hvZmVuIGRlciBCZXRyw7xibmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImhvY2hvZmVuLWRlci1iZXRydWJuaXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTb3Jyb3cncyBGdXJuYWNlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNvcnJvd3MtZnVybmFjZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZyYWd1YSBkZWwgUGVzYXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnJhZ3VhLWRlbC1wZXNhclwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvdXJuYWlzZSBkZXMgbGFtZW50YXRpb25zXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvdXJuYWlzZS1kZXMtbGFtZW50YXRpb25zXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAwN1wiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRvciBkZXMgSXJyc2lubnNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidG9yLWRlcy1pcnJzaW5uc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkdhdGUgb2YgTWFkbmVzc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYXRlLW9mLW1hZG5lc3NcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQdWVydGEgZGUgbGEgTG9jdXJhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInB1ZXJ0YS1kZS1sYS1sb2N1cmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZSBkZSBsYSBmb2xpZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwb3J0ZS1kZS1sYS1mb2xpZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDhcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDhcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJKYWRlLVN0ZWluYnJ1Y2hcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zdGVpbmJydWNoXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZSBRdWFycnlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1xdWFycnlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW50ZXJhIGRlIEphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FudGVyYS1kZS1qYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FycmnDqHJlIGRlIGphZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2FycmllcmUtZGUtamFkZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMDlcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IEVzcGVud2FsZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LWVzcGVud2FsZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgQXNwZW53b29kXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIEFzcGVud29vZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmdWVydGUtYXNwZW53b29kXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBUcmVtYmxlZm9yw6p0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtdHJlbWJsZWZvcmV0XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxMFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxMFwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVobXJ5LUJ1Y2h0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJ1Y2h0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRWhtcnkgQmF5XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVobXJ5LWJheVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaMOtYSBkZSBFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWhpYS1kZS1laG1yeVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkJhaWUgZCdFaG1yeVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlaG1yeVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTFcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTFcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdHVybWtsaXBwZW4tSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3R1cm1rbGlwcGVuLWluc2VsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU3Rvcm1ibHVmZiBJc2xlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInN0b3JtYmx1ZmYtaXNsZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGEgQ2ltYXRvcm1lbnRhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImlzbGEtY2ltYXRvcm1lbnRhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIGxhIEZhbGFpc2UgdHVtdWx0dWV1c2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWxhLWZhbGFpc2UtdHVtdWx0dWV1c2VcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmluc3RlcmZyZWlzdGF0dFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaW5zdGVyZnJlaXN0YXR0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGFya2hhdmVuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRhcmtoYXZlblwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gT3NjdXJvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tb3NjdXJvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVmdWdlIG5vaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVmdWdlLW5vaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDEzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDEzXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSGVpbGlnZSBIYWxsZSB2b24gUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJoZWlsaWdlLWhhbGxlLXZvbi1yYWxsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2FuY3R1bSBvZiBSYWxsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNhbmN0dW0tb2YtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhZ3JhcmlvIGRlIFJhbGxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic2FncmFyaW8tZGUtcmFsbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNhbmN0dWFpcmUgZGUgUmFsbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzYW5jdHVhaXJlLWRlLXJhbGxcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE0XCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS3Jpc3RhbGx3w7xzdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia3Jpc3RhbGx3dXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNyeXN0YWwgRGVzZXJ0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNyeXN0YWwtZGVzZXJ0XCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzaWVydG8gZGUgQ3Jpc3RhbFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNpZXJ0by1kZS1jcmlzdGFsXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRMOpc2VydCBkZSBjcmlzdGFsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc2VydC1kZS1jcmlzdGFsXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxNVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxNVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphbnRoaXItSW5zZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFudGhpci1pbnNlbFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIklzbGUgb2YgSmFudGhpclwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJpc2xlLW9mLWphbnRoaXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJc2xhIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaXNsYS1kZS1qYW50aGlyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSWxlIGRlIEphbnRoaXJcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiaWxlLWRlLWphbnRoaXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDE2XCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDE2XCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVlciBkZXMgTGVpZHNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWVlci1kZXMtbGVpZHNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTZWEgb2YgU29ycm93c1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWEtb2Ytc29ycm93c1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsIE1hciBkZSBsb3MgUGVzYXJlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJlbC1tYXItZGUtbG9zLXBlc2FyZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNZXIgZGVzIGxhbWVudGF0aW9uc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGVzLWxhbWVudGF0aW9uc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTdcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCZWZsZWNrdGUgS8O8c3RlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJlZmxlY2t0ZS1rdXN0ZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlRhcm5pc2hlZCBDb2FzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0YXJuaXNoZWQtY29hc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDb3N0YSBkZSBCcm9uY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY29zdGEtZGUtYnJvbmNlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ8O0dGUgdGVybmllXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNvdGUtdGVybmllXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAxOFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAxOFwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk7DtnJkbGljaGUgWml0dGVyZ2lwZmVsXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm5vcmRsaWNoZS16aXR0ZXJnaXBmZWxcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJOb3J0aGVybiBTaGl2ZXJwZWFrc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJub3J0aGVybi1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBpY29zZXNjYWxvZnJpYW50ZXMgZGVsIE5vcnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpY29zZXNjYWxvZnJpYW50ZXMtZGVsLW5vcnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2ltZWZyb2lkZXMgbm9yZGlxdWVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNpbWVmcm9pZGVzLW5vcmRpcXVlc1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMTlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMTlcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTY2h3YXJ6dG9yXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnp0b3JcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCbGFja2dhdGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmxhY2tnYXRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUHVlcnRhbmVncmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicHVlcnRhbmVncmFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0ZW5vaXJlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBvcnRlbm9pcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIxMDIwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIxMDIwXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmVyZ3Vzb25zIEtyZXV6dW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZlcmd1c29ucy1rcmV1enVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZlcmd1c29uJ3MgQ3Jvc3NpbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVyZ3Vzb25zLWNyb3NzaW5nXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRW5jcnVjaWphZGEgZGUgRmVyZ3Vzb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZW5jcnVjaWphZGEtZGUtZmVyZ3Vzb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDcm9pc8OpZSBkZSBGZXJndXNvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjcm9pc2VlLWRlLWZlcmd1c29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkRyYWNoZW5icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFjaGVuYnJhbmRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFnb25icmFuZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkcmFnb25icmFuZFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmNhIGRlbCBEcmFnw7NuXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmNhLWRlbC1kcmFnb25cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJTdGlnbWF0ZSBkdSBkcmFnb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwic3RpZ21hdGUtZHUtZHJhZ29uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMTAyMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMTAyMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkthaW5lbmdcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2FpbmVuZ1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjNcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXZvbmFzIFJhc3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGV2b25hcy1yYXN0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGV2b25hJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXZvbmFzLXJlc3RcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEZXNjYW5zbyBkZSBEZXZvbmFcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzY2Fuc28tZGUtZGV2b25hXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZGUgRGV2b25hXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlcG9zLWRlLWRldm9uYVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjEwMjRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjEwMjRcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJFcmVkb24tVGVycmFzc2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhc3NlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRXJlZG9uIFRlcnJhY2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZXJlZG9uLXRlcnJhY2VcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJUZXJyYXphIGRlIEVyZWRvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ0ZXJyYXphLWRlLWVyZWRvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXRlYXUgZCdFcmVkb25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhdGVhdS1kZXJlZG9uXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktsYWdlbnJpc3NcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia2xhZ2Vucmlzc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgb2YgV29lXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZpc3N1cmUtb2Ytd29lXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmlzdXJhIGRlIGxhIEFmbGljY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmlzdXJhLWRlLWxhLWFmbGljY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZpc3N1cmUgZHUgbWFsaGV1clwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmaXNzdXJlLWR1LW1hbGhldXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiw5ZkbmlzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm9kbmlzXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhdGlvblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkZXNvbGF0aW9uXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRGVzb2xhY2nDs25cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZGVzb2xhY2lvblwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXNvbGF0aW9uXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRlc29sYXRpb25cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDAzXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR2FuZGFyYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJnYW5kYXJhXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNFwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNjaHdhcnpmbHV0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNjaHdhcnpmbHV0XCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmxhY2t0aWRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJsYWNrdGlkZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1hcmVhIE5lZ3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hcmVhLW5lZ3JhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTm9pcmZsb3RcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibm9pcmZsb3RcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA1XCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmV1ZXJyaW5nXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZldWVycmluZ1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpbmcgb2YgRmlyZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyaW5nLW9mLWZpcmVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBbmlsbG8gZGUgRnVlZ29cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYW5pbGxvLWRlLWZ1ZWdvXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2VyY2xlIGRlIGZldVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjZXJjbGUtZGUtZmV1XCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjAwNlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjAwNlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlVudGVyd2VsdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ1bnRlcndlbHRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJVbmRlcndvcmxkXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInVuZGVyd29ybGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJJbmZyYW11bmRvXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImluZnJhbXVuZG9cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJPdXRyZS1tb25kZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJvdXRyZS1tb25kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDdcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDdcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGZXJuZSBaaXR0ZXJnaXBmZWxcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZmVybmUteml0dGVyZ2lwZmVsXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRmFyIFNoaXZlcnBlYWtzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZhci1zaGl2ZXJwZWFrc1wiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkxlamFuYXMgUGljb3Nlc2NhbG9mcmlhbnRlc1wiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsZWphbmFzLXBpY29zZXNjYWxvZnJpYW50ZXNcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMb2ludGFpbmVzIENpbWVmcm9pZGVzXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImxvaW50YWluZXMtY2ltZWZyb2lkZXNcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDA4XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDA4XCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiV2Vpw59mbGFua2dyYXRcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2Vpc3NmbGFua2dyYXRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJXaGl0ZXNpZGUgUmlkZ2VcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwid2hpdGVzaWRlLXJpZGdlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2FkZW5hIExhZGVyYWJsYW5jYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJjYWRlbmEtbGFkZXJhYmxhbmNhXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ3LDqnRlIGRlIFZlcnNlYmxhbmNcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY3JldGUtZGUtdmVyc2VibGFuY1wiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMDlcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMDlcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZW4gdm9uIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWluZW4tdm9uLXN1cm1pYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJ1aW5zIG9mIFN1cm1pYVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJydWlucy1vZi1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluYXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5hcy1kZS1zdXJtaWFcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJSdWluZXMgZGUgU3VybWlhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJ1aW5lcy1kZS1zdXJtaWFcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEwXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEwXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiU2VlbWFubnNyYXN0XCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInNlZW1hbm5zcmFzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlNlYWZhcmVyJ3MgUmVzdFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJzZWFmYXJlcnMtcmVzdFwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJlZnVnaW8gZGVsIFZpYWphbnRlXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJlZnVnaW8tZGVsLXZpYWphbnRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUmVwb3MgZHUgTWFyaW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicmVwb3MtZHUtbWFyaW5cIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDExXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDExXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJWYWJiaVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2YWJiaVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZhYmJpXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInZhYmJpXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVmFiYmlcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwidmFiYmlcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDEyXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDEyXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGlrZW4tUGxhdHpcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tcGxhdHpcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWtlbiBTcXVhcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGlrZW4tc3F1YXJlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhemEgZGUgUGlrZW5cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGxhemEtZGUtcGlrZW5cIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQbGFjZSBQaWtlblwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGFjZS1waWtlblwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIwMTNcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIwMTNcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJMaWNodHVuZyBkZXIgTW9yZ2VucsO2dGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGljaHR1bmctZGVyLW1vcmdlbnJvdGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBdXJvcmEgR2xhZGVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVyb3JhLWdsYWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQ2xhcm8gZGUgbGEgQXVyb3JhXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNsYXJvLWRlLWxhLWF1cm9yYVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkNsYWlyacOocmUgZGUgbCdhdXJvcmVcIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2xhaXJpZXJlLWRlLWxhdXJvcmVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMDE0XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMDE0XCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFycyBGZXN0ZVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWZlc3RlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiR3VubmFyJ3MgSG9sZFwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJndW5uYXJzLWhvbGRcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGdWVydGUgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZ1ZXJ0ZS1kZS1ndW5uYXJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYW1wZW1lbnQgZGUgR3VubmFyXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImNhbXBlbWVudC1kZS1ndW5uYXJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiSmFkZW1lZXIgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJqYWRlbWVlci1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkphZGUgU2VhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiamFkZS1zZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNYXIgZGUgSmFkZSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcIm1hci1kZS1qYWRlLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTWVyIGRlIEphZGUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJtZXItZGUtamFkZS1mclwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIxMDJcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIxMDJcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJGb3J0IFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZm9ydC1yYW5pay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZvcnQgUmFuaWsgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJmb3J0LXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRnVlcnRlIFJhbmlrIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZnVlcnRlLXJhbmlrLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRm9ydCBSYW5payBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZvcnQtcmFuaWstZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTAzXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTAzXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJlbnN0ZWluIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYXVndXJlbnN0ZWluLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQXVndXJ5IFJvY2sgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhdWd1cnktcm9jay1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJvY2EgZGVsIEF1Z3VyaW8gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NhLWRlbC1hdWd1cmlvLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUm9jaGUgZGUgbCdBdWd1cmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJyb2NoZS1kZS1sYXVndXJlLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjEwNFwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjEwNFwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlZpenVuYWgtUGxhdHogW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXBsYXR6LWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiVml6dW5haCBTcXVhcmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJ2aXp1bmFoLXNxdWFyZS1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlBsYXphIGRlIFZpenVuYWggW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwbGF6YS1kZS12aXp1bmFoLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGxhY2UgZGUgVml6dW5haCBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBsYWNlLWRlLXZpenVuYWgtZnJcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMTA1XCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMTA1XCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGF1YmVuc3RlaW4gW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYXViZW5zdGVpbi1mclwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFyYm9yc3RvbmUgW0ZSXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJhcmJvcnN0b25lLWZyXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiUGllZHJhIEFyYsOzcmVhIFtGUl1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwicGllZHJhLWFyYm9yZWEtZnJcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJQaWVycmUgQXJib3JlYSBbRlJdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInBpZXJyZS1hcmJvcmVhLWZyXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMVwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMVwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIktvZGFzY2ggW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJrb2Rhc2NoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiS29kYXNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwia29kYXNoLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwMlwiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwMlwiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkZsdXNzdWZlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImZsdXNzdWZlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpdmVyc2lkZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpdmVyc2lkZS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlJpYmVyYSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcInJpYmVyYS1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIlByb3ZpbmNlcyBmbHV2aWFsZXMgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJwcm92aW5jZXMtZmx1dmlhbGVzLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwM1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwM1wiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hZmVscyBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVsb25hZmVscy1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVsb25hIFJlYWNoIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZWxvbmEtcmVhY2gtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJDYcOxw7NuIGRlIEVsb25hIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiY2Fub24tZGUtZWxvbmEtZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZnJcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCaWVmIGQnRWxvbmEgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiaWVmLWRlbG9uYS1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDRcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDRcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJBYmFkZG9ucyBNdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYWJhZGRvbnMtbXVuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkFiYWRkb24ncyBNb3V0aCBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImFiYWRkb25zLW1vdXRoLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm9jYSBkZSBBYmFkZG9uIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYm9jYS1kZS1hYmFkZG9uLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQm91Y2hlIGQnQWJhZGRvbiBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJvdWNoZS1kYWJhZGRvbi1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDVcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDVcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEcmFra2FyLVNlZSBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRyYWtrYXItc2VlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHJha2thciBMYWtlIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHJha2thci1sYWtlLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFnbyBEcmFra2FyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibGFnby1kcmFra2FyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiTGFjIERyYWtrYXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJsYWMtZHJha2thci1kZVwiXHJcblx0XHR9XHJcblx0fSxcclxuXHRcIjIyMDZcIjoge1xyXG5cdFx0XCJpZFwiOiBcIjIyMDZcIixcclxuXHRcdFwiZGVcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJNaWxsZXJzdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVyc3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlblwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIk1pbGxlcidzIFNvdW5kIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwibWlsbGVycy1zb3VuZC1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJlc1wiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkVzdHJlY2hvIGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImVzdHJlY2hvLWRlLW1pbGxlci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkTDqXRyb2l0IGRlIE1pbGxlciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImRldHJvaXQtZGUtbWlsbGVyLWRlXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFwiMjIwN1wiOiB7XHJcblx0XHRcImlkXCI6IFwiMjIwN1wiLFxyXG5cdFx0XCJkZVwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fSxcclxuXHRcdFwiZW5cIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJEemFnb251ciBbREVdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImR6YWdvbnVyLWRlXCJcclxuXHRcdH0sXHJcblx0XHRcImVzXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiRHphZ29udXIgW0RFXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJkemFnb251ci1kZVwiXHJcblx0XHR9LFxyXG5cdFx0XCJmclwiOiB7XHJcblx0XHRcdFwibmFtZVwiOiBcIkR6YWdvbnVyIFtERV1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiZHphZ29udXItZGVcIlxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCIyMzAxXCI6IHtcclxuXHRcdFwiaWRcIjogXCIyMzAxXCIsXHJcblx0XHRcImRlXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoLUJ1Y2h0IFtTUF1cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFydWNoLWJ1Y2h0LXNwXCJcclxuXHRcdH0sXHJcblx0XHRcImVuXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFydWNoIEJheSBbU1BdXCIsXHJcblx0XHRcdFwic2x1Z1wiOiBcImJhcnVjaC1iYXktc3BcIlxyXG5cdFx0fSxcclxuXHRcdFwiZXNcIjoge1xyXG5cdFx0XHRcIm5hbWVcIjogXCJCYWjDrWEgZGUgQmFydWNoIFtFU11cIixcclxuXHRcdFx0XCJzbHVnXCI6IFwiYmFoaWEtZGUtYmFydWNoLWVzXCJcclxuXHRcdH0sXHJcblx0XHRcImZyXCI6IHtcclxuXHRcdFx0XCJuYW1lXCI6IFwiQmFpZSBkZSBCYXJ1Y2ggW1NQXVwiLFxyXG5cdFx0XHRcInNsdWdcIjogXCJiYWllLWRlLWJhcnVjaC1zcFwiXHJcblx0XHR9XHJcblx0fVxyXG59IiwiXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldEd1aWxkRGV0YWlsczogZ2V0R3VpbGREZXRhaWxzLFxyXG5cdGdldE1hdGNoZXM6IGdldE1hdGNoZXMsXHJcblx0Z2V0TWF0Y2hEZXRhaWxzOiBnZXRNYXRjaERldGFpbHMsXHJcbn07XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhndWlsZElkLCBvblN1Y2Nlc3MsIG9uRXJyb3IsIG9uQ29tcGxldGUpIHtcclxuXHR2YXIgcmVxdWVzdFVybCA9ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS9ndWlsZF9kZXRhaWxzLmpzb24/Z3VpbGRfaWQ9JyArIGd1aWxkSWQ7XHJcblx0Z2V0KHJlcXVlc3RVcmwsIG9uU3VjY2Vzcywgb25FcnJvciwgb25Db21wbGV0ZSk7XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hlcyhvblN1Y2Nlc3MsIG9uRXJyb3IsIG9uQ29tcGxldGUpIHtcclxuXHR2YXIgcmVxdWVzdFVybCA9ICdodHRwczovL2FwaS5ndWlsZHdhcnMyLmNvbS92MS93dncvbWF0Y2hlcy5qc29uJztcclxuXHRnZXQocmVxdWVzdFVybCwgb25TdWNjZXNzLCBvbkVycm9yLCBvbkNvbXBsZXRlKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXRjaERldGFpbHMobWF0Y2hJZCwgb25TdWNjZXNzLCBvbkVycm9yLCBvbkNvbXBsZXRlKSB7XHJcblx0dmFyIHJlcXVlc3RVcmwgPSAnaHR0cHM6Ly9hcGkuZ3VpbGR3YXJzMi5jb20vdjEvd3Z3L21hdGNoX2RldGFpbHMuanNvbj9tYXRjaF9pZD0nICsgbWF0Y2hJZDtcclxuXHRnZXQocmVxdWVzdFVybCwgb25TdWNjZXNzLCBvbkVycm9yLCBvbkNvbXBsZXRlKTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXQodXJsLCBvblN1Y2Nlc3MsIG9uRXJyb3IsIG9uQ29tcGxldGUpIHtcclxuXHQkLmFqYXgoe1xyXG5cdFx0dXJsOiB1cmwsXHJcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0c3VjY2Vzczogb25TdWNjZXNzLFxyXG5cdFx0ZXJyb3I6IG9uRXJyb3IsXHJcblx0XHRjb21wbGV0ZTogb25Db21wbGV0ZSxcclxuXHR9KTtcclxufVxyXG5cclxuXHJcbiIsIi8qKlxyXG4gKiBAanN4IFJlYWN0LkRPTVxyXG4gKi9cclxuXHJcbnZhciBSZWdpb25NYXRjaGVzID0gcmVxdWlyZSgnLi9vdmVydmlldy9SZWdpb25NYXRjaGVzLmpzeCcpO1xyXG52YXIgUmVnaW9uV29ybGRzID0gcmVxdWlyZSgnLi9vdmVydmlldy9SZWdpb25Xb3JsZHMuanN4Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge21hdGNoZXM6IHt9fTtcclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnVwZGF0ZVRpbWVyID0gbnVsbDtcclxuXHRcdHRoaXMuZ2V0TWF0Y2hlcygpO1xyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLnVwZGF0ZVRpbWVyKTtcclxuXHR9LFxyXG5cdFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyB2YXIgYXBwU3RhdGUgPSB3aW5kb3cuYXBwLnN0YXRlO1xyXG5cdFx0dmFyIHN0YXRpY0RhdGEgPSByZXF1aXJlKCcuLi9zdGF0aWNEYXRhJyk7XHJcblxyXG5cdFx0dmFyIHJlZ2lvbk1hdGNoZXMgPSBbXHJcblx0XHRcdHtcImxhYmVsXCI6IFwiTkEgTWF0Y2h1cHNcIiwgXCJtYXRjaGVzXCI6IF8uZmlsdGVyKHRoaXMuc3RhdGUubWF0Y2hlcywgZnVuY3Rpb24obWF0Y2gpe3JldHVybiBtYXRjaC53dndfbWF0Y2hfaWQuY2hhckF0KDApID09PSAnMSc7IH0pfSxcclxuXHRcdFx0e1wibGFiZWxcIjogXCJFVSBNYXRjaHVwc1wiLCBcIm1hdGNoZXNcIjogXy5maWx0ZXIodGhpcy5zdGF0ZS5tYXRjaGVzLCBmdW5jdGlvbihtYXRjaCl7cmV0dXJuIG1hdGNoLnd2d19tYXRjaF9pZC5jaGFyQXQoMCkgPT09ICcyJzsgfSl9LFxyXG5cdFx0XTtcclxuXHRcdHZhciByZWdpb25Xb3JsZHMgPSBbXHJcblx0XHRcdHtcImxhYmVsXCI6IFwiTkEgV29ybGRzXCIsIFwid29ybGRzXCI6IF8uZmlsdGVyKHN0YXRpY0RhdGEud29ybGRzLCBmdW5jdGlvbih3b3JsZCl7cmV0dXJuIHdvcmxkLmlkLmNoYXJBdCgwKSA9PT0gJzEnOyB9KX0sXHJcblx0XHRcdHtcImxhYmVsXCI6IFwiRVUgV29ybGRzXCIsIFwid29ybGRzXCI6IF8uZmlsdGVyKHN0YXRpY0RhdGEud29ybGRzLCBmdW5jdGlvbih3b3JsZCl7cmV0dXJuIHdvcmxkLmlkLmNoYXJBdCgwKSA9PT0gJzInOyB9KX0sXHJcblx0XHRdO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2lkOiBcIm92ZXJ2aWV3XCJ9LCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicm93XCJ9LCBcclxuXHRcdFx0XHRcdF8ubWFwKHJlZ2lvbk1hdGNoZXMsIGZ1bmN0aW9uKHJlZ2lvbil7XHJcblx0XHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImNvbC1zbS0xMlwiLCBrZXk6IHJlZ2lvbi5sYWJlbH0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0UmVnaW9uTWF0Y2hlcyh7ZGF0YTogcmVnaW9ufSlcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdCksIFxyXG5cclxuXHRcdFx0XHRSZWFjdC5ET00uaHIobnVsbCksIFxyXG5cclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicm93XCJ9LCBcclxuXHRcdFx0XHRcdF8ubWFwKHJlZ2lvbldvcmxkcywgZnVuY3Rpb24ocmVnaW9uKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLXNtLTEyXCIsIGtleTogcmVnaW9uLmxhYmVsfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRSZWdpb25Xb3JsZHMoe2RhdGE6IHJlZ2lvbn0pXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHQpXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fSxcclxuXHJcblxyXG5cclxuXHRnZXRNYXRjaGVzOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBhcGkgPSByZXF1aXJlKCcuLi9hcGknKTtcclxuXHJcblx0XHRhcGkuZ2V0TWF0Y2hlcyhcclxuXHRcdFx0dGhpcy5nZXRNYXRjaGVzU3VjY2VzcyxcclxuXHRcdFx0dGhpcy5nZXRNYXRjaGVzRXJyb3IsXHJcblx0XHRcdHRoaXMuZ2V0TWF0Y2hlc0NvbXBsZXRlXHJcblx0XHQpO1xyXG5cclxuXHR9LFxyXG5cclxuXHRnZXRNYXRjaGVzU3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7bWF0Y2hlczogXy5zb3J0QnkoZGF0YS53dndfbWF0Y2hlcywgJ3d2d19tYXRjaF9pZCcpfSk7XHJcblx0fSxcclxuXHRnZXRNYXRjaGVzRXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdPdmVydmlldzo6Z2V0TWF0Y2hlczpkYXRhIGVycm9yJywgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7IFxyXG5cdH0sXHJcblx0Z2V0TWF0Y2hlc0NvbXBsZXRlOiBfLm5vb3AsXHJcbn0pOyIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vKipcclxuICogQGpzeCBSZWFjdC5ET01cclxuICovXHJcblxyXG52YXIgU2NvcmVib2FyZCA9IHJlcXVpcmUoJy4vdHJhY2tlci9TY29yZWJvYXJkLmpzeCcpO1xyXG52YXIgTWFwcyA9IHJlcXVpcmUoJy4vdHJhY2tlci9NYXBzLmpzeCcpO1xyXG52YXIgR3VpbGRzID0gcmVxdWlyZSgnLi90cmFja2VyL2d1aWxkcy9HdWlsZHMuanN4Jyk7XHJcblxyXG52YXIgbGliRGF0ZSA9IHJlcXVpcmUoJy4uL2xpYi9kYXRlLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtYXRjaERldGFpbHM6IHt9LFxyXG5cdFx0XHRzY29yZXM6IFtdLFxyXG5cdFx0XHRtYXBzU2NvcmVzOiBbXSxcclxuXHRcdFx0b2JqZWN0aXZlczoge30sXHJcblx0XHRcdGd1aWxkczoge30sXHJcblx0XHR9O1xyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMudXBkYXRlVGltZXIgPSBudWxsO1xyXG5cclxuXHRcdHRoaXMuZ2V0TWF0Y2hEZXRhaWxzKCk7XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudXBkYXRlVGltZXIpO1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMuYnVmZlRpbWVycyk7XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coXy5maWx0ZXIodGhpcy5zdGF0ZS5vYmplY3RpdmVzLCBmdW5jdGlvbihvKXsgcmV0dXJuIG8ubGFzdENhcCAhPT0gMDsgfSkpO1xyXG5cdH0sXHJcblx0XHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzdGF0aWNEYXRhID0gcmVxdWlyZSgnLi4vc3RhdGljRGF0YScpO1xyXG5cdFx0dmFyIGFwcFN0YXRlID0gd2luZG93LmFwcC5zdGF0ZTtcclxuXHRcdHZhciBtYXRjaERhdGEgPSB0aGlzLnByb3BzLmRhdGE7XHJcblxyXG5cdFx0dmFyIG1hdGNoV29ybGRzID0gW1xyXG5cdFx0XHRzdGF0aWNEYXRhLndvcmxkc1ttYXRjaERhdGEucmVkX3dvcmxkX2lkXSxcclxuXHRcdFx0c3RhdGljRGF0YS53b3JsZHNbbWF0Y2hEYXRhLmJsdWVfd29ybGRfaWRdLFxyXG5cdFx0XHRzdGF0aWNEYXRhLndvcmxkc1ttYXRjaERhdGEuZ3JlZW5fd29ybGRfaWRdLFxyXG5cdFx0XTtcclxuXHJcblx0XHR2YXIgbWF0Y2hEZXRhaWxzID0gdGhpcy5zdGF0ZS5tYXRjaERldGFpbHM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ21hdGNoV29ybGRzJywgbWF0Y2hXb3JsZHMpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ21hdGNoRGF0YScsIG1hdGNoRGF0YSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygndGhpcy5zdGF0ZS5vYmplY3RpdmVzJywgdGhpcy5zdGF0ZS5vYmplY3RpdmVzKTtcclxuXHJcblx0XHRpZiAoXy5pc0VtcHR5KHRoaXMuc3RhdGUub2JqZWN0aXZlcykpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ09iamVjdGl2ZSBkYXRhIG5vdCByZWFkeScpO1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2lkOiBcInRyYWNrZXJcIn0sIFxyXG5cdFx0XHRcdFx0U2NvcmVib2FyZCh7XHJcblx0XHRcdFx0XHRcdHNjb3JlczogdGhpcy5zdGF0ZS5zY29yZXMsIFxyXG5cdFx0XHRcdFx0XHRvYmplY3RpdmVzOiB0aGlzLnN0YXRlLm9iamVjdGl2ZXMsIFxyXG5cdFx0XHRcdFx0XHRtYXRjaFdvcmxkczogbWF0Y2hXb3JsZHN9XHJcblx0XHRcdFx0XHQpLCBcclxuXHJcblxyXG5cdFx0XHRcdFx0TWFwcyh7XHJcblx0XHRcdFx0XHRcdG1hdGNoRGF0YTogbWF0Y2hEYXRhLCBcclxuXHRcdFx0XHRcdFx0bWFwc1Njb3JlczogdGhpcy5zdGF0ZS5tYXBzU2NvcmVzLCBcclxuXHRcdFx0XHRcdFx0b2JqZWN0aXZlczogdGhpcy5zdGF0ZS5vYmplY3RpdmVzLCBcclxuXHRcdFx0XHRcdFx0Z3VpbGRzOiB0aGlzLnN0YXRlLmd1aWxkcywgXHJcblx0XHRcdFx0XHRcdG1hdGNoV29ybGRzOiBtYXRjaFdvcmxkc31cclxuXHRcdFx0XHRcdCksIFxyXG5cclxuXHJcblx0XHRcdFx0XHRHdWlsZHMoe1xyXG5cdFx0XHRcdFx0XHRndWlsZHM6IHRoaXMuc3RhdGUuZ3VpbGRzLCBcclxuXHRcdFx0XHRcdFx0b2JqZWN0aXZlczogdGhpcy5zdGF0ZS5vYmplY3RpdmVzfVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdGdldE1hdGNoRGV0YWlsczogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYXBpID0gcmVxdWlyZSgnLi4vYXBpJyk7XHJcblx0XHRcclxuXHRcdGFwaS5nZXRNYXRjaERldGFpbHMoXHJcblx0XHRcdHRoaXMucHJvcHMuZGF0YS53dndfbWF0Y2hfaWQsXHJcblx0XHRcdHRoaXMub25NYXRjaERldGFpbHNTdWNjZXNzLCBcclxuXHRcdFx0dGhpcy5vbk1hdGNoRGV0YWlsc0Vycm9yLCBcclxuXHRcdFx0dGhpcy5vbk1hdGNoRGV0YWlsc0NvbXBsZXRlXHJcblx0XHQpO1xyXG5cdH0sXHJcblxyXG5cdG9uTWF0Y2hEZXRhaWxzU3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ01hdGNoOjpvbk1hdGNoRGV0YWlsc1N1Y2Nlc3MnLCB0aGlzLnByb3BzLmRhdGEud3Z3X21hdGNoX2lkLCBkYXRhKTtcclxuXHRcdHZhciBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuXHRcdHZhciBvYmplY3RpdmVzID0gZ2V0T2JqZWN0aXZlcyhjb21wb25lbnQsIGRhdGEpO1xyXG5cdFx0Ly8gdmFyIGd1aWxkcyA9IGdldEd1aWxkcyhjb21wb25lbnQsIG9iamVjdGl2ZXMpO1xyXG5cclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRtYXRjaERldGFpbHM6IGRhdGEsXHJcblx0XHRcdHNjb3JlczogZGF0YS5zY29yZXMsXHJcblx0XHRcdG1hcHNTY29yZXM6IGdldE1hcHNTY29yZXMoZGF0YSksXHJcblx0XHRcdG9iamVjdGl2ZXM6IG9iamVjdGl2ZXMsXHJcblx0XHRcdC8vIGd1aWxkczogZ3VpbGRzLFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdGlmKCFfLmlzRW1wdHkodGhpcy5zdGF0ZS5vYmplY3RpdmVzKSkge1xyXG5cdFx0XHRwcm9jZXNzLm5leHRUaWNrKHF1ZXVlR3VpbGRMb29rdXBzLmJpbmQodGhpcywgdGhpcy5zdGF0ZS5vYmplY3RpdmVzKSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0b25NYXRjaERldGFpbHNFcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xyXG5cdFx0Y29uc29sZS5sb2coJ092ZXJ2aWV3OjpnZXRNYXRjaERldGFpbHM6ZGF0YSBlcnJvcicsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpOyBcclxuXHR9LFxyXG5cclxuXHRvbk1hdGNoRGV0YWlsc0NvbXBsZXRlOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyKSB7XHJcblx0XHR2YXIgcmVmcmVzaFRpbWUgPSBfLnJhbmRvbSgxMDAwKjEsIDEwMDAqNCk7XHJcblx0XHR0aGlzLnVwZGF0ZVRpbWVyID0gc2V0VGltZW91dCh0aGlzLmdldE1hdGNoRGV0YWlscywgcmVmcmVzaFRpbWUpO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE1hcHNTY29yZXMobWQpIHtcclxuXHRyZXR1cm4gXy5wbHVjayhtZC5tYXBzLCAnc2NvcmVzJyk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRPYmplY3RpdmVzKGNvbXBvbmVudCwgbWQpIHtcclxuXHR2YXIgb2JqZWN0aXZlcyA9IF9cclxuXHRcdC5jaGFpbihtZC5tYXBzKVxyXG5cdFx0LnBsdWNrKCdvYmplY3RpdmVzJylcclxuXHRcdC5mbGF0dGVuKClcclxuXHRcdC5tYXAoc2V0T2JqZWN0aXZlTGFzdENhcC5iaW5kKGNvbXBvbmVudCkpXHJcblx0XHQuaW5kZXhCeSgnaWQnKVxyXG5cdFx0LnZhbHVlKCk7XHJcblxyXG5cdHJldHVybiBvYmplY3RpdmVzO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gc2V0T2JqZWN0aXZlTGFzdENhcChvKSB7XHJcblx0dmFyIHNvID0gdGhpcy5zdGF0ZS5vYmplY3RpdmVzW28uaWRdO1xyXG5cclxuXHRpZiAoIXNvKSB7XHJcblx0XHRvLmxhc3RDYXAgPSB3aW5kb3cuYXBwLnN0YXRlLnN0YXJ0O1xyXG5cdH1cclxuXHRlbHNlIGlmIChvLm93bmVyID09PSBzby5vd25lcikge1xyXG5cdFx0by5sYXN0Q2FwID0gc28ubGFzdENhcDtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRvLmxhc3RDYXAgPSBsaWJEYXRlLmRhdGVOb3coKTtcclxuXHR9XHJcblxyXG5cdG8uZXhwaXJlcyA9IGxpYkRhdGUuYWRkNShvLmxhc3RDYXApO1xyXG5cclxuXHRyZXR1cm4gbztcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBxdWV1ZUd1aWxkTG9va3VwcyhvYmplY3RpdmVzKXtcclxuXHR2YXIga25vd25HdWlsZHMgPSBfLmtleXModGhpcy5zdGF0ZS5ndWlsZHMpO1xyXG5cclxuXHR2YXIgbmV3R3VpbGRzID0gX1xyXG5cdFx0LmNoYWluKG9iamVjdGl2ZXMpXHJcblx0XHQucGx1Y2soJ293bmVyX2d1aWxkJylcclxuXHRcdC51bmlxKClcclxuXHRcdC53aXRob3V0KHVuZGVmaW5lZClcclxuXHRcdC5kaWZmZXJlbmNlKGtub3duR3VpbGRzKVxyXG5cdFx0LnZhbHVlKCk7XHJcblxyXG5cdGFzeW5jLmVhY2hMaW1pdChcclxuXHRcdG5ld0d1aWxkcyxcclxuXHRcdDQsXHJcblx0XHRnZXRHdWlsZERldGFpbHMuYmluZCh0aGlzKVxyXG5cdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEd1aWxkRGV0YWlscyhndWlsZElkLCBvbkNvbXBsZXRlKSB7XHJcblx0dmFyIGFwaSA9IHJlcXVpcmUoJy4uL2FwaScpO1xyXG5cdHZhciBjb21wb25lbnQgPSB0aGlzO1xyXG5cclxuXHRhcGkuZ2V0R3VpbGREZXRhaWxzKFxyXG5cdFx0Z3VpbGRJZCxcclxuXHRcdGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NvbXBvbmVudC5zdGF0ZScsIGNvbXBvbmVudC5zdGF0ZSk7XHJcblx0XHRcdC8vIHZhciBndWlsZCA9IF8ubWVyZ2UoY29tcG9uZW50LnN0YXRlLmd1aWxkc1tndWlsZElkXSwgZGF0YSk7XHJcblx0XHRcdGRhdGEub2JqZWN0aXZlcyA9IF8uZmlsdGVyKGNvbXBvbmVudC5zdGF0ZS5vYmplY3RpdmVzLCB7XCJvd25lcl9ndWlsZFwiOiBndWlsZElkfSk7XHJcblx0XHRcdGNvbXBvbmVudC5zdGF0ZS5ndWlsZHNbZ3VpbGRJZF0gPSBkYXRhO1xyXG5cdFx0XHRjb21wb25lbnQuc2V0U3RhdGUoe2d1aWxkczogY29tcG9uZW50LnN0YXRlLmd1aWxkc30pO1xyXG5cdFx0fSwgXHJcblx0XHRfLm5vb3AsXHJcblx0XHRvbkNvbXBsZXRlLmJpbmQobnVsbCwgbnVsbCkgLy8gc28gbm8gZXJyb3IgaXMgcmV0dXJuZWRcclxuXHQpO1xyXG59XG59KS5jYWxsKHRoaXMscmVxdWlyZSgnX3Byb2Nlc3MnKSkiLCIvKiogQGpzeCBSZWFjdC5ET00gKi8vKipcclxuICogQGp4cyBSZWFjdC5ET01cclxuICovXHJcblxyXG52YXIgU2NvcmUgPSByZXF1aXJlKCcuL1Njb3JlLmpzeCcpO1xyXG52YXIgUGllID0gcmVxdWlyZSgnLi9QaWUuanN4Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRzY29yZXM6IFtOYU4sTmFOLE5hTl0sIFxyXG5cdFx0XHRkaWZmOiBbMCwwLDBdXHJcblx0XHR9O1xyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdNYXRjaDo6Y29tcG9uZW50RGlkTW91bnQnLCB0aGlzLnByb3BzLmRhdGEud3Z3X21hdGNoX2lkKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZVRpbWVyID0gbnVsbDtcclxuXHRcdHRoaXMuZ2V0TWF0Y2hEZXRhaWxzKCk7XHJcblxyXG5cdH0sXHJcblxyXG5cdC8vIGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uKG5leHRQcm9wcywgbmV4dFN0YXRlKXtcclxuXHQvLyBcdC8vIGNvbnNvbGUubG9nKCdNYXRjaDo6Y29tcG9uZW50V2lsbFVwZGF0ZScsIHRoaXMucHJvcHMuZGF0YS53dndfbWF0Y2hfaWQsIG5leHRTdGF0ZSwgdGhpcy5zdGF0ZSk7XHJcblxyXG5cdC8vIFx0aWYgKHRoaXMuc3RhdGUuc2NvcmVzLmxlbmd0aCkge1xyXG5cdC8vIFx0XHQkKHRoaXMuZ2V0RE9NTm9kZSgpKS5hZGRDbGFzcygnaGlnaGxpZ2h0Jyk7XHJcblx0Ly8gXHR9XHJcblxyXG5cdC8vIFx0cmV0dXJuO1xyXG5cdC8vIH0sXHJcblxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aGlzLnVwZGF0ZVRpbWVyKTtcclxuXHR9LFxyXG5cdFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnTWF0Y2g6cmVuZGVyJywgdGhpcy5wcm9wcy5kYXRhLnd2d19tYXRjaF9pZCk7XHJcblxyXG5cdFx0dmFyIGRhdGEgPSB0aGlzLnByb3BzLmRhdGE7XHJcblx0XHR2YXIgd29ybGRzID0gcmVxdWlyZSgnLi4vLi4vc3RhdGljRGF0YScpLndvcmxkcztcclxuXHJcblx0XHR2YXIgcmVkV29ybGQgPSB3b3JsZHNbZGF0YS5yZWRfd29ybGRfaWRdO1xyXG5cdFx0dmFyIGJsdWVXb3JsZCA9IHdvcmxkc1tkYXRhLmJsdWVfd29ybGRfaWRdO1xyXG5cdFx0dmFyIGdyZWVuV29ybGQgPSB3b3JsZHNbZGF0YS5ncmVlbl93b3JsZF9pZF07XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm1hdGNoQ29udGFpbmVyXCJ9LCBcclxuXHRcdFx0XHRSZWFjdC5ET00udGFibGUoe2NsYXNzTmFtZTogXCJtYXRjaFwifSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00udHIobnVsbCwgXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS50ZCh7Y2xhc3NOYW1lOiBcInRlYW0gcmVkIG5hbWVcIn0sIFJlYWN0LkRPTS5hKHtocmVmOiByZWRXb3JsZC5saW5rfSwgcmVkV29ybGQubmFtZSkpLCBcclxuXHRcdFx0XHRcdFx0UmVhY3QuRE9NLnRkKHtjbGFzc05hbWU6IFwidGVhbSByZWQgc2NvcmVcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFNjb3JlKHtcclxuXHRcdFx0XHRcdFx0XHRcdGtleTogJ3JlZC1zY29yZS0nICsgZGF0YS53dndfbWF0Y2hfaWQsIFxyXG5cdFx0XHRcdFx0XHRcdFx0bWF0Y2hJZDogZGF0YS53dndfbWF0Y2hfaWQsIFxyXG5cdFx0XHRcdFx0XHRcdFx0dGVhbTogXCJyZWRcIiwgXHJcblx0XHRcdFx0XHRcdFx0XHRzY29yZTogdGhpcy5zdGF0ZS5zY29yZXNbMF0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0ZGlmZjogdGhpcy5zdGF0ZS5kaWZmWzBdfVxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS50ZCh7cm93U3BhbjogXCIzXCIsIGNsYXNzTmFtZTogXCJwaWVcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFBpZSh7c2NvcmVzOiB0aGlzLnN0YXRlLnNjb3Jlcywgc2l6ZTogXCI2MFwiLCBtYXRjaElkOiBkYXRhLnd2d19tYXRjaF9pZH0pXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdCksIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRyKG51bGwsIFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00udGQoe2NsYXNzTmFtZTogXCJ0ZWFtIGJsdWUgbmFtZVwifSwgUmVhY3QuRE9NLmEoe2hyZWY6IGJsdWVXb3JsZC5saW5rfSwgYmx1ZVdvcmxkLm5hbWUpKSwgXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS50ZCh7Y2xhc3NOYW1lOiBcInRlYW0gYmx1ZSBzY29yZVwifSwgXHJcblx0XHRcdFx0XHRcdFx0U2NvcmUoe1xyXG5cdFx0XHRcdFx0XHRcdFx0a2V5OiAnYmx1ZS1zY29yZS0nICsgZGF0YS53dndfbWF0Y2hfaWQsIFxyXG5cdFx0XHRcdFx0XHRcdFx0bWF0Y2hJZDogZGF0YS53dndfbWF0Y2hfaWQsIFxyXG5cdFx0XHRcdFx0XHRcdFx0dGVhbTogXCJibHVlXCIsIFxyXG5cdFx0XHRcdFx0XHRcdFx0c2NvcmU6IHRoaXMuc3RhdGUuc2NvcmVzWzFdLCBcclxuXHRcdFx0XHRcdFx0XHRcdGRpZmY6IHRoaXMuc3RhdGUuZGlmZlsxXX1cclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdCksIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnRyKG51bGwsIFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00udGQoe2NsYXNzTmFtZTogXCJ0ZWFtIGdyZWVuIG5hbWVcIn0sIFJlYWN0LkRPTS5hKHtocmVmOiBncmVlbldvcmxkLmxpbmt9LCBncmVlbldvcmxkLm5hbWUpKSwgXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS50ZCh7Y2xhc3NOYW1lOiBcInRlYW0gZ3JlZW4gc2NvcmVcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFNjb3JlKHtcclxuXHRcdFx0XHRcdFx0XHRcdGtleTogJ2dyZWVuLXNjb3JlLScgKyBkYXRhLnd2d19tYXRjaF9pZCwgXHJcblx0XHRcdFx0XHRcdFx0XHRtYXRjaElkOiBkYXRhLnd2d19tYXRjaF9pZCwgXHJcblx0XHRcdFx0XHRcdFx0XHR0ZWFtOiBcImdyZWVuXCIsIFxyXG5cdFx0XHRcdFx0XHRcdFx0c2NvcmU6IHRoaXMuc3RhdGUuc2NvcmVzWzJdLCBcclxuXHRcdFx0XHRcdFx0XHRcdGRpZmY6IHRoaXMuc3RhdGUuZGlmZlsyXX1cclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHQpXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fSxcclxuXHJcblxyXG5cclxuXHRnZXRNYXRjaERldGFpbHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGFwaSA9IHJlcXVpcmUoJy4uLy4uL2FwaScpO1xyXG5cdFx0XHJcblx0XHRhcGkuZ2V0TWF0Y2hEZXRhaWxzKFxyXG5cdFx0XHR0aGlzLnByb3BzLmRhdGEud3Z3X21hdGNoX2lkLFxyXG5cdFx0XHR0aGlzLm9uTWF0Y2hEZXRhaWxzU3VjY2VzcywgXHJcblx0XHRcdHRoaXMub25NYXRjaERldGFpbHNFcnJvciwgXHJcblx0XHRcdHRoaXMub25NYXRjaERldGFpbHNDb21wbGV0ZVxyXG5cdFx0KTtcclxuXHR9LFxyXG5cclxuXHRvbk1hdGNoRGV0YWlsc1N1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdNYXRjaDo6b25NYXRjaERldGFpbHNTdWNjZXNzJywgdGhpcy5wcm9wcy5kYXRhLnd2d19tYXRjaF9pZCwgZGF0YSk7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0c2NvcmVzOiBkYXRhLnNjb3JlcyxcclxuXHRcdFx0ZGlmZjogW1xyXG5cdFx0XHRcdGRhdGEuc2NvcmVzWzBdIC0gdGhpcy5zdGF0ZS5zY29yZXNbMF0sXHJcblx0XHRcdFx0ZGF0YS5zY29yZXNbMV0gLSB0aGlzLnN0YXRlLnNjb3Jlc1sxXSxcclxuXHRcdFx0XHRkYXRhLnNjb3Jlc1syXSAtIHRoaXMuc3RhdGUuc2NvcmVzWzJdLFxyXG5cdFx0XHRdXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRvbk1hdGNoRGV0YWlsc0Vycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyKSB7XHJcblx0XHRjb25zb2xlLmxvZygnT3ZlcnZpZXc6OmdldE1hdGNoRGV0YWlsczpkYXRhIGVycm9yJywgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7IFxyXG5cdH0sXHJcblxyXG5cdG9uTWF0Y2hEZXRhaWxzQ29tcGxldGU6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcclxuXHRcdHZhciByZWZyZXNoVGltZSA9IF8ucmFuZG9tKDEwMDAqMTYsIDEwMDAqMzIpO1xyXG5cdFx0dGhpcy51cGRhdGVUaW1lciA9IHNldFRpbWVvdXQodGhpcy5nZXRNYXRjaERldGFpbHMsIHJlZnJlc2hUaW1lKTtcclxuXHR9LFxyXG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi8vKipcclxuICogQGp4cyBSZWFjdC5ET01cclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2l6ZSA9IHRoaXMucHJvcHMuc2l6ZSB8fCAnNjAnO1xyXG5cdFx0dmFyIHN0cm9rZSA9IHRoaXMucHJvcHMuc3Ryb2tlIHx8IDI7XHJcblx0XHR2YXIgc2NvcmVzID0gdGhpcy5wcm9wcy5zY29yZXMgfHwgW107XHJcblxyXG5cdFx0dmFyIHBpZVNyYyA9ICdodHRwOi8vd3d3LnBpZWx5Lm5ldC8nICsgc2l6ZSArICcvJyArIHNjb3Jlcy5qb2luKCcsJykgKyAnP3N0cm9rZVdpZHRoPScgKyBzdHJva2U7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0KHNjb3Jlcy5sZW5ndGgpID9cclxuXHRcdFx0XHRSZWFjdC5ET00uaW1nKHtcclxuXHRcdFx0XHRcdHdpZHRoOiBcIjYwXCIsIGhlaWdodDogXCI2MFwiLCBcclxuXHRcdFx0XHRcdGtleTogJ3BpZS0nICsgdGhpcy5wcm9wcy5tYXRjaElkLCBcclxuXHRcdFx0XHRcdHNyYzogcGllU3JjfVxyXG5cdFx0XHRcdCkgOlxyXG5cdFx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwpXHJcblx0XHQpO1xyXG5cdH1cclxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXHJcbiAqIEBqeHMgUmVhY3QuRE9NXHJcbiAqL1xyXG5cclxudmFyIE1hdGNoID0gcmVxdWlyZSgnLi9NYXRjaC5qc3gnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnZXhwb3J0cycsXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiUmVnaW9uTWF0Y2hlc1wifSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmgyKG51bGwsIHRoaXMucHJvcHMuZGF0YS5sYWJlbCksIFxyXG5cdFx0XHRcdF8ubWFwKHRoaXMucHJvcHMuZGF0YS5tYXRjaGVzLCBmdW5jdGlvbihtYXRjaCl7XHJcblx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRNYXRjaCh7XHJcblx0XHRcdFx0XHRcdFx0Y2xhc3NOYW1lOiBcIm1hdGNoXCIsIFxyXG5cdFx0XHRcdFx0XHRcdGtleTogJ21hdGNoLScgKyBtYXRjaC53dndfbWF0Y2hfaWQsIFxyXG5cdFx0XHRcdFx0XHRcdGRhdGE6IG1hdGNofVxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fVxyXG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi8vKipcclxuICogQGp4cyBSZWFjdC5ET01cclxuICovXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGxhYmVsID0gdGhpcy5wcm9wcy5kYXRhLmxhYmVsO1xyXG5cdFx0dmFyIHdvcmxkcyA9IF8uc29ydEJ5KHRoaXMucHJvcHMuZGF0YS53b3JsZHMsICduYW1lJyk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIlJlZ2lvbldvcmxkc1wifSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmgyKG51bGwsIGxhYmVsKSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLnVsKHtjbGFzc05hbWU6IFwibGlzdC11bnN0eWxlZFwifSwgXHJcblx0XHRcdFx0XHRfLm1hcCh3b3JsZHMsIGZ1bmN0aW9uKHdvcmxkKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00ubGkoe2tleTogJ3dvcmxkJyArIHdvcmxkLmlkfSwgUmVhY3QuRE9NLmEoe2hyZWY6IHdvcmxkLmxpbmt9LCB3b3JsZC5uYW1lKSlcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH1cclxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXHJcbiAqIEBqeHMgUmVhY3QuRE9NXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24ocHJldlByb3BzLCBwcmV2U3RhdGUpe1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ1Njb3JlOjpjb21wb25lbnRXaWxsVXBkYXRlJywgcHJldlByb3BzLCB0aGlzLnByb3BzKTtcclxuXHJcblx0XHRpZiAoXy5pc051bWJlcih0aGlzLnByb3BzLmRpZmYpICYmIHRoaXMucHJvcHMuZGlmZiA+IDApIHtcclxuXHRcdFx0dmFyICRkaWZmID0gJCgnLmRpZmYnLCB0aGlzLmdldERPTU5vZGUoKSk7XHJcblxyXG5cdFx0XHQvLyAkZGlmZlxyXG5cdFx0XHQvLyBcdC5mYWRlSW4oJ2Zhc3QnKVxyXG5cdFx0XHQvLyBcdC5kZWxheSgyMDAwKVxyXG5cdFx0XHQvLyBcdC5mYWRlT3V0KCdzbG93Jyk7XHJcblx0XHRcdCRkaWZmXHJcblx0XHRcdFx0LnZlbG9jaXR5KCdmYWRlT3V0Jywge2R1cmF0aW9uOiAwfSlcclxuXHRcdFx0XHQudmVsb2NpdHkoJ2ZhZGVJbicsIHtkdXJhdGlvbjogNDAwfSlcclxuXHRcdFx0XHQudmVsb2NpdHkoJ2ZhZGVPdXQnLCB7ZHVyYXRpb246IDIwMDAsIGRlbGF5OiA0MDAwfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBtYXRjaElkID0gdGhpcy5wcm9wcy5tYXRjaElkO1xyXG5cdFx0dmFyIHRlYW0gPSB0aGlzLnByb3BzLnRlYW07XHJcblx0XHR2YXIgc2NvcmUgPSB0aGlzLnByb3BzLnNjb3JlIHx8IDA7XHJcblx0XHR2YXIgZGlmZiA9IHRoaXMucHJvcHMuZGlmZiB8fCAwO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5zcGFuKG51bGwsIFxyXG5cdFx0XHRcdChkaWZmKSA/XHJcblx0XHRcdFx0XHRSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiBcImRpZmZcIn0sIG51bWVyYWwoZGlmZikuZm9ybWF0KCcwLDAnKSlcclxuXHRcdFx0XHRcdDogUmVhY3QuRE9NLnNwYW4obnVsbCksIFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IFwidmFsdWVcIn0sIG51bWVyYWwoc2NvcmUpLmZvcm1hdCgnMCwwJykpXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fVxyXG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi8vKipcclxuICogQGp4cyBSZWFjdC5ET01cclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbWV0YSA9IHRoaXMucHJvcHMub2JqZWN0aXZlTWV0YTtcclxuXHJcblx0XHRpZiAobWV0YS5kKSB7XHJcblx0XHRcdHZhciBzcmMgPSBbJy9pbWcvaWNvbnMvZGlzdC9hcnJvdyddO1xyXG5cclxuXHRcdFx0aWYgKG1ldGEubikge3NyYy5wdXNoKCdub3J0aCcpOyB9XHJcblx0XHRcdGVsc2UgaWYgKG1ldGEucykge3NyYy5wdXNoKCdzb3V0aCcpOyB9XHJcblxyXG5cdFx0XHRpZiAobWV0YS53KSB7c3JjLnB1c2goJ3dlc3QnKTsgfVxyXG5cdFx0XHRlbHNlIGlmIChtZXRhLmUpIHtzcmMucHVzaCgnZWFzdCcpOyB9XHJcblxyXG5cdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IFwiZGlyZWN0aW9uXCJ9LCBcclxuXHRcdFx0XHRcdFJlYWN0LkRPTS5pbWcoe3NyYzogc3JjLmpvaW4oJy0nKSArICcuc3ZnJ30pXHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiBSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiBcImRpcmVjdGlvblwifSk7XHJcblx0XHR9XHJcblx0fVxyXG59KTsiLCIvKipcclxuICogQGpzeCBSZWFjdC5ET01cclxuICovXHJcblxyXG52YXIgTWFwU2VjdGlvbiA9IHJlcXVpcmUoJy4vTWFwU2VjdGlvbi5qc3gnKTtcclxudmFyIGxpYkRhdGUgPSByZXF1aXJlKCcuLi8uLi9saWIvZGF0ZS5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzdGF0aWNEYXRhID0gcmVxdWlyZSgnLi4vLi4vc3RhdGljRGF0YScpO1xyXG5cdFx0dmFyIG9iamVjdGl2ZXNEYXRhID0gc3RhdGljRGF0YS5vYmplY3RpdmVzO1xyXG5cclxuXHRcdHZhciBtYXBDb25maWcgPSB0aGlzLnByb3BzLm1hcENvbmZpZztcclxuXHRcdHZhciBtYXBTY29yZXMgPSB0aGlzLnByb3BzLm1hcFNjb3JlcztcclxuXHRcdHZhciBvYmplY3RpdmVzID0gdGhpcy5wcm9wcy5vYmplY3RpdmVzO1xyXG5cdFx0dmFyIGd1aWxkcyA9IHRoaXMucHJvcHMuZ3VpbGRzO1xyXG5cdFx0dmFyIG1hcE5hbWUgPSB0aGlzLnByb3BzLm1hcE5hbWU7XHJcblx0XHR2YXIgbWFwQ29sb3IgPSB0aGlzLnByb3BzLm1hcENvbG9yO1xyXG5cdFx0dmFyIGRhdGVOb3cgPSB0aGlzLnByb3BzLmRhdGVOb3c7XHJcblxyXG5cdFx0dmFyIGNvbG9yTWFwID0gWydyZWQnLCAnZ3JlZW4nLCAnYmx1ZSddO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJtYXBcIn0sIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJtYXBTY29yZXNcIn0sIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLmgyKHtjbGFzc05hbWU6ICd0ZWFtICcgKyBtYXBDb2xvciwgb25DbGljazogdGhpcy5vblRpdGxlQ2xpY2t9LCBcclxuXHRcdFx0XHRcdFx0bWFwTmFtZVxyXG5cdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00udWwoe2NsYXNzTmFtZTogXCJsaXN0LWlubGluZVwifSwgXHJcblx0XHRcdFx0XHRcdF8ubWFwKG1hcFNjb3JlcywgZnVuY3Rpb24oc2NvcmUsIHNjb3JlSW5kZXgpIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0dmFyIGNsYXNzTmFtZSA9IFsndGVhbScsIGNvbG9yTWFwW3Njb3JlSW5kZXhdXS5qb2luKCcgJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00ubGkoe2tleTogJ21hcC1zY29yZS0nICsgc2NvcmVJbmRleCwgY2xhc3NOYW1lOiBjbGFzc05hbWV9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bnVtZXJhbChzY29yZSkuZm9ybWF0KCcwLDAnKVxyXG5cdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdFx0KSwgXHJcblxyXG5cclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwicm93XCJ9LCBcclxuXHRcdFx0XHRcdF8ubWFwKG1hcENvbmZpZy5zZWN0aW9ucywgZnVuY3Rpb24obWFwU2VjdGlvbiwgc2VjSW5kZXgpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBzZWN0aW9uQ2xhc3MgPSBbXHJcblx0XHRcdFx0XHRcdFx0J2NvbC1tZC0yNCcsXHJcblx0XHRcdFx0XHRcdFx0J21hcC1zZWN0aW9uJyxcclxuXHRcdFx0XHRcdFx0XTtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChtYXBDb25maWcua2V5ID09PSAnQ2VudGVyJykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChtYXBTZWN0aW9uLmxhYmVsID09PSAnQ2FzdGxlJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0c2VjdGlvbkNsYXNzLnB1c2goJ2NvbC1zbS0yNCcpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25DbGFzcy5wdXNoKCdjb2wtc20tOCcpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uQ2xhc3MucHVzaCgnY29sLXNtLTgnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IHNlY3Rpb25DbGFzcy5qb2luKCcgJyksIGtleTogbWFwQ29uZmlnLmtleSArICctJyArIG1hcFNlY3Rpb24ubGFiZWx9LCBcclxuXHRcdFx0XHRcdFx0XHRcdE1hcFNlY3Rpb24oe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRlTm93OiBkYXRlTm93LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwU2VjdGlvbjogbWFwU2VjdGlvbiwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdGl2ZXM6IG9iamVjdGl2ZXMsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRndWlsZHM6IGd1aWxkc31cclxuXHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG5cclxuXHRvblRpdGxlQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciAkbWFwcyA9ICQoJy5tYXAnKTtcclxuXHRcdHZhciAkbWFwID0gJChlLnRhcmdldCkuY2xvc2VzdCgnLm1hcCcsICRtYXBzKTtcclxuXHJcblx0XHR2YXIgaGFzRm9jdXMgPSAkbWFwLmhhc0NsYXNzKCdtYXAtZm9jdXMnKTtcclxuXHJcblxyXG5cdFx0aWYoIWhhc0ZvY3VzKSB7XHJcblx0XHRcdCRtYXBcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ21hcC1mb2N1cycpXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtYmx1cicpO1xyXG5cclxuXHRcdFx0JG1hcHMubm90KCRtYXApXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdtYXAtZm9jdXMnKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnbWFwLWJsdXInKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQkbWFwc1xyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnbWFwLWZvY3VzJylcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ21hcC1ibHVyJyk7XHJcblxyXG5cdFx0fVxyXG5cdH0sXHJcbn0pO1xyXG5cclxuXHJcbi8qXHJcblxyXG5cclxuXHRcdFx0XHQ8dWwgY2xhc3NOYW1lPVwib2JqZWN0aXZlcyBsaXN0LXVuc3R5bGVkXCI+XHJcblx0XHRcdFx0XHR7Xy5tYXAobWFwRGV0YWlscy5vYmplY3RpdmVzLCBmdW5jdGlvbihvLCBvSW5kZXgpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG9iamVjdGl2ZU1ldGEgPSBvYmplY3RpdmVzRGF0YS5vYmplY3RpdmVfbWV0YVtvLmlkXTtcclxuXHRcdFx0XHRcdFx0dmFyIG9iamVjdGl2ZU5hbWUgPSBvYmplY3RpdmVzRGF0YS5vYmplY3RpdmVfbmFtZXNbby5pZF07XHJcblx0XHRcdFx0XHRcdHZhciBvYmplY3RpdmVMYWJlbHMgPSBvYmplY3RpdmVzRGF0YS5vYmplY3RpdmVfbGFiZWxzW28uaWRdO1xyXG5cclxuXHRcdFx0XHRcdFx0dmFyIHRpbWVyQWN0aXZlID0gKG8uZXhwaXJlcyA+PSBkYXRlTm93KTtcclxuXHRcdFx0XHRcdFx0dmFyIHRpbWVyVW5rbm93biA9IChvLmxhc3RDYXAgPT09IHdpbmRvdy5hcHAuc3RhdGUuc3RhcnQpO1xyXG5cdFx0XHRcdFx0XHR2YXIgZXhwaXJhdGlvbiA9IG1vbWVudCgoby5leHBpcmVzIC0gZGF0ZU5vdykgKiAxMDAwKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKG8ubGFzdENhcCwgby5leHBpcmVzLCBub3csIG8uZXhwaXJlcyA+IG5vdyk7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgY2xhc3NOYW1lID0gW1xyXG5cdFx0XHRcdFx0XHRcdCdvYmplY3RpdmUnLFxyXG5cdFx0XHRcdFx0XHRcdCd0ZWFtJywgXHJcblx0XHRcdFx0XHRcdFx0by5vd25lci50b0xvd2VyQ2FzZSgpLFxyXG5cdFx0XHRcdFx0XHRdLmpvaW4oJyAnKTtcclxuXHJcblx0XHRcdFx0XHRcdHZhciB0aW1lckNsYXNzID0gW1xyXG5cdFx0XHRcdFx0XHRcdCd0aW1lcicsXHJcblx0XHRcdFx0XHRcdFx0KHRpbWVyQWN0aXZlKSA/ICdhY3RpdmUnIDogJ2luYWN0aXZlJyxcclxuXHRcdFx0XHRcdFx0XHQodGltZXJVbmtub3duKSA/ICd1bmtub3duJyA6ICcnLFxyXG5cdFx0XHRcdFx0XHRdLmpvaW4oJyAnKTtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChvYmplY3RpdmVNZXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHRcdDxsaSBjbGFzc05hbWU9e2NsYXNzTmFtZX0ga2V5PXsnb2JqZWN0aXZlLScgKyBvLmlkfSBpZD17J29iamVjdGl2ZS0nICsgby5pZH0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIm9iamVjdGl2ZS1sYWJlbFwiPntvYmplY3RpdmVMYWJlbHNbYXBwU3RhdGUubGFuZy5zbHVnXX0gPC9zcGFuPlxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPXt0aW1lckNsYXNzfSB0aXRsZT17J0V4cGlyZXMgYXQgJyArIG8uZXhwaXJlc30+e2V4cGlyYXRpb24uZm9ybWF0KCdtOnNzJyl9PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KX1cclxuXHRcdFx0XHQ8L3VsPlxyXG5cclxuXHJcblxyXG5cdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJvYmplY3RpdmVzIGxpc3QtdW5zdHlsZWRcIj5cclxuXHRcdFx0XHRcdHtfLm1hcChtYXBEZXRhaWxzLm9iamVjdGl2ZXMsIGZ1bmN0aW9uKG8sIG9JbmRleCkge1xyXG5cdFx0XHRcdFx0XHR2YXIgb2JqZWN0aXZlTWV0YSA9IG9iamVjdGl2ZXNEYXRhLm9iamVjdGl2ZV9tZXRhW28uaWRdO1xyXG5cdFx0XHRcdFx0XHR2YXIgb2JqZWN0aXZlTmFtZSA9IG9iamVjdGl2ZXNEYXRhLm9iamVjdGl2ZV9uYW1lc1tvLmlkXTtcclxuXHRcdFx0XHRcdFx0dmFyIG9iamVjdGl2ZUxhYmVscyA9IG9iamVjdGl2ZXNEYXRhLm9iamVjdGl2ZV9sYWJlbHNbby5pZF07XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgdGltZXJBY3RpdmUgPSAoby5leHBpcmVzID49IGRhdGVOb3cpO1xyXG5cdFx0XHRcdFx0XHR2YXIgdGltZXJVbmtub3duID0gKG8ubGFzdENhcCA9PT0gd2luZG93LmFwcC5zdGF0ZS5zdGFydCk7XHJcblx0XHRcdFx0XHRcdHZhciBleHBpcmF0aW9uID0gbW9tZW50KChvLmV4cGlyZXMgLSBkYXRlTm93KSAqIDEwMDApO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coby5sYXN0Q2FwLCBvLmV4cGlyZXMsIG5vdywgby5leHBpcmVzID4gbm93KTtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBjbGFzc05hbWUgPSBbXHJcblx0XHRcdFx0XHRcdFx0J29iamVjdGl2ZScsXHJcblx0XHRcdFx0XHRcdFx0J3RlYW0nLCBcclxuXHRcdFx0XHRcdFx0XHRvLm93bmVyLnRvTG93ZXJDYXNlKCksXHJcblx0XHRcdFx0XHRcdF0uam9pbignICcpO1xyXG5cclxuXHRcdFx0XHRcdFx0dmFyIHRpbWVyQ2xhc3MgPSBbXHJcblx0XHRcdFx0XHRcdFx0J3RpbWVyJyxcclxuXHRcdFx0XHRcdFx0XHQodGltZXJBY3RpdmUpID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnLFxyXG5cdFx0XHRcdFx0XHRcdCh0aW1lclVua25vd24pID8gJ3Vua25vd24nIDogJycsXHJcblx0XHRcdFx0XHRcdF0uam9pbignICcpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKG9iamVjdGl2ZU1ldGEpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBrZXk9eydvYmplY3RpdmUtJyArIG8uaWR9IGlkPXsnb2JqZWN0aXZlLScgKyBvLmlkfT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwib2JqZWN0aXZlLWxhYmVsXCI+e29iamVjdGl2ZUxhYmVsc1thcHBTdGF0ZS5sYW5nLnNsdWddfSA8L3NwYW4+XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9e3RpbWVyQ2xhc3N9IHRpdGxlPXsnRXhwaXJlcyBhdCAnICsgby5leHBpcmVzfT57ZXhwaXJhdGlvbi5mb3JtYXQoJ206c3MnKX08L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pfVxyXG5cdFx0XHRcdDwvdWw+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXY+bm93OiB7bm93fTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj5jYXA6IHtvLmxhc3RDYXB9PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PmV4cDoge28uZXhwaXJlc308L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj4ge28ubGFzdENhcC5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKX08L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXY+IHtvLmV4cGlyZXMuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyl9PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PiB7by5leHBpcmVzLmRpZmYobm93LCAncycpfTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG4qLyIsIi8qKlxyXG4gKiBAanN4IFJlYWN0LkRPTVxyXG4gKi9cclxudmFyIFNwcml0ZSA9IHJlcXVpcmUoJy4vU3ByaXRlLmpzeCcpO1xyXG52YXIgQXJyb3cgPSByZXF1aXJlKCcuL0Fycm93LmpzeCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzdGF0aWNEYXRhID0gcmVxdWlyZSgnLi4vLi4vc3RhdGljRGF0YScpO1xyXG5cdFx0dmFyIG9iamVjdGl2ZXNEYXRhID0gc3RhdGljRGF0YS5vYmplY3RpdmVzO1xyXG5cclxuXHRcdHZhciBhcHBTdGF0ZSA9IHdpbmRvdy5hcHAuc3RhdGU7XHJcblxyXG5cdFx0dmFyIG9iamVjdGl2ZUlkID0gdGhpcy5wcm9wcy5vYmplY3RpdmVJZDtcclxuXHRcdHZhciBkYXRlTm93ID0gdGhpcy5wcm9wcy5kYXRlTm93O1xyXG5cdFx0dmFyIG9iamVjdGl2ZXMgPSB0aGlzLnByb3BzLm9iamVjdGl2ZXM7XHJcblx0XHR2YXIgZ3VpbGRzID0gdGhpcy5wcm9wcy5ndWlsZHM7XHJcblxyXG5cclxuXHRcdGlmICghXy5oYXMob2JqZWN0aXZlc0RhdGEub2JqZWN0aXZlX21ldGEsIG9iamVjdGl2ZUlkKSkge1xyXG5cdFx0XHQvLyBzaG9ydCBjaXJjdWl0XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHR2YXIgb2JqZWN0aXZlID0gb2JqZWN0aXZlc1tvYmplY3RpdmVJZF07XHJcblx0XHR2YXIgb2JqZWN0aXZlTWV0YSA9IG9iamVjdGl2ZXNEYXRhLm9iamVjdGl2ZV9tZXRhW29iamVjdGl2ZS5pZF07XHJcblx0XHR2YXIgb2JqZWN0aXZlTmFtZSA9IG9iamVjdGl2ZXNEYXRhLm9iamVjdGl2ZV9uYW1lc1tvYmplY3RpdmUuaWRdO1xyXG5cdFx0dmFyIG9iamVjdGl2ZUxhYmVscyA9IG9iamVjdGl2ZXNEYXRhLm9iamVjdGl2ZV9sYWJlbHNbb2JqZWN0aXZlLmlkXTtcclxuXHRcdHZhciBvYmplY3RpdmVUeXBlID0gb2JqZWN0aXZlc0RhdGEub2JqZWN0aXZlX3R5cGVzW29iamVjdGl2ZU1ldGEudHlwZV07XHJcblxyXG5cdFx0dmFyIHRpbWVyQWN0aXZlID0gKG9iamVjdGl2ZS5leHBpcmVzID49IGRhdGVOb3cgKyA1KTsgLy8gc2hvdyBmb3IgNSBzZWNvbmRzIGFmdGVyIGV4cGlyaW5nXHJcblx0XHR2YXIgdGltZXJVbmtub3duID0gKG9iamVjdGl2ZS5sYXN0Q2FwID09PSB3aW5kb3cuYXBwLnN0YXRlLnN0YXJ0KTtcclxuXHRcdHZhciBzZWNvbmRzUmVtYWluaW5nID0gb2JqZWN0aXZlLmV4cGlyZXMgLSBkYXRlTm93O1xyXG5cdFx0dmFyIGV4cGlyYXRpb24gPSBtb21lbnQoc2Vjb25kc1JlbWFpbmluZyAqIDEwMDApO1xyXG5cclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZyhvYmplY3RpdmUubGFzdENhcCwgb2JqZWN0aXZlLmV4cGlyZXMsIG5vdywgb2JqZWN0aXZlLmV4cGlyZXMgPiBub3cpO1xyXG5cclxuXHRcdHZhciBjbGFzc05hbWUgPSBbXHJcblx0XHRcdCdvYmplY3RpdmUnLFxyXG5cdFx0XHQndGVhbScsIFxyXG5cdFx0XHRvYmplY3RpdmUub3duZXIudG9Mb3dlckNhc2UoKSxcclxuXHRcdF0uam9pbignICcpO1xyXG5cclxuXHRcdHZhciB0aW1lckNsYXNzID0gW1xyXG5cdFx0XHQndGltZXInLFxyXG5cdFx0XHQodGltZXJBY3RpdmUpID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnLFxyXG5cdFx0XHQodGltZXJVbmtub3duKSA/ICd1bmtub3duJyA6ICcnLFxyXG5cdFx0XS5qb2luKCcgJyk7XHJcblxyXG5cdFx0dmFyIHRhZ0NsYXNzID0gW1xyXG5cdFx0XHQndGFnJyxcclxuXHRcdF0uam9pbignICcpO1xyXG5cclxuXHRcdHZhciB0aW1lckh0bWwgPSAodGltZXJBY3RpdmUpID8gZXhwaXJhdGlvbi5mb3JtYXQoJ206c3MnKSA6ICcwOjAwJztcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IGNsYXNzTmFtZX0sIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJvYmplY3RpdmUtaWNvbnNcIn0sIFxyXG5cdFx0XHRcdFx0QXJyb3coe29iamVjdGl2ZU1ldGE6IG9iamVjdGl2ZU1ldGF9KSwgXHJcbiBcdFx0XHRcdFx0U3ByaXRlKHt0eXBlOiBvYmplY3RpdmVUeXBlLm5hbWUsIGNvbG9yOiBvYmplY3RpdmUub3duZXIudG9Mb3dlckNhc2UoKX0pXHJcblx0XHRcdFx0KSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcIm9iamVjdGl2ZS1sYWJlbFwifSwgXHJcblx0XHRcdFx0XHRSZWFjdC5ET00uc3BhbihudWxsLCBvYmplY3RpdmVMYWJlbHNbYXBwU3RhdGUubGFuZy5zbHVnXSlcclxuXHRcdFx0XHQpLCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwib2JqZWN0aXZlLXN0YXRlXCJ9LCBcclxuXHRcdFx0XHRcdGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdHZhciBndWlsZElkID0gb2JqZWN0aXZlLm93bmVyX2d1aWxkO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCFndWlsZElkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGd1aWxkID0gZ3VpbGRzW2d1aWxkSWRdO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR2YXIgZ3VpbGRDbGFzcyA9IFtcclxuXHRcdFx0XHRcdFx0XHRcdCdndWlsZCcsXHJcblx0XHRcdFx0XHRcdFx0XHQndGFnJyxcclxuXHRcdFx0XHRcdFx0XHRcdCdwZW5kaW5nJ1xyXG5cdFx0XHRcdFx0XHRcdF0uam9pbignICcpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZighZ3VpbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBSZWFjdC5ET00uc3Bhbih7Y2xhc3NOYW1lOiBndWlsZENsYXNzfSwgUmVhY3QuRE9NLmkoe2NsYXNzTmFtZTogXCJmYSBmYS1zcGlubmVyIGZhLXNwaW5cIn0pLCBcIjtcIik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdCBcdFx0XHRcdFx0XHRcdHJldHVybiBSZWFjdC5ET00uYSh7Y2xhc3NOYW1lOiBndWlsZENsYXNzLCB0aXRsZTogZ3VpbGQuZ3VpbGRfbmFtZX0sIGd1aWxkLnRhZyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KCksIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnNwYW4oe2NsYXNzTmFtZTogdGltZXJDbGFzcywgdGl0bGU6ICdFeHBpcmVzIGF0ICcgKyBvYmplY3RpdmUuZXhwaXJlc30sIHRpbWVySHRtbClcclxuXHRcdFx0XHQpXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fSxcclxufSk7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0QXJyb3cobWV0YSkge1xyXG5cdGlmICghbWV0YS5kKSB7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR2YXIgc3JjID0gWycvaW1nL2ljb25zL2Rpc3QvYXJyb3cnXTtcclxuXHJcblx0XHRpZiAobWV0YS5uKSB7c3JjLnB1c2goJ25vcnRoJyk7IH1cclxuXHRcdGVsc2UgaWYgKG1ldGEucykge3NyYy5wdXNoKCdzb3V0aCcpOyB9XHJcblxyXG5cdFx0aWYgKG1ldGEudykge3NyYy5wdXNoKCd3ZXN0Jyk7IH1cclxuXHRcdGVsc2UgaWYgKG1ldGEuZSkge3NyYy5wdXNoKCdlYXN0Jyk7IH1cclxuXHJcblx0XHRyZXR1cm4gUmVhY3QuRE9NLmltZyh7c3JjOiBzcmMuam9pbignLScpICsgJy5zdmcnfSk7XHJcblxyXG5cdH1cclxufVxyXG5cclxuXHJcbi8qXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2Pm5vdzoge25vd308L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXY+Y2FwOiB7b2JqZWN0aXZlLmxhc3RDYXB9PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PmV4cDoge29iamVjdGl2ZS5leHBpcmVzfTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PiB7b2JqZWN0aXZlLmxhc3RDYXAuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyl9PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PiB7b2JqZWN0aXZlLmV4cGlyZXMuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyl9PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PiB7b2JqZWN0aXZlLmV4cGlyZXMuZGlmZihub3csICdzJyl9PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcbiovIiwiLyoqXHJcbiAqIEBqc3ggUmVhY3QuRE9NXHJcbiAqL1xyXG5cclxudmFyIE1hcE9iamVjdGl2ZSA9IHJlcXVpcmUoJy4vTWFwT2JqZWN0aXZlLmpzeCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzdGF0aWNEYXRhID0gcmVxdWlyZSgnLi4vLi4vc3RhdGljRGF0YScpO1xyXG5cclxuXHRcdHZhciBtYXBTZWN0aW9uID0gdGhpcy5wcm9wcy5tYXBTZWN0aW9uO1xyXG5cdFx0dmFyIG9iamVjdGl2ZXMgPSB0aGlzLnByb3BzLm9iamVjdGl2ZXM7XHJcblx0XHR2YXIgZ3VpbGRzID0gdGhpcy5wcm9wcy5ndWlsZHM7XHJcblx0XHR2YXIgZGF0ZU5vdyA9IHRoaXMucHJvcHMuZGF0ZU5vdztcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00udWwoe2NsYXNzTmFtZTogXCJsaXN0LXVuc3R5bGVkXCJ9LCBcclxuXHRcdFx0XHRfLm1hcChtYXBTZWN0aW9uLm9iamVjdGl2ZXMsIGZ1bmN0aW9uKG9iamVjdGl2ZUlkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRSZWFjdC5ET00ubGkoe2tleTogJ29iamVjdGl2ZS0nICsgb2JqZWN0aXZlSWQsIGlkOiAnb2JqZWN0aXZlLScgKyBvYmplY3RpdmVJZH0sIFxyXG5cdFx0XHRcdFx0XHRcdE1hcE9iamVjdGl2ZSh7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmplY3RpdmVJZDogb2JqZWN0aXZlSWQsIFxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0ZU5vdzogZGF0ZU5vdywgXHJcblx0XHRcdFx0XHRcdFx0XHRvYmplY3RpdmVzOiBvYmplY3RpdmVzLCBcclxuXHRcdFx0XHRcdFx0XHRcdGd1aWxkczogZ3VpbGRzfVxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxuXHJcbi8qXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2Pm5vdzoge25vd308L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXY+Y2FwOiB7by5sYXN0Q2FwfTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj5leHA6IHtvLmV4cGlyZXN9PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXY+IHtvLmxhc3RDYXAuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyl9PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PiB7by5leHBpcmVzLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpfTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj4ge28uZXhwaXJlcy5kaWZmKG5vdywgJ3MnKX08L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuKi8iLCIvKipcclxuICogQGpzeCBSZWFjdC5ET01cclxuICovXHJcblxyXG52YXIgTWFwRGV0YWlscyA9IHJlcXVpcmUoJy4vTWFwRGV0YWlscy5qc3gnKTtcclxudmFyIGxpYkRhdGUgPSByZXF1aXJlKCcuLi8uLi9saWIvZGF0ZS5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7ZGF0ZU5vdzogbGliRGF0ZS5kYXRlTm93KCl9O1xyXG5cdH0sXHJcblx0dGljazogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtkYXRlTm93OiBsaWJEYXRlLmRhdGVOb3coKX0pO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKHRoaXMudGljaywgMTAwMCk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHN0YXRpY0RhdGEgPSByZXF1aXJlKCcuLi8uLi9zdGF0aWNEYXRhJyk7XHJcblx0XHR2YXIgbWFwc0NvbmZpZyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlcy5vYmplY3RpdmVfbWFwO1xyXG5cclxuXHRcdHZhciBtYXRjaERhdGEgPSB0aGlzLnByb3BzLmRhdGE7XHJcblx0XHR2YXIgb2JqZWN0aXZlcyA9IHRoaXMucHJvcHMub2JqZWN0aXZlcztcclxuXHRcdHZhciBndWlsZHMgPSB0aGlzLnByb3BzLmd1aWxkcztcclxuXHRcdHZhciBtYXBzU2NvcmVzID0gdGhpcy5wcm9wcy5tYXBzU2NvcmVzO1xyXG5cdFx0dmFyIG1hdGNoV29ybGRzID0gdGhpcy5wcm9wcy5tYXRjaFdvcmxkcztcclxuXHJcblx0XHRpZiAoIW9iamVjdGl2ZXMpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHZhciBtYXBOYW1lcyA9IFsnRXRlcm5hbCBCYXR0bGVncm91bmRzJywgbWF0Y2hXb3JsZHNbMF0ubmFtZSwgbWF0Y2hXb3JsZHNbMV0ubmFtZSwgbWF0Y2hXb3JsZHNbMl0ubmFtZV07XHJcblx0XHR2YXIgbWFwQ29sb3JzID0gWydkZWZhdWx0JywgJ3JlZCcsICdibHVlJywgJ2dyZWVuJ107XHJcblxyXG5cdFx0dmFyIGRhdGVOb3cgPSB0aGlzLnN0YXRlLmRhdGVOb3c7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0UmVhY3QuRE9NLmRpdih7aWQ6IFwibWFwc1wifSwgXHJcblx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcInJvd1wifSwgXHJcblx0XHRcdFx0XHRfLm1hcChtYXBzQ29uZmlnLCBmdW5jdGlvbihtYXBDb25maWcsIG91dHB1dEluZGV4KSB7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgbWFwTmFtZSA9IG1hcE5hbWVzW291dHB1dEluZGV4XTtcclxuXHRcdFx0XHRcdFx0dmFyIG1hcENvbG9yID0gbWFwQ29sb3JzW291dHB1dEluZGV4XTtcclxuXHJcblx0XHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImNvbC1tZC02XCIsIGtleTogJ21hcC0nICsgbWFwQ29uZmlnLm1hcEluZGV4fSwgXHJcblx0XHRcdFx0XHRcdFx0XHRNYXBEZXRhaWxzKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwc1Njb3JlczogbWFwc1Njb3Jlc1ttYXBDb25maWcubWFwSW5kZXhdLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0aXZlczogb2JqZWN0aXZlcywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGd1aWxkczogZ3VpbGRzLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwQ29uZmlnOiBtYXBDb25maWcsIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBOYW1lOiBtYXBOYW1lLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwQ29sb3I6IG1hcENvbG9yLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0ZU5vdzogZGF0ZU5vd31cclxuXHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9LFxyXG59KTtcclxuXHJcblxyXG4vKlxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj5ub3c6IHtub3d9PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PmNhcDoge28ubGFzdENhcH08L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXY+ZXhwOiB7by5leHBpcmVzfTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PiB7by5sYXN0Q2FwLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpfTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj4ge28uZXhwaXJlcy5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKX08L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXY+IHtvLmV4cGlyZXMuZGlmZihub3csICdzJyl9PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcbiovIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovLyoqXHJcbiAqIEBqeHMgUmVhY3QuRE9NXHJcbiAqL1xyXG5cclxudmFyIFNwcml0ZSA9IHJlcXVpcmUoJy4vU3ByaXRlLmpzeCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbWF0Y2hEZXRhaWxzID0gdGhpcy5wcm9wcy5tYXRjaERldGFpbHM7XHJcblx0XHR2YXIgd29ybGRzID0gdGhpcy5wcm9wcy5tYXRjaFdvcmxkcztcclxuXHJcblx0XHR2YXIgc2NvcmVzID0gdGhpcy5wcm9wcy5zY29yZXM7XHJcblx0XHR2YXIgb2JqZWN0aXZlcyA9IHRoaXMucHJvcHMub2JqZWN0aXZlcztcclxuXHJcblx0XHR2YXIgc3RhdGljRGF0YSA9IHJlcXVpcmUoJy4uLy4uL3N0YXRpY0RhdGEnKTtcclxuXHRcdHZhciBvYmplY3RpdmVUeXBlcyA9IHN0YXRpY0RhdGEub2JqZWN0aXZlcy5vYmplY3RpdmVfdHlwZXM7XHJcblx0XHR2YXIgb2JqZWN0aXZlc01ldGEgPSBzdGF0aWNEYXRhLm9iamVjdGl2ZXMub2JqZWN0aXZlX21ldGE7XHJcblxyXG5cdFx0Xy5tYXAob2JqZWN0aXZlVHlwZXMsIGZ1bmN0aW9uKG90KSB7XHJcblx0XHRcdGlmIChvdCAmJiBvdC52YWx1ZSA+IDApIHtcclxuXHRcdFx0XHRvdC5ob2xkaW5ncyA9IFswLDAsMF07XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciBjb2xvcnMgPSBbJ3JlZCcsICdibHVlJywgJ2dyZWVuJ107XHJcblx0XHR2YXIgY29sb3JNYXAgPSB7XCJyZWRcIjogMCwgXCJncmVlblwiOiAxLCBcImJsdWVcIjogMn07XHJcblxyXG5cdFx0Ly8gdmFyIG9iamVjdGl2ZXMgPSBtYXRjaERldGFpbHMubWFwcyAmJiBfLnJlZHVjZShtYXRjaERldGFpbHMubWFwcywgZnVuY3Rpb24oYWNjLCBtYXBEYXRhKSB7XHJcblx0XHQvLyBcdHJldHVybiBhY2MuY29uY2F0KG1hcERhdGEub2JqZWN0aXZlcyk7XHJcblx0XHQvLyB9LCBbXSk7XHJcblxyXG5cdFx0Xy5lYWNoKG9iamVjdGl2ZXMsIGZ1bmN0aW9uKG9zKSB7XHJcblx0XHRcdHZhciBvTWV0YSA9IG9iamVjdGl2ZXNNZXRhW29zLmlkXTtcclxuXHRcdFx0dmFyIG9UeXBlID0gb01ldGEgJiYgb2JqZWN0aXZlVHlwZXNbb01ldGEudHlwZV07XHJcblxyXG5cdFx0XHRpZiAob1R5cGUpIHtcclxuXHRcdFx0XHR2YXIgY29sb3IgPSBvcy5vd25lci50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdHZhciBjb2xvckluZGV4ID0gY29sb3JNYXBbY29sb3JdO1xyXG5cclxuXHRcdFx0XHRvVHlwZS5ob2xkaW5nc1tjb2xvckluZGV4XSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIHRpY2sgPSBfLnJlZHVjZShvYmplY3RpdmVUeXBlcywgZnVuY3Rpb24oYWNjLCBvdCkge1xyXG5cdFx0XHRpZiAob3QgJiYgb3QudmFsdWUpIHtcclxuXHRcdFx0XHRhY2NbMF0gKz0gKG90LmhvbGRpbmdzWzBdICogb3QudmFsdWUpO1xyXG5cdFx0XHRcdGFjY1sxXSArPSAob3QuaG9sZGluZ3NbMV0gKiBvdC52YWx1ZSk7XHJcblx0XHRcdFx0YWNjWzJdICs9IChvdC5ob2xkaW5nc1syXSAqIG90LnZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gYWNjO1xyXG5cdFx0fSwgWzAsMCwwXSk7XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJyb3dcIiwgaWQ6IFwic2NvcmVib2FyZHNcIn0sIFxyXG5cdFx0XHRcdF8ubWFwKHNjb3JlcywgZnVuY3Rpb24oc2NvcmUsIHNjb3JlSW5kZXgpIHtcclxuXHJcblx0XHRcdFx0XHR2YXIgc2NvcmVib2FyZENsYXNzID0gW1xyXG5cdFx0XHRcdFx0XHQnc2NvcmVib2FyZCcsXHJcblx0XHRcdFx0XHRcdCd0ZWFtLWJnJyxcclxuXHRcdFx0XHRcdFx0J3RlYW0nLFxyXG5cdFx0XHRcdFx0XHQndGV4dC1jZW50ZXInLFxyXG5cdFx0XHRcdFx0XHRjb2xvcnNbc2NvcmVJbmRleF1cclxuXHRcdFx0XHRcdF0uam9pbignICcpO1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJjb2wtc20tOFwiLCBrZXk6ICd0b3RhbC1zY29yZS0nICsgc2NvcmVJbmRleH0sIFxyXG5cdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogc2NvcmVib2FyZENsYXNzfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaDEobnVsbCwgd29ybGRzW3Njb3JlSW5kZXhdLm5hbWUpLCBcclxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5oMihudWxsLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0bnVtZXJhbChzY29yZSkuZm9ybWF0KCcwLDAnKSwgXCIgK1wiLCBudW1lcmFsKHRpY2tbc2NvcmVJbmRleF0pLmZvcm1hdCgnMCwwJylcclxuXHRcdFx0XHRcdFx0XHRcdCksIFxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS51bCh7Y2xhc3NOYW1lOiBcImxpc3QtaW5saW5lXCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0Xy5tYXAob2JqZWN0aXZlVHlwZXMsIGZ1bmN0aW9uKG90KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYob3QgPT09IG51bGwgfHwgb3QudmFsdWUgPT09IDApIHJldHVybiBudWxsO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmxpKHtrZXk6ICd0eXBlLWhvbGRpbmdzLScgKyBvdC5uYW1lfSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNwcml0ZSh7dHlwZTogb3QubmFtZSwgY29sb3I6IGNvbG9yc1tzY29yZUluZGV4XX0pLCBcIiB4IFwiLCBvdC5ob2xkaW5nc1tzY29yZUluZGV4XVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fVxyXG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi8vKipcclxuICogQGp4cyBSZWFjdC5ET01cclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHR5cGUgPSB0aGlzLnByb3BzLnR5cGU7XHJcblx0XHR2YXIgY29sb3IgPSB0aGlzLnByb3BzLmNvbG9yO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFJlYWN0LkRPTS5zcGFuKHtjbGFzc05hbWU6IFsnc3ByaXRlJywgdHlwZSwgY29sb3JdLmpvaW4oJyAnKX0pXHJcblx0XHQpO1xyXG5cdH1cclxufSk7IiwiLyoqXHJcbiAqIEBqc3ggUmVhY3QuRE9NXHJcbiAqL1xyXG52YXIgT2JqZWN0aXZlID0gcmVxdWlyZSgnLi9PYmplY3RpdmUuanN4Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ2V4cG9ydHMnLFxyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIG9iamVjdGl2ZXMgPSB0aGlzLnByb3BzLm9iamVjdGl2ZXM7XHJcblxyXG5cdFx0dmFyIGd1aWxkcyA9IF9cclxuXHRcdFx0LmNoYWluKHRoaXMucHJvcHMuZ3VpbGRzKVxyXG5cdFx0XHQuc29ydEJ5KCdndWlsZF9uYW1lJylcclxuXHRcdFx0LnNvcnRCeShmdW5jdGlvbihndWlsZCl7XHJcblx0XHRcdFx0cmV0dXJuIC1fLm1heChndWlsZC5vYmplY3RpdmVzLCAnbGFzdENhcCcpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQudmFsdWUoKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5ET00uZGl2KHtpZDogXCJndWlsZHNcIn0sIFxyXG5cdFx0XHRcdF8ubWFwKGd1aWxkcywgZnVuY3Rpb24oZ3VpbGQsIGd1aWxkSWQpIHtcclxuXHRcdFx0XHRcdHZhciBlbWJsZW1TcmMgPSAnaHR0cDovL2d1aWxkcy5ndzJ3MncuY29tL2d1aWxkcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGd1aWxkLmd1aWxkX25hbWUucmVwbGFjZSgvIC9nLCAnLScpKSArICcvNjQuc3ZnJztcclxuXHRcdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2tleTogJ2d1aWxkLScgKyBndWlsZElkLCBpZDogJ2d1aWxkLScgKyBndWlsZElkLCBjbGFzc05hbWU6IFwicm93XCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwiY29sLXNtLTRcIn0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmltZyh7Y2xhc3NOYW1lOiBcImVtYmxlbVwiLCBzcmM6IGVtYmxlbVNyY30pXHJcblx0XHRcdFx0XHRcdFx0KSwgXHJcblx0XHRcdFx0XHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBcImNvbC1zbS0yMFwifSwgXHJcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00uaDEobnVsbCwgZ3VpbGQuZ3VpbGRfbmFtZSwgXCIgW1wiLCBndWlsZC50YWcsIFwiXVwiKSwgXHJcblx0XHRcdFx0XHRcdFx0XHRSZWFjdC5ET00udWwoe2NsYXNzTmFtZTogXCJsaXN0LXVuc3R5bGVkXCJ9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0Xy5tYXAoZ3VpbGQub2JqZWN0aXZlcywgZnVuY3Rpb24ob2JqZWN0aXZlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFJlYWN0LkRPTS5saSh7a2V5OiAnb2JqZWN0aXZlLScgKyBvYmplY3RpdmUuaWR9LCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0T2JqZWN0aXZlKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RpdmU6IG9iamVjdGl2ZSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0aXZlczogb2JqZWN0aXZlcywgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3VpbGRzOiBndWlsZHN9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH0sXHJcbn0pO1xyXG4iLCIvKipcclxuICogQGpzeCBSZWFjdC5ET01cclxuICovXHJcbnZhciBTcHJpdGUgPSByZXF1aXJlKCcuLi9TcHJpdGUuanN4Jyk7XHJcbnZhciBBcnJvdyA9IHJlcXVpcmUoJy4uL0Fycm93LmpzeCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdleHBvcnRzJyxcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzdGF0aWNEYXRhID0gcmVxdWlyZSgnLi4vLi4vLi4vc3RhdGljRGF0YScpO1xyXG5cdFx0dmFyIG9iamVjdGl2ZXNEYXRhID0gc3RhdGljRGF0YS5vYmplY3RpdmVzO1xyXG5cclxuXHRcdHZhciBhcHBTdGF0ZSA9IHdpbmRvdy5hcHAuc3RhdGU7XHJcblxyXG5cdFx0dmFyIG9iamVjdGl2ZSA9IHRoaXMucHJvcHMub2JqZWN0aXZlO1xyXG5cdFx0dmFyIG9iamVjdGl2ZXMgPSB0aGlzLnByb3BzLm9iamVjdGl2ZXM7XHJcblxyXG5cclxuXHRcdGlmICghb2JqZWN0aXZlc0RhdGEub2JqZWN0aXZlX21ldGFbb2JqZWN0aXZlLmlkXSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhvYmplY3RpdmUuaWQsICdub3QgaW4nLCBvYmplY3RpdmVzRGF0YS5vYmplY3RpdmVfbWV0YSk7XHJcblx0XHRcdC8vIHNob3J0IGNpcmN1aXRcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vIHZhciBvYmplY3RpdmUgPSBvYmplY3RpdmVzW29iamVjdGl2ZV07XHJcblx0XHR2YXIgb2JqZWN0aXZlTWV0YSA9IG9iamVjdGl2ZXNEYXRhLm9iamVjdGl2ZV9tZXRhW29iamVjdGl2ZS5pZF07XHJcblx0XHR2YXIgb2JqZWN0aXZlTmFtZSA9IG9iamVjdGl2ZXNEYXRhLm9iamVjdGl2ZV9uYW1lc1tvYmplY3RpdmUuaWRdO1xyXG5cdFx0dmFyIG9iamVjdGl2ZUxhYmVscyA9IG9iamVjdGl2ZXNEYXRhLm9iamVjdGl2ZV9sYWJlbHNbb2JqZWN0aXZlLmlkXTtcclxuXHRcdHZhciBvYmplY3RpdmVUeXBlID0gb2JqZWN0aXZlc0RhdGEub2JqZWN0aXZlX3R5cGVzW29iamVjdGl2ZU1ldGEudHlwZV07XHJcblxyXG5cdFx0dmFyIGNsYXNzTmFtZSA9IFtcclxuXHRcdFx0J29iamVjdGl2ZScsXHJcblx0XHRcdCd0ZWFtJywgXHJcblx0XHRcdG9iamVjdGl2ZS5vd25lci50b0xvd2VyQ2FzZSgpLFxyXG5cdFx0XS5qb2luKCcgJyk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0UmVhY3QuRE9NLmRpdih7Y2xhc3NOYW1lOiBjbGFzc05hbWV9LCBcclxuXHRcdFx0XHRSZWFjdC5ET00uZGl2KHtjbGFzc05hbWU6IFwib2JqZWN0aXZlLWljb25zXCJ9LCBcclxuXHRcdFx0XHRcdEFycm93KHtvYmplY3RpdmVNZXRhOiBvYmplY3RpdmVNZXRhfSksIFxyXG4gXHRcdFx0XHRcdFNwcml0ZSh7dHlwZTogb2JqZWN0aXZlVHlwZS5uYW1lLCBjb2xvcjogb2JqZWN0aXZlLm93bmVyLnRvTG93ZXJDYXNlKCl9KVxyXG5cdFx0XHRcdCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJvYmplY3RpdmUtdGltZXN0YW1wXCJ9LCBcclxuXHRcdFx0XHRcdG1vbWVudChvYmplY3RpdmUubGFzdENhcCAqIDEwMDApLmZvcm1hdCgnaGg6bW06c3MnKVxyXG5cdFx0XHRcdCksIFxyXG5cdFx0XHRcdFJlYWN0LkRPTS5kaXYoe2NsYXNzTmFtZTogXCJvYmplY3RpdmUtbGFiZWxcIn0sIFxyXG5cdFx0XHRcdFx0UmVhY3QuRE9NLnNwYW4obnVsbCwgb2JqZWN0aXZlTGFiZWxzW2FwcFN0YXRlLmxhbmcuc2x1Z10pXHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEFycm93KG1ldGEpIHtcclxuXHRpZiAoIW1ldGEuZCkge1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0dmFyIHNyYyA9IFsnL2ltZy9pY29ucy9kaXN0L2Fycm93J107XHJcblxyXG5cdFx0aWYgKG1ldGEubikge3NyYy5wdXNoKCdub3J0aCcpOyB9XHJcblx0XHRlbHNlIGlmIChtZXRhLnMpIHtzcmMucHVzaCgnc291dGgnKTsgfVxyXG5cclxuXHRcdGlmIChtZXRhLncpIHtzcmMucHVzaCgnd2VzdCcpOyB9XHJcblx0XHRlbHNlIGlmIChtZXRhLmUpIHtzcmMucHVzaCgnZWFzdCcpOyB9XHJcblxyXG5cdFx0cmV0dXJuIFJlYWN0LkRPTS5pbWcoe3NyYzogc3JjLmpvaW4oJy0nKSArICcuc3ZnJ30pO1xyXG5cclxuXHR9XHJcbn1cclxuXHJcblxyXG4vKlxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj5ub3c6IHtub3d9PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PmNhcDoge29iamVjdGl2ZS5sYXN0Q2FwfTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj5leHA6IHtvYmplY3RpdmUuZXhwaXJlc308L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj4ge29iamVjdGl2ZS5sYXN0Q2FwLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpfTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj4ge29iamVjdGl2ZS5leHBpcmVzLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpfTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdj4ge29iamVjdGl2ZS5leHBpcmVzLmRpZmYobm93LCAncycpfTwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG4qLyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGRhdGVOb3c6IGRhdGVOb3csXHJcblx0YWRkNTogYWRkNSxcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBkYXRlTm93KCkge1xyXG5cdHJldHVybiBNYXRoLmZsb29yKF8ubm93KCkgLyAxMDAwKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGFkZDUoaW5EYXRlKSB7XHJcblx0dmFyIF9iYXNlRGF0ZSA9IGluRGF0ZSB8fCBkYXRlTm93KCk7XHJcblxyXG5cdHJldHVybiAoX2Jhc2VEYXRlICsgKDUgKiA2MCkpO1xyXG59XHJcbiIsIi8qKlxyXG4gKiBAanN4IFJlYWN0LkRPTVxyXG4gKi9cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG92ZXJ2aWV3KGN0eCl7XHJcblx0dmFyIGxhbmdTbHVnID0gY3R4LnBhcmFtcy5sYW5nU2x1ZyB8fCAnZW4nO1xyXG5cclxuXHR2YXIgYXBwU3RhdGUgPSB3aW5kb3cuYXBwLnN0YXRlO1xyXG5cdHZhciBzdGF0aWNEYXRhID0gcmVxdWlyZSgnLi9zdGF0aWNEYXRhJyk7XHJcblxyXG5cdGFwcFN0YXRlLmxhbmcgPSBzdGF0aWNEYXRhLmxhbmdzW2xhbmdTbHVnXTtcclxuXHJcblx0Xy5tYXAoc3RhdGljRGF0YS53b3JsZHMsIGZ1bmN0aW9uKHdvcmxkKSB7XHJcblx0XHQvLyB3b3JsZC5kZS5zbHVnID0gc2x1Z2lmeSh3b3JsZC5kZS5uYW1lKTtcclxuXHRcdC8vIHdvcmxkLmVuLnNsdWcgPSBzbHVnaWZ5KHdvcmxkLmVuLm5hbWUpO1xyXG5cdFx0Ly8gd29ybGQuZXMuc2x1ZyA9IHNsdWdpZnkod29ybGQuZXMubmFtZSk7XHJcblx0XHQvLyB3b3JsZC5mci5zbHVnID0gc2x1Z2lmeSh3b3JsZC5mci5uYW1lKTtcclxuXHRcdHdvcmxkLm5hbWUgPSB3b3JsZFthcHBTdGF0ZS5sYW5nLnNsdWddLm5hbWU7XHJcblx0XHR3b3JsZC5zbHVnID0gd29ybGRbYXBwU3RhdGUubGFuZy5zbHVnXS5zbHVnO1xyXG5cdFx0d29ybGQubGluayA9ICcvJyArIGFwcFN0YXRlLmxhbmcuc2x1ZyArICcvJyArIHdvcmxkLnNsdWc7XHJcblx0XHRyZXR1cm4gd29ybGQ7XHJcblx0fSk7XHJcblx0Ly8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkod2luZG93LmFwcC5kYXRhLnN0YXRpYy53b3JsZHMpKTtcclxuXHJcblxyXG5cdHZhciBPdmVydmlldyA9IHJlcXVpcmUoJy4vanN4L092ZXJ2aWV3LmpzeCcpXHJcblx0UmVhY3QucmVuZGVyQ29tcG9uZW50KE92ZXJ2aWV3KG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpKTtcclxufVxyXG5cclxuXHJcbi8vIGZ1bmN0aW9uIHNsdWdpZnkoaW5TdHIpIHtcclxuLy8gXHRyZXR1cm4gXy5zdHIuc2x1Z2lmeShpblN0ci5yZXBsYWNlKCfDnycsICdzcycpKTtcclxuLy8gfSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGxhbmdzOiByZXF1aXJlKCcuLi8uLi9kYXRhL2xhbmdzLmpzb24nKSxcclxuXHR3b3JsZHM6IHJlcXVpcmUoJy4uLy4uL2RhdGEvd29ybGRfbmFtZXMuanNvbicpLFxyXG5cdG9iamVjdGl2ZXM6IHJlcXVpcmUoJy4uLy4uL2RhdGEvb2JqZWN0aXZlcycpLFxyXG59O1xyXG4iLCIvKipcclxuICogQGpzeCBSZWFjdC5ET01cclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG92ZXJ2aWV3KGN0eCkge1xyXG5cdHZhciBsYW5nU2x1ZyA9IGN0eC5wYXJhbXMubGFuZ1NsdWc7XHJcblx0dmFyIHdvcmxkU2x1ZyA9IGN0eC5wYXJhbXMud29ybGRTbHVnO1xyXG5cclxuXHR2YXIgYXBwU3RhdGUgPSB3aW5kb3cuYXBwLnN0YXRlO1xyXG5cdGFwcFN0YXRlLnN0YXJ0ID0gTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCk7XHJcblxyXG5cdHZhciBzdGF0aWNEYXRhID0gcmVxdWlyZSgnLi9zdGF0aWNEYXRhJyk7XHJcblxyXG5cdGFwcFN0YXRlLmxhbmcgPSBzdGF0aWNEYXRhLmxhbmdzW2xhbmdTbHVnXTtcclxuXHJcblx0Xy5tYXAoc3RhdGljRGF0YS53b3JsZHMsIGZ1bmN0aW9uKHdvcmxkKSB7XHJcblx0XHQvLyB3b3JsZC5kZS5zbHVnID0gc2x1Z2lmeSh3b3JsZC5kZS5uYW1lKTtcclxuXHRcdC8vIHdvcmxkLmVuLnNsdWcgPSBzbHVnaWZ5KHdvcmxkLmVuLm5hbWUpO1xyXG5cdFx0Ly8gd29ybGQuZXMuc2x1ZyA9IHNsdWdpZnkod29ybGQuZXMubmFtZSk7XHJcblx0XHQvLyB3b3JsZC5mci5zbHVnID0gc2x1Z2lmeSh3b3JsZC5mci5uYW1lKTtcclxuXHRcdHdvcmxkLm5hbWUgPSB3b3JsZFthcHBTdGF0ZS5sYW5nLnNsdWddLm5hbWU7XHJcblx0XHR3b3JsZC5zbHVnID0gd29ybGRbYXBwU3RhdGUubGFuZy5zbHVnXS5zbHVnO1xyXG5cdFx0d29ybGQubGluayA9ICcvJyArIGFwcFN0YXRlLmxhbmcuc2x1ZyArICcvJyArIHdvcmxkLnNsdWc7XHJcblx0XHRyZXR1cm4gd29ybGQ7XHJcblx0fSk7XHJcblxyXG5cdGFwcFN0YXRlLndvcmxkID0gXy5maW5kKHN0YXRpY0RhdGEud29ybGRzLCB7c2x1Zzogd29ybGRTbHVnfSk7XHJcblxyXG5cclxuIFx0dmFyIGFwaSA9IHJlcXVpcmUoJy4vYXBpJyk7XHJcblx0YXBpLmdldE1hdGNoZXMoXHJcblx0XHRnZXRNYXRjaGVzU3VjY2VzcyxcclxuXHRcdGdldE1hdGNoZXNFcnJvcixcclxuXHRcdF8ubm9vcFxyXG5cdCk7XHJcblxyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2V0TWF0Y2hlc1N1Y2Nlc3MoZGF0YSkge1xyXG5cdHZhciBhcHBTdGF0ZSA9IHdpbmRvdy5hcHAuc3RhdGU7XHJcblxyXG5cdHZhciBtYXRjaCA9IF8uZmluZChkYXRhLnd2d19tYXRjaGVzLCBmdW5jdGlvbihtKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRhcHBTdGF0ZS53b3JsZC5pZCA9PSBtLmJsdWVfd29ybGRfaWRcclxuXHRcdFx0fHwgYXBwU3RhdGUud29ybGQuaWQgPT0gbS5ncmVlbl93b3JsZF9pZFxyXG5cdFx0XHR8fCBhcHBTdGF0ZS53b3JsZC5pZCA9PSBtLnJlZF93b3JsZF9pZFxyXG5cdFx0KTtcclxuXHR9KTtcclxuXHJcblx0dmFyIFRyYWNrZXIgPSByZXF1aXJlKCcuL2pzeC9UcmFja2VyLmpzeCcpO1xyXG5cdFJlYWN0LnJlbmRlckNvbXBvbmVudChUcmFja2VyKHtkYXRhOiBtYXRjaH0pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGdldE1hdGNoZXNFcnJvcih4aHIsIHN0YXR1cywgZXJyKSB7XHJcblx0Y29uc29sZS5sb2coJ092ZXJ2aWV3OjpnZXRNYXRjaGVzOmRhdGEgZXJyb3InLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTsgXHJcbn07XHJcbiJdfQ==
