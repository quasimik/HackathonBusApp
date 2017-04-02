#!/usr/bin/env python3
import sys
import matplotlib.pyplot as plt
import urllib.request
from poibin import PoiBin
from decimal import Decimal

databaseName="http://localhost:3000/data"
schoolNames=['UCLA', 'USC', 'UCSD']
for school in schoolNames:
   counts=[]
   x=1
   while (x<=5):
      counts.append(urllib.request.urlopen(databaseName+"?sentiment="+str(x)+"&location="+school).read())
      x+=1
   counts=list(map(int,counts))
   percentages=[]
   x=1
   while (x<=5):
      went=urllib.request.urlopen(databaseName+"?sentiment="+str(x)+"&location="+school+"&went=true").read()
      total=urllib.request.urlopen(databaseName+"?sentiment="+str(x)+"&location="+school).read()
      percentages.append(float(went)/float(total))
      x+=1

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
   pb = PoiBin(arr)
   result=pb.cdf(range(0, total))
   print(result)

   plt.plot(range(0,total),result)
   plt.title(school)
   plt.ylabel('precent chance that all students who want seats do get seats')
   plt.xlabel('number of seats available')
   plt.show()

