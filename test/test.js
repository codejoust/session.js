(function() {
  var add_script, assert, config, doc, fs, jsdom, raw_lib, win;
  jsdom = require('jsdom');
  fs = require('fs');
  assert = require('assert');
  raw_lib = fs.readFileSync(__dirname + '/../session.js').toString();
  config = 'window.session = ' + JSON.stringify({
    config: {
      gapi_location: false,
      location_cookie: '',
      session_cookie: ''
    }
  }) + ';';
  win = jsdom.jsdom('<html><head></head><body></body></html>').createWindow();
  add_script = function(content) {
    var scr;
    scr = win.document.createElement('script');
    scr.innerHTML = content;
    return win.document.getElementsByTagName('head')[0].appendChild(scr);
  };
  add_script(config);
  add_script(raw_lib);
  setTimeout(function() {
    return console.log(win.document.innerHTML);
  }, 400);
  /*
  jsdom.env('<html><body</body></html>', ['../session.js'], (err, win) ->
    win.onload= ->
      console.log 'load'
      console.log win.session
    console.log([err, win.onload])
  )

  */
  doc = jsdom.jsdom('<html><head></head><body>loading...</body></html>');
  win = doc.createWindow();
  console.log(doc.innerHTML);
  win.onload = function() {
    console.log('load');
    return console.log(win.session);
  };
}).call(this);
