function new_game() {
}

function make_move() 
{
   	var board = get_board();
   	var my_x = get_my_x();
	var my_y = get_my_y();
	var opp_x = get_opponent_x();
	var opp_y = get_opponent_y();
	
	var numItemTypes = get_number_of_item_types();
	
   	// we found an item! take it!
   	if (board[my_x][my_y] > 0) 
	{
		return TAKE;
	}
		
	var fruitValue = new Array();
	var score = new Array();

	var i;
	var j;
	
	var closestFruitPosition = new Array();

	for ( i = 0; i < numItemTypes; i++ )
	{
		// -- figure out which items are worth going for still
		var fruitIndex = i + 1;
		fruitValue[i] = ( get_my_item_count(fruitIndex) + get_total_item_count(fruitIndex) ) - get_opponent_item_count(fruitIndex);
		closestFruitPosition[i] = { 'x' : -1, 'y' : -1 };
		score[i] = 600;
	}
	
	for ( i = 0; i < WIDTH; i++ )
	{
		for ( j = 0; j < HEIGHT; j++ )
		{
			var value = board[i][j];
			
			if ( value > 0 )
			{
				var closest = closestFruitPosition[value - 1];
				
				if ( closest.x = -1 )
				{
					// -- value was not set, so now this is the closest
					score[value - 1] = manhattan_distance( my_x, my_y, i, j );
					closest.x = i;
					closest.y = j;
				}
				else
				{
					// -- need to compare
					var newScore = manhattan_distance( my_x, my_y, i, j );
					
					if ( newScore < score[value - 1] )
					{
						score[value - 1] = newScore;
						closest.x = i;
						closest.y = j;
					}
				}
			}
		}
	}
	
	
	for ( i = 0; i < numItemTypes; i++ )
	{
		// finalize the scores
		if ( fruitValue[i] < 0 )
		{
			//worthless 
			score[i] = 501;
		}
	}
	
	var lowestScore = 500;
	var winnerIndex = -1;
	// -- lowest score wins
	for ( i = 0; i < numItemTypes; i++ )
	{
		if ( winnerIndex == -1 || score[i] < lowestScore )
		{
			lowestScore = score[i];
			winnerIndex = i;
		}
	}
	
	// -- we need to get here
	var desiredPosition = closestFruitPosition[winnerIndex];
	
	var xdiff = desiredPosition.x - my_x;
	var ydiff = desiredPosition.y - my_y;
	
	if ( xdiff != 0 )
	{
		// move in x
		if ( xdiff < 0 )
		{
			return WEST;
		}		
		
		return EAST;
	}
	else
	{
		if ( ydiff < 0 )
		{
			return NORTH;
		}
		
		return SOUTH;
	}

   	return PASS;
}

function manhattan_distance( x1, y1, x2, y2 )
{
	return (Math.abs(x1 - x2) + Math.abs(y1 - y2));
}

// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}
