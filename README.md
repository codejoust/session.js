Session.js
==

Gives information about the current session.

To use: include the file session.js, then access the visitor object.
It uses the google javascript loader to get location data.
For async loading, use the window.session_loaded callback.

To add more fields, add or remove included modules and options near the bottom of the js file.


API demo dump of `window.session`:
<pre>
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
      "url": "http://localhost:8000/demo.html",
      "path": "/demo.html",
      "start": 1325893718929,
      "last_visit": 1325893718929
    },
    "orig_session": {
      "visits": 20,
      "search": {
        "engine": null,
        "query": null
      },
      "referrer": "http://localhost:8000/",
      "url": "http://localhost:8000/test_visitor.html",
      "path": "/test_visitor.html",
      "start": 1325886709703,
      "last_visit": 1325893718932
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
      }
    }
  }
</pre>
