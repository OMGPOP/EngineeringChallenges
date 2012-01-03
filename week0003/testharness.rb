#!/usr/bin/env ruby

require 'benchmark'

Benchmark.bm do |b|
  ARGV.each do |prog|
    `chmod +x #{prog}`
    b.report(prog) do
      1000.times { `./#{prog} 12` }
    end
  end
end


def factorial n
  (1..n).inject(1){ |x,s| x * s }
end
