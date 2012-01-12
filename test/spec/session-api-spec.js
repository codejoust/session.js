/***
* Session API Spec - Check API version consistency of session.js.
* Author: Iain, CodeJoust 2012. MIT License
***/

describe('test api versions', function(){
  var mock = create_mock();
  it('should have the correct api version', function(){
    mock.run_sess()
    expect(mock.win.session.api_version).toEqual(0.4)
  })
})

describe('test location api versions', function(){
  var mock = create_mock();
  it('should have the correct session cookie api version', function(){
    mock.run_sess()
    expect(mock.get_cookie_obj('first_session').version).toEqual(0.4)
  })
  it('should have the correct api version after a few runs', function(){
    mock.run_sess()
    mock.run_sess()
    mock.doc.cookiejar.setCookie('first_session=foo; path=/')
    mock.run_sess()
    expect(mock.get_cookie_obj('first_session').version).toEqual(0.4)
  })
});