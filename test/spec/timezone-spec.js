// drat. I have to mock the date object :/

describe('timezone / date tests', function(){
  var internal_date = new Date();
  // get IE date format
  it('should expect IE date format', function(){
    
  })
  // get firefox date format
  it('should expect firefox date format', function(){
    
  })
  // get chrome date format
  it('should expect correct chrome date format', function(){
    
  })
  // time offset
  it("won't blow up with a no / wierd timeoffset", function(){
    
  })
});

describe('locale tests', function(){
  var mock = create_mock()
  it('should take only one locale', function(){
    mock.nav.language = 'Es'
    mock.run_sess()
    expect(mock.win.session.locale.lang).toEqual('es')
    expect(mock.win.session.locale.country).toBeFalsy()
  })
  it('should take no locale', function(){
    delete mock.nav.language
    mock.run_sess()
    expect(mock.win.session.locale).toBeDefined()
    expect(mock.win.session.locale.lang).toBeFalsy()
    expect(mock.win.session.locale.country).toBeFalsy()
  })
  it('should take both locale and country', function(){
    mock.nav.language = 'EN-US'
    mock.run_sess()
    expect(mock.win.session.locale.country).toEqual('us')
    expect(mock.win.session.locale.lang).toEqual('en')
  })
  it('should take blank string locale', function(){
    mock.nav.language = ''
    mock.run_sess()
    expect(mock.win.session.locale).toBeDefined()
    expect(mock.win.session.locale.country).toBeFalsy()
    expect(mock.win.session.locale.lang).toBeFalsy()
  })
  it('should not fail on invalid string', function(){
    mock.nav.language = 'foO1-bar-langauge-----!'
    mock.run_sess()
    expect(mock.win.session.locale).toBeTruthy()
  })
});

describe('alternate locale sources', function(){
  var mock = create_mock()
  
  beforeEach(function(){
    mock.nav = create_mock_navigator()
    delete mock.nav.langauge;
  })
  
  it('should take prop language', function(){
    mock.nav.language = 'en-US'
  })
  it('should take prop browserLanguage', function(){
    mock.nav.browserLanguage = 'en-US'
  })
  it('should take prop systemLanguage', function(){
    mock.nav.systemLanguage = 'en-US'
  })
  it('should take prop userLanguage', function(){
    mock.nav.userLanguage = 'en-US'
  })
  afterEach(function(){
    mock.run_sess()
    expect(mock.win.session.locale.country).toEqual('us')
    expect(mock.win.session.locale.lang).toEqual('en')
  })
});