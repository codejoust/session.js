Visitor.js
==

Open-Source version of visitor.js.

To use: include the file visitor.js, then access the visitor object.
It uses the google javascript loader to get location data.
For async loading, use the window.visitor_loaded callback.

To add more fields, add more modules towards the bottom of the js file.

API demo dump of `window.visitor`:
<pre>
  {
    "location": {
      "latitude": 35.046,
      "longitude": -85.31,
      "address": {
        "city": "Chattanooga",
        "region": "TN",
        "country": "USA",
        "country_code": "US"
      }
    },
    "locale": "en-US",
    "cur_session": {
      "visits": 1,
      "search": {
        "engine": null,
        "query": null
      },
      "referrer": "",
      "url": "http://localhost:8000/demo.html",
      "path": "/demo.html",
      "start": 1325891156797,
      "last_visit": 1325891156797
    },
    "orig_session": {
      "visits": 15,
      "search": {
        "engine": null,
        "query": null
      },
      "referrer": "http://localhost:8000/",
      "url": "http://localhost:8000/test_visitor.html",
      "path": "/test_visitor.html",
      "start": 1325886709703,
      "last_visit": 1325891156799
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
        "height": 1024,
        "width": 1280,
      },
      "viewport": {
        "width": 1206,
        "height": 816
      },
      "is_phone": false,
      "is_tablet": false,
      "is_mobile": false
    }
  }
</pre>
