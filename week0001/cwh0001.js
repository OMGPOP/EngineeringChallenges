/* Cellular Automaton Server - cwh week 0001 solution
 *  README:
 *   this is a node project.
 *   requirements:
 *    - node
 *    - canvas
 *    - underscore
 *  EXAMPLE:
 *   # node ./cwh0001.js
 *   in browser: http://localhost:3000/automaton?rule=30&steps=1000&gradient=true
 *  COMPUTED RESULTS:
 *   see cwh0001.md
 *    
 *
 */
 
var Canvas = require('canvas'), http = require('http'), _ = require('underscore'), url = require('url');

// pads string on left and right and centers.
function padcenter(a,c,d){var b="",e=RegExp("(.*)(.{"+a.length+"})(\\1)$");do b+=c;while(--d);return b.replace(e,"$1"+a+"$3")};

function automaton(rule,steps,cells,gradient) {
  // setup initial variables
  var size = steps + cells.length + steps;
  var line = padcenter(cells, '0', size);
  var widened;
  // create rule table
  var binaryRule = (rule.toString(2).split("").reverse().join("")+"00000000").slice(0,8).toString(2);
  // create canvas
  var canvas = new Canvas(size, size/2);
  var ctx = canvas.getContext('2d');
  // enable gradient
  if (gradient==!0) {
   var color,hue=[[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255],[255,0,0]],gradient=ctx.createLinearGradient(0,0,size,0);
   for(var i=0;i<=6;i++) gradient.addColorStop(i*1/6,"rgb("+hue[i][0]+","+hue[i][1]+","+hue[i][2]+")");
   ctx.fillStyle=gradient;
  }
  // magic
  _.times(steps, function(step) {
   widened = line.slice(0,1) + line + line.slice(-1)
   line = _.reduce(
    _.map(_.range(size), function(i) {
     var lookup = binaryRule[Number(parseInt(widened.slice(i,i+3),2))]
     if (lookup == 1) ctx.fillRect(i, step, 1, 1)
     return lookup
    }), function(x,y) {
      return String(x) + String(y)
    })
  })
  // return painted canvas
  return canvas;
}

http.createServer(function (req, res) {
 var uri = url.parse(req.url, true);
 if (uri.pathname == "/automaton") {
  var rule = uri.query.rule ? Number(uri.query.rule) : 30;
  var steps = uri.query.steps ? Number(uri.query.steps) : 80;
  var cells = uri.query.cells ? String(uri.query.cells) : '1';
  var gradient = uri.query.gradient == "true" ? true : false;
  console.log("automaton("+rule+","+steps+","+cells+","+gradient+")")
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<img src="' + automaton(rule,steps,cells,gradient).toDataURL("image/png") + '" />');
 } else {
  res.writeHead(404);
  res.end();
 }
}).listen(3000);
console.log('Cellular Automaton Server started on port 3000');