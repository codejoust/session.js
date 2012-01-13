/***
* Extension Spec - Test Session modules + Session cookie functionality of session.js.
* Author: Iain, CodeJoust 2012. MIT License
***/

describe("String contains string", function(){
  it('should work with a string', function(){
    expect('asdf'.contains('as')).toBe(true)
    expect('asdf'.contains('asdf')).toBe(true)
    expect('ASDF'.contains('asdf')).toBe(false)
  })
  it('should not fail with a blank string', function(){
    expect(''.contains('')).toBe(true)
    expect(''.contains('foo')).toBe(false)
    expect('asdf'.contains('b')).toBe(false)
  })
  it('needs to work with wrong types', function(){
    expect('true'.contains(true)).toBe(false)
    expect('false'.contains(false)).toBe(false)
    expect('asdf'.contains(43)).toBe(false)
    expect('asdf'.contains('z')).toBe(false)
  })
})

describe('String contains in array', function(){
  it('should use an array', function(){
    expect('asdf'.contains(['a','s','d','f'])).toBe(true)
    expect('asdf'.contains(['ASDF','A','a'])).toBe(true)
    expect('aSdF'.contains(['as','df','asdf'])).toBe(false)
    expect('adfs'.contains(['asd','asb','ad','bbb','b'])).toBe(true)
  })
  it('should handle bad types in an array', function(){
    expect('asdf'.contains([4,3,23])).toBe(false)
    expect('asdf'.contains([true, false])).toBe(false)
    expect('true'.contains([true,'trua'])).toBe(true)
  })
})