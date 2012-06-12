#!/usr/bin/env ruby

def wat(n,k)
  num = 0
  (1..n).each do |i|  
    if num + (n - i) >= k
      puts "#{i} #{i + (k-num)}"
      break
    else 
      num = num + (n - i)
    end
  end
end

`cat #{ARGV[0]}`.split("\n").map{ |x| x.split(" ").map(&:to_i) }.each do |n, k|
  wat(n,k)
end