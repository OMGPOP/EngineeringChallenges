#!/usr/bin/env ruby

require 'benchmark'

Benchmark.bm do |b|
  ARGV.each do |prog|
    b.report(prog) do
      1000.times { `./#{prog} 100` }
    end
  end
end
