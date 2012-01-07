#!/bin/sh
echo 'Packing viewer.js to viewer.min.js'
uglifyjs viewer.js > viewer.min.js
