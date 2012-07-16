function new_game() {
  create_all_fruits_from_board();
}

function make_move() {
  var move = PASS;

  try {
    move = move_me();
  } catch(e) { _target = null;  move = PASS;  }

  return move;
   
}

var _target;
var _paths;
function move_me() {
  var t, fruit,
    x = get_my_x(),
    y = get_my_y(),
    board = get_board();

  if(!_target || board[_target.x][_target.y] != _target.type) {
    _target = rank_fruits()[0];
  }

  _paths = build_best_path_to(_target);
  t =  _paths[0];
  //console.log(_target);
  try {
    fruit = t.node.fruit;
  }catch(e) { fruit = _target; }

  var move = TAKE

  if(x == fruit.x && y == fruit.y) {
    move = TAKE;
    _target = false;
  } else {
    if (x > fruit.x) move = WEST;
    else if(x < fruit.x) move = EAST;
    else if(y < fruit.y) move = SOUTH;
    else if(y > fruit.y) move = NORTH;
  }
  return move;
}

/*rank fruits
  target most important fruit.
    most important is defined by
      (scarse quantity + time to get there) 
  build shortest path with most fruits in it
  start executing steps
    if robot is sitting on fruit
      if opponent is sitting as well pick it

      if opponent is further away from fruit than you
        pick it*/


/*RANKING*/
function rank_fruits() {
  var fruits = rank_fruits_by_quantity(),
      my_x = get_my_x(),
      my_y = get_my_y();
  fruits.sort(function(a, b) { return  b.value(my_x, my_y) - a.value(my_x, my_y) });
  return fruits;
}

function rank_fruits_by_quantity() {
  var fruits = [];

  for_each_fruit(function(i, fruit) {
    if(
      have_less_fruit_than_opponent(fruit.type)
      && have_quantity_less_than_half(fruit.type))
      fruits.push(fruit);
  });

  fruits.sort(function(a, b) { return a.q() - b.q(); });

  return fruits;
}


/*Creating Fruits objects*/

var _board_fruits = null;
function get_fruits_on_board() {
  var board = get_board(),
      fruit;
  for(var i = 0; i < _board_fruits.length; i++) {
    fruit = _board_fruits[i];
    if(!has_item(board[fruit.x][fruit.y])) {
      _board_fruits.splice(i, 1); i--;
    }
  }

  return _board_fruits;
}


function create_all_fruits_from_board() {
  _board_fruits = [];

  for_each_cell(function(x, y, fruit) {
    _board_fruits.push(create_fruit(fruit, x, y));
  });
}

function create_fruit(type, x, y) {
  return {
    type: type,
    x: x,
    y: y,
    quantity: get_total_item_count(type) - (get_my_item_count(type) + get_opponent_item_count(type)),
    q: function() { 
      return get_total_item_count(this.type) - (get_my_item_count(this.type) + get_opponent_item_count(this.type));
    },
    distance_from_me: function(my_x, my_y) {
      var x = my_x - this.x,
          y = my_y - this.y;

      return this._distance = Math.round(Math.sqrt((x * x) + (y * y)));
    },
    value: function(my_x, my_y) {
      var value = 9999;
      value /= this.q();
      value /= this.distance_from_me(my_x, my_y);
      return value;
    },
    _distance: null,
    inRectangle: function(x1, y1, x2, y2) {
      var is_it = (this.x >= x1 && this.x <= x2)
        &&
        (this.y >= y1 && this.y <= y2);
      return is_it;
        
    },
    print: function() { return 'x: ' + this.x + ' | ' + ' y: ' + this.y + ' - q: ' + this.quantity + ' - dist:' + this._distance; }
  }
}

function have_less_fruit_than_opponent(type) {
  return get_my_item_count(type) <= get_opponent_item_count(type);
}

function have_quantity_less_than_half(type) {
  return get_my_item_count(type) < (get_total_item_count(type) / 2);
}

/*Iteration Functions*/

function for_each_cell(cb) {
  var board_x, board_y, board = get_board();

  for(board_x = 0; board_x < board.length; board_x++) {
      for(board_y = 0; board_y < board[board_x].length; board_y++) {
        if(cb(board_x, board_y, board[board_x][board_y]) === true) return;
      }
  }
}

function for_each_fruit(cb) {
  var fruits = get_fruits_on_board();
  for(var i = 0; i < fruits.length; i++) {
    if(cb(i, fruits[i]) === true) return;
  }
}

function get_most_important_fruit() {
  return rank_fruits()[0];
}

function build_best_path_to(target) {
  var tree = create_node_from_target(target);
  
  var bottom_nodes = get_bottom_nodes(tree);
  bottom_nodes = flatten_array(bottom_nodes);
  var paths = [];

  for(var i = 0; i < bottom_nodes.length; i++) {
    paths.push(new Path(bottom_nodes[i]));
  }

  paths.sort(function(a, b) {  return b.quality() - a.quality(); });

  return paths;


  /*value of path
  1 - diversity
  2 - scarsity
  3 - quantity*/
}

function print_tree(tree, space) {
  if(!space) space = 0;
  var sp = space;
  var str = '';
  while(sp-- > 0) { str += '\t'; }
  console.log(str, 'x:', tree.fruit.x, ' y:', tree.fruit.y, 'quantity:', tree.fruit.quantity);

  space++;
  tree.forEach(function(i, child) {
    print_tree(child, space);
  });
}

function get_bottom_nodes(parentNode) {
  var nodes = [];

  parentNode.forEach(function(i, node) {
    if(node.children().length)
      nodes.push(get_bottom_nodes(node));
    else
      nodes.push(node);
  });

  return nodes;
}

function flatten_array(arr) {
  var flat = [];
  for(var i = 0; i < arr.length; i++) {
    if(arr[i] instanceof Array) {
      flat = flat.concat(flatten_array(arr[i]));
    } else {
      flat.push(arr[i]);
    }
  }

  return flat;
}


function create_node_from_target(target) {
  var x = get_my_x(),
      y = get_my_y(),
      fruits = get_fruits_within_quadrant(target, x, y);

  var targetNode = new StepNode(target);
  if(fruits.length) {
    for(var i = 0; i < fruits.length; i++) {
      targetNode.addChild(create_node_from_target(fruits[i]));
    }
  }

  return targetNode;
}


function get_fruits_within_quadrant(target, x2, y2) {

  var fruits = get_fruits_on_board(),
      interested_fruits = [],
      fruit;

  for(var i = 0; i < fruits.length; i++) {
    fruit = fruits[i];

    if(target
      && target != fruit 
      && fruit_in_rectangle(fruit, target.x, target.y, x2, y2)) {
      interested_fruits.push(fruits[i]);
    }
  }

  return interested_fruits;
}

function fruit_in_rectangle(fruit, x1, y1, x2, y2) {
  return fruit.inRectangle(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2))
}



function is_sitting_on_fruit() {

}

function should_pick_up_fruit() {

}

function is_opponent_further_from(target) {

}

function is_opponent_sitting_on_fruit() {

}


function StepNode(fruit) {
  this.fruit = fruit;
  this.parent = null;
  this._children = [];
}

StepNode.prototype = {
  parent: null,
  fruit: null,
  children: function() { return this._children; },
  addChild: function(node) {
    if(this.inList(node)) return this;

    node.parent = this;
    this._children.push(node);
  },
  forEach: function(cb) {
    for(var i = 0; i < this._children.length; i++) {
      if(cb(i, this._children[i]) === true) return;
    }
  },
  inList: function(node) {
    return this.indexOf(node) > -1;
  },
  indexOf: function(node) {
    for(var i = 0; i < this._children.length; i++) {
      if(this._children[i] == node)
        return i;
    }
    return -1;
  },
  level: function() {
    if(this.parent)
      return this.parent.levels_deep() + 1;
    else {
      return 1;
    }
  },
  getAllPosiblePaths: function() {
    var paths = [];
    this.forEach(function(i, child) {

    });
  },
  _value: null,
  _children: null
}

function Path(stepNode) {
  this.node = stepNode;
}

Path.prototype = {
  node: null,
  quality: function() {
    var parent = this.node.parent;
    var quanitity = 1;
    while(parent !== null) {
      quanitity++;
      parent = parent.parent;
    }

    return quanitity;
  }
}

function print_fruits(fruits) {
  for(var i = 0; i <fruits.length; i++) {
    console.log(fruits[i].print());
  }
}