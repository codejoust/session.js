/**
 * Visitor.js 0.0.2
 * (c) 2012 Iain, CodeJoust
 * Visitor is freely distributable under the MIT license.
 * Portions of Visitor.js are inspired or borrowed from Underscore.js, and quirksmode.org demo javascript.
 * This version uses google's jsapi library for location services.
 * For details, see: https://github.com/codejoust/visitor.js
 */
(function(win, doc){
  var opts = {
      enable_location: true,
      session_days: 32
  }
  if ('session_opts' in window){ opts = session_opts; }
  var BrowserDetect = { // from quirksmode.org/js/detect.html
  	detect_browser: function () {
  		return {browser: this.searchString(this.dataBrowser),
  		        version: this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion),
  		        OS: this.searchString(this.dataOS)};
  	},
  	searchString: function (data) {
  		for (var i=0;i<data.length;i++)	{
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
  		{	string: navigator.vendor,	subString: "Apple",	identity: "Safari",	versionSearch: "Version"},
		  {	prop: window.opera,	identity: "Opera",	versionSearch: "Version" },
  		{	string: navigator.vendor,	subString: "iCab",identity: "iCab" },
  		{	string: navigator.vendor,	subString: "KDE",	identity: "Konqueror"	},
  		{ string: navigator.userAgent, subString: "Firefox", identity: "Firefox"	},
  		{	string: navigator.vendor, subString: "Camino", identity: "Camino"	},
  		{		// for newer Netscapes (6+)
  			string: navigator.userAgent, subString: "Netscape",	identity: "Netscape"	},
  		{	string: navigator.userAgent,	subString: "MSIE",	identity: "Explorer",	versionSearch: "MSIE"	},
  		{	string: navigator.userAgent,	subString: "Gecko",	identity: "Mozilla",	versionSearch: "rv"		},
  		{ 		// for older Netscapes (4-)
		    string: navigator.userAgent, subString: "Mozilla", identity: "Netscape",	versionSearch: "Mozilla" }
  	],
  	dataOS : [ {
  			string: navigator.platform, subString: "Win", identity: "Windows"
  		}, {
  			string: navigator.platform,	subString: "Mac",	identity: "Mac"	},
  		{ string: navigator.userAgent,subString: "iPhone", identity: "iPhone/iPod" },
  		{ string: navigator.userAgent,subString: 'iPad', identitiy: 'iPad'},
  		{	string: navigator.platform,	subString: "Linux",	identity: "Linux"	}
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
    parse_json: (JSON.parse || function (str) {
      if (str === "") str = '""';
        eval("var p=" + str + ";");
        return p;
    }),
    set_cookie: function(c_name, value, expire) {
      var exdate=new Date();
      exdate.setDate(exdate.getDate()+expire);
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
    try_obj: function(tries, obj){
      for (var i = 0; i < tries.length; i++){
        obj_try = obj[tries[i]];
        if (!utils.is_undef(obj_try) && obj_try != null && obj_try != ''){
          return obj_try;
        }
      }
      return null;
    },
    try_props: function(props){
      for(var i = 0; i < props.length; i++){
        if (!utils.is_undef(props[i]) && props[i] != null && props[i] != ''){
          return props[i];
        }
      }
    }
  };
    
  var modules = {
    location: function(cookie_name){
      var embed_script = function(url){
        var scr = document.createElement('script');
        scr.type = 'text/javascript';
        scr.src = url;
        document.getElementsByTagName('head')[0].appendChild(scr);
      }
      return function(cb){
        var loc = null;
        if (!utils.get_cookie(cookie_name)){
          win.gloader_loaded = function() {
            if ('google' in window) {
              cb(win.google.loader.ClientLocation);
              utils.set_cookie(cookie_name,utils.stringify_json(win.google.loader.ClientLocation), 1000 * 60 * 60 * 2);} }
          embed_script('https://www.google.com/jsapi?callback=gloader_loaded');
        } else { cb(utils.parse_json(utils.get_cookie(cookie_name))); }
      }
    },
    locale: function(){
      var res = utils.search(['language', 'browserLanguage', 'systemLanguage', 'userLanguage'], function(prop_name){
        return navigator[prop_name];
      }), res_parts = res.split('-');
      if (res_parts.length == 2){
        return {country: res_parts[1], lang: res_parts[0]}
      } else { return {country: res} }
    },
    browser: function(){
      return BrowserDetect.detect_browser();
    },
    device: function(){
      var device = {screen: {width: screen.width, height: screen.height}, viewport: {}};
      var elem=doc.documentElement, doc_body=doc.getElementsByTagName('body')[0], agent = navigator.userAgent;
      device.viewport.width=(win.innerWidth||elem.clientWidth||doc_body.clientWidth);
      device.viewport.height=(win.innerHeight||elem.clientHeight||doc_body.clientHeight);
      device.is_phone  = !!(agent.match(/(iPhone|iPod|blackberry|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i));
      device.is_tablet = !!(agent.match(/(iPad|SCH-I800|xoom|kindle)/i));
      device.is_mobile = device.is_tablet || device.is_phone;
      return device;
    },
    plugins: function(){
      var check_plugin = function(plugin_name){
        if (navigator.plugins){
          return !!utils.find(navigator.plugins, function(plugin){
            if (plugin && plugin['name'] && plugin['name'].toLowerCase().indexOf(plugin_name) !== -1){
              return true;
            }
          });
        }
      }
      return {
        flash: check_plugin('flash'),
        silverlight: check_plugin('silverlight'),
        java: check_plugin('java'),
        quicktime: check_plugin('quicktime'),
      }
    },
    visitor: function(cookie_name, expires){
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
    }
  }
  var visitor_loader = {
    modules: {
      locale: modules.locale(),
      cur_session: modules.visitor(),
      orig_session: modules.visitor('first_session', 1000 * 60 * 60 * 24 * (opts.session_days || 32)),
      browser: modules.browser(),
      plugins: modules.plugins(),
      device: modules.device()
    },
    init: function(){
      if (opts.enable_location){
        visitor_loader.modules['location'] = modules.location('location');
      }
      // Setup Visitor Object
      var asyncs = 0, check_async = function(){
        if (asyncs == 0){ win.visitor_loaded && win.visitor_loaded(win.visitor); }
      };
      win.modules = visitor_loader.modules;
      win.visitor = {api_version: 0.2}
      for (module_name in visitor_loader.modules){
        (function(module_name){
          var module_runner = visitor_loader.modules[module_name];
          if (typeof(module_runner) === 'function'){
            try {
              var ret = module_runner;
              if (typeof(ret) === 'function'){
                asyncs++;
                ret(function(data){
                  win.visitor[module_name] = data;
                  asyncs--;
                  check_async();
                });
              } else {
                win.visitor[module_name] = ret;
              }
            } catch (e) { if (typeof(console) !== 'undefined'){ console.log(e); } }
          } else {
            win.visitor[module_name] = module_runner;
          }
        })(module_name);
      }
    }
  };
  visitor_loader.init();
})(window, document);
