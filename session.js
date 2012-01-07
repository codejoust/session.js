/**
 * session.js 0.0.2
 * (c) 2012 Iain, CodeJoust
 * session is freely distributable under the MIT license.
 * Portions of session.js are inspired or borrowed from Underscore.js, and quirksmode.org demo javascript.
 * This version uses google's jsapi library for location services.
 * For details, see: https://github.com/codejoust/session.js
 */
(function(win, doc){
  var opts = {
    use_html5_location: false,
    // use html5 location -- this _ONLY_ return lat/long, not an city/address
    ipinfodb_key: null,
    // attempts to use ipinfodb if provided a valid key -- get a key at http://ipinfodb.com/register.php
    gapi_location: true,
    // leaving true allows for fallback for both the html5 location and the ipinfodb
    session_days: 32,
    // how many days session information is kept in a cookie
    location_cookie_name: 'location',
    // the name of the location cookie
    //   -- warning: different providers use the same cookie
    //   -- if switching providers, remember to use another cookie or provide checks for old cookies
    session_cookie_name: 'first_session',
    // session cookie name
    location_cookie_hours: 2
    // lifetime of the location cookie
  }
  if ('session_opts' in win){
    for (opt in win.session_opts){
      opts[opt] = win.session_opts[opt];
    }
  }
  var BrowserDetect = { // from quirksmode.org/js/detect.html
    detect_browser: function () {
      return {browser: this.searchString(this.dataBrowser),
              version: this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion),
              OS: this.searchString(this.dataOS)};
    },
    searchString: function (data) {
      for (var i=0;i<data.length;i++)  {
        var dataString = data[i].string;
        var dataProp = data[i].prop;
        this.versionSearchString = data[i].versionSearch || data[i].identity;
        if (dataString) {
          if (dataString.indexOf(data[i].subString) != -1)
            return data[i].identity; }
        else if (dataProp)
          return data[i].identity;
      } },
    searchVersion: function (dataString) {
      var index = dataString.indexOf(this.versionSearchString);
      if (index == -1) return;
      return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
      { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
      { string: navigator.userAgent, subString: "OmniWeb", versionSearch: "OmniWeb/", identity: "OmniWeb" },
      {  string: navigator.vendor,  subString: "Apple",  identity: "Safari",  versionSearch: "Version"},
      {  prop: win.opera,  identity: "Opera",  versionSearch: "Version" },
      {  string: navigator.vendor,  subString: "iCab",identity: "iCab" },
      {  string: navigator.vendor,  subString: "KDE",  identity: "Konqueror"  },
      { string: navigator.userAgent, subString: "Firefox", identity: "Firefox"  },
      {  string: navigator.vendor, subString: "Camino", identity: "Camino"  },
      {    // for newer Netscapes (6+)
        string: navigator.userAgent, subString: "Netscape",  identity: "Netscape"  },
      {  string: navigator.userAgent,  subString: "MSIE",  identity: "Explorer",  versionSearch: "MSIE"  },
      {  string: navigator.userAgent,  subString: "Gecko",  identity: "Mozilla",  versionSearch: "rv"    },
      {     // for older Netscapes (4-)
        string: navigator.userAgent, subString: "Mozilla", identity: "Netscape",  versionSearch: "Mozilla" }
    ],
    dataOS : [ {
        string: navigator.platform, subString: "Win", identity: "Windows"
      }, {
        string: navigator.platform,  subString: "Mac",  identity: "Mac"  },
      { string: navigator.userAgent,subString: "iPhone", identity: "iPhone/iPod" },
      { string: navigator.userAgent,subString: 'iPad', identitiy: 'iPad'},
      {  string: navigator.platform,  subString: "Linux",  identity: "Linux"  }
    ]
  };
  
  var utils = {
    stringify_json: JSON.stringify || function (obj) {
      var t = typeof (obj);
      if (t != "object" || obj === null) {
        if (t == "string") obj = '"'+obj+'"'; return String(obj);
      } else {
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
          v = obj[n]; t = typeof(v);
          if (t == "string") v = '"'+v+'"';
          else if (t == "object" && v !== null) v = JSON.stringify(v);
          json.push((arr ? "" : '"' + n + '":') + String(v));
        } return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
      }
    },
    parse_json: (JSON.parse || function ( data ) {
      if( typeof data !== "string" || !data )
        return null;
      return ( new Function( "return " + data ) )();
    }),
    set_cookie: function(c_name, value, expire) {
      var exdate = new Date(); exdate.setDate(exdate.getDate()+expire);
      document.cookie = c_name+ "=" +escape(value) + ((expire==null) ? "" : ";expires="+exdate.toGMTString());
    },
    get_cookie: function(c_name) {
      if (document.cookie.length > 0 ) {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start != -1){
          c_start=c_start + c_name.length+1;
          c_end=document.cookie.indexOf(";",c_start);
          if (c_end == -1) {
            c_end=document.cookie.length;
          } return unescape(document.cookie.substring(c_start,c_end));
        } } return null; },
    each: function(obj, iterator, context) { // from underscore.js
      if (obj == null) return;
      if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (i in obj && iterator.call(context, obj[i], i, obj) === {}) return;
        }
      } else {
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            if (iterator.call(context, obj[key], key, obj) === {}) return;
          }
        }
      }
    },
    any: function(obj, iterator, context) {
      iterator || (iterator = _.identity);
      var result = false;
      if (obj == null) return result;
      utils.each(obj, function(value, index, list) {
        if (result || (result = iterator.call(context, value, index, list))) return {};
      });
      return !!result;
    },
    search: function(obj, iterator, context) {
      var result;
      utils.any(obj, function(value, index, list) {
        result = iterator.call(context, value, index, list);
        if (result){ return true; }
      });
      return result;
    },
    find: function(obj, iterator, context) {
      var result;
      utils.any(obj, function(value, index, list) {
        if (iterator.call(context, value, index, list)) {
          result = value;
          return true;
        }
      });
      return result;
    },
    is_undef: function(obj){ return obj === void 0; }, // from underscore.js
    embed_script: function(url){
      var scr = document.createElement('script');
      scr.type = 'text/javascript';
      scr.src = url;
      document.getElementsByTagName('head')[0].appendChild(scr);
    }
  };

  var modules = {
    locale: function(){
      var res = utils.search(['language', 'browserLanguage', 'systemLanguage', 'userLanguage'], function(prop_name){
        return navigator[prop_name];
      }), res_parts = res.split('-');
      if (res_parts.length == 2){
        return {country: res_parts[1], lang: res_parts[0]}
      } else { return {lang: res}; }
    },
    browser: function(){
      return BrowserDetect.detect_browser();
    },
    device: function(){
      var device = {screen: {width: screen.width, height: screen.height}, viewport: {}};
      var elem=doc.documentElement, doc_body=doc.getElementsByTagName('body')[0], agent = navigator.userAgent;
      device.viewport.width=(win.innerWidth||elem.clientWidth||doc_body.clientWidth);
      device.viewport.height=(win.innerHeight||elem.clientHeight||doc_body.clientHeight);
      device.is_tablet = !!(agent.match(/(iPad|SCH-I800|xoom|kindle)/i));
      device.is_phone  = !device.is_tablet && !!(agent.match(/(iPhone|iPod|blackberry|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i));
      device.is_mobile = device.is_tablet || device.is_phone;
      return device;
    },
    plugins: function(){
      var check_plugin = function(plugin_name){
        if (navigator.plugins){
          return !!utils.find(navigator.plugins, function(plugin){
            if (plugin && plugin['name'] && plugin['name'].toLowerCase().indexOf(plugin_name) !== -1){
              return true;
            } }); } }
      return {
        flash: check_plugin('flash'),
        silverlight: check_plugin('silverlight'),
        java: check_plugin('java'),
        quicktime: check_plugin('quicktime'),
      }
    },
    session: function(cookie_name, expires){
      if (cookie_name){ var sess = utils.get_cookie(cookie_name); }
      if (!sess){
        sess = {visits: 1, search: {engine: null, query: null}}
        var engines = [{nm: 'Google', url: "https?://(?:www\.)?(?:images.)?google.(?:com|[a-z]{2}|com?.[a-z]{2})", query: 'q'},
        {nm: "Bing", url: "https?://(?:www\.)?bing.com", query: "q"},
        {nm: "Yahoo", url:"https?://(?:www\.)?(?:.+.)?search.yahoo.(?:com|[a-z]{2}|com?.[a-z]{2})", query: "p"},
        {nm: "AOL", url:"https?://(?:www\.)?(?:aol)?search.aol.(?:com|[a-z]{2}|com?.[a-z]{2})", query: "q"},
        {nm: "Ask", url:"https?://(?:www\.)?(?:[a-z]+.)?ask.com", query:"q"},
        {nm: "Baidu", url:"https?://(?:www\.)?baidu.com", query:"wd"}];
        utils.find(engines, function(engine){
          var res = RegExp(engine['url'] + '/.*[?&]' + engine.query + '=([^&]+)').exec(doc.referrer);
          if (res){
            sess.search.engine = engine.nm;
            sess.search.query  = engine.query;
            return true;
          }
        });
        if (!sess.search.engine){
          utils.find(['q','query','term','p','wd','query','text'], function(query_term){
            var res = RegExp("[?&]" + query_term + "=([^&]+)").exec(doc.referrer);
            if (res){
              sess.search.engine = 'Unknown';
              sess.search.query = res;
              return true;
            }
          });
        }
        sess.referrer = doc.referrer;
        sess.url = win.location.href;
        sess.path = win.location.pathname;
        sess.start = (new Date()).getTime();
        sess.last_visit = sess.start;
        if (cookie_name){ utils.set_cookie(cookie_name, JSON.stringify(sess), expires); }
      } else {
        sess = JSON.parse(sess);
        sess.last_visit = (new Date()).getTime();
        sess.visits += 1;
        utils.set_cookie(cookie_name, JSON.stringify(sess), expires)
      }
      return sess;
    },
    html5_location: function(){
      return function(cb){
        navigator.geolocation.getCurrentPosition(function(position){
          position['source'] = 'html5';
          return position
        }, function(err_msg){
          if (opts.gapi_location){ modules.gapi_location()(cb); }
          else { cb({err: true, source: 'html5'}); }
        });
        
      }
    },
    gapi_location: function(){
      return function(cb){
        var loc = null;
        if (!utils.get_cookie(opts.location_cookie_name)){
          win.gloader_loaded = function(){
            if ('google' in window) {
              if (win.google.loader.ClientLocation){
                win.google.loader.ClientLocation.source = 'google';
                cb(win.google.loader.ClientLocation);
              } else {
                cb({err: true, source: 'google'})
              }
              utils.set_cookie(opts.location_cookie_name,utils.stringify_json(win.google.loader.ClientLocation), 1000 * 60 * 60 * opts.location_cookie_hours);} }
          utils.embed_script('https://www.google.com/jsapi?callback=gloader_loaded');
        } else { cb(utils.parse_json(utils.get_cookie(opts.location_cookie_name))); }
      }
    },
    ipinfodb_location: function(api_key){
      return function(cb){
        var loc_cookie = utils.get_cookie(opts.location_cookie_name);
        if (loc_cookie){ return cb(JSON.parse(loc_cookie)); }
        win.ipinfocb = function(data){
          if (data['statusCode'] == 'OK'){
            data['source'] = 'ipinfodb';
            utils.set_cookie(opts.location_cookie_name, JSON.stringify(data), 1000 * 60 * 60 * opts.location_cookie_hours);
            cb(data);
          } else {
            if (opts.gapi_location){
              return modules.gapi()(cb);
            } else { cb({err: true, source: 'ipinfodb'}); }
          }
        }
        utils.embed_script('http://api.ipinfodb.com/v3/ip-city/?key='+ api_key +'&format=json&callback=ipinfocb');
      }
    }
  }
  var session_loader = {
    modules: {
      locale: modules.locale(),
      cur_session: modules.session(),
      orig_session: modules.session(opts.session_cookie_name, 1000 * 60 * 60 * 24 * opts.session_days),
      browser: modules.browser(),
      plugins: modules.plugins(),
      device: modules.device()
    },
    init: function(){
      // location switch
      if (opts.use_html5_location){
        session_loader.modules['location'] = modules.html5_location();
      } else if (opts.ipinfodb_key){
        session_loader.modules['location'] = modules.ipinfodb_location(opts.ipinfodb_key);
      } else if (opts.gapi_location){
        session_loader.modules['location'] = modules.gapi_location();
      }
      // Setup session Object
      var asyncs = 0, check_async = function(){;
        if (asyncs == 0){ win.session_loaded && win.session_loaded(win.session); }
      };
      win.modules = session_loader.modules;
      win.session = {api_version: 0.2}
      for (module_name in session_loader.modules){
        (function(module_name){
          var module_runner = session_loader.modules[module_name];
          if (typeof(module_runner) === 'function'){
            try {
              var ret = module_runner;
              if (typeof(ret) === 'function'){
                asyncs++;
                ret(function(data){
                  win.session[module_name] = data;
                  asyncs--;
                  check_async();
                });
              } else {
                win.session[module_name] = ret;
              }
            } catch (e) { if (typeof(console) !== 'undefined'){ console.log(e); } }
          } else {
            win.session[module_name] = module_runner;
          }
        })(module_name);
      }
      check_async();
    }
  };
  session_loader.init();
})(window, document);
