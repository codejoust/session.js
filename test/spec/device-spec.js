describe('screen size', function(){
  var mock = create_mock()
  beforeEach(function(){
    mock.win = create_mock_window()
    mock.doc = create_mock_document()
    delete mock.win.innerWidth
    delete mock.win.innerHeight
  })
  it('gets proper screen size', function(){
    mock.win.screen.width = 670
    mock.win.screen.height = 770
    mock.run_sess()
    expect(mock.win.session.device.screen.height).toEqual(770)
    expect(mock.win.session.device.screen.width).toEqual(670)
  })
  it('gets proper inner size by win.inner*', function(){
    mock.win.innerWidth = 270
    mock.win.innerHeight = 220
    mock.run_sess()
    expect(mock.win.session.device.viewport).toBeTruthy()
    expect(mock.win.session.device.viewport.width).toEqual(270)
    expect(mock.win.session.device.viewport.height).toEqual(220)
  })
  it('gets proper inner size by doc.documentElement', function(){
    mock.doc.documentElement = {}
    mock.doc.documentElement.clientWidth = 520
    mock.doc.documentElement.clientHeight = 340
    mock.run_sess()
    expect(mock.win.session.device.viewport).toBeTruthy()
    expect(mock.win.session.device.viewport.width).toEqual(520)
    expect(mock.win.session.device.viewport.height).toEqual(340)
  })
  it('gets proper size by doc.body.clientHeight / doc.body.clientWidth', function(){
    mock.doc.body = {}
    mock.doc.body.clientWidth = 342
    mock.doc.body.clientHeight = 434
    mock.run_sess()
    expect(mock.win.session.device.viewport).toBeTruthy()
    expect(mock.win.session.device.viewport.width).toEqual(342)
    expect(mock.win.session.device.viewport.height).toEqual(434)
  })
  it('gets 0 size when inside iframe', function(){
    mock.doc.documentElement = {}
    mock.doc.documentElement.clientWidth = 0
    mock.doc.documentElement.clientHeight = 0
    mock.doc.body = undefined
    mock.run_sess()
    expect(mock.win.session.device.viewport).toBeTruthy()
    expect(mock.win.session.device.viewport.width).toEqual(0)
    expect(mock.win.session.device.viewport.height).toEqual(0)
  })
})

describe('mobile / tablet device checks', function(){
  var mock = create_mock()
  it("shouldn't blow up with a garbled useragent", function(){
    mock.nav.userAgent = 'baser';
    mock.run_sess()
    expect(mock.win.session).toBeDefined()
    expect(mock.win.session.device).toBeDefined()
  })
  it('should see an ipad as a mobile tablet', function(){
    mock.nav.userAgent = 'Mozilla/5.0 (iPad; CPU OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3';
    mock.run_sess()
    expect(mock.win.session.device.is_tablet).toBe(true)
    expect(mock.win.session.device.is_mobile).toBe(true)
    expect(mock.win.session.device.is_phone).toBe(false)
  })
  it('should see an iphone as a phone', function(){
    mock.nav.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3';
    mock.run_sess()
    expect(mock.win.session.device.is_tablet).toBe(false)
    expect(mock.win.session.device.is_mobile).toBe(true)
    expect(mock.win.session.device.is_phone).toBe(true)
  })
  it('should see a android phone as a phone', function(){
    mock.nav.userAgent = 'Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';
    mock.run_sess()
    expect(mock.win.session.device.is_tablet).toBe(false)
    expect(mock.win.session.device.is_mobile).toBe(true)
    expect(mock.win.session.device.is_phone).toBe(true)
  })
  it('should see a chrome windows desktop as not a tablet or a phone', function(){
    mock.nav.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.75 Safari/535.7';
    mock.run_sess()
    expect(mock.win.session.device.is_tablet).toBe(false)
    expect(mock.win.session.device.is_mobile).toBe(false)
    expect(mock.win.session.device.is_phone).toBe(false)
  })
  it('should see chrome on mac as not a tablet or a phone', function(){
    mock.nav.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.75 Safari/535.7';
    mock.run_sess()
    expect(mock.win.session.device.is_tablet).toBe(false)
    expect(mock.win.session.device.is_mobile).toBe(false)
    expect(mock.win.session.device.is_phone).toBe(false)
  })
})