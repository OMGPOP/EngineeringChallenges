#! /usr/bin/env python
import math
import sys

class Marching():
	def __init__(self):
		self.grid = [
		[ 8,  2, 22, 97, 38, 15,  0, 40,  0, 75,  4,  5,  7, 78, 52, 12, 50, 77, 91,  8],
      		[49, 49, 99, 40, 17, 81, 18, 57, 60, 87, 17, 40, 98, 43, 69, 48,  4, 56, 62,  0],
      		[81, 49, 31, 73, 55, 79, 14, 29, 93, 71, 40, 67, 53, 88, 30,  3, 49, 13, 36, 65],
      		[52, 70, 95, 23,  4, 60, 11, 42, 69, 24, 68, 56,  1, 32, 56, 71, 37,  2, 36, 91],
      		[22, 31, 16, 71, 51, 67, 63, 89, 41, 92, 36, 54, 22, 40, 40, 28, 66, 33, 13, 80],
      		[24, 47, 32, 60, 99,  3, 45,  2, 44, 75, 33, 53, 78, 36, 84, 20, 35, 17, 12, 50],
      		[32, 98, 81, 28, 64, 23, 67, 10, 26, 38, 40, 67, 59, 54, 70, 66, 18, 38, 64, 70],
      		[67, 26, 20, 68,  2, 62, 12, 20, 95, 63, 94, 39, 63,  8, 40, 91, 66, 49, 94, 21],
      		[24, 55, 58,  5, 66, 73, 99, 26, 97, 17, 78, 78, 96, 83, 14, 88, 34, 89, 63, 72],
      		[21, 36, 23,  9, 75,  0, 76, 44, 20, 45, 35, 14,  0, 61, 33, 97, 34, 31, 33, 95],
      		[78, 17, 53, 28, 22, 75, 31, 67, 15, 94,  3, 80,  4, 62, 16, 14,  9, 53, 56, 92],
      		[16, 39,  5, 42, 96, 35, 31, 47, 55, 58, 88, 24,  0, 17, 54, 24, 36, 29, 85, 57],
      		[86, 56,  0, 48, 35, 71, 89,  7,  5, 44, 44, 37, 44, 60, 21, 58, 51, 54, 17, 58],
      		[19, 80, 81, 68,  5, 94, 47, 69, 28, 73, 92, 13, 86, 52, 17, 77,  4, 89, 55, 40],
      		[ 4, 52,  8, 83, 97, 35, 99, 16,  7, 97, 57, 32, 16, 26, 26, 79, 33, 27, 98, 66],
      		[88, 36, 68, 87, 57, 62, 20, 72,  3, 46, 33, 67, 46, 55, 12, 32, 63, 93, 53, 69],
      		[ 4, 42, 16, 73, 38, 25, 39, 11, 24, 94, 72, 18,  8, 46, 29, 32, 40, 62, 76, 36],
      		[20, 69, 36, 41, 72, 30, 23, 88, 34, 62, 99, 69, 82, 67, 59, 85, 74,  4, 36, 16],
      		[20, 73, 35, 29, 78, 31, 90,  1, 74, 31, 49, 71, 48, 86, 81, 16, 23, 57,  5, 54],
      		[ 1, 70, 54, 71, 83, 51, 54, 69, 16, 92, 33, 48, 61, 43, 52,  1, 89, 19, 67, 48]]
	
	def march(self):
		size = len(self.grid)
		i = 0
		h1 = h2 = h3 = h4 = 0
		v1 = v2 = v3 = v4 = 0
		d1 = d2 = d3 = d4 = 0
		b1 = b2 = b3 = b4 = 0
		thebigone = 0
		bh = 0
		bv = 0
		direction = 0
		while i < size:
			j = 0
			h = v = d = b = 0
			while j <= size - 4:
				n1 = j + 1
				n2 = j + 2
				n3 = j + 3
				if(j == 0):
					v1 = self.grid[i][j]
					v2 = self.grid[i][n1]
					v3 = self.grid[i][n2]
					v4 = self.grid[i][n3]
					h1 = self.grid[j][i]
					h2 = self.grid[n1][i]
					h3 = self.grid[n2][i]
					h4 = self.grid[n3][i]
				else:
					v1 = v2
					v2 = v3
					v3 = v4
					v4 = self.grid[i][n3]
					h1 = h2
					h2 = h3
					h3 = h4
					h4 = self.grid[n3][i]
				if i <= size - 4:
					d1 = self.grid[i][j]
					d2 = self.grid[i+1][n1]
					d3 = self.grid[i+2][n2]
					d4 = self.grid[i+3][n3]
					if d1 == 0 | d1 == 0 | d3 == 0 | d4 == 0:
						d = 0
					else:
						d = d1 + d2 + d3 + d4
					if d > thebigone:
						thebigone = d
						bv = i
						bh = j
						direction = 2
					b1 = self.grid[i][j+3]
					b2 = self.grid[i+1][j+2]
					b3 = self.grid[i+2][j+1]
					b4 = self.grid[i+3][j]
					if b1 == 0 | b2 == 0 | b3 == 0 | b4 == 0:
						b = 0
					else:
						b = b1 + b2 + b3 + b4
					if b > thebigone:
						thebigone = b
						bv = i
						bh = j
						direction = 3
				if v1 == 0 | v2 == 0 | v3 == 0 | v4 == 0:
					v = 0
				else:
					v = v1 + v2 + v3 + v4
				if h1 == 0 | h2 == 0 | h3 == 0 | h4 == 0:
					h = 0
				else:
					h = h1 + h2 + h3 + h4
				if v > thebigone:
					thebigone = v
					bv = i
					bh = j
				if h > thebigone:
					thebigone = h
					bv = j
					bh = i
					direction = 1
				#print("i:"+str(i)+" j:"+str(j)+" v:"+str(v)+" h:"+str(h)+" d:"+str(b))
				#print("d1: "+str(b1)+" d2: "+str(b2)+" d3: "+str(b3)+" d4: "+str(b4))
				j = j + 1
			i = i + 1
		product = 0
		if direction == 1:
			product = self.grid[bv][bh] * self.grid[bv+1][bh] * self.grid[bv+2][bh] * self.grid[bv+3][bh]
		elif direction == 2:
			product = self.grid[bv][bh] * self.grid[bv+1][bh+1] * self.grid[bv+2][bh+2] * self.grid[bv+3][bv+3]
		elif direction == 3:
			product = self.grid[bv][bh+3] * self.grid[bv+1][bh+2] * self.grid[bv+2][bh+1] * self.grid[bv+3][bh]
		else:
			product = self.grid[bv][bh] * self.grid[bv][bh+1] * self.grid[bv][bh+2] * self.grid[bv][bh+3]
		print("bv: "+str(bv)+" bh: "+str(bh)+" dir: "+str(direction)+" product: "+str(product))
run = Marching()
run.march()
