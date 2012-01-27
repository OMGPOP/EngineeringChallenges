#!/usr/bin/env node

var _=require("underscore");require("fs").readFile("input.txt","utf8",function(a,e){if(a)throw a;var d=e.split("\n"),b=_.rest(d);_.times(_.first(d),function(c){console.log(_.size(_.filter(_.range(~~Math.sqrt(~~(b[c]/2))+1),function(a){return Math.pow(~~Math.sqrt(b[c]-Math.pow(a,2)),2)+Math.pow(a,2)==b[c]})))})});
