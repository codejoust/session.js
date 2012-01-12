/***
* Session Info Spec - Test Session modules + Session cookie functionality of session.js.
* Author: Iain, CodeJoust 2012. MIT License
***/
describe("session url location", function(){
    var mock = create_mock()
    it("switches location", function () {
        var test_url = 'https://github.com/testing';
        mock.win.location = parse_url(test_url)
        mock.run_sess();
        expect(mock.win.session.current_session.url).toEqual(test_url);
        expect(mock.win.session.current_session.path).toEqual(mock.win.location.pathname);
    })
    it("switches referrer", function () {
        var test_url = parse_url('https://github.com/testing');
        mock.doc.referrer = test_url.raw;
        mock.run_sess();
        expect(mock.win.session.current_session.url).toEqual(test_url.raw);
        expect(mock.win.session.current_session.path).toEqual(test_url.pathname);
    })
});

describe("running search referrers", function(){
  var mock = create_mock()
  it("runs google search", function(){
      mock.doc.referrer = 'http://google.com/go/url?q=asasd fasdf';
      var parsed_ref = parse_url(mock.doc.referrer);
      mock.run_sess();
      expect(mock.win.session.current_session.referrer).toEqual(mock.doc.referrer);
      expect(mock.win.session.current_session.referrer_info.path).toEqual('/go/url');
      expect(mock.win.session.current_session.referrer_info.search).toEqual('?q=asasd%20fasdf');
      expect(mock.win.session.current_session.search.query).toEqual('asasd fasdf');
      expect(mock.win.session.current_session.search.engine).toEqual('Google');
  })
  it("runs bing search", function(){
      mock.doc.referrer = 'http://search.yahoo.com/res?q=asdfasdf asdfasdf';
      var parsed_ref = parse_url(mock.doc.referrer);
      mock.run_sess();
      expect(mock.win.session.current_session.referrer).toEqual(mock.doc.referrer);
      expect(mock.win.session.current_session.referrer_info.path).toEqual('/res');
      expect(mock.win.session.current_session.referrer_info.search).toEqual('?q=asdfasdf%20asdfasdf');
      expect(mock.win.session.current_session.search.engine).toEqual('Yahoo');
  })
  it("presists search info", function(){
    mock.doc.reset_jar()
    mock.doc.referrer = 'http://search.yahoo.com/res?p=asdfasdf asdfasdf';
    mock.run_sess()
    mock.doc.referrer = 'http://google.com/go/url?q=asasd fasdf';
    mock.run_sess()
    expect(mock.win.session.original_session.search.engine).toEqual('Yahoo');
    expect(mock.win.session.original_session.search.query).toEqual('asdfasdf asdfasdf');
  })
});


describe("counting visits", function(){
  var mock = create_mock()
  mock.win.location = parse_url('http://codejoust.com/asdfasdf/asdfas')
  beforeEach(function(){
    mock.doc.reset_jar()
  })
  it('counts initial visits', function(){
    mock.run_sess()
    expect(mock.win.session.original_session.visits).toEqual(1)
    expect(mock.win.session.current_session.visits).toEqual(1)
  })
  it('counts two visits', function(){
    mock.run_sess()
    mock.run_sess()
    expect(mock.win.session.original_session.visits).toEqual(2)
    expect(mock.win.session.current_session.visits).toEqual(1)
  })
  it('counts six visits', function(){
    for(var i = 0; i < 6; i++){
      mock.run_sess()
    }
    expect(mock.win.session.original_session.visits).toEqual(6)
    expect(mock.win.session.current_session.visits).toEqual(1)
  })
  it('presists across paths', function(){
    mock.run_sess()
    mock.win.location.pathname = 'furballl'
    mock.doc.cookiejar.getCookie('first_session', new cookiejar.CookieAccessInfo('codejoust.com', '/foopath/baar', false, false))
  })
  it('keeps start times', function(){
    runs(function(){
      mock.run_sess();
      var self = this;
      self.start_time_1 = (new Date()).getTime();
      setTimeout(function(){
        mock.run_sess();
        self.start_time_2 = (new Date()).getTime();
        self.start_done_1 = mock.win.session.original_session.start;
        self.start_done_2 = mock.win.session.current_session.start;
      }, 50)
    })
    waits(100);
    runs(function(){
      var err_offset = 6;
      expect(this.start_done_1).toBeLessThan(this.start_time_1 + err_offset)
      expect(this.start_done_1).toBeGreaterThan(this.start_time_1 - err_offset);
      expect(this.start_done_2).toBeLessThan(this.start_time_2 + err_offset)
      expect(this.start_done_2).toBeGreaterThan(this.start_time_1 - err_offset);
    })
  })
});
