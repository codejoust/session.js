#!/bin/sh
echo 'Packing visitor.js to visitor.min.js'
uglifyjs visitor.js > visitor.min.js
