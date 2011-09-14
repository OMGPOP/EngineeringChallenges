#!/usr/bin/env ruby

def run rule, t0, steps
	state = [0] * steps + t0.split( "" ).map{ |x| x.to_i } + [0] * steps
	(steps + 1).times do
    puts state.map{ |cell| if cell == 1 then 'x' else ' ' end }.join
		state = state.each_with_index.map{ |x,i| rule[((state[i-1] || 0) << 2) | x | (state[i+1] || 0)] }
	end
end

run 30, "1010010100111100101010100111111011", 20
