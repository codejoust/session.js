Session.js
==

Gives information about the current session.

To use: include the file session.js, then access the visitor object.
It uses the google javascript loader to get location data.
For async loading, use the window.session_loaded callback.

[Live API Demo](http://go.iain.in/sessionjslivedemo01) | [Example Usage Page](http://go.iain.in/sessionjslivedemo02)

Configurable <a href="#options">options</a> are below.

### Usage:

Include `session.js` in the head or footer.

#### Download/Linking:
Recommended:
[Api v0.4 Uncompressed](http://codejoust.github.com/session.js/session-0.4.js)

Quick Example:

```html
<script type='text/javascript'>
  window.session = {
  options: { gapi_location: true },
  start: function(session){ // can also use window.session global.
    if (session.first_session.visits > 1){
      alert('Hi again from ' + session.location.address.city);
    } else {
      if (session.contains(session.current_session.referrer_info.host, 'facebook')){
        alert('Hi there from '+ session.location.address.city +'. How about liking us on facebook?');
      } else if (session.current_session.search.engine){
        alert('Did you find what you were looking for from ' + session.current_session.search.engine + '?');
      }
    }
  }
}
</script>
<script type='text/javascript' src="http://codejoust.github.com/session.js/session-0.4.js"></script>
```

#### Other Source Options:
Lock version to v0.4 (current stable):
[uncompressed](http://codejoust.github.com/session.js/session-0.4.js), 
[compressed](http://codejoust.github.com/session.js/session-0.4.min.js).

Edge:
[uncompressed](http://codejoust.github.com/session.js/session.js),
[compressed](http://codejoust.github.com/session.js/session.min.js) 


If used in the footer (before the `</body>` tag), you can use the `window.session = {start: function(sess){ /* loaded session data */ }}` callback, before including the session.js. This is recommended when using session.js with location data.

### API demo dump of `window.session`:

```js
{
  "api_version": 0.4,
  "locale": {
    "country": "us",
    "lang": "en"
  },
  "current_session": {
    "visits": 1,
    "start": 1326170811877,
    "last_visit": 1326170811877,
    "url": "http://codejoust.github.com/session.js/",
    "path": "/session.js/",
    "referrer": "",
    "referrer_info": {
      "host": "codejoust.github.com",
      "path": "/session.js/",
      "protocol": "http:",
      "port": 80,
      "search": "",
      "query": {}
    },
    "search": {
      "engine": null,
      "query": null
    }
  },
  "original_session": {
    "visits": 29,
    "start": 1326032481755,
    "last_visit": 1326170811879,
    "url": "http://codejoust.github.com/session.js/",
    "path": "/session.js/",
    "referrer": "",
    "referrer_info": {
      "host": "codejoust.github.com",
      "path": "/session.js/",
      "protocol": "http:",
      "port": 80,
      "search": "",
      "query": {}
    },
    "search": {
      "engine": null,
      "query": null
    }
  },
  "browser": {
    "browser": "Chrome",
    "version": 16,
    "os": "Mac"
  },
  "plugins": {
    "flash": true,
    "silverlight": true,
    "java": true,
    "quicktime": true
  },
  "time": {
    "tz_offset": -5,
    "observes_dst": true
  },
  "device": {
    "screen": {
      "width": 1280,
      "height": 1024
    },
    "viewport": {
      "width": 1230,
      "height": 952
    },
    "is_tablet": false,
    "is_phone": false,
    "is_mobile": false
  },
  "location": {
    "latitude": 35.046,
    "longitude": -85.31,
    "address": {
      "city": "Chattanooga",
      "region": "TN",
      "country": "USA",
      "country_code": "US"
    },
    "source": "google"
  }
}
```
<a name="options" />
### Options:
Set `window.session` before including `session.js` to change options and define a location callback.
Default options are shown below.

ipinfodb.com location [demo](http://codejoust.github.com/session.js/ipinfodb_demo.html).

Synchronous information (everything but location not cached in a cookie),
is available immediately after including session.js.

```js
window.session = {
  options: {
  // Default Settings Example
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
  },
  start: function(session){
    // Session location loaded into window.session and first argument.
  }
}
```

<img src="https://secure.codejoust.com/pix" />
