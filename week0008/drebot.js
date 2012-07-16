var nextPos = null;
var nextFruit = null;
var MAX;

function new_game() {
   MAX = WIDTH > HEIGHT ? WIDTH : HEIGHT;
}

function make_move() {
   var board = get_board();

   // find the best fruit to get next
   nextFruit = getBestFruit();

   // only take the best items
   if(board[get_my_x()][get_my_y()] > 0 && (nextFruit == null || board[get_my_x()][get_my_y()] == nextFruit)){
      nextPos = null;
      return TAKE;
   }

   // stop chasing if someone picked up that fruit
   if(nextPos != null && board[nextPos.x][nextPos.y] == 0){
      nextPos = null;
   }

   // find the next closest fruit that will help us win
   var fruits = getNearbyFruit(get_my_x(), get_my_y(), board, 1, nextFruit);

   if(fruits.length > 0){
      nextPos = fruits[0];
   } else {
      nextPos = null;
   }

   // move to the next closest fruit
   if(nextPos != null){
      if(get_my_x() < nextPos.x) return EAST;
      if(get_my_x() > nextPos.x) return WEST;
      if(get_my_y() < nextPos.y) return SOUTH;
      if(get_my_y() > nextPos.y) return NORTH;
   } else {
      // could not find anything, just move randomly
      return randomDir();
   }
}

function randomDir() {
   var rand = Math.random() * 4;

   if (rand < 1) return NORTH;
   if (rand < 2) return SOUTH;
   if (rand < 3) return EAST;
   if (rand < 4) return WEST;

   return PASS;
}

function moveIsValid(x, y) {
   if(x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT)
      return false;
   return true;
}

function getNearbyFruit(x, y, b, r, f) {
   var fruitList = [];

   for( var i = x - r; i <= x + r; i++ ){
      for( var j = y - r; j <= y + r; j++ ){
         if(moveIsValid(i, j) && b[i][j] > 0){
            if(!hasEnough(b[i][j]) && (f == null || f == b[i][j])){
               var dist = Math.abs(x-i)+Math.abs(y-j);
               fruitList.push({x:i, y:j, f:b[i][j], d:dist});
            }
         }
      }
   }

   if(fruitList.length == 0 && r < MAX){
      return getNearbyFruit(x, y, b, r+1, f);
   } else if(b != null && r >= MAX){
      return getNearbyFruit(x, y, b, 1, null);
   }

   fruitList.sort(function(a,b){return a.d-b.d});

   return fruitList;
}

function getBestFruit() {
   var types = get_number_of_item_types();
   var typeList = [];

   for(var i = 1; i <= types; i++){
      if(!hasEnough(i)){
         typeList.push({c:get_total_item_count(i), t:i});
      }
   }

   typeList.sort(function(a,b){return a.c-b.c});

   var type = null;

   if(typeList[0] && typeList[0].t)
      type = typeList[0].t;

   return type
}

function hasEnough(type) {
   var myCount = get_my_item_count(type);
   var oppCount = get_opponent_item_count(type);
   var totalCount = get_total_item_count(type);
   var halfCount = totalCount * 0.5 + 0.1;

   if(myCount > halfCount || oppCount > halfCount)
      return true;

   return false;
}