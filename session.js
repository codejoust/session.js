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
    use_html5_location: false,
    // Attempts to use IPInfoDB if provided a valid key
    // get a key at http://ipinfodb.com/register.php
    ipinfodb_key: false,
    // Leaving true allows for fallback for both
    // the HTML5 location and the IPInfoDB
    gapi_location: true,
    // Name of the location cookie
    //   - WARNING: different providers use the same cookie
    //   - if switching providers, remember to use another cookie or provide checks for old cookies
    location_cookie: "location",
    // Location cookie expiration in hours
    location_cookie_timeout: 2,
    // Session expiration in days
    session_timeout: 32,
    // Session cookie name
    session_cookie: "first_session"
  };
  
  
  // Session object
  var session = function() {
    // Merge options
    if( window.session && window.session.options ) {
      for( option in window.session.options )
        options[option] = window.session.options[option];
    }
    // Modules to run
    this.modules = {
      api_version: 0.3,
      locale: modules.locale(),
      current_session: modules.session(),
      original_session: modules.session(
        options.session_cookie,
        options.session_timeout * 24 * 60 * 60 * 1000
      ),
      browser: modules.browser(),
      plugins: modules.plugins(),
      device: modules.device()
    };
    // Location switch
    if( options.use_html5_location ) {
      this.modules.location = modules.html5_location();
    } else if( options.ipinfodb_key ) {
      this.modules.location = modules.ipinfodb_location( options.ipinfodb_key );
    } else if( options.gapi_location ) {
      this.modules.location = modules.gapi_location();
    }
    // Cache window.session.start
    if( window.session && window.session.start )
      var start = window.session.start;
    // Set up checking, if all modules are ready
    var asynchs = 0, module, result, self = this,
        check_asynch = function() {
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
            check_asynch();
          });
        }
        catch( error ) {
          if( console && typeof console.log === "function" )
            console.log( error );
        }
      } else self.modules[name] = module;
    }
    check_asynch();
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
          this.version_string = data[i].versionSearch || data[i].identity;
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
        var index = data.indexOf( this.version_string );
        if( index == -1 ) return;
        return parseFloat(
          data.substr( index + this.version_string.length + 1 )
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
      
      var check_plugin = function( name ) {
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
        flash:       check_plugin( "flash" ),
        silverlight: check_plugin( "silverlight" ),
        java:        check_plugin( "java" ),
        quicktime:   check_plugin( "quicktime" )
      };
      
    },
    
    session: function( cookie, expires ) {
      
      var session = null;
      
      if( typeof cookie === "string" )
        session = util.get_cookie( cookie );
      
      if( session === null ) {
        
        session = {
          visits: 1,
          start: new Date().getTime(),
          last_visit: new Date().getTime(),
          url: window.location.href,
          path: window.location.pathname,
          referrer: document.referrer,
          referrer_info: util.parse_url( document.referrer ),
          search: {
            engine: null,
            query:  null
          }
        };
        
        var search_engines = [
          { name: "Google", host: "google", query: "q" },
          { name: "Bing", host: "bing.com", query: "q" },
          { name: "Yahoo", host: "search.yahoo", query: "p" },
          { name: "AOL", host: "search.aol", query: "q" },
          { name: "Ask", host: "ask.com", query: "q" },
          { name: "Baidu", host: "baidu.com", query: "wd" }
        ];
        
        var length = search_engines.length,
            engine, match, i = 0;
        
        for( ; i < length; i++ ) {
          engine = search_engines[i];
          if( session.referrer_info.host.indexOf( engine.host ) !== -1 ) {
            session.search.engine = engine.name;
            session.search.query  = session.referrer_info.query[engine.query];
            session.search.terms  = session.search.query.split( " " );
          }
        }
        
        if( session.search.engine === null ) {
          
          match = new RegExp( "[?&](?:q|query|term|p|wd|query|text)=([^&]+)" );
          match = match.exec( document.referrer );
          
          if( match ) {
            session.search.engine = "Unknown";
            session.search.query  = decodeURI( match[1] );
            session.search.terms  = session.search.query.split( " " );
          }
          
        }
        
      } else {
        session = json.parse( session );
        session.last_visit = new Date().getTime();
        session.visits++;
      }
      
      if( typeof cookie === "string" )
        util.set_cookie( cookie, json.stringify( session ), expires );
      
      return session;
      
    },
    
    html5_location: function() {
      return function( callback ) {
        navigator.geolocation.getCurrentPosition( function( position ) {
          position.source = 'HTML5';
          callback( position );
        }, function( error ) {
          if( options.gapi_location ) modules.gapi_location()( callback );
          else callback({ error: true, source: 'HTML5' });
        });
      };
    },
    
    gapi_location: function() {
      return function( callback ) {
        var location = null;
        if( !util.get_cookie( options.location_cookie ) ) {
          window.gloaderReady = function() {
            if( "google" in window ) {
              if( window.google.loader.ClientLocation ) {
                window.google.loader.ClientLocation.source = "google";
                callback( window.google.loader.ClientLocation );
              }
              else {
                callback({ error: true, source: "google" });
              }
              util.set_cookie(
                options.location_cookie,
                json.stringify( window.google.loader.ClientLocation ),
                options.location_cookie_timeout * 60 * 60 * 1000
              );
            }
          };
          util.embed_script( "https://www.google.com/jsapi?callback=gloaderReady" );
        }
        else {
          callback( json.parse( util.get_cookie( options.location_cookie ) ) );
        }
      };
    },
    
    ipinfodb_location: function( apiKey ) {
      return function( callback ) {
        var location_cookie = util.get_cookie( options.location_cookie );
        if( location_cookie )
          return json.parse( location_cookie );
        window.IPInfoReady = function( data ) {
          if( data.statusCode === "OK" ) {
            data.source = "IPInfoDB";
            util.set_cookie(
              options.location_cookie,
              json.stringify( data ),
              options.location_cookie * 60 * 60 * 1000
            );
            callback( data );
          }
          else {
            if( options.gapi_location ) return modules.gapi_location()(callback);
            else callback({ error: true, source: "IPInfoDB", message: data.statusMessage });
          }
        };
        util.embed_script(
          "http://api.ipinfodb.com/v3/ip-city/?key=" + apiKey + "&format=json&callback=ipinfocb"
        );
      };
    }
    
  };
  
  
  // Utilities
  var util = {
    
    trim: function( string ) {
      return string.replace( /^\s+|\s+$/g, "" );
    },
    
    parse_url: function( string ) {
      
      var query, a = document.createElement( "a" );
          a.href = string;
      // Strip the '?'
      var query = a.search.substr(1);
      // Disassemble query string
      if( query !== "" ) {
        var pairs = query.split( "&" ),
            length = split.length, parts, i = 0;
            query = {};
        for( ; i < length; i++ ) {
          parts = pairs[i].split( "=" );
          if( parts.length === 2 )
            query[parts[0]] = decodeURI( parts[1] );
        }
      }
      return {
        host:     a.host,
        path:     a.pathname,
        protocol: a.protocol,
        port:     a.port === "" ? 80 : a.port,
        search:   a.search,
        query:    query
      }
    },
    
    set_cookie: function( name, value, expires, path ) {
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
    
    get_cookie: function( name ) {
      var cookies = document.cookie.split( ';' ),
          cookie, i = 0, length = cookies.length;
      for( ; i < length; i++ ) {
        cookie = util.trim( cookies[i] );
        if( cookie.indexOf( name ) === 0 )
          return cookie.substr( name.length + 1, cookie.length );
      }
      return null;
    },
    
    embed_script: function( url ) {
      var element  = document.createElement( "script" );
      element.type = "text/javascript";
      element.src  = url;
      document.getElementsByTagName( "body" )[0].appendChild( element );
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