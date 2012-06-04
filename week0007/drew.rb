#!/usr/bin/env ruby

`cat #{ARGV[0]}`.split("\n").map{ |x| x.split(" ").map(&:to_i) }.each do |n, k|
  k = k - 1
  x = (-0.5 * Math.sqrt((1 - 2 * n)**2 - 8 * k) + n - 0.5).to_i
  y = 1 + k - (x * (n - (x + 3)/2.0)).to_i
  puts "#{x + 1} #{y + 1}"
end
