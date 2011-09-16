/** * Module dependencies.  */
var express = require('express')
    , _ = require('underscore'); 
var app = module.exports = express.createServer(); 

// Configuration
app.configure(
  function(){ 
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

// -r 110 -s 20 -c 1
// params r
app.get('/q134', function(req, res) {
  var steps = parseInt(req.param('s'));
  var rule  = parseInt(req.param('r'));

  var frow = (new Array(steps + 1)).join("0") + req.param('c') + (new Array(steps + 1)).join("0");
  var matrix_data = _.reduce(_.range(steps), function(memo, step) {
    var curr_row = ("0" + _.last(memo) + "0").split("");
    var next_row = []
    for (var i=0;i<=curr_row.length - 3;i++) {
      rule & Math.pow(2,parseInt(curr_row.slice(i,i+3).join(''),2)) ? next_row.push(1) : next_row.push(0)
    }
    memo.push(next_row.join(''));

    return memo;
  }, [frow]);

  res.render('q134/index', {
    title: 'Quiz 134',
    rule: rule,
    steps: steps,
    cells: parseInt(req.param('c')),
    scale: parseInt(req.param('scale')),
    matrix: matrix_data
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
