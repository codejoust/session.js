jsdom = require('jsdom')
test = require('tap').test
fs = require('fs')

raw_lib = fs.readFileSync(__dirname + '/../session.js')

test("Testing session.js -- navigator")

