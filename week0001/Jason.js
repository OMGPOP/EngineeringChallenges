// This is a dudez plugin and thus you won't be able to run it. It's also not very optimized, I was more interested in the visualization than the algorithm!

(function() {
DE.CM = function(params) {
  if(params.rule) { 
    this.rule = params.rule; 
    var rulebin = ("00000000" + this.rule.toString(2)).slice(-8).split("").join("");
    this.table = {}
    this.table['111'] = rulebin[0];
    this.table['110'] = rulebin[1];
    this.table['101'] = rulebin[2];
    this.table['100'] = rulebin[3];
    this.table['011'] = rulebin[4];
    this.table['010'] = rulebin[5];
    this.table['001'] = rulebin[6];
    this.table['000'] = rulebin[7];
  }
  
}

DE.CM.prototype.rule = null;
DE.CM.prototype.table = null;
DE.CM.prototype.engine = null;
DE.CM.prototype.last_step = null;

DE.CM.prototype.initialize = function(engine) {
  this.engine = engine;
}

DE.CM.prototype.step = function() {
  if((new Date()).getTime() - this.last_step > 500) {
    this.last_step = (new Date()).getTime();
    var col, row;
    for(row = 1; row < (this.engine.map.squares.length - 1); row = row + 1) {
      var t = 0;
      for(col = 1; col < (this.engine.map.squares[0].length - 1); col = col + 1) {
        var temp = ""
        if(col < 2) { temp = temp + "0" } else { if(t != 0) { temp = temp + "1"; } else { temp = temp + "0" }}
        t = this.engine.map.squares[row][col]; 
        if(t != 0) { temp = temp + "1"; } else { temp = temp + "0" }
        if(col > this.engine.map.squares.length - 2) { temp = temp + "0" } else { var z = this.engine.map.squares[row][col+1]; if(z != 0) { temp = temp + "1"; } else { temp = temp + "0" }}
        
        this.engine.map.squares[row][col] = (this.table[temp] == "0" ? 0 : 6000);
      }
    }
  }
}
})()
