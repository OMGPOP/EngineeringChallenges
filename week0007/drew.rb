#!/usr/bin/env ruby

IO.foreach(ARGV[0]).each do |line|
  n, k = line.split(" ").map(&:to_i)
  x = (n - (1 + Math.sqrt((1 - (n<<1))**2 - ((k-1) << 3)))/2.0).to_i
  y = k - (x * (n - (x + 3)/2.0)).to_i
  puts "#{x + 1} #{y + 1}"
end
