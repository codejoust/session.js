Session.js
==

Gives information about the current session.

To use: include the file session.js, then access the visitor object.
It uses the google javascript loader to get location data.
For async loading, use the window.session_loaded callback.

[Live Demo](http://go.iain.in/sessionjslivedemo01)

Configurable <a href="#options">options</a> are below.

### Usage:

Include `session.js` in the head or footer.

#### Download/Linking:
Edge:
[uncompressed](https://raw.github.com/codejoust/session.js/master/session.js),
[compressed](https://raw.github.com/codejoust/session.js/master/session.min.js)
Lock version to v0.3 (last stable version):
[uncompressed](https://raw.github.com/codejoust/session.js/v0.4/session.js) [compressed](https://raw.github.com/codejoust/session.js/v0.4/session.min.js)

If used in the footer (before the `</body>` tag), you can use the `window.session_loaded = function(session){}` callback).

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
    "start": 1325991619228,
    "last_visit": 1325991619228,
    "url": "http://localhost:8000/demo.html",
    "path": "/demo.html",
    "referrer": "http://localhost:8000/",
    "referrer_info": {
      "host": "localhost:8000",
      "path": "/",
      "protocol": "http:",
      "port": "8000",
      "search": "",
      "query": {}
    },
    "search": {
      "engine": null,
      "query": null
    }
  },
  "original_session": {
    "visits": 41,
    "start": 1325990490065,
    "last_visit": 1325991619229,
    "url": "http://localhost:8000/demo.html",
    "path": "/demo.html",
    "referrer": "",
    "referrer_info": {
      "host": "localhost:8000",
      "path": "/demo.html",
      "protocol": "http:",
      "port": "8000",
      "search": "",
      "query": ""
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
  "device": {
    "screen": {
      "width": 1280,
      "height": 1024
    },
    "viewport": {
      "width": 1063,
      "height": 860
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

```js
window.session = {
  options: {
    // Use the HTML5 Geolocation API
    // this ONLY returns lat & long, no city/address
    use_html5_location: false,
    // Attempts to use IPInfoDB if provided a valid key
    // Get a key at http://ipinfodb.com/register.php
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
  },
  start: {
    // Session location loaded.
  }
}
```

<img src="https://secure.codejoust.com/pix" />