// @todo - can tests be dynamically created in Jasmine for this to work?

var mock = create_mock();
var _getTestHandler = function(testData, expectedResult) {
  return function() {
    mock.nav.userAgent = testData[3];
    mock.nav.appVersion = testData[2];
    mock.nav.platform = testData[1];
    if (testData[4]) {
      mock.nav.vendor = testData[4];
    }
    mock.run_sess();

    var browser_data = mock.win.session.browser;
    expect(browser_data.browser).toEqual(expectedResult.browser);
    expect(browser_data.version).toEqual(expectedResult.version);
    expect(browser_data.os).toEqual(expectedResult.os);
  };
};

describe('IE Browser Names', function(){
  var ie_tests = [
    ['msie 11',       'Win', '11.0', 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv 11.0) like Gecko'],
    ['msie 10',       'Win', '10.0', 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)'],
    ['msie 9',        'Win',  '9.0', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)'],
    ['msie 8 .net',   'Win',  '8.0', 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET4.0C; .NET4.0E)'],
    ['msie 9',        'Win',  '9.0', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)'],
    ['msie 8 .net',   'Win',  '8.0', 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)'],
    ['msie 8 .net 2', 'Win',  '8.0', 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)']
  ];
  var ie_tests_expected_result = [
    { browser: 'Explorer', version: 11, os: 'Windows' },
    { browser: 'Explorer', version: 10, os: 'Windows' },
    { browser: 'Explorer', version:  9, os: 'Windows' },
    { browser: 'Explorer', version:  8, os: 'Windows' },
    { browser: 'Explorer', version:  9, os: 'Windows' },
    { browser: 'Explorer', version:  8, os: 'Windows' },
    { browser: 'Explorer', version:  8, os: 'Windows' }
  ];
  for (var i = 0; i < ie_tests.length; i++) {
    var ie_test = ie_tests[i];
    var expected_result = ie_tests_expected_result[i];
    it(ie_test[0], _getTestHandler(ie_test, expected_result));
  }
});

describe('Edge Browser Names', function (){
  var edge_tests = [
    ['edge', 'Win', '12', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240']
  ];
  var edge_tests_expected_result = [
    { browser: 'Edge', version: 12.1024, os: 'Windows' }
  ];
  for (var i = 0; i < edge_tests.length; i++) {
    var edge_test = edge_tests[i];
    var expected_result = edge_tests_expected_result[i];
    it(edge_test[0], _getTestHandler(edge_test, expected_result));
  }
});

describe('PhantomJS Browser Names', function (){
  var tests = [
    ['phantomjs 2.0', 'Win32', '5.0', 'Mozilla/5.0 (Unknown; Linux x86_64) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.0.1-development Safari/538.1', 'Apple Computer, Inc.'],
    ['phantomjs 1.9', 'Win32', '5.0', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.9.8 Safari/534.34', 'Apple Computer, Inc.']
  ];
  var expected_results = [
    { browser: 'PhantomJS', version: 2, os: 'Windows' },
    { browser: 'PhantomJS', version: 1.9, os: 'Windows' }
  ];
  for (var i = 0; i < tests.length; i++) {
    var test = tests[i];
    var expected_result = expected_results[i];
    it(test[0], _getTestHandler(test, expected_result));
  }
});

describe('Firefox Browser Names', function(){
  var firefox_tests = [
    ['firefox 9.0.1', '9.0.1',  'Mozilla/5.0 (Windows NT 5.1; rv:9.0.1) Gecko/20100101 Firefox/9.0.1'],
    ['firefox 8.0.1', '8.0.1',  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:8.0.1) Gecko/20100101 Firefox/8.0.1'],
    ['firefox 3.6',   '3.6.24', 'Mozilla/5.0 (X11; U; Linux i686; sk; rv:1.9.2.24) Gecko/20111107 Ubuntu/10.04 (lucid) Firefox/3.6.24'],
    ['firefox beta',  '11.0a2', 'Mozilla/5.0 (X11; Linux x86_64; rv:11.0a2) Gecko/20120107 Firefox/11.0a2']
  ];
});

describe('Safari Browser Names', function(){
  var tests = [
    ['8.0 mac intel', 'MacIntel', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/8.0.8 Safari/600.8.9', 'Apple Computer, Inc.'],
    //['ipad test',      '5.1',   'Mozilla/5.0 (iPad; CPU OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3'],
    //['intel mac test', '5.1.2', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.52.7 (KHTML, like Gecko) Version/5.1.2 Safari/534.52.7'],
    //['5.0 intel mac',  '5.0',   'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16'],
    //['5.1 ipad',       '5.1',   'Mozilla/5.0 (iPad; CPU OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3'],
    //['4.1 iphone',     '5.1',   'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3']
  ];
  var expected_results = [
    { browser: 'Safari', version: 8, os: 'Mac' }
  ];
  for (var i = 0; i < tests.length; i++) {
    var test = tests[i];
    var expected_result = expected_results[i];
    it(test[0], _getTestHandler(test, expected_result));
  }
});

describe('Chrome Browser Names', function(){
  var chrome_tests = [
    ['chrome 44', 'Win', '44',  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36'],
  ];

  var chrome_tests_expected_result = [
    { browser: 'Chrome', version: 44, os: 'Windows' }
   ];
  for (var i = 0; i < chrome_tests.length; i++) {
    var chrome_test = chrome_tests[i];
    var expected_result = chrome_tests_expected_result[i];
    it(chrome_test[0], _getTestHandler(chrome_test, expected_result));
  }
});
