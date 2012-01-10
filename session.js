/**
 * session.js 0.4.1
 * (c) 2012 Iain, CodeJoust
 * session.js is freely distributable under the MIT license.
 * Portions of session.js are inspired or borrowed from Underscore.js, and quirksmode.org demo javascript.
 * This version uses google's jsapi library for location services.
 * For details, see: https://github.com/codejoust/session.js
 */
(function(win){
  
  // References for better js compression
  var doc = win.document,
      nav = win.navigator,
      scr = win.screen;
  
  // Changing the API Version invalidates olde cookies with previous api version tags.
  var API_VERSION = 0.4;
  
  // Settings: defaults
  var options = {
    // Use the HTML5 Geolocation API
    // this ONLY returns lat & long, no city/address
    use_html5_location: false,
    // Attempts to use IPInfoDB if provided a valid key
    // Get a key at http://ipinfodb.com/register.php
    ipinfodb_key: false,
    // Leaving true allows for fallback for both
    // the HTML5 location and the IPInfoDB
    gapi_location: true,
    // Name of the location cookie (set blank to disable cookie)
    //   - WARNING: different providers use the same cookie
    //   - if switching providers, remember to use another cookie or provide checks for old cookies
    location_cookie: "location",
    // Location cookie expiration in hours
    location_cookie_timeout: 5,
    // Session expiration in days
    session_timeout: 32,
    // Session cookie name (set blank to disable cookie)
    session_cookie: "first_session"
  };
  
  // Session object
  var SessionRunner = function(){
    // Helper for querying.
    // Usage: session.current_session.referrer_info.hostname.contains(['github.com','news.ycombinator.com'])
    String.prototype.contains = function(other_str){
      if (typeof(other_str) === 'string'){
        return (this.indexOf(other_str) !== -1); }
      for (var i = 0; i < other_str.length; i++){
        if (this.indexOf(other_str[i]) !== -1){ return true; } }
      return false; }
    // Merge options
    if (win.session && win.session.options) {
      for (option in win.session.options){
        options[option] = win.session.options[option]; }
    }
    // Cache win.session.start
    if (win.session && win.session.start){
      var start = win.session.start;
    }
    // Set up checking, if all modules are ready
    var name, module, asynchs = 0, self = this,
        check_asynch = function( deinc ) {
          if( deinc ) asynchs--;
          if( asynchs === 0 ) {
            if( start ) start( win.session );
          }
        }
    // clear
    win.session = {};
    // run modules
    for( var name in modules ) {
      module = modules[name]();
      if( typeof module === 'function' ) {
        try {
          module( function( data ) {
            win.session[name] = data;
            check_asynch( true );
          });
          asynchs++;
        }
        catch( error ) {
          if( win.console && typeof console.log === 'function' ) {
            console.log( error );
            check_asynch( true );
          }
        }
      } else {
        win.session[name] = module;
      }
    }
    // initial check
    check_asynch();
  };
  
  var modules = {
    browser: function(){
      
      var identity = null, match, version;
      
      var data = {
        'Chrome':             'Chrome',
        'OmniWeb':            'OmniWeb',
        'Safari':             'Apple',
        'iCab':               'iCab',
        'Konqueror':          'KDE',
        'Firefox':            'Firefox',
        'Camino':             'Camino',
        'Internet Explorer':  'MSIE',
        'Mozilla':            'Gecko',
        'Opera':              'Opera'
      };
      
      for( identity in data ) {
        // match identity & version
        match = nav.userAgent.match( new RegExp(
          '(' + data[identity] + ')(?:(?:/| )([0-9._]*))?'
        ));
        // retrieve versions for opera, safari, ...
        version = nav.userAgent.match(
          /Version(?:\/| )([0-9._]*)/
        );
        // get out of the loop
        if( match ) break;
      }
      
      function plugins() {
        if( !nav.plugins ) return null;
        var checks = [ 'flash', 'silverlight', 'java', 'quicktime' ],
            result = {}, plugin, name;
        for( var i in checks ) {
          name = checks[i]; result[name] = false;
          for( var j in nav.plugins ) {
            plugin = nav.plugins[j];
            if( plugin.name && plugin.name.toLowerCase().indexOf( name ) !== -1 ) {
              result[name] = true; break;
            }
          }
        }
        return result;
      }
      
      return {
        // vendor: nav.vendor || null,
        name: identity,
        version: version && version[1] || match && match[2] || null,
        plugins: plugins()
      };
      
    },
  
    os: function() {
      
      var data, vendor, os, match, version;
      
      data = {
        'Microsoft': {
          'Windows 8':       'Windows NT (6[.]2)',
          'Windows 7':       'Windows NT (6[.]1)',
          'Windows Vista':   'Windows NT (6[.]0)',
          'Windows XP':      'Windows NT (5[.](?:1|2))',
          'Windows Phone':   'Windows Phone OS',
          'Windows Mobile':  'Windows Mobile',
          'Windows CE':      'Windows CE'
        },
        'Apple': {
          'Mac Power PC': 'Mac PPC|PPC|Mac PowerPC|Mac_PowerPC',
          'Mac OS X':     'Mac OS X',
          'Mac iOS':      'iPod|iPad|iPhone',
          'Mac':          'Darwin|Macintosh|Power Macintosh|Mac OS'
        },
        'Google': {
          'Android': 'Android'
        },
        'Canonical': {
          'Kubuntu':  'Kubuntu',
          'Xubuntu':  'Xubuntu',
          'Edubuntu': 'Edubuntu',
          'Ubuntu':   'Ubuntu'
        },
        // TODO: categorize (vendor)
        'Other': {
          'Debian':     'Debian',
          'Fedora':     'Fedora',
          'CentOS':     'CentOS|Cent OS',
          'Linux Mint': 'Linux Mint',
          'openSUSE':   'openSUSE',
          'Linux':      'Linux',
          'Maemo':      'Maemo',
          'FreeBSD':    'FreeBSD',
          'NetBSD':     'NetBSD',
          'OpenBSD':    'OpenBSD',
          'Dragonfly':  'Dragonfly',
          'Syllable':   'Syllable'
        },
        'HP': {
          'webOS':   'webOS',
          'Palm OS': 'PalmOS|Palm OS'
        },
        'RIM': {
          'BlackBerry':    'BlackBerry',
          'RIM Tablet OS': 'RIM Tablet OS',
          'QNX':           'QNX'
        },
        'Accenture': {
          'Symbian OS': 'SymbOS|SymbianOS|Symbian OS'
        },
        'Samsung': {
          'bada': 'bada'
        },
        'Nintendo': {
          'Nintendo Wii': 'Nintendo Wii',
          'Nintendo DS':  'Nintendo DS',
          'Nintendo DSi': 'Nintendo DSi'
        },
        'Sony': {
          'Playstation Portable': 'Playstation Portable',
          'Playstation':          'Playstation'
        },
        'Oracle': {
          'Solaris': 'SunOS|Sun OS'
        }
      };
      
      for( vendor in data ) {
        for( os in data[vendor] ) {
          match = nav.userAgent.match(
            new RegExp( data[vendor][os] + '(?:(?:/| )([0-9._]*))?', 'i' )
          );
          if( match ) {
            version = match[2] || match[1] || null;
            // apple has os version numbers separated by underscores,
            // so we'll have to account for that strange behavior
            version = version ? version.replace( /_/g, '.' ) : null;
            return {
              vendor: vendor,
              name: os,
              version: version
            };
          }
        }
      }
      
      return null;
    },
    
    timezone: function(){
      var A = new Date(); A.setMonth( 0 ); A.setDate( 1 );
      var B = new Date(); B.setMonth( 6 ); B.setDate( 1 );
      return {
        offset: new Date().getTimezoneOffset() / -60,
        dst: A.getTimezoneOffset() !== B.getTimezoneOffset()
      };
    },
    locale: function() {
      var lang = (
        nav.language        ||
        nav.browserLanguage ||
        nav.systemLanguage  ||
        nav.userLanguage
      ).split("-");
      if (lang.length == 2){
        return { country: lang[1].toLowerCase(), lang: lang[0].toLowerCase() };
      } else if (lang) {
        return {lang: lang[0].toLowerCase(), country: null };
      } else { return{lang: null, country: null }; }
    },
    device: function() {
      var html   = doc.documentElement,
          body   = doc.getElementsByTagName( 'body' )[0],
          tablet = !!nav.userAgent.match( /(iPad|SCH-I800|xoom|kindle)/i ),
          phone  = !!nav.userAgent.match ( /(iPhone|iPod|blackberry|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i );
      return {
        screen: {
          width: scr.width,
          height: scr.height,
          pixel_ratio: win.devicePixelRatio || null
        },
        viewport: {
          width: scr.availWidth || win.innerWidth || html.clientWidth || body.clientWidth,
          height: scr.availHeight || win.innerHeight || html.clientHeight || body.clientHeight,
          color_depth: scr.colorDepth || scr.pixelDepth || null
        },
        is_tablet: tablet,
        is_phone: !tablet && phone,
        is_mobile: tablet || phone
      };
    },
    current_session: function (cookie, expires){
      var session = util.get_obj(cookie);
      if (session == null){
        session = {
          visits: 1,
          start: new Date().getTime(), last_visit: new Date().getTime(),
          url: win.location.href, path: win.location.pathname,
          referrer: doc.referrer, referrer_info: util.parse_url(doc.referrer),
          search: { engine: null, query: null }
        };
        var search_engines = [
          { name: "Google", host: "google", query: "q" },
          { name: "Bing", host: "bing.com", query: "q" },
          { name: "Yahoo", host: "search.yahoo", query: "p" },
          { name: "AOL", host: "search.aol", query: "q" },
          { name: "Ask", host: "ask.com", query: "q" },
          { name: "Baidu", host: "baidu.com", query: "wd" }
        ], length = search_engines.length,
           engine, match, i = 0,
           fallbacks = 'q query term p wd query text'.split(' ');
        for (i = 0; i < length; i++){
          engine = search_engines[i];
          if (session.referrer_info.host.indexOf(engine.host) !== -1){
            session.search.engine = engine.name;
            session.search.query  = session.referrer_info.query[engine.query];
            session.search.terms  = session.search.query ? session.search.query.split(" ") : null;
            break;
          }
        }
        if (session.search.engine === null && session.referrer_info.search.length > 1){
          for (i = 0; i < fallbacks.length; i++){
            var terms = session.referrer_info.query[fallbacks[i]];
            if (terms){
              session.search.engine = "Unknown";
              session.search.query  = terms; session.search.terms  = terms.split(" ");
              break;
            }
          } 
        }
      } else {
        session.last_visit = new Date().getTime();
        session.visits++;
      }
      util.set_cookie(cookie, util.package_obj(session), expires);
      return session;
    },
    original_session: function() {
      return this.current_session(
        options.session_cookie,
        options.session_timeout * 24 * 60 * 60 * 1000
      );
    },
    html5_location: function(){
      if( options.use_html5_location ) {
        return function(callback){
          nav.geolocation.getCurrentPosition(function(pos){
            pos.source = 'html5';
            callback(pos);
          }, function(err) {
            if (options.gapi_location){
              modules.gapi_location()(callback);
            } else {
              callback({error: true, source: 'html5'}); }
          });
        };
      }
    },
    gapi_location: function(){
      if( options.gapi_location ) {
        return function(callback){
          var location = util.get_obj(options.location_cookie);
          if (!location || location.source !== 'google'){
            win.gloader_ready = function() {
              if ("google" in win){
                if (win.google.loader.ClientLocation){
                  win.google.loader.ClientLocation.source = "google";
                  callback(win.google.loader.ClientLocation);
                } else {
                  callback({error: true, source: "google"});
                }
                util.set_cookie(
                  options.location_cookie,
                  util.package_obj(win.google.loader.ClientLocation),
                  options.location_cookie_timeout * 60 * 60 * 1000);
              }}
            util.embed_script("https://www.google.com/jsapi?callback=gloader_ready");
          } else {
            callback(location);
          }
        }
      }
    },
    ipinfodb_location: function(api_key){
      if( options.ipinfodb_key ) {
        api_key = api_key || options.ipinfodb_key;
        return function (callback){
          var location_cookie = util.get_obj(options.location_cookie);
          if (location_cookie && location_cookie.source === 'ipinfodb'){ callback(location_cookie); }
          win.ipinfocb = function(data){
            if (data.statusCode === "OK"){
              data.source = "ipinfodb";
              util.set_cookie(
                options.location_cookie,
                util.package_obj(data),
                options.location_cookie * 60 * 60 * 1000);
              callback(data);
            } else {
              if (options.gapi_location){ return modules.gapi_location()(callback); }
              else { callback({error: true, source: "ipinfodb", message: data.statusMessage}); }
            }}
          util.embed_script("http://api.ipinfodb.com/v3/ip-city/?key=" + api_key + "&format=json&callback=ipinfocb");
        }
      }
    }
  };
  
  // Utilities
  var util = {
    parse_url: function(url_str){
      var a = doc.createElement("a"), query = {};
      a.href = url_str; query_str = a.search.substr(1);
      // Disassemble query string
      if (query_str != ''){
        var pairs = query_str.split("&"), i = 0,
            length = pairs.length, parts;
        for (; i < length; i++){
          parts = pairs[i].split("=");
          if (parts.length === 2){
            query[parts[0]] = decodeURI(parts[1]); }
        }
      }
      return {
        host:     a.host,
        path:     a.pathname,
        protocol: a.protocol,
        port:     a.port === '' ? 80 : a.port,
        search:   a.search,
        query:    query }
    },
    set_cookie: function(cname, value, expires, options){ // from jquery.cookie.js
      if (!doc.cookie || !cname || !value){ return null; }
      if (!options){ var options = {}; }
      if (value === null || value === undefined){ expires = -1; }
      if (expires){ options.expires = (new Date().getTime()) + expires; }
      return (document.cookie = [
          encodeURIComponent(cname), '=',
          encodeURIComponent(String(value)),
          options.expires ? '; expires=' + new Date(options.expires).toUTCString() : '', // use expires attribute, max-age is not supported by IE
          options.path ? '; path=' + options.path : '',
          options.domain ? '; domain=' + options.domain : '',
          (win.location && win.location.protocol === 'https:') ? '; secure' : ''
      ].join(''));
    },
    get_cookie: function(cookie_name, result){ // from jquery.cookie.js
      return (result = new RegExp('(?:^|; )' + encodeURIComponent(cookie_name) + '=([^;]*)').exec(document.cookie)) ? decodeURIComponent(result[1]) : null;
    },
    embed_script: function(url){
      var element  = doc.createElement("script");
      element.type = "text/javascript";
      element.src  = url;
      doc.getElementsByTagName("body")[0].appendChild(element);
    },
    package_obj: function (obj){
      obj.version = API_VERSION;
      var ret = JSON.stringify(obj);
      delete obj.version; return ret;
    },
    get_obj: function(cookie_name){
      var obj;
      try { obj = JSON.parse(util.get_cookie(cookie_name)); } catch(e){};
      if (obj && obj.version == API_VERSION){
        delete obj.version; return obj;
      }
    }
  };
  
  // JSON
  var JSON = {
    parse: (win.JSON && win.JSON.parse) || function(data){
        if (typeof data !== "string" || !data){ return null; }
        return (new Function("return " + data))();
    },
    stringify: (win.JSON && win.JSON.stringify) || function(object){
      var type = typeof object;
      if (type !== "object" || object === null) {
        if (type === "string"){ return '"' + object + '"'; }
      } else {
        var k, v, json = [],
            isArray = (object && object.constructor === Array);
        for (k in object ) {
          v = object[k]; type = typeof v;
          if (type === "string")
            v = '"' + v + '"';
          else if (type === "object" && v !== null)
            v = this.stringify(v);
          json.push((isArray ? "" : '"' + k + '":') + v);
        }
        return (isArray ? "[" : "{") + json.join(",") + (isArray ? "]" : "}");
      } } };

  // Initialize SessionRunner
  SessionRunner();

})( this );
