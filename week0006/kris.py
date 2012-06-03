#!/usr/bin/python
import sys

rowSize = 20
matrix = []

def product(x, y, dx, dy, dMax):
    product = matrix[x][y]
    for i in range(dMax-1):
        x += dx;
        y += dy;
        if x < 0 or y < 0 or x >= rowSize or y >= rowSize:
            return product
        product *= matrix[x][y]
    return product

#read in matrix
input = file('problem.txt')
matrix =[map(int, x.split()) for x in input.readlines()[2:22]]

#find max product
result = 0
prodLength = 4
for i in range(rowSize):
    for j in range (rowSize):
        result = max(result,
                     product(i,j, 1, 1,prodLength),
                     product(i,j, 1, 0,prodLength),
                     product(i,j, 0, 1,prodLength),
                     product(i,j, 1,-1,prodLength))
print result



