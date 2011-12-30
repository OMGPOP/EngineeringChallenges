#!/usr/bin/env ruby

module EA

	class Genotype

		attr_accessor :chromosome
		attr_accessor :genome_mask
		attr_accessor :fitness
		attr_accessor :size

		def initialize size, chromosome, genome_mask
			@size = size
			@chromosome = chromosome
			@genome_mask = genome_mask
			@fitness = 0
		end

		def mutate rate
			@size.times do |i|	
				@chromosome = @chromosome ^ (1 << i) if rand() < rate
			end
		end

		def crossover rate, genotype
			if rand() < rate
				cross_point = rand @size
				lmask = (0...cross_point).inject(0){ |mask, bit| mask | (1 << bit) }
				rmask = (cross_point...@size).inject(0){ |mask, bit| mask | (1 << bit) }
				@chromosome = (lmask & @chromosome) | (rmask & genotype.chromosome) 
				genotype.chromosome = (lmask & genotype.chromosome) | (rmask & @chromosome) 
			end
			return self, genotype
		end

		def genome index
			(@chromosome >> @genome_mask[ index ].bit) & @genome_mask[ index ].mask
		end

		def clone
			Genotype.new @size, @chromosome, @genome_mask
		end

	end

	class GeneMarker

		attr_accessor :bit
		attr_accessor :mask
		
		def initialize bit, mask
			@bit = bit
			@mask = mask
		end

	end

	class Evolver

		attr_reader :genotypes

		def initialize size, genome_mask, population_size
			max = (0...size).inject(0){ |m, bit| m | (1 << bit) }
			@genotypes = (0...population_size).map{ |i| Genotype.new size, 0, genome_mask }
			@population_size = population_size
		end

		def next pool_size, crossover_rate, mutation_rate
			pool = []
			# sort by descending fitness
			@genotypes.sort!{ |a,b| b.fitness <=> a.fitness }

			# step size
			dt = Math::PI / @population_size
			# remainder
			rm = 0.0

			# Integrates 1 + cos x dx from 0 to pi, giving a nice weighted distribution
			# favoring genotypes with a high fitness score
			@genotypes.each_with_index do |genotype, i|
				t = i / @population_size.to_f
				n = dt + Math::cos( Math::PI * t ) * dt
				n = n * pool_size / Math::PI # scale to pool size
				while n + rm >= 1.0
					pool.push genotype.clone
					n -= 1
				end
				rm = n
			end

			pool.shuffle!
			@genotypes = [@genotypes.first.clone] #elitism
			while @genotypes.length < @population_size
				a = pool.pop()
				b = pool.pop()
				a.crossover crossover_rate, b
				a.mutate mutation_rate
				b.mutate mutation_rate
				@genotypes.push a, b
			end
		end


	end

end


# Test evolve a pair of integers whose product is 3198
def test
	evolver = EA::Evolver.new 12, [EA::GeneMarker.new(0, 255), EA::GeneMarker.new(8,15)], 100
	50.times do |i|
		evolver.genotypes.map{ |genotype| genotype.fitness = fitness genotype }
		evolver.next 300, 0.7, 0.005
	end
  evolver.genotypes.map{ |genotype| [genotype.genome(0), genotype.genome(1)] }
end

def fitness genotype
	1.0 / (1.0 + (genotype.genome(0) * genotype.genome(1) - 3198.0)**2.0)
end
