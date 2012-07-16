MAX_DEPTH = 1;

function Fruit(type, x, y) {
   this.type = type;
   this.x = x;
   this.y = y;

   this.compareTo = function(other) {
      var myX = get_my_x();
      var myY = get_my_y();
     return getDistanceCoordinates(myX, myY, x, y)-getDistanceCoordinates(myX, myY, other.x, other.y);
    };

   this.toString = function() {
      var myX = get_my_x();
      var myY = get_my_y();
      return type + " " + x + " " + y + " " + getDistanceCoordinates(myX, myY, x, y);
    }
}

function BestFruitsData(fruits, distance) {
   this.fruits = fruits;
   this.distance = distance;
}

function new_game() {
}

function generate_prediction_values () {
   var board = get_board();
   var opponentX = get_opponent_x();
   var opponentY = get_opponent_x();
   var opponentItem = board[opponentX][opponentY];

   feroseOpponentPickupingUp = 0;

   if (opponentX != get_my_x() || opponentY != get_my_y()) {
      feroseOpponentPickupingUp = board[opponentX][opponentY];
   }
}

function get_real_opponent_item_count(type) {
   return get_opponent_item_count(type) + (feroseOpponentPickupingUp == type ? 1 : 0);
}

function generate_ignore_list () {
   feroseIgnoreList = [];
   var numItems = get_number_of_item_types()+1;
   for (var i = 1; i < numItems; i++) {
      if (get_real_opponent_item_count(i) > get_total_item_count(i)/2 || get_my_item_count(i) > get_total_item_count(i)/2) {
         feroseIgnoreList.push(i);
      }
   }
}

function generate_fruit_list () {
   var board = get_board();
   feroseFruitList = [];
   for (var x=0; x<WIDTH; ++x) {
      for (var y=0; y<HEIGHT; ++y) {
         var type = board[x][y];
         if (isWorthTaking(type)) {
            // If we are all on top of a fruit, consider it
            if (get_my_x() == get_opponent_x() && get_my_y() == get_opponent_y() && get_my_x() == x && get_my_y() == y) {
               feroseFruitList.push(new Fruit(type, x, y));
            }
            // Otherwise if the opponent is not on top of a fruit, consider it
            else if (get_opponent_x() != x || get_opponent_y() != y) {
               feroseFruitList.push(new Fruit(type, x, y));
            }
         }
      }
   }

   feroseFruitList.sort(function(a,b){return a.compareTo(b)});
   if (feroseFruitList.length > MAX_DEPTH) {
      feroseFruitList.length = MAX_DEPTH;
   }
}

function isWorthTaking(type) {
   // True if there's an item and it's not in the ignore list
   return type > 0 && !(feroseIgnoreList.indexOf(type) > -1);
}

function getDistanceFruits(fruits) {
   if (fruits == null || fruits.length == 0) {
      return 0;
   }
   var myX = get_my_x();
   var myY = get_my_y();
   if (fruits.length == 1) {
      return getDistanceCoordinates(myX, myY, fruits[0].x, fruits[0].y);
   }
   var totalDistance = getDistanceCoordinates(myX, myY, fruits[0].x, fruits[0].y);
   for (var i = 1; i < fruits.length; ++i) {
      totalDistance += getDistanceCoordinates(fruits[i-1].x, fruits[i-1].y, fruits[i].x, fruits[i].y);
   }
   return totalDistance;
}

function getDistanceCoordinates(x1, y1, x2, y2) {
   return Math.abs(x1-x2) + Math.abs(y1-y2);
}

function root () {
   // Start by going nowhere
   return [];
}

function reject (c) {
   return false;
}

function accept (c) {
   // Returns true if this path is currently the best path available, even better than the last recorded path
   if (feroseBestFruits == null || feroseBestFruits.fruits.length != feroseFruitList.length) {
      return c.length > 0;
   }
   if (c.length == feroseFruitList.length) {
      return getDistanceFruits(c) <= feroseBestFruits.distance;
   }
   return false;
}

function first (c) {
   // Append a new element that's not already in the list
   var notInList = null;
   for (var i = 0; i < feroseFruitList.length; ++i) {
      if (c.indexOf(feroseFruitList[i]) == -1) {
         notInList = feroseFruitList[i];
         break;
      }
   }
   if (notInList == null) {
      return null;
   }
   return c.concat([notInList]);
}

function next (s) {
   // Replace the last element with the next
   var fruitIndex = feroseFruitList.indexOf(s[s.length-1]);
   var notInList = null;
   for (var i = fruitIndex; i < feroseFruitList.length; ++i) {
      if (s.indexOf(feroseFruitList[i]) == -1) {
         notInList = feroseFruitList[i];
         break;
      }
   }
   if (notInList == null) {
      return null;
   }
   s[s.length-1] = notInList;
   return s;
}

function output (c) {
   feroseBestFruits = new BestFruitsData(c, getDistanceFruits(c));
}

function bt (c) {
   //trace(c);
   if (reject(c)) {
      return;
   }
   if (accept(c)) {
      output(c);
   }
   var s = first(c);
   while (s != null) {
      bt(s);
      s = next(s);
   }
}

function make_move() {
   feroseBestFruits = null;

   var board = get_board();
   var myX = get_my_x();
   var myY = get_my_y();
   var myItem = board[myX][myY];

   generate_prediction_values();
   generate_ignore_list();
   generate_fruit_list();

   //trace(feroseFruitList.length);

   if (isWorthTaking(myItem))
      return TAKE;

   bt(root());

   //trace(feroseBestFruits);

   if (feroseBestFruits != null) {
      var bestFruit = feroseBestFruits.fruits[0];

      if (bestFruit.x < myX)
         return WEST;
      if (bestFruit.y < myY)
         return NORTH;
      if (bestFruit.x > myX)
         return EAST
      if (bestFruit.y > myY)
         return SOUTH
   }

   return NORTH;
}

// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
// function default_board_number() {
//    return 303803;
// }
