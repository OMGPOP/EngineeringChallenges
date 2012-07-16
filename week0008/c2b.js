function new_game() {
}

var board;
function make_move() {
   board = get_board();

   // we found an item! take it!
   if (board[get_my_x()][get_my_y()] > 0) {
       return TAKE;
   }
   
   return best_direction(get_my_x(),get_my_y());
}

function best_direction(from_x, from_y) {
  up = y_search(from_x, from_y-1, -1);
  down = y_search(from_x, from_y+1, 1);
  left = x_search(from_x-1, from_y, -1);
  right = x_search(from_x+1, from_y, 1);
  
  trace("UP: "+up);
  trace("DOWN: "+down);
  trace("LEFT: "+left);
  trace("RIGHT: "+right);
  
  var attempt;
  if(up >= down) {
    if(left > right && left > up) {
      return WEST;
    }
    
    if(right >= left && right > up) {
      return EAST;
    }
    
    if(up != 0) {
      return NORTH;
    }
  } else if (down >= up) {
    if(left > right && left > down) {
      return WEST;
    }
    
    if(right >= left && right > down) {
      return EAST;
    }
    
    if(down != 0) {
      return SOUTH;
    }
  }
  
  return random_direction();  
}

var rand = Math.random() * 4;
function random_direction() {
  trace("Y: "+get_my_y() + " H "+HEIGHT);
  if((get_my_x() == 0 || get_my_x() == WIDTH) || (get_my_y() == 0 || get_my_y() == HEIGHT-1)) {
    if(rand >= 4) {
      rand = Math.random() * 4;
    } else {
      rand = rand + 1;
    }
  }

  if (rand < 1) return NORTH;
  if (rand < 2) return SOUTH;
  if (rand < 3) return EAST;
  if (rand < 4) return WEST;
}

// direction is -1 (down) 1 (up)
function y_search(x, y, direction) {
  if(y < 0 || y >= HEIGHT) {
    return 0;
  }
  
  if(has_item(board[x][y]))
  {
    return 1 + y_search(x,y+direction,direction);
  } 
  
  return 0 + y_search(x,y+direction,direction);
}

// -1 (left) +1 (right)
function x_search(x, y, direction) {
  if(x < 0 || x >= WIDTH) {
    return 0;
  }
  
  if(has_item(board[x][y]))
  {
    return 1 + x_search(x+direction,y,direction);
  } 
  
  return 0 + x_search(x+direction,y,direction);
}
