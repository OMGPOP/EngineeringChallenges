
var fruits;
var categories;
var vector;
var path;
var choice;
var target_fruit;

function new_game()
{
	fruits = {};
	categories = {};
	vector = null;
	path = null;
	choice = null;
	target_fruit = null;
	build_fruits(fruits, categories);
}

function make_move()
{
	var ox = get_opponent_x();
	var oy = get_opponent_y();
	var mx = get_my_x();
	var my = get_my_y();
	delete_fruit(ox,oy);
	delete_fruit(mx,my);
	if(!path || !path.length)
	{
		build_path();
	}
	if(path && path.length) return path.pop();
	return PASS;
}

function build_choice()
{
	var strategy = build_strategy();
	choice = [];
	for(var i = 0, n = strategy.length; i < n; i++)
	{
		choice = choice.concat(strategy[i]);
	}
	sort_on(choice, "heuristic");
	choice.reverse();
}

function build_path()
{
	if(!choice || !choice.length)
	{
		build_choice();
	}
	path = [];
	target_fruit = choice.pop();
  choice = null;
	if(target_fruit) build_path_to(target_fruit.fruit.x, target_fruit.fruit.y);
}

function build_path_to(x,y)
{
  var dx = x - get_my_x();
  var dy = y - get_my_y();
  for(var i = 0; i < Math.abs(dx); i++)
  {
    path.push(dx > 0 ? EAST : WEST);
  }
  for(i = 0; i < Math.abs(dy); i++)
  {
    path.push(dy > 0 ? SOUTH : NORTH);
  }
  path.push(TAKE);
	path.reverse();
}

function build_strategy()
{
	var cat = find_most_efficient_category();
	var num = num_required_in_category(cat);
	var fruit = closest(cat);
	vector = subtract(fruit, here());
	var strategy = [];
	for(var q in categories)
	{
		if(!is_category_complete(q))
		{
			var ac = add_category(q);
			if(ac.length) strategy.push(ac);
		}
	}
	sort_on(strategy, "length");
	return strategy.slice(0,num_categories_to_win());
}

function fruit_key(x,y)
{
	return String(x) + "-" + String(y);
}

function build_fruits(fruits, categories)
{
	var board = get_board();
	for(var i = 0; i < WIDTH; i++)
	{
		for(var j = 0; j < HEIGHT; j++)
		{
			if(board[i][j])
			{
				var key = fruit_key(i,j);
				var fruit = { key:key, x:i, y:j, type:board[i][j] };
				fruits[key] = fruit;
				if(!categories[fruit.type]) categories[fruit.type] = [];
				categories[fruit.type].push(fruit);
			}
		}
	}
}

function manhattan_dist(x,y)
{
  return Math.abs(x - get_my_x()) + Math.abs(y - get_my_y());
}

function manhattan_dist_ex(x1,y1,x2,y2)
{
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function is_category_complete(category)
{
	var me = get_my_item_count(category);
	var op = get_opponent_item_count(category);
	var total = get_total_item_count(category);
	var rem = categories[category].length;
	if(rem == 0) return true;
	if(rem + me < op || rem + op < me) return true;
	return false;
}

function category_winner(category)
{
	var me = get_my_item_count(category);
	var op = get_opponent_item_count(category);
	var total = get_total_item_count(category);
	if(me + op == total) return 0;
	return op > me ? -1 : 1;
}


function num_required_in_category(category)
{
	var total = get_total_item_count(category);
	var me = get_my_item_count(category);
	return Math.floor(total / 2) + 1 - me;
}

function num_categories_left()
{
	var num = 0;
	for(var q in categories)
	{
		if(!is_category_complete(q)) num++;
	}
	return num;
}

function find_most_efficient_category()
{
	var min = WIDTH * HEIGHT;
	var cat = null;
	for(var q in categories)
	{
		if(!is_category_complete(q))
		{
			var num = num_required_in_category(q);
			if(num < min)
			{
				min = num;
				cat = q;
			}
		}
	}
	return cat;
}

function num_categories_to_win()
{
	var score = 0;
	for(var q in categories)
	{
		if(is_category_complete(q))
		{
			score += category_winner(q);
		}
	}
	var rem = num_categories_left();
	return Math.ceil(rem/2) + 1 - score;
}


function closest(category)
{
	var min = WIDTH + HEIGHT;
	var fruit = null;
	for(var i = 0, m = categories[category].length; i < m; i++)
	{
		var f = categories[category][i];
		var dist = manhattan_dist(f.x, f.y);
		if(dist < min)
		{
			min = dist;
			fruit = f;
		}
	}
	return fruit;
}

function add_category(cat)
{
	var num = Math.ceil(num_required_in_category(cat));
	var out = [];
	for(var i = 0, m = categories[cat].length; i < m; i++)
	{
		var fruit = categories[cat][i];
		if(is_ahead(vector, here(), fruit))
		{
			var candidate = {fruit:fruit, seg_dist:dist_to_segment(fruit, here(), vector), fruit_dist:manhattan_dist_ex(fruit.x, fruit.y, get_my_x(), get_my_y())};
			candidate.heuristic = heuristic(candidate);
			out.push(candidate);
		}
	}
	sort_on(out, "heuristic");
	return out.slice(0,num);
}

function heuristic(candidate)
{
	// distance to me more important than distance from vector
	return (candidate.fruit_dist * 2 + candidate.seg_dist / 4) * Math.sqrt(num_required_in_category(candidate.fruit.type));
}

function delete_fruit(x,y)
{
	var board = get_board();
	var key = fruit_key(x,y);
	if(!board[x][y] && fruits[key])
	{
		var fruit = fruits[key];
		var cats = categories[fruit.type];
		for(var i = 0, n = cats.length; i < n; i++)
		{
			if(cats[i] == fruit)
			{
				cats.splice(i,1);
				break;
			}
		}
		if(target_fruit && fruit == target_fruit.fruit)
		{
			path = null;
			target_fruit = null;
		}
		if(choice)
		{
			for(i = 0, n = choice.length; i < n; i++)
			{
				if(choice[i].fruit == fruit)
				{
					choice.splice(i,1);
					break;
				}
			}
		}
		delete fruits[key];
	}
}

function sort_on(arr, prop)
{
	arr.sort(function(a,b){
		if(a[prop] < b[prop]) return -1;
		if(a[prop] > b[prop]) return 1;
		return 0;
	});
}



function dot(p1, p2)
{
	return p1.x * p2.x + p1.y * p2.y;
}

function subtract(p1, p2)
{
	return {x:p1.x - p2.x, y:p1.y - p2.y};
}

function length(v)
{
	return Math.sqrt(v.x * v.x + v.y * v.y);
}

// is P in the direction of v from X
function is_ahead(v, X, P)
{
	return dot(v, subtract(P,X)) > 0;
}

function get_centroid(S)
{
	var C = {x:0, y:0};
	for(var i = 0, n = S.length; i < n; i++)
	{
		C.x += S[i].x;
		C.y += S[i].y;
	}
	C.x /= S.length;
	C.y /= S.length;
	return C;
}

function dist_to_segment_full(P, A, B)
{
	var AB = subtract(B, A);
	return dist_to_segment(P, A, AB);
}

function dist_to_segment(P, A, v)
{
	var AP = subtract(P, A);
	var t = dot(v, AP) / dot(v, v);
	var Q = {x:A.x + v.x * t, y:A.y + v.y * t};
	return length(subtract(P, Q));
}


function here()
{
	return {x:get_my_x(), y:get_my_y()};
}

function there()
{
	return {x:get_opponent_x(), y:get_opponent_y()};
}

