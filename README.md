Visitor.js
==

Open-Source version of visitor.js.

To use: include the file visitor.js, then access the visitor object.
For async loading, use the window.visitor_loaded callback.

To add more fields, add more modules torwards the bottom of the js file.

API demo dump:
<pre>
{
  "locale": "en-US",
  "cur_session": {
    "visits": 1,
    "search": {
      "engine": null,
      "query": null
    },
    "referrer": "http://localhost:8000/",
    "url": "http://localhost:8000/demo.html",
    "path": "/demo.html",
    "start": 1325887305691,
    "last_visit": 1325887305691
  },
  "orig_session": {
    "visits": 2,
    "search": {
      "engine": null,
      "query": null
    },
    "referrer": "http://localhost:8000/",
    "url": "http://localhost:8000/test_visitor.html",
    "path": "/test_visitor.html",
    "start": 1325886709703,
    "last_visit": 1325887305692
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
