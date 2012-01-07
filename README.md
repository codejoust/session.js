Session.js
==

Gives information about the current session.

To use: include the file session.js, then access the visitor object.
It uses the google javascript loader to get location data.
For async loading, use the window.session_loaded callback.

[Live Demo](http://go.iain.in/sessionjslivedemo01)

To add more fields, add or remove included modules and options near the bottom of the js file.

### Usage:

Include `session.js` in the head or footer.

If used in the footer (before the `</body>` tag), you can use the `window.session_loaded = function(session){}` callback).

### API demo dump of `window.session`:

```js
{
  "api_version": 0.2,
  "locale": {
    "country": "US",
    "lang": "en"
  },
  "cur_session": {
    "visits": 1,
    "search": {
      "engine": null,
      "query": null
    },
    "referrer": "",
    "url": "http://localhost:8000/",
    "path": "/",
    "start": 1325915913173,
    "last_visit": 1325915913173
  },
  "orig_session": {
    "visits": 75,
    "search": {
      "engine": null,
      "query": null
    },
    "referrer": "http://localhost:8000/",
    "url": "http://localhost:8000/test_visitor.html",
    "path": "/test_visitor.html",
    "start": 1325886709703,
    "last_visit": 1325915913175
  },
  "browser": {
    "browser": "Chrome",
    "version": 16,
    "OS": "Mac"
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
      "width": 1206,
      "height": 816
    },
    "is_phone": false,
    "is_tablet": false,
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

### Options:
Set `window.session_opts` before including `session.js` to change options.
Default options are shown below.

```js
window.session_opts = {
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
};
```

