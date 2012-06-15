#!/usr/bin/env ruby

def s(n, k)
  m = 0
  (1..n-1).each do |i|
   if ((m += n - i) >= k)
    puts "#{i} #{k - m + n}"
    break
   end
  end
end

`cat #{ARGV[0]}`.split("\n").map{ |x| x.split(" ").map(&:to_i) }.each do |n, k|
  s(n, k)
end