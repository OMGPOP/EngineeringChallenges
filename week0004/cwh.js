#!/usr/bin/env node

var _ = require('underscore');

require('fs').readFile("input.txt", "utf8", function(err, data) {
  if (err) throw err;
  var a = data.split("\n")
  var ns = _.rest(a)
  _.times(_.first(a), function(i) { console.log(_.size(_.filter(_.range((~~(Math.sqrt(~~(ns[i]/2)))+1)), function(x) { return (Math.pow(~~(Math.sqrt(ns[i]-(Math.pow(x,2)))),2) + Math.pow(x,2)) == ns[i] }))) })
})
