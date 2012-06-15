#!/usr/bin/env ruby

IO.binread(ARGV[0]).split("\n").map{ |x| x.split(" ").map(&:to_i) }.each do |n, k|
  x = (n - (1 + Math.sqrt((1 - (n<<1))**2 - ((k-1)<<3)))/2.0).to_i
  y = k - (x * (n - (x + 3)/2.0)).to_i
  puts "#{x + 1} #{y + 1}"
end
