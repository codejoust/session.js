/***
* Test Mocker for Session.js
* Author: Iain, CodeJoust 2012. MIT License
***/

function parse_url(url){
  var d = document.createElement('a');
  d.href = url; d.raw = url;
  return d;
}

function create_mock_document(){
  var doc = {
    get cookie(){ return this.cookiejar.getCookies(cookiejar.CookieAccessInfo()).toString(); },
    set cookie(cookie_in){ this.cookiejar.setCookie(cookie_in); return cookie_in; },
    reset_jar: function(){ this.cookiejar = new cookiejar.CookieJar(); },
    cookiejar: new cookiejar.CookieJar(),
    referrer: 'http://codejoust.com/asdf',
    body: {},
    documentElement: {},
    cleanup_cookies: function(){ this.cookiejar = new cookiejar.CookieJar(); }
  };
  doc.createElement = function(a){ return document.createElement(a) };
  doc.getElementsByTagName = function(nm){ return document.getElementsByTagName(nm) };
  return doc;
}

function create_mock_navigator(){
  return {
    userAgent: navigator.userAgent,
    appVersion: '42',
    vendor: 'testing',
    platform: 'linux',
    language: 'en-US'
  }
}

function create_mock_window(sess_obj){
  
  return {innerWidth: 200, innerHeight: 200, location: window.location,
          session: sess_obj, screen:{width: 10, height: 10}};
}

function create_mock(sess_obj){
  if (!sess_obj){ sess_obj = {options: { gapi_location: false }}};
  var mock = {
    sess: null // sets initial state
    , win: create_mock_window()
    , nav: create_mock_navigator(sess_obj)
    , get_cookie_obj: function(cookie_name){
      return JSON.parse(unescape(this.doc.cookiejar.getCookie(cookie_name, cookiejar.CookieAccessInfo()).value));
   }, doc: create_mock_document()
    , run_sess: function(){
       mock.win.session = sess_obj;
       sess = exports.session(mock.win, mock.doc, mock.nav)
       return sess;
  }};
  return mock;
}
