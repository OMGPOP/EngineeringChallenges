import math
import sys

class SqrFind():
	def __init__(self):
		self.maxrange = 2147483647
		self.halfrange = int(math.floor(math.sqrt(self.maxrange)))
		self.keeptrack = 0
		self.squares = {0:0}
		self.roots = {0:0}
		self.buildLookup()
		
		resultprint = ''
		if(len(sys.argv) > 1):
			f = open(sys.argv[1])
			
			ct = 0;
			for line in f:
				if(ct > 0):
					new = str(self.spitResult(long(line))) + '\n'
					resultprint = resultprint + new
				ct = ct + 1
		else:
			f = open('input.txt')
			ct = 0;
			
			#tester.spitResult(25)
			for line in f:
				if(ct > 0):
					new = str(self.spitResult(long(line))) + '\n'
					resultprint = resultprint + new
				ct = ct + 1
		print(resultprint)
	
	def buildLookup(self):
		i=1
		while i <= self.halfrange:
			self.keeptrack += (i<<1) - 1
			self.squares[i] = self.keeptrack
			self.roots[self.keeptrack] = i
			i = i + 1
	
	def spitResult(self, base):
		basehalf = base>>1
		#start = math.floor(math.sqrt(base))
		#end = math.floor(math.sqrt(basehalf))
		#start = math.floor(base**0.5)
		#end = math.floor(basehalf**0.5)
		start = self.isqrt(base)
		end = self.isqrt(basehalf)
		
		matches = 0
		while start > end:
			first = self.squares[start]
			left = base - first
			if(left in self.roots):
				matches = matches +1
			start = start - 1
		return matches
		#print(str(matches)
	
	def isqrt(self,x):
		# approximate integer sqrt I grabbed of the web
		# http://code.activestate.com/recipes/577821-integer-square-root-function/
		if x < 0:
			raise ValueError('square root not defined for negative numbers')
		n = int(x)
		if n == 0:
			return 0
		a, b = divmod(n.bit_length(), 2)
		x = 2**(a+b)
		while True:
			y = (x + n//x)//2
			if y >= x:
				return x
			x = y
		
		
inst = SqrFind()