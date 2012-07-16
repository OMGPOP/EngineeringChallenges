function new_game() {
}

function make_move() {
   var board = get_board();
   var fruit_locations = locate_fruit({"x":get_my_x(),"y":get_my_y()}, board).sort(function(a,b){return a.distance - b.distance});

   // alert("Going to: " + fruit_locations[0].x + "," + fruit_locations[0].y );

   if (board[get_my_x()][get_my_y()] > 0) return TAKE;

   var directions = [
    {"direction":"north","distance": Math.abs (get_my_x() - fruit_locations[0].x) + Math.abs (get_my_y() - 1 - fruit_locations[0].y)},
    {"direction":"south","distance": Math.abs (get_my_x() - fruit_locations[0].x) + Math.abs (get_my_y() + 1 - fruit_locations[0].y)},
    {"direction":"east","distance": Math.abs (get_my_x() + 1 - fruit_locations[0].x) + Math.abs (get_my_y() - fruit_locations[0].y)},
    {"direction":"west","distance": Math.abs (get_my_x() - 1 - fruit_locations[0].x) + Math.abs (get_my_y() - fruit_locations[0].y)}
   ].sort(function(a,b){return a.distance - b.distance});

   // alert("Going : " + directions[0].direction);

   switch(directions[0].direction) {
     case "north":
       return NORTH;
     case "south":
       return SOUTH;
     case "east":
       return EAST;
     case "west":
       return WEST;
     default:
       return PASS;
   }
}

function locate_fruit(current_location, board) {
  var fruit_locations = [];

  for (var i = 0; i < board.length; i++){ 
    for (var j = 0; j < board[i].length; j++){ 
      if (board[i][j] > 0) {
        var fruit_location = {"x":i,"y":j}
        fruit_location.distance = manhattan_distance(current_location,fruit_location);
        fruit_locations.push(fruit_location);
      }
    }
  } 
  return fruit_locations;
}

function manhattan_distance(pos0, pos1) {
  // This is the Manhattan distance
  var d1 = Math.abs (pos1.x - pos0.x);
  var d2 = Math.abs (pos1.y - pos0.y);
  return d1 + d2;
}

// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}
