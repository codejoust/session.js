#!/bin/sh
echo 'Packing session.js to session.min.js'
uglifyjs session.js > session.min.js
