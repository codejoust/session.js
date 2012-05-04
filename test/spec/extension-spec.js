/***
* Extension Spec - Test Session modules + Session cookie functionality of session.js.
* Author: Iain, CodeJoust 2012. MIT License
***/

var mock = create_mock()
var session = mock.run_sess().win.session

describe("String contains string", function(){
  it('should work with a string', function(){
    expect(session.contains('asdf', 'as')).toBe(true)
    expect(session.contains('asdf', 'asdf')).toBe(true)
    expect(session.contains('ASDF', 'asdf')).toBe(false)
  })
  it('should not fail with a blank string', function(){
    expect(session.contains('', '')).toBe(true)
    expect(session.contains('', 'foo')).toBe(false)
    expect(session.contains('asdf', 'b')).toBe(false)
  })
  it('needs to work with wrong types', function(){
    expect(session.contains('true', true)).toBe(false)
    expect(session.contains('false', false)).toBe(false)
    expect(session.contains('asdf', 43)).toBe(false)
    expect(session.contains('asdf', 'z')).toBe(false)
  })
})

describe('String contains in array', function(){
  it('should use an array', function(){
    expect(session.contains('asdf', ['a','s','d','f'])).toBe(true)
    expect(session.contains('asdf', ['ASDF','A','a'])).toBe(true)
    expect(session.contains('aSdF', ['as','df','asdf'])).toBe(false)
    expect(session.contains('adfs', ['asd','asb','ad','bbb','b'])).toBe(true)
  })
  it('should handle bad types in an array', function(){
    expect(session.contains('asdf', [4,3,23])).toBe(false)
    expect(session.contains('asdf', [true, false])).toBe(false)
    expect(session.contains('true', [true,'trua'])).toBe(true)
  })
})
