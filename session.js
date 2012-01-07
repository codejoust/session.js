/**
 * session.js 0.3
 * (c) 2012 Iain, CodeJoust
 * session is freely distributable under the MIT license.
 * Portions of session.js are inspired or borrowed from Underscore.js, and quirksmode.org demo javascript.
 * This version uses google's jsapi library for location services.
 * For details, see: https://github.com/codejoust/session.js
 */
(function( window, document ) {
  
  // Settings: defaults
  var options = {
    // Use the HTML5 Geolocation API
    // this ONLY returns lat & long, no city/address
    HTML5Location:  false,
    // Attempts to use IPInfoDB if provided a valid key
    // get a key at http://ipinfodb.com/register.php
    IPInfoDBKey:    false,
    // Leaving true allows for fallback for both
    // the HTML5 location and the IPInfoDB
    GAPILocation:   true,
    // Name of the location cookie
    //   - WARNING: different providers use the same cookie
    //   - if switching providers, remember to use another cookie or provide checks for old cookies
    locationCookie: "location",
    // Location cookie expiration in hours
    locationCookieTimeout: 2,
    // Session expiration in days
    sessionTimeout: 32,
    // Session cookie name
    sessionCookie: "first_session"
  };
  
  
  // Session object
  var session = function() {
    // Merge options
    if( window.session && window.session.options )
      util.merge( options, window.session.options );
    // Modules to run
    this.modules = {
      apiVersion: 0.3,
      locale: modules.locale(),
      currentSession: modules.session(),
      originalSession: modules.session(
        options.sessionCookie,
        options.sessionTimeout * 24 * 60 * 60 * 1000
      ),
      browser: modules.browser(),
      plugins: modules.plugins(),
      device: modules.device()
    };
    // Location switch
    if( options.HTML5Location ) {
      this.modules.location = modules.HTML5Location();
    } else if( options.IPInfoDBKey ) {
      this.modules.location = modules.IPInfoDBLocation( options.IPInfoDBKey );
    } else if( options.GAPILocation ) {
      this.modules.location = modules.GAPILocation();
    }
    // Cache window.session.start
    if( window.session && window.session.start )
      var start = window.session.start;
    // Set up checking, if all modules are ready
    var asynchs = 0, module, result, self = this,
        checkAsynch = function() {
          if( asynchs === 0 ) {
            // Map over results
            window.session = self.modules;
            // Run start calback
            if( start ) start( self.modules );
          }
        };
    // Run asynchronos methods
    for( var name in this.modules ) {
      module = self.modules[name];
      if( typeof module === "function" ) {
        try {
          asynchs++;
          module( function( data ) {
            self.modules[name] = data;
            asynchs--;
            checkAsynch();
          });
        }
        catch( error ) {
          if( console && typeof console.log === "function" )
            console.log( error );
        }
      } else self.modules[name] = module;
    }
    checkAsynch();
  };
  
  
  // Browser (and OS) detection
  var browser = {
    
    detect: function() {
      return {
        browser: this.search( this.data.browser ),
        version: this.search( navigator.userAgent ) || this.search( navigator.appVersion ),
        os: this.search( this.data.os )
      };
    },
    
    search: function( data ) {
      if( typeof data === "object" ) {
        // search for string match
        for( var i = 0; i < data.length; i++ ) {
          var dataString = data[i].string,
              dataProp   = data[i].prop;
          this.versionString = data[i].versionSearch || data[i].identity;
          if( dataString ) {
            if( dataString.indexOf( data[i].subString ) != -1 )
              return data[i].identity;
          }
          else if( dataProp )
            return data[i].identity;
        }
      }
      else {
        // search for version number
        var index = data.indexOf( this.versionString );
        if( index == -1 ) return;
        return parseFloat(
          data.substring( index + this.versionString.length + 1 )
        );
      }
    },
    
    data: {
      browser: [
        { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
        { string: navigator.userAgent, subString: "OmniWeb", versionSearch: "OmniWeb/", identity: "OmniWeb" },
        { string: navigator.vendor, subString: "Apple", identity: "Safari", versionSearch: "Version" },
        { prop: window.opera, identity: "Opera", versionSearch: "Version" },
        { string: navigator.vendor, subString: "iCab",identity: "iCab" },
        { string: navigator.vendor, subString: "KDE", identity: "Konqueror" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.vendor, subString: "Camino", identity: "Camino" },
        { string: navigator.userAgent, subString: "Netscape", identity: "Netscape" },
        { string: navigator.userAgent, subString: "MSIE", identity: "Explorer", versionSearch: "MSIE" },
        { string: navigator.userAgent, subString: "Gecko", identity: "Mozilla", versionSearch: "rv" },
        { string: navigator.userAgent, subString: "Mozilla", identity: "Netscape", versionSearch: "Mozilla" }
      ],
      os: [
        { string: navigator.platform, subString: "Win", identity: "Windows" },
        { string: navigator.platform, subString: "Mac", identity: "Mac" },
        { string: navigator.userAgent, subString: "iPhone", identity: "iPhone/iPod" },
        { string: navigator.userAgent, subString: "iPad", identitiy: "iPad" },
        { string: navigator.platform, subString: "Linux", identity: "Linux" },
        { string: navigator.userAgent, subString: "Android", identity: "Android" }
      ]
    }
    
  };
  
  
  var modules = {
    
    browser: function() {
      return browser.detect();
    },
    
    locale: function() {
      var lang = (
        navigator.language        ||
        navigator.browserLanguage ||
        navigator.systemLanguage  ||
        navigator.userLanguage
      ).split( "-" );
      return {
        country: lang[1].toLowerCase(),
        lang: lang[0].toLowerCase()
      };
    },
    
    device: function() {
      
      var device = {
        screen: {
          width: screen.width,
          height: screen.height
        }
      };
      
      var html = document.documentElement,
          body = document.getElementsByTagName( "body" )[0];
      
      device.viewport = {
        width:  window.innerWidth  || html.clientWidth  || body.clientWidth,
        height: window.innerHeight || html.clientHeight || body.clientHeight
      };
      
      device.isTablet = !!navigator.userAgent.match(
        /(iPad|SCH-I800|xoom|kindle)/i
      );
      
      device.isPhone = !device.isTablet && !!navigator.userAgent.match(
        /(iPhone|iPod|blackberry|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i
      );
      
      device.isMobile = device.isTablet || device.isPhone;
      
      return device;
      
    },
    
    plugins: function() {
      
      var checkPlugin = function( name ) {
        if( navigator.plugins ) {
          var plugin, i = 0, length = navigator.plugins.length;
          for( ; i < length; i++ ) {
            plugin = navigator.plugins[i];
            if( plugin && plugin.name && plugin.name.toLowerCase().indexOf( name ) !== -1 )
              return true;
          }
          return false;
        }
        return void 0;
      };
      
      return {
        flash:       checkPlugin( "flash" ),
        silverlight: checkPlugin( "silverlight" ),
        java:        checkPlugin( "java" ),
        quicktime:   checkPlugin( "quicktime" )
      };
      
    },
    
    session: function( cookie, expires ) {
      
      var session = null;
      
      if( typeof cookie === "string" )
        session = util.getCookie( cookie );
      
      if( session === null ) {
        
        session = {
          visits: 1,
          search: {
            engine: null,
            query:  null
          }
        };
        
        var searchEngines = [
          { name: "Google", url: "https?://(?:www\.)?(?:images.)?google.(?:com|[a-z]{2}|com?.[a-z]{2})", query: "q" },
          { name: "Bing", url: "https?://(?:www\.)?bing.com", query: "q" },
          { name: "Yahoo", url: "https?://(?:www\.)?(?:.+.)?search.yahoo.(?:com|[a-z]{2}|com?.[a-z]{2})", query: "p" },
          { name: "AOL", url: "https?://(?:www\.)?(?:aol)?search.aol.(?:com|[a-z]{2}|com?.[a-z]{2})", query: "q" },
          { name: "Ask", url: "https?://(?:www\.)?(?:[a-z]+.)?ask.com", query: "q" },
          { name: "Baidu", url: "https?://(?:www\.)?baidu.com", query: "wd" }
        ];
        
        var engine, match, i = 0,
            length = searchEngines.length;
        
        for( ; i < length; i++ ) {
          
          engine = searchEngines[i];
          
          match = new RegExp( engine.url + "/.*[?&]" + engine.query + "=([^&]+)" );
          match = match.exec( document.referrer );
          
          if( match ) {
            session.search.engine = engine.name;
            session.search.query  = engine.query;
          }
          
        }
        
        if( session.search.engine === null ) {
          
          match = new RegExp( "[?&](?:q|query|term|p|wd|query|text)=([^&]+)" );
          match = match.exec( document.referrer );
          
          if( match ) {
            session.search.engine = "Unknown";
            session.search.query  = match;
          }
          
        }
        
        session.referrer  = document.referrer;
        session.url       = window.location.href;
        session.path      = window.location.pathname;
        session.start     = new Date().getTime();
        session.lastVisit = session.start;
        
      } else {
        session = json.parse( session );
        session.lastVisit = new Date().getTime();
        session.visits++;
      }
      
      if( typeof cookie === "string" )
        util.setCookie( cookie, json.stringify( session ), expires );
      
      return session;
      
    },
    
    HTML5Location: function() {
      return function( callback ) {
        navigator.geolocation.getCurrentPosition( function( position ) {
          position.source = 'HTML5';
          callback( position );
        }, function( error ) {
          if( options.GAPILocation ) modules.GAPILocation()( callback );
          else callback({ error: true, source: 'HTML5' });
        });
      };
    },
    
    GAPILocation: function() {
      return function( callback ) {
        var location = null;
        if( !util.getCookie( options.locationCookie ) ) {
          window.gloaderReady = function() {
            if( "google" in window ) {
              if( window.google.loader.ClientLocation ) {
                window.google.loader.ClientLocation.source = "google";
                callback( window.google.loader.ClientLocation );
              }
              else {
                callback({ error: true, source: "google" });
              }
              util.setCookie(
                options.locationCookie,
                json.stringify( window.google.loader.ClientLocation ),
                options.locationCookieTimeout * 60 * 60 * 1000
              );
            }
          };
          util.loadScript( "https://www.google.com/jsapi?callback=gloaderReady" );
        }
        else {
          callback( json.parse( util.getCookie( options.locationCookie ) ) );
        }
      };
    },
    
    IPInfoDBLocation: function( apiKey ) {
      return function( callback ) {
        var locationCookie = util.getCookie( options.locationCookie );
        if( locationCookie )
          return json.parse( locationCookie );
        window.IPInfoReady = function( data ) {
          if( data.statusCode === "OK" ) {
            data.source = "IPInfoDB";
            util.setCookie(
              options.locationCookie,
              json.stringify( data ),
              options.locationCookie * 60 * 60 * 1000
            );
            callback( data );
          }
          else {
            if( options.GAPILocation ) return modules.GAPILocation()(callback);
            else callback({ error: true, source: "IPInfoDB", message: data.statusMessage });
          }
        };
        util.loadScript(
          "http://api.ipinfodb.com/v3/ip-city/?key=" + apiKey + "&format=json&callback=ipinfocb"
        );
      };
    }
    
  };
  
  
  // Utilities
  var util = {
    
    trim: function( string ) {
      return string.replace( /^\s+|\s+$/g, '' );
    },
    
    setCookie: function( name, value, expires, path ) {
      // set path
      path = path ? "; path=" + path : "; path=/";
      // calculate expiration date
      if( expires ) {
        var date = new Date();
        date.setTime( date.getTime() + expires );
        expires = "; expires=" + date.toGMTString();
      }
      else expires = "";
      // set cookie
      return document.cookie = name + "=" + value + expires + path;
    },
    
    getCookie: function( name ) {
      var cookies = document.cookie.split( ';' ),
          cookie, i = 0, length = cookies.length;
      for( ; i < length; i++ ) {
        cookie = util.trim( cookies[i] );
        if( cookie.indexOf( name ) === 0 )
          return cookie.substring( name.length + 1, cookie.length );
      }
      return null;
    },
    
    loadScript: function( url ) {
      var element  = document.createElement( "script" );
      element.type = "text/javascript";
      element.src  = url;
      document.getElementsByTagName( "body" )[0].appendChild( element );
    },
    
    // Object merge, stolen from jQuery ($.fn.extend)
    merge: function() {
      
      var options, name, copy,
          target = arguments[0] || {},
          length = arguments.length,
          i      = 1;
      
      for( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if( ( options = arguments[i] ) != null ) {
          // Extend the base object
          for( name in options ) {
            copy = options[name];
            // Prevent never-ending loop
            if( target === copy ) continue;
            // Don't bring in undefined values
            if( copy !== void 0 ) target[name] = copy;
          }
        }
      }
      // Return the modified object
      return target;
    }
    
  };
  
  
  // JSON
  var json = {
    
    parse: JSON.parse || function( data ) {
      if( typeof data !== "string" || !data )
        return null;
      return ( new Function( "return " + data ) )();
    },
    
    stringify: JSON.stringify || function( object ) {
      var type = typeof object;
      if( type !== "object" || object === null ) {
        if( type === "string" )
          return '"' + object + '"';
      }
      else {
        var k, v, json = [],
            isArray = ( object && object.constructor === Array );
        for( k in object ) {
          v = object[k]; type = typeof v;
          if( type === "string" )
            v = '"' + v + '"';
          else if( type === "object" && v !== null )
            v = this.stringify( v );
          json.push( ( isArray ? "" : '"' + k + '":' ) + v );
        }
        return ( isArray ? "[" : "{" ) + json.join(",") + ( isArray ? "]" : "}" );
      }
    }
    
  };
  
  
  // Initialize
  new session();
  
  
})( window, document );