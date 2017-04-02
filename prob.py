#!/usr/bin/env python3
import sys
from poibin import PoiBin
from decimal import Decimal

percentages, counts = sys.argv[2::2], sys.argv[1::2]
percentages=list(map(float,percentages))
counts=list(map(int,counts))

#print("Type count then percentage for each sentiment")
arr=[]
total=0
x=0
i=0
while (x < len(counts)):
   i=0
   total+=counts[x]
   while (i < counts[x]):
       arr.append(percentages[x])
       i+=1
   x+=1

#print(arr)
pb = PoiBin(arr)
result=pb.cdf(range(0, total))
print(result)

"""
import matplotlib.pyplot as plt
plt.plot(range(0,total),result)
plt.ylabel('precent chance that all students who wanted seats do get seats')
plt.xlabel('number of seats available')
plt.show()
"""
